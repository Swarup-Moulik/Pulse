import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const AdminAttendance = ({ user }) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/attendance");
        if (res.ok) setAttendance(await res.json());
      } catch (error) {
        toast.error("Failed to load attendance");
      }
    };
    fetchAllAttendance();
  }, []);

  return (
    <DashboardLayout user={user}>
      <h2 className="text-xl font-bold mb-6">Global Attendance (Today)</h2>
      <div className="grid gap-4 max-w-4xl">
        {attendance.map((row) => (
          <div
            key={row.id}
            className="flex justify-between items-center bg-background border border-border/50 p-4 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold">
                {row.user?.name || "Unknown Employee"}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.date} | In: {row.check_in} | Out:{" "}
                {row.check_out || "--:--"}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-700">
              {row.status}
            </span>
          </div>
        ))}
        {attendance.length === 0 && (
          <p className="text-muted-foreground">
            No attendance records for today.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminAttendance;
