import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const Leave = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLeaves = async () => {
    // Admins see all, employees see their own
    const endpoint =
      user.role === "admin"
        ? "http://localhost:8000/api/admin/leaves"
        : `http://localhost:8000/api/employee/leaves/${user.id}`;

    try {
      const res = await fetch(endpoint);
      if (res.ok) setRequests(await res.json());
    } catch (error) {
      toast.error("Failed to load leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user.id, user.role]);

  const handleApply = async () => {
    if (!startDate || !endDate) return toast.error("Please select dates");
    try {
      const res = await fetch(`http://localhost:8000/api/employee/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
        }),
      });
      if (res.ok) {
        toast.success("Leave applied!");
        fetchLeaves();
      } else toast.error("Failed to apply");
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleAction = async (leaveId, action) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/leaves/${leaveId}?status=${action}`,
        { method: "PUT" },
      );
      if (res.ok) {
        toast.success(`Leave ${action.toLowerCase()}`);
        fetchLeaves();
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {user.role === "employee" && (
          <div className="bg-background border border-border p-6 rounded-xl shadow-sm">
            <h3 className="font-bold mb-4">Apply for Leave</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="p-2 border border-border rounded-lg bg-secondary cursor-pointer"
              >
                <option>Sick Leave</option>
                <option>Paid Leave</option>
                <option>Casual Leave</option>
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border border-border rounded-lg bg-secondary"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border border-border rounded-lg bg-secondary"
              />
              <button
                onClick={handleApply}
                className="md:col-span-3 bg-primary text-primary-foreground p-2 rounded-lg cursor-pointer hover:opacity-90 font-medium transition-opacity"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}

        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Leave History</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg border border-border/50"
              >
                <div>
                  <p className="font-medium">
                    {r.user?.name || user.name} -{" "}
                    <span className="text-primary">{r.leave_type}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.start_date} to {r.end_date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${r.status === "Approved" ? "text-green-600" : r.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}
                  >
                    {r.status}
                  </span>
                  {user.role === "admin" && r.status === "Pending" && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAction(r.id, "Approved")}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded cursor-pointer hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(r.id, "Rejected")}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded cursor-pointer hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No leave requests found.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Leave;
