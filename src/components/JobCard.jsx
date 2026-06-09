import { useState } from "react";
import { BriefcaseBusiness, ChevronDown, MapPin } from "lucide-react";
import NotesSection from "./NotesSection";

const STATUS_STYLES = {
  Standby: {
    dot: "bg-slate-400 shadow-[0_0_12px_rgba(148,163,184,0.55)]",
    badge: "border-slate-300/30 bg-slate-300/10 text-slate-200",
    card: "job-card--standby",
  },
  "Work in Progress": {
    dot: "bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.8)]",
    badge:
      "border-cyan-300/45 bg-cyan-300/15 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]",
    card: "job-card--active",
  },
  Done: {
    dot: "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.65)]",
    badge: "border-emerald-300/40 bg-emerald-400/15 text-emerald-100",
    card: "job-card--done",
  },
};

export default function JobCard({
  clientId,
  job,
  onAddNote,
  onUpdateNote,
  onUpdateJobStatus,
  onDeleteNote,
  onDeleteJob,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = STATUS_STYLES[job.status] ?? STATUS_STYLES.Standby;

  return (
    <article
      className={`job-card ${styles.card} overflow-hidden rounded-2xl`}
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
        className="w-full p-3.5 text-left sm:p-4"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-violet-300/15 bg-violet-400/8 text-violet-200">
            <BriefcaseBusiness size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-sm font-black text-white sm:text-base">
                {job.project}
              </h4>
              <span className={`status-badge ${styles.badge}`}>
                <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                {job.status}
              </span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-slate-400">
              <MapPin size={13} className="shrink-0 text-slate-500" />
              {job.jobsite}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 sm:block">
              {job.notes.length} {job.notes.length === 1 ? "note" : "notes"}
            </span>
            <ChevronDown
              size={17}
              className={`text-slate-500 transition-transform duration-300 ${
                isExpanded ? "rotate-180 text-violet-200" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <NotesSection
          clientId={clientId}
          job={job}
          onAddNote={onAddNote}
          onUpdateNote={onUpdateNote}
          onUpdateJobStatus={onUpdateJobStatus}
          onDeleteNote={onDeleteNote}
          onDeleteJob={onDeleteJob}
        />
      )}
    </article>
  );
}
