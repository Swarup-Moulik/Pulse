import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const Admin = ({ user }) => {
  const [stats, setStats] = useState({
    total_employees: 0,
    pending_leaves: 0,
    attendance_today: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch Dashboard Stats
      const statsRes = await fetch(
        "http://localhost:8000/api/admin/dashboard-stats",
      );
      if (statsRes.ok) setStats(await statsRes.json());

      // Fetch Recent Leaves
      const leaveRes = await fetch("http://localhost:8000/api/admin/leaves");
      if (leaveRes.ok) {
        const data = await leaveRes.json();
        setRecentLeaves(data.filter((l) => l.status === "Pending"));
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLeaveAction = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/leaves/${id}?status=${status}`,
        { method: "PUT" },
      );
      if (res.ok) {
        toast.success(`Leave ${status}`);
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Employees", value: stats.total_employees },
            {
              label: "Pending Leaves",
              value: stats.pending_leaves,
              color: "text-primary",
            },
            { label: "Attendance Today", value: stats.attendance_today },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-background p-6 rounded-2xl border border-border/50 shadow-sm"
            >
              <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                {stat.label}
              </h4>
              <p
                className={`mt-3 text-4xl font-bold ${stat.color || "text-foreground"}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-background p-6 rounded-2xl border border-border/50 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Recent Leave Approvals</h3>
          <div className="space-y-3">
            {recentLeaves.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No pending requests.
              </p>
            ) : (
              recentLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 bg-secondary/50 rounded-xl flex justify-between items-center border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {leave.user_id}
                    </div>
                    <span className="font-medium">
                      {leave.leave_type} Request
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLeaveAction(leave.id, "Approved")}
                      className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:opacity-90 cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleLeaveAction(leave.id, "Rejected")}
                      className="text-xs font-semibold bg-secondary text-foreground px-4 py-1.5 rounded-lg hover:bg-border cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
