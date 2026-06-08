import { useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function NoteCard({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [form, setForm] = useState({
    title: note.title,
    description: note.description,
    date: note.date,
  });

  const openEditor = () => {
    if (isConfirmingDelete) return;
    setForm({
      title: note.title,
      description: note.description,
      date: note.date,
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setForm({
      title: note.title,
      description: note.description,
      date: note.date,
    });
  };

  const saveNote = (event) => {
    event.preventDefault();
    onUpdate({
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
    });
    setIsEditing(false);
  };

  return (
    <article
      onClick={isEditing ? undefined : openEditor}
      onKeyDown={
        isEditing
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openEditor();
              }
            }
      }
      tabIndex={isEditing ? undefined : 0}
      aria-label={isEditing ? undefined : `Edit note ${note.title}`}
      className={`note-card rounded-xl p-3.5 sm:p-4 ${
        isEditing ? "" : "cursor-pointer"
      }`}
    >
      {isEditing ? (
        <form
          className="space-y-3"
          onSubmit={saveNote}
          onClick={(event) => event.stopPropagation()}
        >
          <label className="block">
            <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Note title
            </span>
            <input
              autoFocus
              required
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="form-field text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Description
            </span>
            <textarea
              required
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="form-field resize-y text-xs leading-5"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Date
            </span>
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              className="form-field [color-scheme:dark] text-xs"
            />
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancelEditing}
              className="secondary-button rounded-lg px-3 py-2 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button rounded-lg px-4 py-2 text-xs font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-bold text-slate-100">{note.title}</h4>
              <time
                dateTime={note.date}
                className="flex shrink-0 items-center gap-1.5 text-[0.65rem] font-medium text-slate-500"
              >
                <CalendarDays size={12} />
                {formatDate(note.date)}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-400">
              {note.description}
            </p>
            <p className="mt-2 flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-wider text-cyan-300/55">
              <Pencil size={10} />
              Click to edit
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsConfirmingDelete(true);
            }}
            aria-label={`Delete note ${note.title}`}
            className="danger-button grid h-8 w-8 shrink-0 place-items-center rounded-lg"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {isConfirmingDelete && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="mt-4 flex flex-col gap-3 rounded-xl border border-rose-300/15 bg-rose-500/5 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm font-medium text-rose-100">
            Delete this note? This cannot be undone.
          </p>
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
              onClick={onDelete}
              className="danger-button rounded-lg px-3 py-2 text-xs font-bold"
            >
              Delete Note
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
