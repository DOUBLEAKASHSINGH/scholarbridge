"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your account preferences.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-500">Name</label>
            <p className="text-slate-900 font-medium mt-1">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500">Email Address</label>
            <p className="text-slate-900 font-medium mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500">Account Type</label>
            <p className="text-slate-900 font-medium mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            More settings and preferences will be available in future updates. For now, you can update your profile information in the Profile tab.
          </p>
        </div>
      </div>
    </div>
  );
}
