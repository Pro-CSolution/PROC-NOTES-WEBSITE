import { useEffect, useState } from "react";
import Modal from "./Modal";

function getToday() {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getInitialForm() {
  return {
    title: "",
    description: "",
    date: getToday(),
  };
}

export default function AddNoteModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(getInitialForm);

  useEffect(() => {
    if (isOpen) setForm(getInitialForm());
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Note"
      description="Record a clear update for this job."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Note Title
          </span>
          <input
            autoFocus
            required
            type="text"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="What is this note about?"
            className="form-field"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Note Description
          </span>
          <textarea
            required
            rows="5"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Enter the job details or update"
            className="form-field resize-y"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Date
          </span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(event) =>
              setForm((current) => ({ ...current, date: event.target.value }))
            }
            className="form-field [color-scheme:dark]"
          />
        </label>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="secondary-button rounded-xl px-5 py-3 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button rounded-xl px-6 py-3 font-bold"
          >
            Save Note
          </button>
        </div>
      </form>
    </Modal>
  );
}
