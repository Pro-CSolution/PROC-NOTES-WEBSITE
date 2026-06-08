import { useEffect, useState } from "react";
import Modal from "./Modal";

const INITIAL_FORM = {
  project: "",
  jobsite: "",
  status: "Standby",
};

export default function AddJobModal({ isOpen, onClose, onSave, clientName }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) setForm(INITIAL_FORM);
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      project: form.project.trim(),
      jobsite: form.jobsite.trim(),
      status: form.status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Job"
      description={`Create a job for ${clientName}. Notes will be saved inside this job.`}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Project
          </span>
          <input
            autoFocus
            required
            type="text"
            value={form.project}
            onChange={(event) =>
              setForm((current) => ({ ...current, project: event.target.value }))
            }
            placeholder="Enter project name"
            className="form-field"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Jobsite
          </span>
          <input
            required
            type="text"
            value={form.jobsite}
            onChange={(event) =>
              setForm((current) => ({ ...current, jobsite: event.target.value }))
            }
            placeholder="Enter location or address"
            className="form-field"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Status
          </span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value }))
            }
            className="form-field"
          >
            <option>Standby</option>
            <option>Work in Progress</option>
            <option>No Work</option>
          </select>
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
            Save Job
          </button>
        </div>
      </form>
    </Modal>
  );
}
