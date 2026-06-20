"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Loader2, ArrowRight } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { COUNTRIES } from "@/lib/countries";

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [financialNeed, setFinancialNeed] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [specialDemographics, setSpecialDemographics] = useState("");
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      setFullName(user.name || "");
      setEducationLevel(user.educationLevel || "");
      setFieldOfStudy(user.fieldOfStudy || "");
      setCountryOfResidence(user.countryOfResidence || "");
      setFinancialNeed(user.financialNeed || "");
      setGenderIdentity(user.genderIdentity || "");
      setSpecialDemographics(user.specialDemographics || "");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: fullName,
        educationLevel,
        fieldOfStudy,
        countryOfResidence,
        financialNeed,
        genderIdentity,
        specialDemographics
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save onboarding data:", err);
      alert("Failed to save your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Your Profile</h1>
          <p className="mt-3 text-lg text-slate-500">
            Tell us about yourself so we can find the best opportunities for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Education Level</label>
              <select
                required
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              >
                <option value="">Select Level...</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="PhD">PhD</option>
              </select>
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Field of Study</label>
            <input
              type="text"
              required
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="e.g. Computer Science, Medicine"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender Identity</label>
              <select
                required
                value={genderIdentity}
                onChange={(e) => setGenderIdentity(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Special Demographics & Needs (Optional)</label>
              <input
                type="text"
                value={specialDemographics}
                onChange={(e) => setSpecialDemographics(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g. First-Gen, Physical Disability"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Financial Need / Background</label>
            <textarea
              required
              value={financialNeed}
              onChange={(e) => setFinancialNeed(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32 bg-slate-50 focus:bg-white"
              placeholder="Briefly describe your financial situation or background to help us match you with need-based scholarships or grants..."
            ></textarea>
            <p className="text-xs text-slate-500 mt-1">This information is securely stored and only used for AI matching.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-blue-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Saving Profile...
                </>
              ) : (
                <>
                  Continue to Dashboard <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
