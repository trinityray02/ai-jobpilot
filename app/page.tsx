export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">
          AI JobPilot
        </h1>

        <button className="rounded-lg bg-white px-5 py-2 font-medium text-slate-950">
          Get Started
        </button>
      </nav>

      <section className="mx-auto max-w-5xl px-8 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
          AI-Powered Career Assistant
        </p>

        <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
          Turn Your Resume Into Your
          <span className="text-blue-400"> Competitive Edge.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Analyze job descriptions, discover missing skills,
          improve your resume, and prepare for interviews with AI.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600">
            Analyze a Job
          </button>

          <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900">
            Upload Resume
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-8 pb-20 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">
            🎯 Job Matching
          </h3>

          <p className="mt-3 text-slate-400">
            Compare your skills against a job description
            and receive an AI-powered match score.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">
            📄 Resume Analysis
          </h3>

          <p className="mt-3 text-slate-400">
            Upload your resume and get personalized
            recommendations for improvement.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">
            🎤 Interview Prep
          </h3>

          <p className="mt-3 text-slate-400">
            Practice realistic interview questions and
            receive AI-powered feedback.
          </p>
        </div>
      </section>
    </main>
  );
}