import Link from "next/link";

const features = [
  {
    title: "Job Analyzer",
    description:
      "Compare your resume against a job description and get an AI-powered match score.",
    icon: "🎯",
    href: "/job-analyzer",
  },
  {
    title: "Resume Review",
    description:
      "Upload your resume and let AI JobPilot read and prepare it for analysis.",
    icon: "📄",
    href: "/resume",
  },
  {
    title: "Interview Prep",
    description:
      "Practice realistic interview questions and receive AI-powered feedback.",
    icon: "🎤",
    href: "/interview-prep",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
          <h1 className="mb-10 text-2xl font-bold text-blue-400">
            AI JobPilot
          </h1>

          <nav className="space-y-2">
            <Link
              href="/"
              className="block rounded-lg bg-blue-500 px-4 py-3 font-medium"
            >
              🏠 Dashboard
            </Link>

            <Link
              href="/resume"
              className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              📄 Resume
            </Link>

            <Link
              href="/job-analyzer"
              className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              🎯 Job Analyzer
            </Link>

            <Link
              href="/interview-prep"
              className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              🎤 Interview Prep
            </Link>

            <Link
              href="/applications"
              className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
            >
              💼 Applications
            </Link>
          </nav>
        </aside>

        <section className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-800 px-8 py-6">
            <div>
              <p className="text-sm text-slate-400">Welcome to</p>
              <h2 className="text-2xl font-bold">Your Career Dashboard</h2>
            </div>

            <Link
              href="/job-analyzer"
              className="rounded-lg bg-blue-500 px-5 py-2 font-semibold hover:bg-blue-600"
            >
              Analyze a Job
            </Link>
          </header>

          <div className="p-8">
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
                AI-Powered Career Assistant
              </p>

              <h3 className="max-w-3xl text-4xl font-bold">
                Turn your experience into a stronger software engineering
                application.
              </h3>

              <p className="mt-4 max-w-2xl text-slate-400">
                Upload your resume, analyze jobs, identify skill gaps, and
                prepare for interviews from one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/job-analyzer"
                  className="rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
                >
                  Start Job Analysis
                </Link>

                <Link
                  href="/resume"
                  className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
                >
                  Upload Resume
                </Link>
              </div>
            </section>

            <section className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Applications</p>
                <p className="mt-2 text-3xl font-bold">0</p>
                <p className="mt-2 text-sm text-slate-500">
                  Application tracking coming next
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">AI Analysis</p>
                <p className="mt-2 text-3xl font-bold">Live</p>
                <p className="mt-2 text-sm text-slate-500">
                  Personalized resume matching is active
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Resume Processing</p>
                <p className="mt-2 text-3xl font-bold">PDF</p>
                <p className="mt-2 text-sm text-slate-500">
                  Resume text extraction supported
                </p>
              </div>
            </section>

            <section className="mt-8">
              <h3 className="mb-5 text-xl font-bold">Tools</h3>

              <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature) => (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500"
                  >
                    <div className="text-3xl">{feature.icon}</div>

                    <h4 className="mt-4 text-xl font-semibold">
                      {feature.title}
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>

                    <p className="mt-5 font-semibold text-blue-400">
                      Open tool →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}