"use client";

import { useState } from "react";

type InterviewQuestion = {
  question: string;
  category: string;
};

export default function InterviewPrepPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateQuestions() {
    if (!jobTitle.trim()) {
      setError("Please enter a job title.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuestions([]);

      const response = await fetch("/api/interview-prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to generate interview questions.");
        return;
      }

      setQuestions(data.questions);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
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

          <h1 className="mt-3 text-4xl font-bold">
            Interview Prep
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Generate realistic technical and behavioral questions for the role
            you are preparing for.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <label
            htmlFor="jobTitle"
            className="text-lg font-semibold"
          >
            Job Title
          </label>

          <input
            id="jobTitle"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="Example: Software Engineer"
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating Questions..." : "Generate Interview Questions"}
          </button>

          {error && (
            <div className="mt-5 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold">
              Practice Questions
            </h2>

            {questions.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
                      {item.category}
                    </p>

                    <p className="mt-2 text-lg text-slate-200">
                      {item.question}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}