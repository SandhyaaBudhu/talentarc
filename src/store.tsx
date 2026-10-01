import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  initialCandidates,
  initialJobs,
  initialInterviews,
  initialMessages,
} from "./data";
import type { Candidate, Job, Interview, Stage } from "./data";

export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  const update = (next: T | ((old: T) => T)) =>
    setValue((old) => {
      const value =
        typeof next === "function" ? (next as (old: T) => T)(old) : next;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* State stays available in memory. */
      }
      return value;
    });
  return [value, update] as const;
}
function useAppState() {
  const [candidates, setCandidates] = useStored(
    "talentarc-candidates-v1",
    initialCandidates,
  );
  const [jobs, setJobs] = useStored("talentarc-jobs-v1", initialJobs);
  const [interviews, setInterviews] = useStored(
    "talentarc-interviews-v1",
    initialInterviews,
  );
  const [messages, setMessages] = useStored(
    "talentarc-messages-v1",
    initialMessages,
  );
  const [theme, setTheme] = useStored<"light" | "dark">(
    "talentarc-theme",
    "light",
  );
  const [toast, setToast] = useState("");
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const notify = (message: string) => {
    setToast(message);
  };
  const updateCandidate = (id: number, patch: Partial<Candidate>) =>
    setCandidates((old) =>
      old.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  const moveCandidate = (id: number, stage: Stage) => {
    updateCandidate(id, { stage });
    notify(`Candidate moved to ${stage.toLowerCase()}`);
  };
  const toggleFavorite = (id: number) =>
    setCandidates((old) =>
      old.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
    );
  const saveJob = (job: Job) => {
    setJobs((old) =>
      old.some((j) => j.id === job.id)
        ? old.map((j) => (j.id === job.id ? job : j))
        : [job, ...old],
    );
    notify("Job saved to your workspace");
  };
  const updateInterview = (interview: Interview) => {
    setInterviews((old) =>
      old.map((i) => (i.id === interview.id ? interview : i)),
    );
    notify("Interview rescheduled");
  };
  return {
    candidates,
    jobs,
    interviews,
    messages,
    setMessages,
    theme,
    setTheme,
    toast,
    setToast,
    notify,
    candidateId,
    setCandidateId,
    updateCandidate,
    moveCandidate,
    toggleFavorite,
    saveJob,
    updateInterview,
  };
}
const Context = createContext<ReturnType<typeof useAppState> | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useApp() {
  const context = useContext(Context);
  if (!context) throw new Error("Missing provider");
  return context;
}
