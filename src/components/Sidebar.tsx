"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Search, 
  BookmarkCheck, 
  Settings, 
  List,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover", href: "/dashboard/explore", icon: Search },
    { name: "My Tracker", href: "/dashboard/tracker", icon: BookmarkCheck },
    { name: "Profile", href: "/dashboard/profile", icon: GraduationCap },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Web Scanner", href: "/dashboard/discover", icon: Search },
    { name: "Directory", href: "/dashboard/students", icon: List },
    { name: "Admin Profile", href: "/dashboard/profile", icon: Settings },
  ];

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex bg-white border-r border-slate-200 h-full flex-col shrink-0 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 rounded-full p-1 shadow-sm transition-colors z-10"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <Link href="/dashboard" className={`flex items-center gap-2 text-blue-600 font-bold ${isCollapsed ? 'justify-center' : ''}`}>
            <GraduationCap className="h-8 w-8 shrink-0" />
            {!isCollapsed && <span className="text-xl">ScholarBridge</span>}
          </Link>
        </div>
        {!isCollapsed && (
          <div className="px-6 pb-4">
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">ScholarBridge &ndash; We Help Build the Future</p>
          </div>
        )}

        <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto mt-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                title={isCollapsed ? link.name : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                {!isCollapsed && <span>{link.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-16">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? "fill-blue-50" : ""}`} />
              <span className="text-[10px] font-bold">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
