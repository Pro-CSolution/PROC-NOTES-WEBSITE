import { useState } from "react";
import { Building2, ChevronDown, Layers3 } from "lucide-react";
import JobsSection from "./JobsSection";

export default function ClientCard({
  client,
  onAddJob,
  onDeleteJob,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onDeleteClient,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const noteCount = client.jobs.reduce(
    (total, job) => total + job.notes.length,
    0,
  );

  return (
    <article className="client-shell rounded-[2rem]">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
        className="client-card w-full rounded-[2rem] p-4 text-left sm:p-5"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="client-icon grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-13 sm:w-13">
            <Building2 size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-cyan-300/70">
              Client
            </p>
            <h2 className="mt-1 truncate text-base font-black text-white sm:text-lg">
              {client.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="count-chip">
                <Layers3 size={14} />
                {client.jobs.length} {client.jobs.length === 1 ? "job" : "jobs"}
              </span>
              <span className="count-chip">
                {noteCount} {noteCount === 1 ? "note" : "notes"}
              </span>
            </div>
          </div>

          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/4">
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-300 ${
                isExpanded ? "rotate-180 text-cyan-200" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <JobsSection
          client={client}
          onAddJob={onAddJob}
          onDeleteJob={onDeleteJob}
          onAddNote={onAddNote}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onDeleteClient={onDeleteClient}
        />
      )}
    </article>
  );
}
