"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Application = {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  date: string;
};

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
      "Upload your resume and prepare it for personalized job analysis.",
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");

        if (!response.ok) {
          throw new Error("Unable to load applications.");
        }

        const data = await response.json();

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Dashboard application error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offers = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const latestApplication = applications[0];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
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

        {/* Main Content */}
        <section className="flex-1">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-800 px-8 py-6">
            <div>
              <p className="text-sm text-slate-400">
                Welcome to
              </p>

              <h2 className="text-2xl font-bold">
                Your Career Dashboard
              </h2>
            </div>

            <Link
              href="/job-analyzer"
              className="rounded-lg bg-blue-500 px-5 py-2 font-semibold hover:bg-blue-600"
            >
              Analyze a Job
            </Link>
          </header>

          <div className="p-8">

            {/* Hero */}
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
                AI-Powered Career Assistant
              </p>

              <h3 className="max-w-3xl text-4xl font-bold">
                Turn your experience into stronger job applications.
              </h3>

              <p className="mt-4 max-w-2xl text-slate-400">
                Upload your resume, analyze job descriptions, identify
                skill gaps, practice interviews, and track applications
                from one dashboard.
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

            {/* Live Stats */}
            <section className="mt-8">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  Application Overview
                </h3>

                <Link
                  href="/applications"
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  View Applications →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-400">
                    Total Applications
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {loading ? "..." : totalApplications}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Roles currently tracked
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-400">
                    Interviews
                  </p>

                  <p className="mt-2 text-4xl font-bold text-blue-400">
                    {loading ? "..." : interviews}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Applications in interview stage
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-400">
                    Offers
                  </p>

                  <p className="mt-2 text-4xl font-bold text-green-400">
                    {loading ? "..." : offers}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Offers received
                  </p>
                </div>
              </div>
            </section>

            {/* Latest Application */}
            <section className="mt-8">
              <h3 className="mb-5 text-xl font-bold">
                Latest Application
              </h3>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                {loading ? (
                  <p className="text-slate-400">
                    Loading latest application...
                  </p>
                ) : latestApplication ? (
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        {latestApplication.company}
                      </p>

                      <h4 className="mt-1 text-xl font-semibold">
                        {latestApplication.role}
                      </h4>

                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(
                          latestApplication.date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium">
                      {latestApplication.status}
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-400">
                      You haven't added any applications yet.
                    </p>

                    <Link
                      href="/applications"
                      className="mt-4 inline-block font-semibold text-blue-400 hover:text-blue-300"
                    >
                      Add your first application →
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Tools */}
            <section className="mt-8">
              <h3 className="mb-5 text-xl font-bold">
                AI Career Tools
              </h3>

              <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature) => (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500"
                  >
                    <div className="text-3xl">
                      {feature.icon}
                    </div>

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

            {/* Tech Stack */}
            <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Built With
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  "Next.js",
                  "TypeScript",
                  "React",
                  "Tailwind CSS",
                  "PostgreSQL",
                  "Prisma",
                  "Supabase",
                  "Groq AI",
                ].map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </section>

          </div>
        </section>
      </div>
    </main>
  );
}