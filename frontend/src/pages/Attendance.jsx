import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const Attendance = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/employee/attendance/${user.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      toast.error("Failed to load attendance records");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user.id]);

  const handleCheckInOut = async (action) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/employee/attendance/${action}/${user.id}`,
        { method: "POST" },
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchAttendance();
      } else {
        toast.error(
          data.detail ||
            `Failed to check ${action === "check-in" ? "in" : "out"}`,
        );
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Attendance Records</h2>
          {user.role === "employee" && (
            <div className="space-x-3">
              <button
                disabled={isLoading}
                onClick={() => handleCheckInOut("check-in")}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              >
                Check In
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleCheckInOut("check-out")}
                className="bg-secondary text-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-border transition-colors"
              >
                Check Out
              </button>
            </div>
          )}
        </div>

        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-secondary/50 text-muted-foreground text-sm">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Check In</th>
                <th className="p-4 text-left">Check Out</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-4 font-medium">{r.date}</td>
                  <td className="p-4">{r.check_in || "--:--"}</td>
                  <td className="p-4">{r.check_out || "--:--"}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-wider">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-muted-foreground"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Attendance;
