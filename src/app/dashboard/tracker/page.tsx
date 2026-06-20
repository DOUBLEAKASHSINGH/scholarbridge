"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Opportunity, SavedOpportunity, SavedOpportunityStatus } from "@/types";
import { Kanban, Loader2, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

const STATUSES: SavedOpportunityStatus[] = ['Saved', 'Drafting Application', 'Applied', 'Result Pending'];

export default function TrackerPage() {
  const { user } = useAuth();
  const [savedOpps, setSavedOpps] = useState<(Opportunity & { savedId: string, status: SavedOpportunityStatus })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "saved_opportunities"), where("userId", "==", user.id));
      const snapshot = await getDocs(q);
      
      const opps: (Opportunity & { savedId: string, status: SavedOpportunityStatus })[] = [];
      
      for (const d of snapshot.docs) {
        const savedData = d.data() as SavedOpportunity;
        const oppDoc = await getDoc(doc(db, "opportunities", savedData.opportunityId));
        if (oppDoc.exists()) {
          opps.push({ ...oppDoc.data(), id: oppDoc.id, savedId: d.id, status: savedData.status || 'Saved' } as any);
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

  const handleStatusChange = async (savedId: string, newStatus: SavedOpportunityStatus) => {
    try {
      await updateDoc(doc(db, "saved_opportunities", savedId), {
        status: newStatus
      });
      setSavedOpps(prev => prev.map(o => o.savedId === savedId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (savedId: string) => {
    try {
      await deleteDoc(doc(db, "saved_opportunities", savedId));
      setSavedOpps(prev => prev.filter(o => o.savedId !== savedId));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Kanban className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Tracker</h1>
          <p className="text-slate-500 text-sm">Manage your saved opportunities and track your application progress.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {STATUSES.map(status => {
            const columnOpps = savedOpps.filter(o => o.status === status);
            return (
              <div key={status} className="w-80 flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-slate-700">{status}</h3>
                  <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
                    {columnOpps.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnOpps.map(opp => (
                    <div key={opp.savedId} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                          {opp.type}
                        </span>
                        <button 
                          onClick={() => handleDelete(opp.savedId)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{opp.title}</h4>
                      <p className="text-xs font-medium text-slate-500 mb-4">{opp.provider}</p>
                      
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <select 
                          value={opp.status}
                          onChange={(e) => handleStatusChange(opp.savedId, e.target.value as SavedOpportunityStatus)}
                          className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Link 
                          href={`/dashboard/opportunities/${opp.id}`}
                          className="flex items-center justify-center gap-1.5 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-lg transition-colors"
                        >
                          View Details <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                  {columnOpps.length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                      No items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
