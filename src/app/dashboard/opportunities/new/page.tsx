"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { OpportunityType } from "@/types";
import { Save } from "lucide-react";

export default function NewOpportunityPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<OpportunityType>("scholarship");
  const [deadline, setDeadline] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deadlineTimestamp = new Date(deadline).getTime();
      await addDoc(collection(db, "opportunities"), {
        title,
        description,
        type,
        deadline: deadlineTimestamp,
        eligibility,
        amount,
        provider,
        createdAt: Date.now()
      });
      router.push("/dashboard/opportunities");
    } catch (err) {
      console.error("Failed to post opportunity", err);
      alert("Failed to post opportunity. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Post New Opportunity</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. Google Women in Tech Scholarship"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Provider</label>
            <input
              type="text"
              required
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. Google"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Opportunity Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OpportunityType)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="scholarship">Scholarship</option>
              <option value="internship">Internship</option>
              <option value="grant">Grant</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Deadline</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Amount (Optional)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. $5,000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Eligibility Criteria</label>
          <textarea
            required
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24"
            placeholder="e.g. Must be a full-time student majoring in Computer Science."
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32"
            placeholder="Describe the opportunity in detail..."
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? "Posting..." : (
              <>
                <Save className="h-4 w-4" />
                Post Opportunity
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
