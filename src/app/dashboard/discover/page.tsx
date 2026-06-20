"use client";

import { useState } from "react";
import { searchAndStructureOpportunities } from "@/app/actions/ingest";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Loader2, Sparkles, MapPin, DollarSign, GraduationCap, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDiscoverPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    degree: "All",
    funding: "All",
    geography: "All"
  });
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await searchAndStructureOpportunities(query, filters);
      if (response.success) {
        setResults(response.data);
      } else {
        setErrorMsg(response.message || "Failed to scan the web.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected client error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (opp: any, index: number) => {
    setImportingId(index);
    try {
      const deadlineTimestamp = new Date(opp.deadline).getTime() || Date.now() + 30 * 24 * 60 * 60 * 1000;
      
      await addDoc(collection(db, "opportunities"), {
        title: opp.title,
        description: opp.description,
        type: opp.type,
        provider: opp.provider,
        fundingAmount: opp.fundingAmount || "",
        eligibilityObject: opp.eligibilityObject || {},
        location: opp.location || "Remote",
        sourceUrl: opp.sourceUrl || "",
        deadline: deadlineTimestamp,
        eligibility: opp.eligibilityObject?.degreeLevel?.join(", ") || "", // Legacy fallback
        createdAt: Date.now()
      });
      
      // Remove from list after importing
      setResults(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("Failed to import opportunity.");
    } finally {
      setImportingId(null);
    }
  };

  const handleDiscard = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Discovery Workspace</h1>
          <p className="text-slate-500 text-sm">Scan the web for new opportunities and instantly import them to your database.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Search Query</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="e.g. Undergraduate scholarships for international students in Tech 2026..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Category</label>
            <select 
              value={filters.category}
              onChange={e => setFilters({...filters, category: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Internship">Internship</option>
              <option value="Grant">Grant</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Degree Eligibility</label>
            <select 
              value={filters.degree}
              onChange={e => setFilters({...filters, degree: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Degrees</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Funding Type</label>
            <select 
              value={filters.funding}
              onChange={e => setFilters({...filters, funding: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Funding</option>
              <option value="Fully Funded">Fully Funded</option>
              <option value="Partially Funded">Partially Funded</option>
              <option value="Tuition Only">Tuition Only</option>
              <option value="Stipend">Stipend</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Geography</label>
            <select 
              value={filters.geography}
              onChange={e => setFilters({...filters, geography: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">Global</option>
              <option value="Local (Domestic)">Local (Domestic)</option>
              <option value="International">International</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in">
                <XCircle className="h-4 w-4" />
                {errorMsg}
              </div>
            )}
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-70 shadow-md shadow-indigo-200 whitespace-nowrap"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            Scan the Web
          </button>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 animate-pulse" />
          </div>
          <h3 className="mt-6 text-lg font-bold text-slate-900">AI is scouring the web...</h3>
          <p className="text-slate-500 text-sm mt-1">Structuring and categorizing results</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Pending Review <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-sm">{results.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {results.map((opp, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border-2 border-indigo-50 shadow-md hover:shadow-lg transition-shadow flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                        {opp.type}
                      </span>
                      <span className="text-sm font-medium text-slate-500">{opp.provider}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{opp.title}</h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm">{opp.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {opp.fundingAmount && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100">
                        <DollarSign className="h-3.5 w-3.5" /> {opp.fundingAmount}
                      </div>
                    )}
                    {opp.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                        <MapPin className="h-3.5 w-3.5" /> {opp.location}
                      </div>
                    )}
                    {opp.eligibilityObject?.degreeLevel?.map((deg: string) => (
                      <div key={deg} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                        <GraduationCap className="h-3.5 w-3.5" /> {deg}
                      </div>
                    ))}
                    {opp.eligibilityObject?.targetCountries?.map((country: string) => (
                      <div key={country} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex flex-row lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[200px]">
                  <button 
                    onClick={() => handleApprove(opp, index)}
                    disabled={importingId === index}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-70"
                  >
                    {importingId === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-green-400" />}
                    Approve & Import
                  </button>
                  <button 
                    onClick={() => handleDiscard(index)}
                    disabled={importingId === index}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
          <Search className="h-10 w-10 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No opportunities discovered.</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md text-center">
            Check server logs to verify API connectivity, or try adjusting your search filters to be less restrictive.
          </p>
        </div>
      )}
    </div>
  );
}
