"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, getCountFromServer, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Opportunity } from "@/types";
import { generateMatches } from "@/app/actions/match";
import { Sparkles, Briefcase, GraduationCap, ArrowRight, Bookmark, MessageCircle, MapPin, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import AICoach from "@/components/AICoach";
import { doc, setDoc } from "firebase/firestore";

interface MatchResult {
  opportunityId: string;
  matchReason: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCoachOpp, setActiveCoachOpp] = useState<Opportunity | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ students: 0, opportunities: 0, tracked: 0 });
  const [visibleCount, setVisibleCount] = useState(5);

  const handleSave = async (oppId: string) => {
    if (!user) return;
    setSavingId(oppId);
    try {
      const savedRef = doc(db, "saved_opportunities", `${user.id}_${oppId}`);
      await setDoc(savedRef, {
        id: savedRef.id,
        userId: user.id,
        opportunityId: oppId,
        status: "Saved",
        savedAt: Date.now()
      });
      alert("Opportunity saved successfully!");
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save opportunity.");
    } finally {
      setSavingId(null);
    }
  };

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
            educationLevel: user.educationLevel,
            financialNeed: user.financialNeed,
            fieldOfStudy: user.fieldOfStudy,
            countryOfResidence: user.countryOfResidence
          }, opps);
          setMatches(matchResults);
        } else if (user?.role === "admin") {
          try {
            const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
            const oppsQuery = collection(db, "opportunities");
            const trackedQuery = collection(db, "saved_opportunities");
            
            const [studentsSnap, oppsSnap, trackedSnap] = await Promise.all([
              getCountFromServer(studentsQuery),
              getCountFromServer(oppsQuery),
              getCountFromServer(trackedQuery)
            ]);
            
            setStats({
              students: studentsSnap.data().count,
              opportunities: oppsSnap.data().count,
              tracked: trackedSnap.data().count
            });
          } catch (e) {
            console.error("Failed to fetch admin stats", e);
          }
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
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">{stats.students}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Opportunities</p>
              <p className="text-2xl font-bold text-slate-900">{stats.opportunities}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Applications Tracked</p>
              <p className="text-2xl font-bold text-slate-900">{stats.tracked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Opportunities</h2>
            <Link href="/dashboard/opportunities/new" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Post New
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {opportunities.slice(0, visibleCount).map((opp) => (
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
          {opportunities.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
              {visibleCount < opportunities.length ? (
                <button
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  View More Opportunities
                </button>
              ) : (
                <p className="text-sm text-slate-500 py-2">All opportunities loaded.</p>
              )}
            </div>
          )}
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
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium text-slate-500">
                    {opp.location && (
                      <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{opp.location}</div>
                    )}
                    {opp.deadline && (
                      <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" />{new Date(opp.deadline).toLocaleDateString()}</div>
                    )}
                    {(opp.fundingAmount || opp.amount) && (
                      <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-green-500" />{opp.fundingAmount || opp.amount}</div>
                    )}
                  </div>
                  
                  <p className="text-slate-600 mb-4 line-clamp-2">{opp.description}</p>
                  
                  <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <Sparkles className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-indigo-700 italic">"{match.matchReason}"</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 justify-center mt-4 sm:mt-0">
                  <button
                    onClick={() => setActiveCoachOpp(opp)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-2.5 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md shadow-indigo-200"
                  >
                    Ask Coach <MessageCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleSave(opp.id)}
                    disabled={savingId === opp.id}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 px-5 py-2.5 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    Save <Bookmark className="h-4 w-4" />
                  </button>
                  <Link 
                    href={`/dashboard/opportunities/${opp.id}`}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                  >
                    Details <ArrowRight className="h-4 w-4" />
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

      {activeCoachOpp && user && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right">
            <AICoach 
              opportunity={activeCoachOpp} 
              user={user} 
              onClose={() => setActiveCoachOpp(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
