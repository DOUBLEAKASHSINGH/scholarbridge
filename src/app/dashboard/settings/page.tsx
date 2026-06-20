"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, AlertTriangle } from "lucide-react";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || confirmName !== user?.name) return;
    
    setDeleteLoading(true);
    setDeleteError("");
    try {
      // 1. Delete user document from Firestore
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      
      // 2. Delete user from Firebase Auth
      await deleteUser(auth.currentUser);
      
      // Redirect to homepage
      router.push("/");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      if (err.code === "auth/requires-recent-login") {
        setDeleteError("For security reasons, please log out and log back in before deleting your account.");
      } else {
        setDeleteError(err.message || "Failed to delete account.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

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

      {/* Danger Zone */}
      <div className="mt-8 bg-red-50/50 p-6 rounded-2xl border border-red-100">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl mt-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700 mt-1 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl zoom-in-95 animate-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Account</h3>
            <p className="text-sm text-slate-600 mb-4">
              This action is permanent and cannot be undone. All your saved opportunities, profile data, and settings will be permanently erased.
            </p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {deleteError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Please type <span className="font-bold text-slate-900 bg-slate-100 px-1 py-0.5 rounded select-all">{user?.name}</span> to confirm.
              </label>
              <input
                type="text"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="Type your name here..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmName("");
                  setDeleteError("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={confirmName !== user?.name || deleteLoading}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
