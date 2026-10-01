import { useState } from "react";
import {
  ArrowUpRight,
  CheckCheck,
  Mail,
  Search,
  Send,
  MessagesSquare,
} from "lucide-react";
import { useApp } from "../store";
import { Avatar, Empty, PageHeading } from "../components/UI";
export default function Messages() {
  const { messages, setMessages, candidates, setCandidateId, notify } =
    useApp();
  const [selected, setSelected] = useState<number | null>(
    messages[0]?.id || null,
  );
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All messages");
  const [reply, setReply] = useState("");
  const current = messages.find((m) => m.id === selected);
  const person = candidates.find((c) => c.id === current?.candidateId);
  const visible = messages.filter((m) => {
    const c = candidates.find((c) => c.id === m.candidateId);
    return (
      `${m.subject} ${c?.name}`.toLowerCase().includes(query.toLowerCase()) &&
      (tab !== "Unread" || m.unread)
    );
  });
  const open = (id: number) => {
    setSelected(id);
    setReply("");
    setMessages((old) =>
      old.map((m) => (m.id === id ? { ...m, unread: false } : m)),
    );
  };
  return (
    <>
      <PageHeading
        eyebrow="KEEP THE CONVERSATION GOING"
        title="Messages"
        description="Every great hire starts with a human connection."
      >
        <button
          className="button secondary"
          onClick={() => {
            setMessages((old) => old.map((m) => ({ ...m, unread: false })));
            notify("All messages marked as read");
          }}
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </PageHeading>
      <section className={`panel inbox ${selected ? "conversation-open" : ""}`}>
        <div className="inbox-sidebar">
          <div className="inbox-heading">
            <h2>Your inbox</h2>
            <span className="count">
              {messages.filter((m) => m.unread).length} unread
            </span>
          </div>
          <div className="search-field">
            <Search size={16} />
            <input
              aria-label="Search messages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
            />
          </div>
          <div className="list-tabs">
            {["All messages", "Unread"].map((t) => (
              <button
                className={tab === t ? "active" : ""}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="message-list">
            {visible.map((m) => {
              const c = candidates.find((c) => c.id === m.candidateId)!;
              return (
                <button
                  className={`message-preview ${selected === m.id ? "active" : ""}`}
                  key={m.id}
                  onClick={() => open(m.id)}
                >
                  <Avatar person={c} />
                  <div>
                    <div className="message-preview-top">
                      <strong>{c.name}</strong>
                      <span>{m.time}</span>
                    </div>
                    <h3>{m.subject}</h3>
                    <p>{m.preview}</p>
                    {m.unread && <i className="unread-dot" />}
                  </div>
                </button>
              );
            })}
            {visible.length === 0 && (
              <Empty
                title="You’re all caught up"
                text="No conversations match this view."
              />
            )}
          </div>
          <div className="inbox-demo">
            <MessagesSquare size={16} />A little space for real connection.
          </div>
        </div>
        {current && person ? (
          <div className="conversation">
            <div className="conversation-heading">
              <button
                className="back-inbox text-link"
                onClick={() => setSelected(null)}
              >
                ← Inbox
              </button>
              <Avatar person={person} />
              <div>
                <h2>{person.name}</h2>
                <span>{person.role}</span>
              </div>
              <button
                className="icon-button"
                aria-label="View candidate profile"
                onClick={() => setCandidateId(person.id)}
              >
                <ArrowUpRight size={19} />
              </button>
            </div>
            <div className="conversation-body">
              <div className="conversation-date">Today · October 1, 2026</div>
              <div className="email-heading">
                <Mail size={18} />
                <h3>{current.subject}</h3>
              </div>
              <div className="message-bubble incoming">
                <p>{current.preview}</p>
                <span>
                  {current.time} · {person.name.split(" ")[0]}
                </span>
              </div>
              {current.replies.map((r, i) => (
                <div className="message-bubble outgoing" key={i}>
                  <p>{r}</p>
                  <span>
                    Sarah Mitchell <CheckCheck size={13} />
                  </span>
                </div>
              ))}
              <div className="conversation-context">
                <span className="live-dot" />
                You’re connected with {person.name.split(" ")[0]} about the{" "}
                {person.role} role.
              </div>
            </div>
            <form
              className="reply-box"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                setMessages((old) =>
                  old.map((m) =>
                    m.id === current.id
                      ? {
                          ...m,
                          replies: [...m.replies, reply.trim()],
                          unread: false,
                        }
                      : m,
                  ),
                );
                setReply("");
                notify("Reply saved to your demo conversation");
              }}
            >
              <label className="sr-only" htmlFor="message-reply">
                Your reply
              </label>
              <textarea
                id="message-reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Write a thoughtful reply to ${person.name.split(" ")[0]}…`}
                rows={3}
                required
              />
              <div>
                <span>Demo inbox · replies are saved locally</span>
                <button
                  className="button primary"
                  disabled={!reply.trim()}
                  type="submit"
                >
                  Send reply <Send size={15} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="conversation-empty">
            <Empty
              title="A conversation is waiting"
              text="Choose a message to pick up where you left off."
            />
          </div>
        )}
      </section>
    </>
  );
}
