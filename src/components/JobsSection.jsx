import { useState } from "react";
import { BriefcaseBusiness, Plus, Trash2 } from "lucide-react";
import AddJobModal from "./AddJobModal";
import JobCard from "./JobCard";

export default function JobsSection({
  client,
  onAddJob,
  onUpdateJobStatus,
  onDeleteJob,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onDeleteClient,
}) {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className="jobs-panel mx-2 rounded-b-[2rem] px-4 pb-4 pt-5 sm:mx-4 sm:px-5 sm:pb-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white">Client Jobs</h3>
          <p className="mt-1 text-[0.68rem] text-slate-500">
            Select a job to see and manage its notes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsJobModalOpen(true)}
          className="secondary-button flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[0.68rem] font-bold"
        >
          <Plus size={13} />
          New Job
        </button>
      </div>

      {client.jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 py-8 text-center">
          <BriefcaseBusiness size={24} className="mx-auto text-slate-600" />
          <p className="mt-3 text-xs text-slate-500">
            No jobs yet. Add the first job for this client.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {client.jobs.map((job) => (
            <JobCard
              key={job.id}
              clientId={client.id}
              job={job}
              onAddNote={onAddNote}
              onUpdateNote={onUpdateNote}
              onUpdateJobStatus={onUpdateJobStatus}
              onDeleteNote={onDeleteNote}
              onDeleteJob={onDeleteJob}
            />
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-white/8 pt-4">
        {isConfirmingDelete ? (
          <div className="delete-confirmation">
            <div>
              <p className="text-sm font-bold text-rose-100">
                Delete {client.name}?
              </p>
              <p className="mt-1 text-xs text-rose-200/60">
                This deletes every job and note under this client.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="secondary-button rounded-lg px-3 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDeleteClient(client.id)}
                className="danger-button rounded-lg px-3 py-2 text-xs font-bold"
              >
                Delete Client
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className="danger-button flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold"
          >
            <Trash2 size={14} />
            Delete Client
          </button>
        )}
      </div>

      <AddJobModal
        isOpen={isJobModalOpen}
        clientName={client.name}
        onClose={() => setIsJobModalOpen(false)}
        onSave={(job) => {
          onAddJob(client.id, job);
          setIsJobModalOpen(false);
        }}
      />
    </div>
  );
}
