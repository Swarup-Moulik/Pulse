import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Clock, Calendar as CalIcon, User as UserIcon } from "lucide-react";

const Employee = ({ user }) => {
  const navigate = useNavigate();

  return (
    <DashboardLayout user={user}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-3 bg-background p-6 rounded-2xl border border-border/50 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">
              Good Morning, {user.name.split(" ")[0]}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Emp ID: <span className="font-mono">{user.employee_id}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/employee/attendance")}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 cursor-pointer shadow-sm transition-all"
          >
            Go to Attendance
          </button>
        </div>

        {[
          { label: "My Profile", icon: UserIcon, path: "/employee/profile" },
          { label: "Attendance", icon: Clock, path: "/employee/attendance" },
          { label: "Leaves", icon: CalIcon, path: "/employee/leave" },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => navigate(card.path)}
            className="bg-background p-6 rounded-2xl border border-border/50 shadow-sm cursor-pointer hover:border-primary transition-colors group"
          >
            <card.icon
              className="text-muted-foreground group-hover:text-primary transition-colors mb-4"
              size={24}
            />
            <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              {card.label}
            </h4>
            <p className="mt-2 text-xl font-semibold">View Details &rarr;</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};
export default Employee;
