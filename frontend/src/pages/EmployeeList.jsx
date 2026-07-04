import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddEmployeeModal from "../components/AddEmployeeModal";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const DESIGNATIONS = [
  "Software Engineer",
  "HR Manager",
  "Product Manager",
  "Designer",
  "Intern",
  "Director",
];

const EmployeeList = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch employees from the database
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        // Filter out admins if you only want to see employees
        setEmployees(data.filter((emp) => emp.role === "employee"));
      }
    } catch (error) {
      toast.error("Failed to load employees");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handler for changing designation
  const handleDesignationChange = async (userId, newDesignation) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/designation?designation=${newDesignation}`,
        {
          method: "PATCH",
        },
      );

      if (response.ok) {
        toast.success("Designation updated!");
        fetchEmployees(); // Refresh list to show changes
      } else {
        toast.error("Failed to update designation");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // Create a new employee
  const handleAddEmployee = async (newEmployeeData) => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEmployeeData,
          role: "employee",
        }),
      });

      if (response.ok) {
        toast.success("Employee added successfully!");
        fetchEmployees(); // Refresh the list
        setIsModalOpen(false);
      } else {
        const err = await response.json();

        // NEW: Safely extract the error message so React doesn't crash!
        let errorMessage = "Failed to add employee";
        if (typeof err.detail === "string") {
          errorMessage = err.detail;
        } else if (Array.isArray(err.detail)) {
          errorMessage = err.detail[0].msg; // Grab the specific validation error
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error while adding employee");
    }
  };

  // Delete an employee
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast.success("Employee removed");
        fetchEmployees(); // Refresh the list
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      toast.error("Network error while deleting");
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="bg-background border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-lg font-bold">Employee Directory</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            + Add Employee
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-muted-foreground text-left">
            <tr>
              <th className="p-4">Emp ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Designation</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="border-t border-border/50 hover:bg-secondary/20 transition-colors"
              >
                <td className="p-4 font-mono text-xs text-muted-foreground">
                  {emp.employee_id || "N/A"}
                </td>
                <td className="p-4 font-medium">{emp.name}</td>
                <td className="p-4 text-muted-foreground">{emp.email}</td>
                <td className="p-4">
                  {/* Dynamic Dropdown */}
                  <select
                    value={emp.designation || ""}
                    onChange={(e) =>
                      handleDesignationChange(emp.id, e.target.value)
                    }
                    className="bg-secondary border border-border rounded-md px-2 py-1 text-xs cursor-pointer focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>
                      Unassigned
                    </option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmployee}
      />
    </DashboardLayout>
  );
};

export default EmployeeList;
