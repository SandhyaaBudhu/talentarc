import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  X,
  Star,
  MapPin,
  BriefcaseBusiness,
  Mail,
  Plus,
  CheckCheck,
} from "lucide-react";
import type { Candidate } from "../data";
import { stages } from "../data";
import { useApp } from "../store";

export function Avatar({
  person,
  size = "md",
}: {
  person: Pick<Candidate, "name" | "photo" | "color">;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`avatar avatar-${size} avatar-${person.color}`}
      aria-label={person.name}
    >
      {person.photo && !failed ? (
        <img src={person.photo} alt="" onError={() => setFailed(true)} />
      ) : (
        person.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
      )}
    </span>
  );
}
export function Badge({
  children,
  kind,
}: {
  children: ReactNode;
  kind?: string;
}) {
  return (
    <span
      className={`badge badge-${(kind || String(children)).toLowerCase().replaceAll(" ", "-")}`}
    >
      <i />
      {children}
    </span>
  );
}
export function Empty({
  title = "No results found",
  text = "Try adjusting your search or filters.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <BriefcaseBusiness size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  drawer = false,
  subtitle,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  drawer?: boolean;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = ref.current;
    el?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab" && el) {
        const items = [
          ...el.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex="0"]',
          ),
        ].filter((e) => !e.hasAttribute("disabled"));
        const first = items[0];
        const last = items[items.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === el)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === el)
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = scroll;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className={`modal-backdrop ${drawer ? "drawer-backdrop" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={`modal ${drawer ? "drawer" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
export function CandidateDrawer() {
  const {
    candidateId,
    setCandidateId,
    candidates,
    toggleFavorite,
    moveCandidate,
    updateCandidate,
    notify,
  } = useApp();
  const candidate = candidates.find((c) => c.id === candidateId);
  const [note, setNote] = useState("");
  useEffect(() => setNote(""), [candidateId]);
  if (!candidate) return null;
  return (
    <Modal
      title="Candidate profile"
      subtitle={`TA-${String(candidate.id).padStart(4, "0")}`}
      drawer
      onClose={() => setCandidateId(null)}
    >
      <div className="drawer-content">
        <div className="profile-intro">
          <Avatar person={candidate} size="lg" />
          <button
            className={`icon-button favorite ${candidate.favorite ? "is-favorite" : ""}`}
            aria-label={candidate.favorite ? "Remove favorite" : "Add favorite"}
            onClick={() => toggleFavorite(candidate.id)}
          >
            <Star
              size={21}
              fill={candidate.favorite ? "currentColor" : "none"}
            />
          </button>
          <h2>{candidate.name}</h2>
          <p>{candidate.role}</p>
          <span className="text-muted">
            {candidate.company} · {candidate.experience} years of experience
          </span>
        </div>
        <div className="profile-contact">
          <span>
            <Mail size={16} />
            {candidate.email}
          </span>
          <span>
            <MapPin size={16} />
            {candidate.location}
          </span>
          <span>
            <BriefcaseBusiness size={16} />
            Sourced from {candidate.source}
          </span>
        </div>
        <div className="profile-section">
          <h3>Hiring stage</h3>
          <select
            aria-label="Hiring stage"
            value={candidate.stage}
            onChange={(e) =>
              moveCandidate(candidate.id, e.target.value as Candidate["stage"])
            }
          >
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="stage-track">
            {stages.map((s) => (
              <span
                key={s}
                className={
                  stages.indexOf(s) <= stages.indexOf(candidate.stage)
                    ? "done"
                    : ""
                }
                title={s}
              />
            ))}
          </div>
        </div>
        <div className="profile-section">
          <h3>Skills & expertise</h3>
          <div className="chips">
            {candidate.skills.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="profile-section">
          <h3>
            Team notes <span className="count">{candidate.notes.length}</span>
          </h3>
          {candidate.notes.map((n, i) => (
            <div className="note" key={i}>
              <div className="note-author">
                <Avatar
                  person={{ name: "Sarah Mitchell", color: "green" }}
                  size="xs"
                />
                <strong>Sarah Mitchell</strong>
                <span>Team note</span>
              </div>
              <p>{n}</p>
            </div>
          ))}
          {candidate.notes.length === 0 && (
            <p className="text-muted">Start the conversation with your team.</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              updateCandidate(candidate.id, {
                notes: [...candidate.notes, note.trim()],
              });
              setNote("");
              notify("Note added");
            }}
          >
            <label className="sr-only" htmlFor="candidate-note">
              Add a note
            </label>
            <textarea
              id="candidate-note"
              placeholder="Add your thoughts about this candidate…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              required
            />
            <button className="button primary" type="submit">
              <Plus size={16} />
              Add note
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
export function Toast() {
  const { toast, setToast } = useApp();
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 4200);
      return () => clearTimeout(id);
    }
  }, [toast, setToast]);
  return toast ? (
    <div className="toast" role="status">
      <CheckCheck size={19} />
      <span>{toast}</span>
      <button onClick={() => setToast("")} aria-label="Dismiss notification">
        <X size={16} />
      </button>
    </div>
  ) : null;
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
export function PanelHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
