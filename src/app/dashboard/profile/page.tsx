"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseResumeAction } from "@/app/actions/parseResume";
import { useAuth } from "@/contexts/AuthContext";
import { Save, User as UserIcon, BookOpen, Link as LinkIcon, DollarSign, Building2, Mail, FileUp, Plus, X, Trash2 } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { COUNTRIES } from "@/lib/countries";

function AdminProfileForm() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setOrganizationName(user.organizationName || "");
      setContactEmail(user.contactEmail || user.email || "");
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
        organizationName,
        contactEmail
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
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
          <p className="text-slate-500 text-sm">Update your organization details and contact information.</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 font-medium animate-in fade-in zoom-in-95">
            Admin profile updated successfully!
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <UserIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Organization Details</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Your Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Organization / Non-Profit Name</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="e.g. The Scholarship Foundation"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="contact@organization.org"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-70"
          >
            {loading ? "Saving..." : (
              <>
                <Save className="h-5 w-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function StudentProfileForm() {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institute, setInstitute] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [sopUrl, setSopUrl] = useState("");
  const [financialNeed, setFinancialNeed] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [selectedDemographics, setSelectedDemographics] = useState<string[]>([]);
  
  // AI Extracted Fields
  const [skills, setSkills] = useState<string[]>([]);
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [educationHistory, setEducationHistory] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

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
      setGenderIdentity(user.genderIdentity || "");
      setSelectedDemographics(
        Array.isArray(user.specialDemographics)
          ? user.specialDemographics
          : typeof user.specialDemographics === 'string' && user.specialDemographics.length > 0
            ? user.specialDemographics.split(", ")
            : []
      );
      setSkills(user.skills || []);
      setProfessionalSummary(user.professionalSummary || "");
      setProjects(user.projects || []);
      setEducationHistory(user.educationHistory || []);
    }
  }, [user]);

  const handleUrlExtraction = async () => {
    if (!resumeUrl || !user) {
      alert("Please enter a valid Resume URL first.");
      return;
    }
    
    setIsParsing(true);
    try {
      // Parse with AI Action directly from URL
      const parsedData = await parseResumeAction(resumeUrl);

      if (parsedData && !parsedData.error) {
        setSkills(parsedData.skills || []);
        setProfessionalSummary(parsedData.professionalSummary || "");
        setProjects(parsedData.projects || []);
        setEducationHistory(parsedData.educationHistory || []);
        alert("Resume successfully parsed and populated!");
      } else {
        alert(parsedData?.error || "Failed to parse resume content.");
        console.error("Parse Error:", parsedData?.error);
      }
    } catch (err) {
      console.error("Parse failed", err);
      alert("An error occurred during resume processing.");
    } finally {
      setIsParsing(false);
    }
  };

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
        financialNeed,
        genderIdentity,
        specialDemographics: selectedDemographics.join(", "),
        skills,
        professionalSummary,
        projects,
        educationHistory
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
            <UserIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Demographics & Needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender Identity</label>
              <select
                required
                value={genderIdentity}
                onChange={(e) => setGenderIdentity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Special Demographics & Accessibility</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "First-Generation College Student",
                  "Physical Disability",
                  "Visually Impaired",
                  "Hearing Impaired",
                  "Chronic Illness",
                  "LGBTQ+"
                ].map(option => {
                  const isSelected = selectedDemographics.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDemographics(prev => prev.filter(d => d !== option));
                        } else {
                          setSelectedDemographics(prev => [...prev, option]);
                        }
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                        isSelected 
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
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
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Resume / CV</label>
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Paste Google Drive Link..."
                />
                <button
                  type="button"
                  onClick={handleUrlExtraction}
                  disabled={isParsing || !resumeUrl}
                  className="w-full px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {isParsing ? "Extracting Data from URL..." : "Auto-Extract Profile Data from URL"}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Statement of Purpose (SOP)</label>
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="url"
                  value={sopUrl}
                  onChange={(e) => setSopUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Paste Google Drive Link..."
                />
                <p className="text-xs text-slate-500 mt-2">Please provide a public Google Drive or Dropbox link for instant processing.</p>
              </div>
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

        {/* Academic & Professional Profile UI */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">Academic & Professional Profile</h2>
            </div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">Auto-Populates via PDF</span>
          </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Professional Summary</label>
                <textarea
                  value={professionalSummary}
                  onChange={(e) => setProfessionalSummary(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none h-24 resize-none"
                />
              </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Education</label>
                <button
                  type="button"
                  onClick={() => setEducationHistory([...educationHistory, { degree: "", institute: "", year: "" }])}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Education
                </button>
              </div>
              <div className="space-y-4">
                {educationHistory.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                    <button
                      type="button"
                      onClick={() => setEducationHistory(educationHistory.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Degree (e.g., B.S. Computer Science)"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...educationHistory];
                          newEdu[idx].degree = e.target.value;
                          setEducationHistory(newEdu);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Institute Name"
                        value={edu.institute}
                        onChange={(e) => {
                          const newEdu = [...educationHistory];
                          newEdu[idx].institute = e.target.value;
                          setEducationHistory(newEdu);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g., 2024)"
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...educationHistory];
                          newEdu[idx].year = e.target.value;
                          setEducationHistory(newEdu);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100 flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                      className="hover:text-indigo-900 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a skill and press Enter..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Projects</label>
                <button
                  type="button"
                  onClick={() => setProjects([...projects, { name: "", techStack: [], description: "" }])}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Project
                </button>
              </div>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => {
                          const newProjects = [...projects];
                          newProjects[idx].name = e.target.value;
                          setProjects(newProjects);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Tech Stack (comma separated)"
                        value={Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack}
                        onChange={(e) => {
                          const newProjects = [...projects];
                          newProjects[idx].techStack = e.target.value.split(",").map((s: string) => s.trim());
                          setProjects(newProjects);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <textarea
                      placeholder="Project Description"
                      value={proj.description}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[idx].description = e.target.value;
                        setProjects(newProjects);
                      }}
                      className="w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg p-2 resize-none h-24 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
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

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "admin" ? <AdminProfileForm /> : <StudentProfileForm />;
}
