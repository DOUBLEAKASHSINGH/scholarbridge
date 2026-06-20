export default function DocsPage() {
  return (
    <div className="min-h-screen w-full !bg-slate-50 !text-slate-900 py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-blue prose-slate">
        <h1 className="text-4xl font-bold !text-slate-900 mb-4">Documentation</h1>
        <p className="text-xl !text-slate-600 mb-12">The complete guide to navigating and maximizing the ScholarBridge platform.</p>
        
        <div className="!bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold !text-blue-600 mb-6 border-b border-slate-100 pb-4">For Students</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">🎓</span> 
                1. Building Your Profile
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                Navigate to your <strong>Profile</strong> to set up the foundation for the AI engine. You can input your Academic Background, Financial Need, and select multiple Demographic chips (e.g., First-Generation, STEM).
                <br /><br />
                <strong>Dual Document Input:</strong> In the Document Links section, you have ultimate flexibility. You can either paste a viewable Google Drive link OR securely upload your Resume/CV and Statement of Purpose directly as files. The AI Coach uses these documents to provide hyper-personalized advice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">✨</span> 
                2. AI-Curated Matches (Dashboard)
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                Your primary dashboard serves as an intelligent feed. Based on your unique profile, our engine automatically ranks the best scholarships, grants, and internships for you. Look for the <strong>AI Match Score</strong> tag on each card to see exactly how well you align with the opportunity's criteria.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">💬</span> 
                3. The AI-Powered Mentorship Coach
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                Click <strong>"AI-Powered Mentorship Coach"</strong> on any opportunity card to open a real-time chat with our Gemini-powered assistant. The Coach automatically reads the specific opportunity requirements alongside your uploaded resume and profile. It can draft essay outlines, critique your SOP, and prepare you for interviews.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">🔍</span> 
                4. AI Web Discovery Engine
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                Can't find what you're looking for? Use the Discovery Engine to perform real-time web scans. Filter by Funding Type, Degree, Category, and Geography to pull live opportunities from the internet directly into your view.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">📌</span> 
                5. The Application Tracker
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                When you save an opportunity, it moves to your <strong>My Tracker</strong> board. Keep your job hunt organized by moving cards through stages: <em>Saved → Drafting → Applied → Interview → Accepted</em>.
              </p>
            </div>
          </div>
        </div>

        <div className="!bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold !text-indigo-600 mb-6 border-b border-slate-100 pb-4">For Administrators</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">📊</span> 
                1. The Admin Overview
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                The administrative dashboard provides immediate high-level statistics: Total Students, Active Opportunities, and total Applications Tracked. It also features a cleanly paginated list of "Recent Opportunities" to review what has recently been added to the database.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">🌐</span> 
                2. AI Discovery Workspace
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                A powerful tool for program managers. Enter a broad query like <em>"Undergraduate CS Scholarships 2026"</em>. The engine (powered by Gemini & Tavily) securely scrapes the web, filters out noise, structures the data into our schema, and allows you to instantly import verified opportunities to the global database.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold !text-slate-900 mb-2 flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">🗄️</span> 
                3. Database Management & Directory
              </h3>
              <p className="!text-slate-700 leading-relaxed pl-10">
                Admins have full access to the <strong>Directory</strong> to view the student base and can manually use the <strong>"Post New"</strong> feature to list highly localized or unlisted opportunities directly to the student dashboard.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
