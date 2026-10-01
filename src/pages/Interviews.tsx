import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Video,
  ArrowRight,
  Check,
  UsersRound,
} from "lucide-react";
import { useApp } from "../store";
import type { Interview } from "../data";
import {
  Avatar,
  Badge,
  Empty,
  Modal,
  PageHeading,
  PanelHeading,
} from "../components/UI";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
function weekDate(offset: number, day: number) {
  return new Date(2026, 8, 28 + offset * 7 + day);
}
export default function Interviews() {
  const { interviews, candidates } = useApp();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<number | null>(
    params.has("interview") ? Number(params.get("interview")) : null,
  );
  const [week, setWeek] = useState(0);
  const [view, setView] = useState<"week" | "list">("week");
  const current = interviews.find((i) => i.id === selected);
  const sorted = interviews
    .filter((i) => i.day >= 3)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const weekLabel = `${weekDate(week, 0).toLocaleDateString("en-GB", { month: "short", day: "numeric" })} – ${weekDate(week, 4).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}, 2026`;
  return (
    <>
      <PageHeading
        eyebrow="GOOD CONVERSATIONS START HERE"
        title="Interview schedule"
        description="A little preparation makes every conversation count."
      >
        <span className="date-pill">
          <CalendarDays size={15} />
          {sorted.length} upcoming interviews
        </span>
      </PageHeading>
      <section className="panel calendar-panel">
        <div className="calendar-toolbar">
          <div>
            <button
              className="icon-button"
              aria-label="Previous week"
              onClick={() => setWeek(week - 1)}
            >
              <ChevronLeft size={19} />
            </button>
            <button
              className="icon-button"
              aria-label="Next week"
              onClick={() => setWeek(week + 1)}
            >
              <ChevronRight size={19} />
            </button>
            <h2>{weekLabel}</h2>
            <button
              className="button secondary small-button"
              onClick={() => setWeek(0)}
            >
              Today
            </button>
          </div>
          <div className="segmented-control">
            <button
              className={view === "week" ? "active" : ""}
              onClick={() => setView("week")}
            >
              Week
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>
        </div>
        {view === "week" ? (
          <div className="calendar-scroll">
            <div className="week-calendar">
              <div className="calendar-day-headers">
                <div className="timezone">
                  SAST<small>GMT+2</small>
                </div>
                {days.map((day, i) => (
                  <div
                    className={week === 0 && i === 3 ? "today" : ""}
                    key={day}
                  >
                    <span>{day.slice(0, 3)}</span>
                    <strong>{weekDate(week, i).getDate()}</strong>
                    {week === 0 && i === 3 && <i />}
                  </div>
                ))}
              </div>
              <div className="calendar-grid">
                <div className="calendar-hours">
                  {[9, 10, 11, 12, 13, 14, 15, 16].map((h) => (
                    <span key={h}>{`${h}:00`}</span>
                  ))}
                </div>
                {days.map((day, d) => (
                  <div
                    className={`calendar-day ${week === 0 && d === 3 ? "today-column" : ""}`}
                    key={day}
                  >
                    {[9, 10, 11, 12, 13, 14, 15, 16].map((h) => (
                      <div className="hour-grid" key={h} />
                    ))}
                    {week === 0 &&
                      interviews
                        .filter((i) => i.day === d)
                        .map((interview) => {
                          const c = candidates.find(
                            (c) => c.id === interview.candidateId,
                          )!;
                          const [h, m] = interview.time.split(":").map(Number);
                          return (
                            <button
                              className={`calendar-event event-${interview.title.toLowerCase().includes("technical") ? 1 : /culture|offer/i.test(interview.title) ? 0 : 2}`}
                              style={{
                                top: (h - 9 + m / 60) * 66 + 4,
                                height: Math.max(
                                  48,
                                  (interview.duration / 60) * 66 - 7,
                                ),
                              }}
                              onClick={() => setSelected(interview.id)}
                              key={interview.id}
                            >
                              <span>
                                {interview.time} · {interview.duration} min
                              </span>
                              <strong>{c.name}</strong>
                              {interview.duration >= 45 && (
                                <small>{interview.title}</small>
                              )}
                            </button>
                          );
                        })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="calendar-list">
            {week === 0 ? (
              interviews
                .slice()
                .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
                .map((i) => {
                  const c = candidates.find((c) => c.id === i.candidateId)!;
                  return (
                    <button
                      key={i.id}
                      className="calendar-list-item"
                      onClick={() => setSelected(i.id)}
                    >
                      <span className="list-date">
                        <strong>{weekDate(0, i.day).getDate()}</strong>
                        <small>{days[i.day].slice(0, 3)}</small>
                      </span>
                      <Avatar person={c} />
                      <div>
                        <strong>{c.name}</strong>
                        <small>{i.title}</small>
                      </div>
                      <span>
                        {i.time} · {i.duration} min
                      </span>
                      <ArrowRight size={17} />
                    </button>
                  );
                })
            ) : (
              <Empty
                title="A little room in your week"
                text="No interviews scheduled for this week."
              />
            )}
          </div>
        )}
        <div className="calendar-legend">
          <span>
            <i className="green" />
            Portfolio & introductory
          </span>
          <span>
            <i className="purple" />
            Technical
          </span>
          <span>
            <i className="amber" />
            Culture & offer
          </span>
          <span>All times in South African Standard Time</span>
        </div>
      </section>
      <section className="panel upcoming-panel">
        <PanelHeading
          title="Up next"
          subtitle="Your next opportunities to connect."
        />
        <div className="upcoming-grid">
          {sorted.slice(0, 3).map((i) => {
            const c = candidates.find((c) => c.id === i.candidateId)!;
            return (
              <button
                className="upcoming-card"
                key={i.id}
                onClick={() => setSelected(i.id)}
              >
                <div className="upcoming-date">
                  <CalendarDays size={14} />
                  {days[i.day]},{" "}
                  {weekDate(0, i.day).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                  })}
                  <Badge kind="screening">Confirmed</Badge>
                </div>
                <div className="person-cell">
                  <Avatar person={c} />
                  <span>
                    <strong>{c.name}</strong>
                    <small>{i.title}</small>
                  </span>
                </div>
                <div className="upcoming-meta">
                  <span>
                    <Clock3 size={14} />
                    {i.time} · {i.duration} min
                  </span>
                  <span>
                    {i.type === "In person" ? (
                      <MapPin size={14} />
                    ) : (
                      <Video size={14} />
                    )}{" "}
                    {i.type}
                  </span>
                  <ArrowRight size={15} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
      {current && (
        <InterviewModal
          interview={current}
          onClose={() => {
            setSelected(null);
            setParams({}, { replace: true });
          }}
        />
      )}
    </>
  );
}
function InterviewModal({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  const { candidates, updateInterview } = useApp();
  const candidate = candidates.find((c) => c.id === interview.candidateId)!;
  const [reschedule, setReschedule] = useState(false);
  const [day, setDay] = useState(interview.day);
  const [time, setTime] = useState(interview.time);
  return (
    <Modal
      title="Interview details"
      subtitle={interview.title}
      onClose={onClose}
    >
      <div className="modal-body">
        <div className="interview-detail-person">
          <Avatar person={candidate} size="lg" />
          <div>
            <h2>{candidate.name}</h2>
            <p>{candidate.role}</p>
            <Badge kind="screening">Confirmed</Badge>
          </div>
        </div>
        <div className="interview-detail-grid">
          <div>
            <CalendarDays size={18} />
            <span>
              <small>Date</small>
              <strong>
                {days[interview.day]},{" "}
                {weekDate(0, interview.day).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                })}
              </strong>
            </span>
          </div>
          <div>
            <Clock3 size={18} />
            <span>
              <small>Time · SAST</small>
              <strong>
                {interview.time} · {interview.duration} minutes
              </strong>
            </span>
          </div>
          <div>
            <Video size={18} />
            <span>
              <small>Location</small>
              <strong>
                {interview.type === "In person"
                  ? "Acme Studio · Meeting room 2"
                  : interview.type}
              </strong>
            </span>
          </div>
          <div>
            <UsersRound size={18} />
            <span>
              <small>Interviewer</small>
              <strong>{interview.interviewer}</strong>
            </span>
          </div>
        </div>
        <div className="profile-section">
          <h3>Participants</h3>
          <div className="participant">
            <Avatar person={candidate} size="sm" />
            <div>
              <strong>{candidate.name}</strong>
              <small>Candidate</small>
            </div>
            <Avatar
              person={{ name: interview.interviewer, color: "green" }}
              size="sm"
            />
            <div>
              <strong>{interview.interviewer}</strong>
              <small>Interviewer</small>
            </div>
          </div>
        </div>
        <div className="profile-section">
          <h3>Conversation notes</h3>
          <p className="interview-notes">{interview.notes}</p>
        </div>
        {reschedule && (
          <form
            id="reschedule-form"
            className="reschedule-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateInterview({ ...interview, day, time });
              onClose();
            }}
          >
            <h3>Find a better time</h3>
            <div className="form-grid">
              <label>
                Day
                <select
                  aria-label="Day"
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                >
                  {days.map((d, i) => (
                    <option value={i} key={d}>
                      {d}, {weekDate(0, i).getDate()}{" "}
                      {weekDate(0, i).toLocaleDateString("en-GB", {
                        month: "short",
                      })}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Time (SAST)
                <input
                  type="time"
                  min="09:00"
                  max="16:00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </label>
            </div>
            <p className="text-muted">
              Rescheduling updates this demo calendar. No invitations will be
              sent.
            </p>
          </form>
        )}
      </div>
      <div className="modal-footer">
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
        {reschedule ? (
          <button
            className="button primary"
            type="submit"
            form="reschedule-form"
          >
            <Check size={16} />
            Confirm new time
          </button>
        ) : (
          <button
            className="button primary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setReschedule(true);
            }}
          >
            <CalendarDays size={16} />
            Reschedule
          </button>
        )}
      </div>
    </Modal>
  );
}
