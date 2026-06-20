"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types";
import { Users, Loader2 } from "lucide-react";

export default function StudentDirectoryPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") return;
    
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const snapshot = await getDocs(q);
        const data: User[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as User);
        });
        
        // Sort by createdAt descending (newest first)
        data.sort((a, b) => b.createdAt - a.createdAt);
        
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [user]);

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
          <p className="text-slate-500 text-sm">View all students registered on the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Degree Level</th>
                  <th className="py-4 px-6">Institute</th>
                  <th className="py-4 px-6">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{student.name || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-700 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {student.educationLevel || "Not provided"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 text-sm">
                      {student.institute || "Not provided"}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Unknown"}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      No students registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
