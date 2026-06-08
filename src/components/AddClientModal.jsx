import { useEffect, useState } from "react";
import Modal from "./Modal";

const INITIAL_FORM = {
  name: "",
};

export default function AddClientModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) setForm(INITIAL_FORM);
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      name: form.name.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      description="Create the client first, then add their jobs and job notes."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-200">
            Client Name
          </span>
          <input
            autoFocus
            required
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Enter client name"
            className="form-field"
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
            Save Client
          </button>
        </div>
      </form>
    </Modal>
  );
}
