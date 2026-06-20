"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Opportunity, SavedOpportunity } from "@/types";
import { BookmarkCheck, ArrowRight, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { user } = useAuth();
  const [savedOpps, setSavedOpps] = useState<(Opportunity & { savedId: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "saved_opportunities"), where("userId", "==", user.id));
      const snapshot = await getDocs(q);
      
      const opps: (Opportunity & { savedId: string })[] = [];
      
      for (const d of snapshot.docs) {
        const savedData = d.data() as SavedOpportunity;
        const oppDoc = await getDoc(doc(db, "opportunities", savedData.opportunityId));
        if (oppDoc.exists()) {
          opps.push({ ...oppDoc.data(), id: oppDoc.id, savedId: d.id } as Opportunity & { savedId: string });
        }
      }
      
      setSavedOpps(opps);
    } catch (err) {
      console.error("Failed to fetch saved opps", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSaved();
  }, [user]);

  const handleUnsave = async (savedId: string) => {
    try {
      await deleteDoc(doc(db, "saved_opportunities", savedId));
      setSavedOpps(prev => prev.filter(o => o.savedId !== savedId));
    } catch (err) {
      console.error("Failed to unsave", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <BookmarkCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Opportunities</h1>
          <p className="text-slate-500 text-sm">Review and apply to the opportunities you've bookmarked.</p>
        </div>
      </div>

      <div className="space-y-4">
        {savedOpps.length > 0 ? (
          savedOpps.map(opp => (
            <div key={opp.savedId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                    {opp.type}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">{opp.provider}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{opp.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{opp.description}</p>
                <div className="mt-3 text-xs text-slate-400 font-medium">
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => handleUnsave(opp.savedId)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <Link 
                  href={`/dashboard/opportunities/${opp.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
            <BookmarkCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No saved opportunities yet</h3>
            <p className="text-slate-500 mt-1 mb-6">When you see an opportunity you like, hit the Save button.</p>
            <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
              Go to Dashboard matches &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
