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
    { name: "Matches", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/dashboard/explore", icon: Search },
    { name: "Saved", href: "/dashboard/saved", icon: BookmarkCheck },
    { name: "Profile", href: "/dashboard/profile", icon: Settings },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover", href: "/dashboard/discover", icon: Search },
    { name: "Opportunities", href: "/dashboard/opportunities", icon: List },
    { name: "Post New", href: "/dashboard/opportunities/new", icon: PlusCircle },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <GraduationCap className="h-8 w-8" />
          <span>ScholarBridge</span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
