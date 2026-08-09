"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  date: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Application["status"]>("Applied");
  const [date, setDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("applications");

    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  function saveApplications(updated: Application[]) {
    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
  }

  function addApplication() {
    if (!company.trim() || !role.trim()) {
      alert("Please enter a company and role.");
      return;
    }

    const newApplication: Application = {
      id: crypto.randomUUID(),
      company,
      role,
      status,
      date: date || new Date().toISOString().split("T")[0],
    };

    saveApplications([newApplication, ...applications]);

    setCompany("");
    setRole("");
    setStatus("Applied");
    setDate("");
  }

  function updateStatus(
    id: string,
    newStatus: Application["status"]
  ) {
    const updated = applications.map((application) =>
      application.id === id
        ? { ...application, status: newStatus }
        : application
    );

    saveApplications(updated);
  }

  function deleteApplication(id: string) {
    const updated = applications.filter(
      (application) => application.id !== id
    );

    saveApplications(updated);
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
            Track the roles you apply to and update their status as you move
            through the hiring process.
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
                setStatus(event.target.value as Application["status"])
              }
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-blue-500"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
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
            className="mt-5 w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
          >
            Add Application
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-2 text-3xl font-bold">
              {applications.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Applied</p>
            <p className="mt-2 text-3xl font-bold">
              {
                applications.filter(
                  (application) => application.status === "Applied"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Interviews</p>
            <p className="mt-2 text-3xl font-bold">
              {
                applications.filter(
                  (application) => application.status === "Interview"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Offers</p>
            <p className="mt-2 text-3xl font-bold">
              {
                applications.filter(
                  (application) => application.status === "Offer"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No applications yet.
            </div>
          ) : (
            applications.map((application) => (
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
                      Added: {application.date}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={application.status}
                      onChange={(event) =>
                        updateStatus(
                          application.id,
                          event.target.value as Application["status"]
                        )
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 outline-none"
                    >
                      <option>Applied</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>

                    <button
                      onClick={() => deleteApplication(application.id)}
                      className="rounded-lg border border-red-900 px-4 py-2 text-red-400 hover:bg-red-950/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}