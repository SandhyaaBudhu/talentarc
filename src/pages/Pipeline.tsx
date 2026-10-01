import { useState } from "react";
import { ArrowUpRight, Search, Star, UsersRound } from "lucide-react";
import { stages } from "../data";
import type { Stage } from "../data";
import { useApp } from "../store";
import { Avatar, Empty, PageHeading } from "../components/UI";
export default function Pipeline() {
  const { candidates, jobs, moveCandidate, setCandidateId, toggleFavorite } =
    useApp();
  const [role, setRole] = useState("All roles");
  const [query, setQuery] = useState("");
  const visible = candidates.filter(
    (c) =>
      (role === "All roles" || c.role === role) &&
      c.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="FROM POTENTIAL TO POSSIBILITY"
        title="Hiring pipeline"
        description="Keep every candidate moving toward their next chapter."
      >
        <select
          aria-label="Pipeline role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
      </PageHeading>
      <div className="pipeline-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search pipeline"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a candidate…"
          />
        </div>
        <span>
          <UsersRound size={16} />
          {visible.length} candidates <i /> Use the stage selector to move a
          candidate
        </span>
      </div>
      <div className="pipeline-board">
        {stages.map((stage, index) => {
          const list = visible.filter((c) => c.stage === stage);
          return (
            <section className={`pipeline-column column-${index}`} key={stage}>
              <header>
                <span className="column-dot" />
                <h2>{stage}</h2>
                <span className="count">{list.length}</span>
              </header>
              <div className="pipeline-column-body">
                {list.map((c) => (
                  <article className="pipeline-card" key={c.id}>
                    <div className="pipeline-card-top">
                      <Avatar person={c} />
                      <button
                        className={`icon-button favorite ${c.favorite ? "is-favorite" : ""}`}
                        onClick={() => toggleFavorite(c.id)}
                        aria-label={`${c.favorite ? "Unstar" : "Star"} ${c.name}`}
                      >
                        <Star
                          size={16}
                          fill={c.favorite ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <button
                      className="pipeline-name"
                      onClick={() => setCandidateId(c.id)}
                    >
                      {c.name}
                      <ArrowUpRight size={13} />
                    </button>
                    <p>{c.role}</p>
                    <div className="chips compact">
                      {c.skills.slice(0, 2).map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="pipeline-card-meta">
                      <span>{c.source}</span>
                      <span>{c.experience} yrs exp.</span>
                    </div>
                    <label className="sr-only" htmlFor={`stage-${c.id}`}>
                      Stage for {c.name}
                    </label>
                    <select
                      id={`stage-${c.id}`}
                      value={c.stage}
                      onChange={(e) =>
                        moveCandidate(c.id, e.target.value as Stage)
                      }
                    >
                      {stages.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </article>
                ))}
                {list.length === 0 && (
                  <Empty
                    title="Room for possibility"
                    text="Move a candidate into this stage."
                  />
                )}
              </div>
              <div className="column-footer">
                {list.length} {list.length === 1 ? "candidate" : "candidates"}{" "}
                in {stage.toLowerCase()}
              </div>
            </section>
          );
        })}
      </div>
      <div className="pipeline-hint">
        <span className="live-dot" />
        Every move is saved automatically and reflected throughout your
        workspace.
      </div>
    </>
  );
}
