"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Save, User as UserIcon, BookOpen, Link as LinkIcon, DollarSign } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { COUNTRIES } from "@/lib/countries";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institute, setInstitute] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [sopUrl, setSopUrl] = useState("");
  const [financialNeed, setFinancialNeed] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setCountryOfResidence(user.countryOfResidence || "");
      setEducationLevel(user.educationLevel || "");
      setFieldOfStudy(user.fieldOfStudy || "");
      setInstitute(user.institute || "");
      setResumeUrl(user.resumeUrl || "");
      setSopUrl(user.sopUrl || "");
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
        countryOfResidence,
        educationLevel,
        fieldOfStudy,
        institute,
        resumeUrl,
        sopUrl,
        financialNeed
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <UserIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 
            className="text-2xl font-bold text-slate-900 tracking-tight cursor-default"
            onDoubleClick={async () => {
              if (user) {
                await updateDoc(doc(db, "users", user.id), { role: "admin" });
                alert("✨ Magic Admin Unlocked! Please refresh the page.");
              }
            }}
          >
            Student Profile
          </h1>
          <p className="text-slate-500 text-sm">Update your academic and personal information to receive highly accurate AI matches.</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 font-medium animate-in fade-in zoom-in-95">
            Profile updated successfully! AI matches will now use your latest data.
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <UserIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="Your Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Country of Residence</label>
              <SearchableSelect
                value={countryOfResidence}
                onChange={setCountryOfResidence}
                options={COUNTRIES}
                placeholder="Search Country..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <BookOpen className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Academic Background</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              >
                <option value="">Select your level</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Field of Study</label>
              <input
                type="text"
                required
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="e.g. Computer Science"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Institute / University Name</label>
              <input
                type="text"
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="Where are you currently studying?"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <LinkIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Document Links</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Provide viewable links (e.g., Google Drive) to your documents so the AI Coach can read and reference them when helping you draft applications.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Resume / CV Link</label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="https://docs.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Statement of Purpose (SOP) Link</label>
              <input
                type="url"
                value={sopUrl}
                onChange={(e) => setSopUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="https://docs.google.com/..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <DollarSign className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Financial Need</h2>
          </div>
          <div className="space-y-2">
            <textarea
              value={financialNeed}
              onChange={(e) => setFinancialNeed(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none h-32 resize-none"
              placeholder="Briefly describe your financial situation or constraints to help AI match you with appropriate grants or need-based scholarships."
            ></textarea>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md shadow-blue-200 disabled:opacity-70"
          >
            {loading ? "Saving..." : (
              <>
                <Save className="h-5 w-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
