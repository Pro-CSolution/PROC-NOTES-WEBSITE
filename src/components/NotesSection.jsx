import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import AddNoteModal from "./AddNoteModal";
import NoteCard from "./NoteCard";

export default function NotesSection({
  clientId,
  job,
  onAddNote,
  onUpdateNote,
  onUpdateJobStatus,
  onDeleteNote,
  onDeleteJob,
}) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const statusClass =
    job.status === "Work in Progress"
      ? "status-select--active"
      : job.status === "Done"
        ? "status-select--done"
        : "status-select--standby";

  return (
    <div className="job-notes-panel px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-3">
        <div>
          <h4 className="text-sm font-bold text-white">Notes for this job</h4>
          <p className="mt-1 text-[0.68rem] text-slate-500">
            {job.notes.length} {job.notes.length === 1 ? "saved note" : "saved notes"}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-[0.58rem] font-black uppercase tracking-wider text-slate-500">
              Job status
            </span>
            <select
              value={job.status}
              onChange={(event) =>
                onUpdateJobStatus(clientId, job.id, event.target.value)
              }
              aria-label={`Change status for ${job.project}`}
              className={`status-select ${statusClass} rounded-md px-2.5 py-1.5 text-[0.68rem] font-bold`}
            >
              <option>Standby</option>
              <option>Work in Progress</option>
              <option>Done</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setIsNoteModalOpen(true)}
            className="secondary-button flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[0.68rem] font-bold"
          >
            <Plus size={13} />
            New Note
          </button>
        </div>
      </div>

      {job.notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 py-7 text-center">
          <FileText size={22} className="mx-auto text-slate-600" />
          <p className="mt-3 text-xs text-slate-500">
            No notes for this job yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {job.notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={(updatedNote) =>
                onUpdateNote(clientId, job.id, note.id, updatedNote)
              }
              onDelete={() => onDeleteNote(clientId, job.id, note.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-white/8 pt-4">
        {isConfirmingDelete ? (
          <div className="delete-confirmation">
            <div>
              <p className="text-sm font-bold text-rose-100">
                Delete {job.project}?
              </p>
              <p className="mt-1 text-xs text-rose-200/60">
                This also deletes all notes in this job.
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
                onClick={() => onDeleteJob(clientId, job.id)}
                className="danger-button rounded-lg px-3 py-2 text-xs font-bold"
              >
                Delete Job
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
            Delete Job
          </button>
        )}
      </div>

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={(note) => {
          onAddNote(clientId, job.id, note);
          setIsNoteModalOpen(false);
        }}
      />
    </div>
  );
}
