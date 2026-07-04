import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Briefcase,
  ArrowRight,
  UserPlus,
  Phone,
  User,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import toast from "react-hot-toast";

const DESIGNATIONS = [
  "Software Engineer",
  "HR Manager",
  "Product Manager",
  "Designer",
  "Intern",
  "Director",
];

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Registration State
  const [role, setRole] = useState("employee");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDesignation, setRegDesignation] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      sessionStorage.setItem("pulse_token", data.access_token);

      toast.success("Logged in successfully!");
      onLogin(data.user);
      navigate(`/${data.user.role}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          designation: regDesignation,
          role: "admin",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setIsRegisterMode(false);
      setRegPassword("");
      toast.success("Admin account created successfully! Please log in.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary transition-colors duration-300 px-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-background rounded-xl shadow-xl border border-border overflow-hidden flex flex-col transition-colors duration-300">
        <div className="pt-8 pb-6 px-8 text-center border-b border-border">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-4 shadow-md">
            {isRegisterMode ? <UserPlus size={28} /> : <Briefcase size={28} />}
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {isRegisterMode ? "Register Admin" : "Pulse"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegisterMode
              ? "Set up a new administrator account"
              : "Every workday, perfectly aligned."}
          </p>
        </div>

        <div className="p-8">
          {isRegisterMode ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              {/* DROPDOWN FOR DESIGNATION */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Designation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Briefcase size={18} />
                  </div>
                  <select
                    required
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a designation...
                    </option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium cursor-pointer hover:opacity-90 transition-opacity"
              >
                {isLoading ? "Registering..." : "Register Admin"}
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="w-full py-2 text-muted-foreground text-sm cursor-pointer hover:underline"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex bg-secondary p-1 rounded-md mb-4">
                <button
                  type="button"
                  onClick={() => setRole("employee")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded cursor-pointer transition-all ${role === "employee" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded cursor-pointer transition-all ${role === "admin" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
                >
                  Admin
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>

              {role === "admin" && (
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="w-full mt-2 text-sm text-primary cursor-pointer hover:underline flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} /> Register New Admin
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
