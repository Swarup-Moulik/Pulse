import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [salary, setSalary] = useState({ basic: 0, hra: 0, special: 0 });
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });

  // 1. Fetch Profile and Salary Data
  const fetchData = async () => {
    try {
      // Fetch Profile
      const userRes = await fetch(
        `http://localhost:8000/api/employee/profile/${user.id}`,
      );
      const userData = await userRes.json();
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        address: userData.address || "",
        designation: userData.designation || "",
      });

      // Fetch Salary Structure based on designation
      const salaryRes = await fetch(
        `http://localhost:8000/api/admin/payroll/${userData.designation}`,
      );
      if (salaryRes.ok) {
        const salaryData = await salaryRes.json();
        setSalary({
          basic: salaryData.basic,
          hra: salaryData.hra,
          special: salaryData.special,
        });
      }
    } catch (error) {
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  // 2. Save Profile Changes
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/employee/profile/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (res.ok) {
        toast.success("Profile updated!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const isEditable = (field) => {
    if (user.role === "admin") return true;
    return ["phone", "address"].includes(field);
  };

  const handlePasswordChange = async () => {
    if (passData.new !== passData.confirm)
      return toast.error("New passwords don't match");
    if (passData.new.length < 6) return toast.error("Password too short");

    try {
      const res = await fetch(
        `http://localhost:8000/api/employee/change-password/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            old_password: passData.old,
            new_password: passData.new,
          }),
        },
      );

      if (res.ok) {
        toast.success("Password updated!");
        setPassData({ old: "", new: "", confirm: "" });
      } else {
        const err = await res.json();
        toast.error(err.detail || "Update failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="bg-background border border-border/50 rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Personal Details</h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="text-primary font-medium hover:underline text-sm cursor-pointer"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold capitalize">
                  {key}
                </label>
                <input
                  disabled={!isEditing || !isEditable(key)}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full mt-1 p-2 bg-secondary border border-border rounded-md disabled:bg-transparent disabled:border-transparent transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Structure */}
        <div className="bg-background border border-border/50 rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Salary Structure</h2>
          <div className="space-y-4">
            {Object.entries(salary).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center border-b border-border/30 pb-2"
              >
                <span className="text-muted-foreground capitalize">{key}</span>
                <span className="font-mono font-medium">
                  ₹{value.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-4 font-bold border-t border-border">
              <span>Total CTC</span>
              <span>
                ₹{(salary.basic + salary.hra + salary.special).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border/50 rounded-xl p-8 shadow-sm mt-8">
          <h2 className="text-xl font-bold mb-6">Security</h2>
          <div className="space-y-4 max-w-lg">
            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-2 bg-secondary rounded-md"
              value={passData.old}
              onChange={(e) =>
                setPassData({ ...passData, old: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 bg-secondary rounded-md"
              value={passData.new}
              onChange={(e) =>
                setPassData({ ...passData, new: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-2 bg-secondary rounded-md"
              value={passData.confirm}
              onChange={(e) =>
                setPassData({ ...passData, confirm: e.target.value })
              }
            />
            <button
              onClick={handlePasswordChange}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
