import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  UsersRound,
  Kanban,
  CalendarDays,
  MessagesSquare,
  Search,
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
  Settings2,
  CircleHelp,
  ArrowUpRight,
  X,
  Menu,
  Check,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useApp, useStored } from "../store";
import { Avatar, Empty, Modal } from "./UI";
const navigation = [
  { path: "/dashboard", name: "Overview", icon: LayoutDashboard },
  { path: "/jobs", name: "Job openings", icon: BriefcaseBusiness },
  { path: "/candidates", name: "Candidates", icon: UsersRound },
  { path: "/pipeline", name: "Hiring pipeline", icon: Kanban },
  { path: "/interviews", name: "Interviews", icon: CalendarDays },
  { path: "/messages", name: "Messages", icon: MessagesSquare },
];
export default function Shell({ children }: { children: ReactNode }) {
  const {
    theme,
    setTheme,
    candidates,
    jobs,
    setCandidateId,
    messages,
    notify,
  } = useApp();
  const [collapsed, setCollapsed] = useStored("talentarc-sidebar", false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState<"notifications" | "profile" | null>(null);
  const [dialog, setDialog] = useState<
    "settings" | "help" | "workspace" | null
  >(null);
  const [notificationsRead, setNotificationsRead] = useStored(
    "talentarc-notifications-read",
    false,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    setMobile(false);
    setSearchOpen(false);
    setSearch("");
    setMenu(null);
  }, [location.pathname]);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!topRef.current?.contains(e.target as Node)) {
        setMenu(null);
        setSearchOpen(false);
      }
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setSearchOpen(false);
        setMobile(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const unread = messages.filter((m) => m.unread).length;
  const matches = candidates
    .filter((c) =>
      (c.name + " " + c.role).toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 4);
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobile && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <NavLink to="/dashboard" className="brand" aria-label="Talentarc home">
          <span className="brand-mark">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path
                d="M5 24v-9a11 11 0 0 1 22 0v9M12 24v-9a4 4 0 0 1 8 0v9"
                stroke="currentColor"
                strokeWidth="3.3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-word">
            talentarc<span>RECRUITING, REIMAGINED</span>
          </span>
        </NavLink>
        <button
          className="workspace-switch"
          onClick={() => setDialog("workspace")}
          title="Workspace details"
        >
          <span className="workspace-icon">
            A<span>•</span>
          </span>
          <span className="sidebar-label">
            <strong>Acme Studio</strong>
            <small>Pro workspace</small>
          </span>
          <ChevronDown size={15} className="sidebar-label" />
        </button>
        <div className="nav-label sidebar-label">WORKSPACE</div>
        <nav>
          {navigation.map(({ path, name, icon: Icon }) => (
            <NavLink
              to={path}
              key={path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title={collapsed ? name : undefined}
            >
              <Icon size={19} />
              <span className="sidebar-label">{name}</span>
              {path === "/messages" && unread > 0 && (
                <span className="nav-count sidebar-label">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="team-card sidebar-label">
            <div className="team-card-icon">
              <Sparkles size={19} />
            </div>
            <strong>Great teams start here.</strong>
            <p>Your next great hire is one conversation away.</p>
            <button onClick={() => navigate("/candidates")}>
              Find your next hire <ArrowUpRight size={15} />
            </button>
          </div>
          <button
            className="nav-item"
            onClick={() => setDialog("settings")}
            title="Settings"
          >
            <Settings2 size={19} />
            <span className="sidebar-label">Settings</span>
          </button>
          <button
            className="nav-item"
            onClick={() => setDialog("help")}
            title="Help & resources"
          >
            <CircleHelp size={19} />
            <span className="sidebar-label">Help & resources</span>
          </button>
          <div className="sidebar-footer">
            <span className="sidebar-label">
              <i /> All systems operational
            </span>
            <button
              className="icon-button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronsRight size={17} />
              ) : (
                <ChevronsLeft size={17} />
              )}
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar" ref={topRef}>
          <div className="topbar-start">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">
              Workspace <span>/</span>{" "}
              <strong>
                {navigation.find((n) => n.path === location.pathname)?.name ||
                  "Overview"}
              </strong>
            </span>
          </div>
          <div className="topbar-actions">
            <div className="global-search">
              <Search size={17} />
              <input
                aria-label="Search candidates and jobs"
                placeholder="Search anything…"
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
              />
              <kbd>⌕</kbd>
              {searchOpen && (
                <div className="search-results">
                  <div className="dropdown-label">
                    {search ? "SEARCH RESULTS" : "QUICK FIND"}
                  </div>
                  {matches.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCandidateId(c.id);
                        setSearchOpen(false);
                        setSearch("");
                      }}
                    >
                      <Avatar person={c} size="sm" />
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.role}</small>
                      </span>
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                  {search &&
                    jobs
                      .filter((j) =>
                        j.title.toLowerCase().includes(search.toLowerCase()),
                      )
                      .slice(0, 2)
                      .map((j) => (
                        <button
                          key={`job${j.id}`}
                          onClick={() => {
                            navigate(`/jobs?q=${encodeURIComponent(j.title)}`);
                            setSearchOpen(false);
                          }}
                        >
                          <span className="job-icon small">
                            <BriefcaseBusiness size={16} />
                          </span>
                          <span>
                            <strong>{j.title}</strong>
                            <small>Job opening · {j.status}</small>
                          </span>
                        </button>
                      ))}
                  {matches.length === 0 &&
                    !jobs.some((j) =>
                      j.title.toLowerCase().includes(search.toLowerCase()),
                    ) && <Empty />}
                </div>
              )}
            </div>
            <button
              className="icon-button theme-button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <div className="topbar-dropdown">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                aria-expanded={menu === "notifications"}
                onClick={() =>
                  setMenu(menu === "notifications" ? null : "notifications")
                }
              >
                <Bell size={19} />
                {!notificationsRead && <i />}
              </button>
              {menu === "notifications" && (
                <div className="dropdown notifications">
                  <div className="dropdown-title">
                    <strong>Notifications</strong>
                    <button
                      onClick={() => {
                        setNotificationsRead(true);
                        notify("All notifications marked as read");
                      }}
                      title="Mark all as read"
                    >
                      <Check size={17} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/candidates");
                      setNotificationsRead(true);
                    }}
                  >
                    <span className="notification-icon">
                      <UsersRound size={17} />
                    </span>
                    <span>
                      <strong>Fresh talent, fresh possibilities</strong>
                      <small>2 new candidates applied today.</small>
                      <em>25 minutes ago</em>
                    </span>
                  </button>
                  <button onClick={() => navigate("/interviews")}>
                    <span className="notification-icon peach">
                      <CalendarDays size={17} />
                    </span>
                    <span>
                      <strong>Your next interview is at 10:00</strong>
                      <small>Portfolio review with Olivia Bennett.</small>
                      <em>Today</em>
                    </span>
                  </button>
                  <button onClick={() => navigate("/messages")}>
                    <span className="notification-icon purple">
                      <MessagesSquare size={17} />
                    </span>
                    <span>
                      <strong>Sophia replied to your offer</strong>
                      <small>Pick up the conversation in Messages.</small>
                      <em>1 hour ago</em>
                    </span>
                  </button>
                </div>
              )}
            </div>
            <span className="topbar-divider" />
            <div className="topbar-dropdown">
              <button
                className="profile-button"
                onClick={() => setMenu(menu === "profile" ? null : "profile")}
                aria-label="Profile menu"
                aria-expanded={menu === "profile"}
              >
                <Avatar
                  person={{
                    name: "Sarah Mitchell",
                    photo: initialProfilePhoto,
                    color: "green",
                  }}
                  size="sm"
                />
                <span>
                  <strong>Sarah Mitchell</strong>
                  <small>Talent Lead</small>
                </span>
                <ChevronDown size={14} />
              </button>
              {menu === "profile" && (
                <div className="dropdown profile-menu">
                  <div className="dropdown-title">
                    <div>
                      <strong>Sarah Mitchell</strong>
                      <small>sarah@acmestudio.demo</small>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDialog("settings");
                      setMenu(null);
                    }}
                  >
                    <Settings2 size={16} />
                    Workspace preferences
                  </button>
                  <button
                    onClick={() => {
                      setDialog("workspace");
                      setMenu(null);
                    }}
                  >
                    <UsersRound size={16} />
                    Your team
                  </button>
                  <button
                    onClick={() =>
                      notify(
                        "You’re in a demo workspace. No sign-in is required.",
                      )
                    }
                  >
                    <LogOut size={16} />
                    About this demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="main-content">
          {children}
          <footer className="content-footer">
            <span>Thoughtful hiring. Exceptional teams.</span>
            <span>
              © 2026 Talentarc <i /> Made for people.
            </span>
          </footer>
        </main>
      </div>
      {dialog && (
        <Modal
          title={
            dialog === "settings"
              ? "Workspace preferences"
              : dialog === "help"
                ? "A little help, a lot of possibility."
                : "Welcome to Acme Studio"
          }
          onClose={() => setDialog(null)}
        >
          <div className="modal-body">
            {dialog === "settings" ? (
              <>
                <p className="text-muted">
                  Make this workspace feel like yours. Your preferences are
                  saved on this device.
                </p>
                <div className="settings-row">
                  <div>
                    <h3>Appearance</h3>
                    <p>Choose your preferred color theme.</p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                  >
                    {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}{" "}
                    {theme === "light" ? "Dark mode" : "Light mode"}
                  </button>
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Compact navigation</h3>
                    <p>Give your workspace a little more room.</p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => setCollapsed(!collapsed)}
                  >
                    {collapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
                <div className="info-box">
                  Demo data is stored in your browser. Candidate changes, notes,
                  job edits, and message replies stay here when you return.
                </div>
              </>
            ) : dialog === "help" ? (
              <>
                <p className="text-muted">
                  Everything you need to move from first hello to your next
                  great hire.
                </p>
                <div className="help-item">
                  <strong>Manage your candidate pool</strong>
                  <p>
                    Search, filter, select, or star candidates. Open a profile
                    to add a note or update their hiring stage.
                  </p>
                </div>
                <div className="help-item">
                  <strong>Keep your pipeline moving</strong>
                  <p>
                    Use the stage selector on any candidate card. Counts update
                    across your workspace automatically.
                  </p>
                </div>
                <div className="help-item">
                  <strong>Plan the next conversation</strong>
                  <p>
                    Click any interview to review details or choose a new day
                    and time.
                  </p>
                </div>
                <div className="info-box">
                  This is a front-end demo. Messages, job publishing, and
                  rescheduling update the local workspace only.
                </div>
              </>
            ) : (
              <>
                <div className="workspace-info">
                  <span className="workspace-icon large">
                    A<span>•</span>
                  </span>
                  <div>
                    <h2>Acme Studio</h2>
                    <p>A good place to build great things.</p>
                  </div>
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Sarah Mitchell</h3>
                    <p>Talent Lead · Workspace administrator</p>
                  </div>
                  <Avatar person={{ name: "Sarah Mitchell", color: "green" }} />
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Alex Morgan</h3>
                    <p>Engineering Lead · Interviewer</p>
                  </div>
                  <Avatar person={{ name: "Alex Morgan", color: "blue" }} />
                </div>
                <div className="info-box">
                  Pro demo workspace · Africa/Johannesburg (SAST)
                  <br />
                  Recruiting together since 2024.
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="button primary" onClick={() => setDialog(null)}>
              Got it <X size={15} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
const initialProfilePhoto =
  `${import.meta.env.BASE_URL}images/avatar-1.jpg`;
