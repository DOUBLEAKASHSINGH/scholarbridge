"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Opportunity, SavedOpportunity } from "@/types";
import AICoach from "@/components/AICoach";
import { Calendar, Building, DollarSign, Target, ArrowLeft, Bookmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [savedStatus, setSavedStatus] = useState<SavedOpportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const oppDoc = await getDoc(doc(db, "opportunities", id as string));
        if (oppDoc.exists()) {
          setOpportunity({ id: oppDoc.id, ...oppDoc.data() } as Opportunity);
        }

        if (user) {
          const savedDoc = await getDoc(doc(db, "saved_opportunities", `${user.id}_${id}`));
          if (savedDoc.exists()) {
            setSavedStatus(savedDoc.data() as SavedOpportunity);
          }
        }
      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpp();
  }, [id, user]);

  const handleSave = async (status: "Saved" | "Applied") => {
    if (!user || !opportunity) return;
    try {
      const savedRef = doc(db, "saved_opportunities", `${user.id}_${opportunity.id}`);
      const data: SavedOpportunity = {
        id: savedRef.id,
        userId: user.id,
        opportunityId: opportunity.id,
        status,
        savedAt: Date.now()
      };
      await setDoc(savedRef, data);
      setSavedStatus(data);
    } catch (err) {
      console.error("Failed to save status", err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!opportunity) return <div className="p-8 text-center text-red-500">Opportunity not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                {opportunity.type}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{opportunity.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-900">{opportunity.provider}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Due: {new Date(opportunity.deadline).toLocaleDateString()}</span>
              </div>
              {opportunity.amount && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-emerald-600">{opportunity.amount}</span>
                </div>
              )}
            </div>

            {user?.role === "student" && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleSave("Saved")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-colors border ${
                    savedStatus?.status === "Saved" 
                      ? "bg-slate-100 border-slate-200 text-slate-700" 
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${savedStatus?.status === "Saved" ? "fill-current" : ""}`} />
                  {savedStatus?.status === "Saved" ? "Saved" : "Save for later"}
                </button>
                <button 
                  onClick={() => handleSave("Applied")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-colors ${
                    savedStatus?.status === "Applied" 
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {savedStatus?.status === "Applied" ? "Applied" : "Mark as Applied"}
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" /> Eligibility
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{opportunity.eligibility}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar: AI Coach */}
        <div className="lg:col-span-1">
          {user && user.role === "student" && (
            <div className="sticky top-24">
              <AICoach opportunity={opportunity} user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
