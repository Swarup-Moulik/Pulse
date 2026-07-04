import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";
import { Briefcase, Wallet, TrendingUp, Save } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplate = async (designation) => {
    setIsLoading(true);
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
        setTemplate({ basic: 0, hra: 0, special: 0 });
      }
    } catch (error) {
      toast.error("Failed to load template");
    } finally {
      setIsLoading(false);
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
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Payroll Structure
        </h2>

        {/* Horizontal Navigation: Flex-wrap allows horizontal layout on PC and wrapping on mobile */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DESIGNATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDesig(d)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
                activeDesig === d
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background border border-border/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Briefcase size={16} />
              {d}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-background border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-border/30 pb-6">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Wallet size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {activeDesig} Salary Configuration
              </h3>
              <p className="text-sm text-muted-foreground">
                Adjust monthly components for this role
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["basic", "hra", "special"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  {field}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-muted-foreground font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    className="w-full bg-secondary border border-border rounded-xl p-3 pl-10 font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={template[field]}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        [field]: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-secondary/50 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/10 text-green-600 rounded-2xl">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Monthly CTC
                </p>
                <p className="text-3xl font-bold text-foreground tracking-tight">
                  ₹
                  {(
                    template.basic +
                    template.hra +
                    template.special
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              <Save size={20} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payroll;
