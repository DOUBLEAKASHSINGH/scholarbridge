export default function HelpPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-20 px-6 flex flex-col items-center text-center">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Help Center</h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          Need assistance? Email our support team at as3004399@gmail.com.
        </p>
        <a 
          href="mailto:as3004399@gmail.com"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
