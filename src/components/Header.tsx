"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {getGreeting()}, {user?.name?.split(' ')[0]}!
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                {unreadCount > 0 && <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{unreadCount} New</span>}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-slate-900">Welcome to ScholarBridge!</p>
                  <p className="text-sm text-slate-500 mt-1">Complete your profile to get your first AI-curated matches.</p>
                  <p className="text-xs text-slate-400 mt-2">Just now</p>
                </div>
              </div>
              <div className="p-3 text-center border-t border-slate-100">
                <button 
                  onClick={() => setUnreadCount(0)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors border border-slate-200"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
