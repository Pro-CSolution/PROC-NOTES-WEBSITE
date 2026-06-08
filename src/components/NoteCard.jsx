import { useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function NoteCard({ note, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <article className="note-card rounded-xl p-3.5 sm:p-4">
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
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmingDelete(true)}
          aria-label={`Delete note ${note.title}`}
          className="danger-button grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isConfirmingDelete && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-rose-300/15 bg-rose-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
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
