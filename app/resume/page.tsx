"use client";

import { ChangeEvent, useState } from "react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setMessage("");
    setResumeText("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setMessage("Please select a PDF resume.");
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose a resume first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setResumeText("");

      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON response:", text);
        setMessage("The server returned an unexpected response.");
        return;
      }

      if (!response.ok) {
        setMessage(data.error || "Resume upload failed.");
        return;
      }

      setResumeText(data.resumeText);

localStorage.setItem("resumeText", data.resumeText);
localStorage.setItem("resumeFileName", data.fileName);

setMessage(
  `Resume processed successfully: ${data.fileName}`
);
    } catch (error) {
      console.error(error);
      setMessage("Unable to upload resume.");
    } finally {
      setUploading(false);
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
            Resume Upload
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Upload your resume so AI JobPilot can compare your actual
            experience and skills against job descriptions.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 p-10 text-center">

            <div className="text-5xl">
              📄
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              Upload your resume
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              PDF files only
            </p>

            <label className="mt-6 inline-block cursor-pointer rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600">

              Choose Resume

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>
          </div>

          {file && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">

              <p className="text-sm text-slate-400">
                Selected Resume
              </p>

              <div className="mt-2 flex items-center justify-between gap-4">

                <div>
                  <p className="font-semibold">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                  Ready
                </span>

              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-6 w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Processing Resume..." : "Upload Resume"}
          </button>

          {message && (
            <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              {message}
            </div>
          )}

          {resumeText && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">

              <h2 className="text-lg font-semibold">
                Extracted Resume Text
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                AI JobPilot successfully read your resume.
              </p>

              <div className="mt-4 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm leading-6 text-slate-300">
                {resumeText}
              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}