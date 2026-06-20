"use client";
import Link from "next/link";
import { GraduationCap, ArrowRight, Sparkles, Target, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 lg:px-14 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <GraduationCap className="h-8 w-8" />
          <span>ScholarBridge</span>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          AI-Powered Opportunity Matching
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6">
          Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">opportunity</span> with AI.
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          ScholarBridge connects students with tailored scholarships, internships, and grants. Stop searching and start applying.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link href="/dashboard" className="px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
              Go to Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link href="/signup" className="px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/login" className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                I already have an account
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Matching</h3>
            <p className="text-slate-600">Our AI analyzes your profile and connects you with the opportunities you are most likely to win.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Coaching</h3>
            <p className="text-slate-600">Get personalized advice and tips on how to apply for specific scholarships from our built-in AI coach.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Listings</h3>
            <p className="text-slate-600">Every grant, internship, and scholarship is verified by our admins to ensure safety and authenticity.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-12 text-center text-slate-500">
        <p>© {new Date().getFullYear()} ScholarBridge. All rights reserved.</p>
      </footer>
    </div>
  );
}
