"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Save } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { COUNTRIES } from "@/lib/countries";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [financialNeed, setFinancialNeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEducationLevel(user.educationLevel || "");
      setFieldOfStudy(user.fieldOfStudy || "");
      setCountryOfResidence(user.countryOfResidence || "");
      setFinancialNeed(user.financialNeed || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccess(false);
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: fullName,
        educationLevel,
        fieldOfStudy,
        countryOfResidence,
        financialNeed
      });
      setSuccess(true);
      // Wait a moment before clearing success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Profile</h1>
      <p className="text-slate-500 mb-8">Update your information to get better AI matches.</p>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100">
            Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Your Name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Country of Residence</label>
            <SearchableSelect
              value={countryOfResidence}
              onChange={setCountryOfResidence}
              options={COUNTRIES}
              placeholder="Search Country..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Education Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Select your level</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Field of Study</label>
            <input
              type="text"
              required
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. Computer Science"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Financial Need</label>
          <textarea
            value={financialNeed}
            onChange={(e) => setFinancialNeed(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24"
            placeholder="Briefly describe your financial situation or constraints to help AI match you with appropriate grants or need-based scholarships."
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? "Saving..." : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
