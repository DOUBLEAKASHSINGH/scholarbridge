"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-xl text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 shadow-sm"
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400 ml-2" />
            <input
              type="text"
              className="w-full px-2 py-1.5 text-sm outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${
                    value === opt 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                  {value === opt && <Check className="h-4 w-4 text-blue-600" />}
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-sm text-slate-500 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
