"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Users } from "lucide-react";

export default function StudentDirectoryPage() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="p-8 text-center text-red-500">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 text-sm">Manage and view all registered students on the platform.</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-700">Coming Soon</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          The student directory is currently under development. Soon, you'll be able to view and manage student profiles here.
        </p>
      </div>
    </div>
  );
}
