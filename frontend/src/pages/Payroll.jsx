import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const DESIGNATIONS = [
  "Software Engineer",
  "HR Manager",
  "Product Manager",
  "Designer",
  "Intern",
  "Director",
];

const Payroll = ({ user }) => {
  const [activeDesig, setActiveDesig] = useState(DESIGNATIONS[0]);
  const [template, setTemplate] = useState({ basic: 0, hra: 0, special: 0 });

  const fetchTemplate = async (designation) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/payroll/${designation}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTemplate({
          basic: data.basic,
          hra: data.hra,
          special: data.special,
        });
      } else {
        setTemplate({ basic: 0, hra: 0, special: 0 }); // Reset if none exists
      }
    } catch (error) {
      toast.error("Failed to load template");
    }
  };

  useEffect(() => {
    fetchTemplate(activeDesig);
  }, [activeDesig]);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/payroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designation: activeDesig, ...template }),
      });
      if (res.ok) toast.success("Salary template saved!");
      else toast.error("Failed to save template");
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          {DESIGNATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDesig(d)}
              className={`w-full text-left p-3 rounded-lg cursor-pointer transition-colors ${activeDesig === d ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"}`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-background p-8 rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-xl font-bold mb-6">
            Manage Salary for {activeDesig}
          </h2>
          <div className="space-y-4 max-w-md">
            {["basic", "hra", "special"].map((field) => (
              <div key={field}>
                <label className="text-sm block mb-1 uppercase tracking-wider font-semibold text-muted-foreground">
                  {field}
                </label>
                <input
                  type="number"
                  className="w-full bg-secondary border border-border p-2 rounded-lg"
                  value={template[field]}
                  onChange={(e) =>
                    setTemplate({
                      ...template,
                      [field]: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            ))}
            <div className="pt-4 border-t border-border mt-6 flex justify-between font-bold text-lg">
              <span>Total CTC</span>
              <span>
                ₹
                {(
                  template.basic +
                  template.hra +
                  template.special
                ).toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg mt-6 cursor-pointer font-medium hover:opacity-90 transition-opacity"
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Payroll;
