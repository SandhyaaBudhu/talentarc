import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ArrowRight,
  BriefcaseBusiness,
  UsersRound,
  CalendarDays,
  Timer,
  TrendingUp,
  ChevronDown,
  Video,
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import { useApp } from "../store";
import { Avatar, Badge, PageHeading, PanelHeading } from "../components/UI";
import { ApplicationsChart, PipelineFunnel } from "../components/Charts";

export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export default function Dashboard() {
  const { candidates, jobs, interviews, setCandidateId, notify } = useApp();
  const [period, setPeriod] = useState("Last 30 days");
  const openJobs = jobs.filter((j) => j.status === "Open");
  const upcoming = interviews
    .filter((i) => i.day >= 3)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const metrics = [
    {
      label: "Open positions",
      value: openJobs.length,
      icon: BriefcaseBusiness,
      color: "green",
      change: "+2",
      caption: "vs. last month",
      trend: "up",
    },
    {
      label: "Active candidates",
      value: candidates.filter((c) => c.stage !== "Hired").length,
      icon: UsersRound,
      color: "blue",
      change: "+18.5%",
      caption: "vs. last month",
      trend: "up",
    },
    {
      label: "Interviews scheduled",
      value: upcoming.length,
      icon: CalendarDays,
      color: "purple",
      change: "This week",
      caption: "across your team",
      trend: "neutral",
    },
    {
      label: "Avg. time to hire",
      value: "24",
      unit: "days",
      icon: Timer,
      color: "amber",
      change: "−4 days",
      caption: "vs. last month",
      trend: "up",
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="YOUR WORKSPACE, IN FOCUS"
        title="Good morning, Sarah 👋"
        description="Here’s what’s happening with your hiring today."
      >
        <span className="date-pill">
          <CalendarDays size={15} />
          Thu, Oct 1, 2026
        </span>
        <button
          className="button secondary"
          onClick={() => {
            downloadCSV("talentarc-hiring-report.csv", [
              ["Metric", "Value"],
              ["Open positions", openJobs.length],
              [
                "Active candidates",
                candidates.filter((c) => c.stage !== "Hired").length,
              ],
              ["Upcoming interviews", upcoming.length],
              ["Average time to hire (historical)", 24],
              [],
              ["Candidate", "Role", "Stage", "Source"],
              ...candidates.map((c) => [c.name, c.role, c.stage, c.source]),
            ]);
            notify("Hiring report exported");
          }}
        >
          <ArrowDownToLine size={16} />
          Export report
        </button>
      </PageHeading>
      <div className="overview-note">
        <span>
          <span className="live-dot" />
          Your hiring momentum is looking good.
        </span>
        <span>
          <strong>
            {candidates.filter((c) => c.stage === "Offer").length} offers
          </strong>{" "}
          ready for the next chapter <ArrowUpRight size={14} />
        </span>
      </div>
      <div className="metrics-grid">
        {metrics.map(
          ({
            label,
            value,
            unit,
            icon: Icon,
            color,
            change,
            caption,
            trend,
          }) => (
            <div className="metric-card" key={label}>
              <div className="metric-top">
                <span>{label}</span>
                <span className={`metric-icon ${color}`}>
                  <Icon size={19} />
                </span>
              </div>
              <div className="metric-value">
                {value}
                <small>{unit}</small>
                <span className={`metric-spark ${color}`}>
                  <svg viewBox="0 0 90 35">
                    <path
                      d={
                        color === "amber"
                          ? "M2 5 L15 12 L28 8 L41 19 L54 16 L67 27 L80 23 L88 31"
                          : "M2 30 L14 24 L26 28 L39 14 L51 20 L64 9 L76 13 L88 3"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="metric-foot">
                <span className={trend === "up" ? "positive" : "neutral"}>
                  {trend === "up" && <TrendingUp size={12} />} {change}
                </span>
                <span>{caption}</span>
              </div>
            </div>
          ),
        )}
      </div>
      <div className="dashboard-charts">
        <section className="panel trend-panel">
          <PanelHeading
            title="Applications overview"
            subtitle="A little momentum, a lot of potential."
          >
            <div className="select-wrap">
              <select
                aria-label="Applications chart period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {["Last 30 days", "Last 3 months", "Last 12 months"].map(
                  (p) => (
                    <option key={p}>{p}</option>
                  ),
                )}
              </select>
              <ChevronDown size={14} />
            </div>
          </PanelHeading>
          <div className="trend-summary">
            <strong>
              {jobs.reduce((n, j) => n + j.applicants, 0)}
              <span>total applications</span>
            </strong>
            <span className="trend-growth">
              <TrendingUp size={13} /> 18.5% <span>vs. previous period</span>
            </span>
            <div className="chart-legend">
              <span>
                <i />
                This period
              </span>
              <span>
                <i />
                Previous period
              </span>
            </div>
          </div>
          <ApplicationsChart period={period} />
        </section>
        <section className="panel">
          <PanelHeading
            title="Hiring pipeline"
            subtitle="Every step brings you closer."
          >
            <Link
              className="icon-button"
              to="/pipeline"
              aria-label="View pipeline"
            >
              <ArrowUpRight size={18} />
            </Link>
          </PanelHeading>
          <PipelineFunnel candidates={candidates} />
          <div className="funnel-footer">
            <span>
              <i />
              {candidates.length} tracked candidates
            </span>
            <Link to="/pipeline">
              View pipeline <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
      <div className="dashboard-middle">
        <section className="panel">
          <PanelHeading
            title="Open positions"
            subtitle="Build the team you believe in."
          >
            <Link className="text-link" to="/jobs">
              View all <ArrowRight size={14} />
            </Link>
          </PanelHeading>
          <div className="open-jobs-list">
            {openJobs.slice(0, 4).map((job, i) => (
              <Link
                to={`/jobs?q=${encodeURIComponent(job.title)}`}
                className="open-job"
                key={job.id}
              >
                <span className={`job-icon job-color-${i}`}>
                  <BriefcaseBusiness size={20} />
                </span>
                <div className="open-job-detail">
                  <strong>{job.title}</strong>
                  <span>
                    {job.department} <i /> {job.location.split(" / ")[0]}
                  </span>
                </div>
                <div className="open-job-count">
                  <strong>{job.applicants}</strong>
                  <span>applicants</span>
                </div>
                <ArrowUpRight size={16} className="text-muted" />
              </Link>
            ))}
          </div>
          <div className="panel-bottom">
            <span>
              <span className="live-dot" />
              {openJobs.length} roles open for possibility
            </span>
            <Link className="text-link" to="/jobs">
              Manage jobs <ArrowRight size={14} />
            </Link>
          </div>
        </section>
        <section className="panel schedule-panel">
          <PanelHeading
            title="Today’s interviews"
            subtitle="Make room for a good conversation."
          >
            <Link
              className="icon-button"
              to="/interviews"
              aria-label="View all interviews"
            >
              <MoreHorizontal size={20} />
            </Link>
          </PanelHeading>
          <div className="today-label">
            <CalendarDays size={14} />
            THURSDAY, OCTOBER 1
            <span>
              {interviews.filter((i) => i.day === 3).length} interviews
            </span>
          </div>
          {interviews
            .filter((i) => i.day === 3)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((interview, i) => {
              const candidate = candidates.find(
                (c) => c.id === interview.candidateId,
              )!;
              return (
                <Link
                  to={`/interviews?interview=${interview.id}`}
                  className="interview-row"
                  key={interview.id}
                >
                  <div className="interview-time">
                    <strong>{interview.time}</strong>
                    <span>{interview.duration} min</span>
                  </div>
                  <span className={`interview-line line-${i}`} />
                  <Avatar person={candidate} size="sm" />
                  <div className="interview-info">
                    <strong>{candidate.name}</strong>
                    <span>{interview.title}</span>
                  </div>
                  <span className="interview-type" title={interview.type}>
                    {interview.type === "In person" ? (
                      <MapPin size={15} />
                    ) : (
                      <Video size={15} />
                    )}
                  </span>
                </Link>
              );
            })}
          <Link to="/interviews" className="schedule-all">
            See full schedule <ArrowRight size={15} />
          </Link>
        </section>
      </div>
      <div className="dashboard-bottom">
        <section className="panel recent-panel">
          <PanelHeading
            title="Recent candidates"
            subtitle="Meet the people behind the applications."
          >
            <Link className="text-link" to="/candidates">
              View all <ArrowRight size={14} />
            </Link>
          </PanelHeading>
          <div className="table-scroll">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied for</th>
                  <th>Stage</th>
                  <th>Applied</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 4).map((c) => (
                  <tr key={c.id} onClick={() => setCandidateId(c.id)}>
                    <td>
                      <button
                        className="person-cell"
                        onClick={() => setCandidateId(c.id)}
                      >
                        <Avatar person={c} size="sm" />
                        <span>
                          <strong>{c.name}</strong>
                          <small>{c.email}</small>
                        </span>
                      </button>
                    </td>
                    <td>{c.role}</td>
                    <td>
                      <Badge>{c.stage}</Badge>
                    </td>
                    <td className="text-muted">
                      {c.date === "2026-10-01" ? "Today" : "Yesterday"}
                    </td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label={`Open ${c.name}'s profile`}
                        onClick={() => setCandidateId(c.id)}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel sourcing-panel">
          <PanelHeading
            title="Top sourcing channels"
            subtitle="Where great connections begin."
          />
          <div className="source-total">
            <strong>{candidates.length}</strong>
            <span>candidates · all sources</span>
          </div>
          {[
            { name: "LinkedIn", symbol: "in", color: "blue" },
            { name: "Careers page", symbol: "↗", color: "green" },
            { name: "Referral", symbol: "✳", color: "purple" },
            { name: "Agency", symbol: "◈", color: "amber" },
          ].map((source) => {
            const count = candidates.filter(
              (c) => c.source === source.name,
            ).length;
            return (
              <div className="source-row" key={source.name}>
                <span className={`source-logo ${source.color}`}>
                  {source.symbol}
                </span>
                <div>
                  <span>
                    {source.name}
                    <strong>{count}</strong>
                  </span>
                  <div className="source-track">
                    <i
                      className={source.color}
                      style={{ width: `${(count / candidates.length) * 100}%` }}
                    />
                  </div>
                </div>
                <span>{Math.round((count / candidates.length) * 100)}%</span>
              </div>
            );
          })}
          <p className="source-insight">
            <TrendingUp size={15} />
            <span>Referrals lead the way to your next hire.</span>
          </p>
        </section>
      </div>
    </>
  );
}
