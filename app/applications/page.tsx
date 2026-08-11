"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Application["status"]>("Applied");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/applications");

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to load applications.");
        return;
      }

      setApplications(data.applications);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function addApplication() {
    if (!company.trim() || !role.trim()) {
      setError("Please enter a company and role.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          role,
          status,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to add application.");
        return;
      }

      setApplications((current) => [
        data.application,
        ...current,
      ]);

      setCompany("");
      setRole("");
      setStatus("Applied");
      setDate("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    id: string,
    newStatus: Application["status"]
  ) {
    try {
      setError("");

      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update application.");
        return;
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? data.application
            : application
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    }
  }

  async function deleteApplication(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to delete application.");
        return;
      }

      setApplications((current) =>
        current.filter(
          (application) => application.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
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
            Applications Tracker
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Track applications in your PostgreSQL database and update
            your progress throughout the hiring process.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Add Application
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company"
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Job title"
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as Application["status"]
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-blue-500"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={addApplication}
            disabled={saving}
            className="mt-5 w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Application"}
          </button>

          {error && (
            <div className="mt-5 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold">
              {applications.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Applied
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                applications.filter(
                  (application) =>
                    application.status === "Applied"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Interviews
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                applications.filter(
                  (application) =>
                    application.status === "Interview"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Offers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                applications.filter(
                  (application) =>
                    application.status === "Offer"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No applications yet. Add your first one above.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {application.role}
                      </h3>

                      <p className="mt-1 text-slate-400">
                        {application.company}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Application date:{" "}
                        {new Date(
                          application.date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={application.status}
                        onChange={(event) =>
                          updateStatus(
                            application.id,
                            event.target
                              .value as Application["status"]
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 outline-none focus:border-blue-500"
                      >
                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Interview">
                          Interview
                        </option>

                        <option value="Offer">
                          Offer
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                      <button
                        onClick={() =>
                          deleteApplication(application.id)
                        }
                        className="rounded-lg border border-red-900 px-4 py-2 text-red-400 hover:bg-red-950/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}