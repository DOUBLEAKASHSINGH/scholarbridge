"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Search, 
  BookmarkCheck, 
  Settings, 
  PlusCircle, 
  List,
  GraduationCap
} from "lucide-react";

export default function Sidebar() {
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
      <div className="hidden md:flex w-64 bg-white border-r border-slate-200 h-full flex-col shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <GraduationCap className="h-8 w-8" />
            <span>ScholarBridge</span>
          </Link>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium tracking-wide">ScholarBridge &ndash; We Help Build the Future</p>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
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
