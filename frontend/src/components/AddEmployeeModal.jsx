import React, { useState } from "react";
import Modal from "./Modal";

const DESIGNATIONS = [
  "Software Engineer",
  "HR Manager",
  "Product Manager",
  "Designer",
  "Intern",
  "Director",
];

const AddEmployeeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ name: "", email: "", designation: "" }); // Reset form
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">
            Full Name
          </label>
          <input
            required
            className="w-full p-2 bg-secondary border border-border rounded-lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">
            Email
          </label>
          <input
            required
            type="email"
            className="w-full p-2 bg-secondary border border-border rounded-lg"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* DROPDOWN FOR DESIGNATION */}
        <div>
          <label className="text-sm text-muted-foreground block mb-1">
            Designation
          </label>
          <select
            required
            className="w-full p-2 bg-secondary border border-border rounded-lg appearance-none cursor-pointer"
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
          >
            <option value="" disabled>
              Select Designation
            </option>
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium mt-4 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        >
          Create Employee
        </button>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
