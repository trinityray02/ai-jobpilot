"use client";

import { useState } from "react";

type Analysis = {
  matchScore: number;
  detectedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
};

export default function JobAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first.");
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);

      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <a
          href="/"
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </a>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            AI JobPilot
          </p>

          <h1 className="mt-3 text-4xl font-bold">Job Analyzer</h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Paste a job description below. AI JobPilot will compare the
            position against your resume and identify your strengths, missing
            skills, and overall match.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <label
            htmlFor="jobDescription"
            className="text-lg font-semibold"
          >
            Job Description
          </label>

          <p className="mt-1 text-sm text-slate-400">
            Copy and paste the complete job posting.
          </p>

          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here..."
            className="mt-5 min-h-80 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {jobDescription.length} characters
            </p>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Job"}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Match Score</p>

              <p className="mt-2 text-5xl font-bold text-blue-400">
                {analysis.matchScore}%
              </p>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${analysis.matchScore}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Detected Skills</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Skills that match the position.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.detectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Missing Skills</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Skills worth strengthening or highlighting.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                AI Recommendations
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Ways to strengthen your application for this position.
              </p>

              <ul className="mt-5 space-y-4">
                {analysis.recommendations.map(
                  (recommendation, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-lg bg-slate-950 p-4 text-slate-300"
                    >
                      <span className="font-bold text-blue-400">
                        {index + 1}.
                      </span>

                      <span>{recommendation}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}