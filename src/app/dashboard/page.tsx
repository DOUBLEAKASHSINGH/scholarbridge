"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Opportunity } from "@/types";
import { generateMatches } from "@/app/actions/matchOpportunities";
import { Sparkles, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface MatchResult {
  opportunityId: string;
  score: number;
  reason: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "opportunities"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const opps: Opportunity[] = [];
        querySnapshot.forEach((doc) => {
          opps.push({ id: doc.id, ...doc.data() } as Opportunity);
        });
        setOpportunities(opps);

        if (user?.role === "student" && opps.length > 0) {
          const matchResults = await generateMatches({
            role: user.role,
            educationLevel: user.educationLevel,
            financialNeed: user.financialNeed
          }, opps);
          setMatches(matchResults);
        }
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === "admin") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Opportunities</p>
              <p className="text-2xl font-bold text-slate-900">{opportunities.length}</p>
            </div>
          </div>
          {/* Add more admin stats here */}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Opportunities</h2>
            <Link href="/dashboard/opportunities/new" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Post New
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {opportunities.slice(0, 5).map((opp) => (
              <div key={opp.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                  <p className="text-sm text-slate-500">{opp.provider} • {opp.type}</p>
                </div>
                <div className="text-sm text-slate-500">
                  Due: {new Date(opp.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
            {opportunities.length === 0 && (
              <div className="p-6 text-center text-slate-500">No opportunities posted yet.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Top Matches</h1>
          <p className="text-slate-500 text-sm">AI-curated opportunities based on your profile.</p>
        </div>
      </div>

      <div className="space-y-6">
        {matches.map((match) => {
          const opp = opportunities.find(o => o.id === match.opportunityId);
          if (!opp) return null;

          return (
            <div key={match.opportunityId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {opp.type}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      {opp.provider}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{opp.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{opp.description}</p>
                  
                  <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <Sparkles className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-indigo-700 italic">"{match.reason}"</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 border-emerald-100 bg-emerald-50 text-emerald-700">
                    <span className="text-lg font-bold leading-none">{match.score}%</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Match</span>
                  </div>
                  
                  <Link 
                    href={`/dashboard/opportunities/${opp.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-transform"
                  >
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {matches.length === 0 && opportunities.length > 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Analyzing your profile...</h3>
            <p className="text-slate-500">Check back soon for your personalized matches.</p>
          </div>
        )}

        {opportunities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No opportunities available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
