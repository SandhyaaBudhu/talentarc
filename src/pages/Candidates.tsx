import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import { stages } from "../data";
import type { Stage } from "../data";
import { useApp, useStored } from "../store";
import { Avatar, Badge, Empty, PageHeading } from "../components/UI";
import { downloadCSV } from "./Dashboard";
export default function Candidates() {
  const {
    candidates,
    jobs,
    setCandidateId,
    toggleFavorite,
    moveCandidate,
    notify,
  } = useApp();
  const [filters, setFilters] = useStored("talentarc-candidate-filters", {
    query: "",
    role: "All roles",
    stage: "All stages",
    favorites: false,
  });
  const [sort, setSort] = useState<{
    key: "name" | "role" | "date";
    ascending: boolean;
  }>({ key: "date", ascending: false });
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const updateFilters = (patch: Partial<typeof filters>) => {
    setFilters({ ...filters, ...patch });
    setPage(1);
  };
  const results = useMemo(
    () =>
      candidates
        .filter(
          (c) =>
            (c.name + " " + c.email + " " + c.skills.join(" "))
              .toLowerCase()
              .includes(filters.query.toLowerCase()) &&
            (filters.role === "All roles" || c.role === filters.role) &&
            (filters.stage === "All stages" || c.stage === filters.stage) &&
            (!filters.favorites || c.favorite) &&
            (!skill || c.skills.includes(skill)),
        )
        .sort(
          (a, b) =>
            a[sort.key].localeCompare(b[sort.key]) * (sort.ascending ? 1 : -1),
        ),
    [candidates, filters, sort, skill],
  );
  const pageCount = Math.max(1, Math.ceil(results.length / 8));
  const safePage = Math.min(page, pageCount);
  const visible = results.slice((safePage - 1) * 8, safePage * 8);
  const selectAll =
    visible.length > 0 && visible.every((c) => selected.includes(c.id));
  const exportCandidates = () => {
    const data = selected.length
      ? candidates.filter((c) => selected.includes(c.id))
      : results;
    downloadCSV("talentarc-candidates.csv", [
      ["Name", "Email", "Role", "Stage", "Skills", "Source"],
      ...data.map((c) => [
        c.name,
        c.email,
        c.role,
        c.stage,
        c.skills.join("; "),
        c.source,
      ]),
    ]);
    notify(`${data.length} candidates exported`);
  };
  return (
    <>
      <PageHeading
        eyebrow="PEOPLE, NOT JUST PROFILES"
        title="Candidate database"
        description="Your next great teammate could be right here."
      >
        <button className="button secondary" onClick={exportCandidates}>
          <ArrowDownToLine size={16} />
          Export candidates
        </button>
      </PageHeading>
      <div className="candidate-summary">
        <span className="summary-icon">
          <UsersRound size={20} />
        </span>
        <div>
          <strong>{candidates.length} candidates</strong>
          <span>in your talent community</span>
        </div>
        <div className="summary-avatars">
          {candidates.slice(0, 4).map((c) => (
            <Avatar key={c.id} person={c} size="sm" />
          ))}
          <span>+{candidates.length - 4}</span>
        </div>
        <span className="summary-caption">
          <span className="live-dot" />
          {candidates.filter((c) => c.date === "2026-10-01").length} new
          applications today
        </span>
      </div>
      <section className="panel candidates-panel">
        <div className="list-tabs">
          <button
            className={!filters.favorites ? "active" : ""}
            onClick={() => updateFilters({ favorites: false })}
          >
            All candidates <span>{candidates.length}</span>
          </button>
          <button
            className={filters.favorites ? "active" : ""}
            onClick={() => updateFilters({ favorites: true })}
          >
            <Star size={15} />
            Starred <span>{candidates.filter((c) => c.favorite).length}</span>
          </button>
        </div>
        <div className="filter-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              placeholder="Search name, email, or skill…"
              aria-label="Search candidates"
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
            />
            {filters.query && (
              <button
                onClick={() => updateFilters({ query: "" })}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <select
            aria-label="Filter by role"
            value={filters.role}
            onChange={(e) => updateFilters({ role: e.target.value })}
          >
            <option>All roles</option>
            {[
              ...new Set([
                ...jobs.map((j) => j.title),
                ...candidates.map((c) => c.role),
              ]),
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            aria-label="Filter by stage"
            value={filters.stage}
            onChange={(e) => updateFilters({ stage: e.target.value })}
          >
            <option>All stages</option>
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            className={`button secondary ${skillsOpen ? "is-active" : ""}`}
            onClick={() => setSkillsOpen(!skillsOpen)}
          >
            <SlidersHorizontal size={16} />
            Skills{skill && <span className="count">1</span>}
          </button>
        </div>
        {skillsOpen && (
          <div className="skills-filter">
            <span>Filter by expertise</span>
            <button
              className={`chip ${!skill ? "selected" : ""}`}
              onClick={() => {
                setSkill("");
                setPage(1);
              }}
            >
              All skills
            </button>
            {[...new Set(candidates.flatMap((c) => c.skills))]
              .slice(0, 15)
              .map((s) => (
                <button
                  className={`chip ${skill === s ? "selected" : ""}`}
                  key={s}
                  onClick={() => {
                    setSkill(skill === s ? "" : s);
                    setPage(1);
                  }}
                >
                  {s}
                </button>
              ))}
          </div>
        )}
        {selected.length > 0 && (
          <div className="bulk-bar">
            <strong>{selected.length} selected</strong>
            <select
              aria-label="Move selected candidates"
              value=""
              onChange={(e) => {
                selected.forEach((id) =>
                  moveCandidate(id, e.target.value as Stage),
                );
                setSelected([]);
              }}
            >
              <option value="" disabled>
                Move to stage…
              </option>
              {stages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="text-link" onClick={exportCandidates}>
              Export selection
            </button>
            <button
              className="icon-button"
              aria-label="Clear selection"
              onClick={() => setSelected([])}
            >
              <X size={17} />
            </button>
          </div>
        )}
        <div className="table-scroll">
          <table className="candidate-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    aria-label="Select all visible candidates"
                    checked={selectAll}
                    onChange={() =>
                      setSelected(
                        selectAll
                          ? selected.filter(
                              (id) => !visible.some((c) => c.id === id),
                            )
                          : [
                              ...new Set([
                                ...selected,
                                ...visible.map((c) => c.id),
                              ]),
                            ],
                      )
                    }
                  />
                </th>
                {[
                  { key: "name", label: "Candidate" },
                  { key: "role", label: "Applied for" },
                ].map((col) => (
                  <th key={col.key}>
                    <button
                      onClick={() =>
                        setSort({
                          key: col.key as "name" | "role",
                          ascending:
                            sort.key === col.key ? !sort.ascending : true,
                        })
                      }
                    >
                      {col.label}
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                ))}
                <th>Skills</th>
                <th>Stage</th>
                <th>
                  <button
                    onClick={() =>
                      setSort({
                        key: "date",
                        ascending:
                          sort.key === "date" ? !sort.ascending : false,
                      })
                    }
                  >
                    Applied
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr
                  key={c.id}
                  className={selected.includes(c.id) ? "selected-row" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${c.name}`}
                      checked={selected.includes(c.id)}
                      onChange={() =>
                        setSelected(
                          selected.includes(c.id)
                            ? selected.filter((id) => id !== c.id)
                            : [...selected, c.id],
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="person-cell"
                      onClick={() => setCandidateId(c.id)}
                    >
                      <Avatar person={c} />
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.email}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <button
                      className="plain-text-button"
                      onClick={() => setCandidateId(c.id)}
                    >
                      {c.role}
                    </button>
                    <small className="cell-subtext">{c.location}</small>
                  </td>
                  <td>
                    <div className="chips compact">
                      {c.skills.slice(0, 2).map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                      <span
                        className="skill-more"
                        title={c.skills.slice(2).join(", ")}
                      >
                        +{c.skills.length - 2}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge>{c.stage}</Badge>
                  </td>
                  <td className="text-muted">
                    {new Date(c.date + "T12:00:00").toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short" },
                    )}
                  </td>
                  <td>
                    <button
                      className={`icon-button favorite ${c.favorite ? "is-favorite" : ""}`}
                      onClick={() => toggleFavorite(c.id)}
                      aria-label={`${c.favorite ? "Unstar" : "Star"} ${c.name}`}
                    >
                      <Star
                        size={17}
                        fill={c.favorite ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && (
          <Empty title="No candidates match this view" />
        )}
        <div className="table-footer">
          <span>
            Showing {results.length ? (safePage - 1) * 8 + 1 : 0}–
            {Math.min(safePage * 8, results.length)} of {results.length}{" "}
            candidates
          </span>
          <div>
            <button
              className="icon-button"
              disabled={safePage === 1}
              aria-label="Previous page"
              onClick={() => setPage(safePage - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                className={`page-number ${safePage === i + 1 ? "current" : ""}`}
                key={i}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="icon-button"
              disabled={safePage === pageCount}
              aria-label="Next page"
              onClick={() => setPage(safePage + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
