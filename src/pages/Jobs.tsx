import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  LayoutGrid,
  List,
  MapPin,
  Pencil,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import type { Job } from "../data";
import { useApp, useStored } from "../store";
import { Badge, Empty, Modal, PageHeading } from "../components/UI";
export default function Jobs() {
  const { jobs, saveJob } = useApp();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [status, setStatus] = useState("All jobs");
  const [view, setView] = useStored<"cards" | "table">(
    "talentarc-job-view",
    "cards",
  );
  const [editing, setEditing] = useState<Job | null>(null);
  const visible = jobs.filter(
    (j) =>
      (status === "All jobs" || j.status === status) &&
      `${j.title} ${j.department} ${j.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="THE NEXT CHAPTER STARTS HERE"
        title="Job openings"
        description="Meaningful opportunities for exceptional people."
      >
        <button
          className="button primary"
          onClick={() =>
            setEditing({
              id: Date.now(),
              title: "",
              department: "Design",
              location: "",
              type: "Full-time",
              status: "Draft",
              applicants: 0,
              salary: "",
              date: "2026-10-01",
            })
          }
        >
          <Plus size={17} />
          Create job
        </button>
      </PageHeading>
      <div className="jobs-status-strip">
        {["Open", "Draft", "Closed"].map((s) => (
          <button
            className={status === s ? "active" : ""}
            key={s}
            onClick={() => setStatus(status === s ? "All jobs" : s)}
          >
            <span className={`status-strip-dot ${s.toLowerCase()}`} />
            <strong>{jobs.filter((j) => j.status === s).length}</strong>
            <span>
              {s === "Open"
                ? "Open positions"
                : s === "Draft"
                  ? "In draft"
                  : "Closed roles"}
            </span>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <div className="jobs-toolbar">
        <div className="list-tabs">
          <button
            className={status === "All jobs" ? "active" : ""}
            onClick={() => setStatus("All jobs")}
          >
            All jobs <span>{jobs.length}</span>
          </button>
          {["Open", "Draft", "Closed"].map((s) => (
            <button
              className={status === s ? "active" : ""}
              onClick={() => setStatus(s)}
              key={s}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="jobs-toolbar-right">
          <div className="search-field">
            <Search size={16} />
            <input
              aria-label="Search jobs"
              placeholder="Search jobs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="view-toggle">
            <button
              aria-label="Card view"
              className={view === "cards" ? "active" : ""}
              onClick={() => setView("cards")}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="Table view"
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      {visible.length === 0 ? (
        <section className="panel">
          <Empty
            title="No jobs match this view"
            text="Try another search or create your next opportunity."
          />
        </section>
      ) : view === "cards" ? (
        <div className="jobs-grid">
          {visible.map((job, i) => (
            <article className="panel job-card" key={job.id}>
              <div className="job-card-top">
                <span className={`job-icon job-color-${i % 4}`}>
                  <BriefcaseBusiness size={23} />
                </span>
                <Badge>{job.status}</Badge>
                <button
                  className="icon-button"
                  aria-label={`Edit ${job.title}`}
                  onClick={() => setEditing(job)}
                >
                  <Pencil size={16} />
                </button>
              </div>
              <span className="department-label">{job.department}</span>
              <h2>{job.title}</h2>
              <div className="job-meta">
                <span>
                  <MapPin size={15} />
                  {job.location}
                </span>
                <span>
                  <Clock3 size={15} />
                  {job.type}
                </span>
              </div>
              <div className="job-salary">
                {job.salary || "Salary to be discussed"}
                <small>{job.salary.includes("hour") ? "" : "per year"}</small>
              </div>
              <div className="job-card-footer">
                <span>
                  <UsersRound size={16} />
                  <strong>{job.applicants}</strong> applicants
                </span>
                <button className="text-link" onClick={() => setEditing(job)}>
                  Manage role <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="panel table-scroll">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Applicants</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.title}</strong>
                    <small className="cell-subtext">{job.type}</small>
                  </td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>
                    <Badge>{job.status}</Badge>
                  </td>
                  <td>{job.applicants}</td>
                  <td>
                    <button
                      className="button secondary small-button"
                      onClick={() => setEditing(job)}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <div className="jobs-bottom-note">
        <span className="live-dot" />
        Thoughtful opportunities attract thoughtful people.
      </div>
      {editing && (
        <JobModal
          job={editing}
          exists={jobs.some((j) => j.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(job) => {
            saveJob(job);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
function JobModal({
  job,
  exists,
  onClose,
  onSave,
}: {
  job: Job;
  exists: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
}) {
  const [form, setForm] = useState(job);
  const [error, setError] = useState("");
  const field = (key: keyof Job, value: string) =>
    setForm({ ...form, [key]: value });
  return (
    <Modal
      title={exists ? "Edit job opening" : "Create a new opportunity"}
      subtitle={
        exists
          ? "Keep the details up to date."
          : "A great team starts with a clear role."
      }
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (form.title.trim().length < 4) {
            setError("Give your role a clear title of at least 4 characters.");
            return;
          }
          if (!form.location.trim()) {
            setError("Add a location or choose Remote.");
            return;
          }
          onSave({
            ...form,
            title: form.title.trim(),
            location: form.location.trim(),
          });
        }}
      >
        <div className="modal-body form-grid">
          <label className="full">
            Job title
            <input
              value={form.title}
              onChange={(e) => field("title", e.target.value)}
              placeholder="e.g. Senior Product Designer"
              required
              minLength={4}
            />
          </label>
          <label>
            Department
            <select
              value={form.department}
              onChange={(e) => field("department", e.target.value)}
            >
              {[
                "Design",
                "Engineering",
                "Product",
                "Marketing",
                "People",
                "Operations",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>
            Employment type
            <select
              value={form.type}
              onChange={(e) => field("type", e.target.value)}
            >
              {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="full">
            Location
            <input
              value={form.location}
              onChange={(e) => field("location", e.target.value)}
              placeholder="e.g. Cape Town / Hybrid, or Remote"
              required
            />
          </label>
          <label className="full">
            Salary range <span className="optional">(optional)</span>
            <input
              value={form.salary}
              onChange={(e) => field("salary", e.target.value)}
              placeholder="e.g. R720,000 – R960,000"
            />
          </label>
          <label className="full">
            Job status
            <select
              value={form.status}
              onChange={(e) => field("status", e.target.value)}
            >
              {["Draft", "Open", "Closed"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {error && (
            <p className="form-error full" role="alert">
              {error}
            </p>
          )}
          <div className="info-box full">
            Jobs are saved to this demo workspace. Opening a role makes it
            visible here; it won’t publish to an external job board.
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" type="submit">
            {exists ? "Save changes" : "Create job"}
            <ArrowUpRight size={15} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
