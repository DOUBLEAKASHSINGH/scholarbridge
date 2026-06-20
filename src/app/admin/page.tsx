"use client";

import { useState, useEffect } from "react";
import { addOpportunity, getOpportunities, deleteOpportunity } from "@/lib/db";
import { Opportunity, OpportunityType } from "@/types";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState<OpportunityType>("scholarship");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [deadline, setDeadline] = useState("");
  const [provider, setProvider] = useState(""); // adding provider as it's required by the Opportunity interface

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const deadlineTimestamp = new Date(deadline).getTime();
      await addOpportunity({
        title,
        type,
        description,
        eligibility,
        targetCountry,
        deadline: deadlineTimestamp,
        provider: provider || "Admin Provider"
      });
      
      // Reset form
      setTitle("");
      setType("scholarship");
      setDescription("");
      setEligibility("");
      setTargetCountry("");
      setDeadline("");
      setProvider("");
      
      // Refresh list
      fetchOpps();
    } catch (err) {
      console.error("Error adding opportunity", err);
      alert("Failed to add opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await deleteOpportunity(id);
      fetchOpps();
    } catch (err) {
      console.error("Error deleting opportunity", err);
      alert("Failed to delete opportunity");
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-blue-600" />
          Add New Opportunity
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Opportunity Title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="scholarship">Scholarship</option>
                <option value="internship">Internship</option>
                <option value="grant">Grant</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Target Country</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. United States, Global"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 transition-all"
              placeholder="Detailed description of the opportunity..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Eligibility Criteria</label>
            <textarea
              required
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 transition-all"
              placeholder="Who is eligible to apply?"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlusCircle className="h-5 w-5" />}
              Add Opportunity
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Active Opportunities</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Target Country</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading opportunities...
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No opportunities found.
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
                        onClick={() => handleDelete(opp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
    </div>
  );
}
