import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              ScholarBridge
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bridging the gap between ambitious students and life-changing educational opportunities through the power of AI.
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Timeline</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Accounts/Connect */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Connect</h3>
            <ul className="space-y-3 mb-6">
              <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">My Account</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Admin Portal</Link></li>
            </ul>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Founder Credit */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ScholarBridge. All rights reserved.
          </p>
          <p className="text-sm font-medium text-slate-900">
            Founded & Built by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-base">Akash Singh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
