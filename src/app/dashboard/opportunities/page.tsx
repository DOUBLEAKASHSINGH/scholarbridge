"use client";

import { useState, useEffect } from "react";
import { getOpportunities, deleteOpportunity } from "@/lib/db";
import { Opportunity } from "@/types";
import { Trash2, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [opportunityToDelete, setOpportunityToDelete] = useState<string | null>(null);

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const data = await getOpportunities();
      setOpportunities(data);
    } catch (err) {
      console.error("Failed to load opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleDelete = async () => {
    if (!opportunityToDelete) return;
    try {
      await deleteOpportunity(opportunityToDelete);
      setOpportunityToDelete(null);
      fetchOpps();
    } catch (err) {
      console.error("Error deleting opportunity", err);
      alert("Failed to delete opportunity");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Opportunities</h1>
        <Link 
          href="/dashboard/opportunities/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Post New
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Target Country</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading opportunities...
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No opportunities found. Click "Post New" to add one.
                  </td>
                </tr>
              ) : (
                opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{opp.title}</td>
                    <td className="px-6 py-4 capitalize text-slate-600">{opp.type}</td>
                    <td className="px-6 py-4 text-slate-600">{opp.targetCountry || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(opp.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setOpportunityToDelete(opp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {opportunityToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl zoom-in-95 animate-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Opportunity</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete this opportunity? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setOpportunityToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
