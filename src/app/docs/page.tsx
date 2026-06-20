export default function DocsPage() {
  return (
    <div className="min-h-screen w-full !bg-slate-50 !text-slate-900 py-20 px-6">
      <div className="max-w-3xl mx-auto prose prose-blue prose-slate">
        <h1 className="text-4xl font-bold !text-slate-900 mb-4">Documentation</h1>
        <p className="text-lg !text-slate-700 mb-12">Learn how to navigate and maximize the ScholarBridge platform.</p>
        
        <h2 className="text-2xl font-semibold !text-slate-900 mt-8 mb-4 border-b pb-2">For Students</h2>
        <ul className="space-y-4 !text-slate-700 mb-8 list-disc pl-5">
          <li><strong className="!text-slate-900">Building Your Profile:</strong> Navigate to Settings to input your academic background and demographic needs. The more accurate your profile, the better our AI can match you.</li>
          <li><strong className="!text-slate-900">The Application Tracker:</strong> Use the "My Tracker" dashboard to move saved opportunities from "Drafting" to "Applied".</li>
          <li><strong className="!text-slate-900">The AI Coach:</strong> Click "Ask Coach" on any opportunity card. The Coach automatically knows your profile and will give you tailored essay and resume advice.</li>
        </ul>

        <h2 className="text-2xl font-semibold !text-slate-900 mt-8 mb-4 border-b pb-2">For Administrators</h2>
        <ul className="space-y-4 !text-slate-700 list-disc pl-5">
          <li><strong className="!text-slate-900">AI Discovery Workspace:</strong> Enter a broad query like "Undergraduate CS Scholarships". The engine will safely scrape the web, filter out noise, and present validated opportunities.</li>
          <li><strong className="!text-slate-900">Database Management:</strong> Click "Post New" to manually add local opportunities that aren't listed publicly on the internet.</li>
        </ul>
      </div>
    </div>
  );
}
