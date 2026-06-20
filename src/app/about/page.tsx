export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">About ScholarBridge</h1>
      <p className="text-lg text-slate-600 mb-10 leading-relaxed">
        Every year, millions of dollars in scholarships and life-changing internships go unawarded because of a massive information disconnect. Students face overwhelming criteria, while educational non-profits lack the resources to manually hunt for opportunities. We built ScholarBridge to fix this.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-blue-600 mb-3">Our Mission</h3>
          <p className="text-slate-600">To democratize access to education and career funding by leveraging artificial intelligence to automate opportunity discovery and application mentorship.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-blue-600 mb-3">The Technology</h3>
          <p className="text-slate-600">ScholarBridge acts as an autonomous engine. It actively scans the web, structures complex eligibility data, and provides students with a context-aware AI Coach to guide their applications.</p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">The Founder</h2>
        <p className="text-slate-600">
          ScholarBridge was founded and built by <a href="https://www.linkedin.com/in/doubleakashsingh/" target="_blank" className="text-blue-600 font-semibold hover:underline">Akash Singh</a> for Hackathon 1.0. Driven by a passion for accessible education, Akash designed this platform to bridge the gap between student potential and real-world capital.
        </p>
      </div>
    </div>
  );
}
