"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Opportunity } from "@/types";
import { Search, MapPin, DollarSign, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const q = query(collection(db, "opportunities"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const opps: Opportunity[] = [];
        snapshot.forEach((doc) => opps.push({ id: doc.id, ...doc.data() } as Opportunity));
        setOpportunities(opps);
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const toggleFilter = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    stateSetter(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  };

  const filteredOpps = useMemo(() => {
    return opportunities.filter(opp => {
      // Keyword search
      const q = searchQuery.toLowerCase();
      const matchesQuery = !q || opp.title.toLowerCase().includes(q) || opp.description.toLowerCase().includes(q) || opp.provider.toLowerCase().includes(q);

      // Extract degree levels from new expanded AI schema, fallback to legacy eligibility string match
      const degrees = opp.eligibilityObject?.degreeLevel || [opp.eligibility]; 
      const matchesDegree = selectedDegrees.length === 0 || selectedDegrees.some(d => 
        degrees.some(od => od.toLowerCase().includes(d.toLowerCase()))
      );

      // Location match
      const matchesLocation = selectedLocations.length === 0 || (opp.location && selectedLocations.includes(opp.location));

      // Funding type / Opportunity Type match
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(opp.type);

      return matchesQuery && matchesDegree && matchesLocation && matchesType;
    });
  }, [opportunities, searchQuery, selectedDegrees, selectedLocations, selectedTypes]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-72 shrink-0 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Search className="h-4 w-4" /> Filters
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Degree Level</h3>
              <div className="space-y-2">
                {["High School", "Undergraduate", "Postgraduate", "PhD"].map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedDegrees.includes(level)}
                      onChange={() => toggleFilter(setSelectedDegrees, level)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Location</h3>
              <div className="space-y-2">
                {["Remote", "On-site", "International"].map(loc => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedLocations.includes(loc)}
                      onChange={() => toggleFilter(setSelectedLocations, loc)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Funding Type</h3>
              <div className="space-y-2">
                {["scholarship", "grant", "internship"].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleFilter(setSelectedTypes, type)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search keywords, titles, providers..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="text-slate-900">{filteredOpps.length}</span> opportunities
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOpps.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredOpps.map(opp => (
              <div key={opp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                    {opp.type}
                  </span>
                  {opp.location && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      <MapPin className="h-3 w-3" /> {opp.location}
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {opp.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-3">{opp.provider}</p>
                
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                  {opp.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-400">Deadline</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <Link 
                    href={`/dashboard/opportunities/${opp.id}`}
                    className="flex items-center justify-center p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">No matches found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
