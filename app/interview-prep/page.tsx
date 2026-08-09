"use client";

import { useState } from "react";

type InterviewQuestion = {
  question: string;
  category: string;
};

type Feedback = {
  overallScore: number;
  technicalAccuracy: number;
  communication: number;
  completeness: number;
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
};

export default function InterviewPrepPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, Feedback>>({});
  const [loading, setLoading] = useState(false);
  const [evaluatingIndex, setEvaluatingIndex] = useState<number | null>(null);
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
      setAnswers({});
      setFeedback({});

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

  async function evaluateAnswer(index: number) {
    const question = questions[index]?.question;
    const answer = answers[index];

    if (!answer?.trim()) {
      setError("Please enter an answer before submitting.");
      return;
    }

    try {
      setEvaluatingIndex(index);
      setError("");

      const response = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
          jobTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to evaluate your answer.");
        return;
      }

      setFeedback((currentFeedback) => ({
        ...currentFeedback,
        [index]: data.feedback,
      }));
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setEvaluatingIndex(null);
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
            Generate realistic interview questions, practice your answers,
            and receive AI-powered scoring and feedback.
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
            {loading
              ? "Generating Questions..."
              : "Generate Interview Questions"}
          </button>

          {error && (
            <div className="mt-5 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold">
              Practice Interview
            </h2>

            {questions.map((item, index) => {
              const currentFeedback = feedback[index];

              return (
                <div
                  key={`${item.question}-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
                        {item.category}
                      </p>

                      <p className="mt-2 text-lg text-slate-200">
                        {item.question}
                      </p>

                      <textarea
                        value={answers[index] || ""}
                        onChange={(event) =>
                          setAnswers((currentAnswers) => ({
                            ...currentAnswers,
                            [index]: event.target.value,
                          }))
                        }
                        placeholder="Type your interview answer here..."
                        className="mt-5 min-h-40 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                      />

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => evaluateAnswer(index)}
                          disabled={evaluatingIndex === index}
                          className="rounded-lg bg-blue-500 px-5 py-2 font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {evaluatingIndex === index
                            ? "Evaluating..."
                            : "Evaluate Answer"}
                        </button>
                      </div>

                      {currentFeedback && (
                        <div className="mt-6 space-y-5">
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                              <p className="text-xs uppercase text-slate-500">
                                Overall
                              </p>

                              <p className="mt-2 text-3xl font-bold text-blue-400">
                                {currentFeedback.overallScore}/10
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                              <p className="text-xs uppercase text-slate-500">
                                Technical
                              </p>

                              <p className="mt-2 text-3xl font-bold">
                                {currentFeedback.technicalAccuracy}/10
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                              <p className="text-xs uppercase text-slate-500">
                                Communication
                              </p>

                              <p className="mt-2 text-3xl font-bold">
                                {currentFeedback.communication}/10
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                              <p className="text-xs uppercase text-slate-500">
                                Completeness
                              </p>

                              <p className="mt-2 text-3xl font-bold">
                                {currentFeedback.completeness}/10
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-5 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                              <h3 className="font-semibold text-green-400">
                                Strengths
                              </h3>

                              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                {currentFeedback.strengths.map(
                                  (strength, strengthIndex) => (
                                    <li key={strengthIndex}>
                                      ✓ {strength}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                              <h3 className="font-semibold text-yellow-400">
                                Improvements
                              </h3>

                              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                {currentFeedback.improvements.map(
                                  (improvement, improvementIndex) => (
                                    <li key={improvementIndex}>
                                      • {improvement}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                            <h3 className="font-semibold text-blue-400">
                              Example Stronger Answer
                            </h3>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                              {currentFeedback.betterAnswer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}