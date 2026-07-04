import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin"; // Admin Dashboard
import Employee from "./pages/Employee"; // Employee Dashboard
import EmployeeList from "./pages/EmployeeList";
import AdminAttendance from "./pages/AdminAttendance";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import { Toaster } from "react-hot-toast";

const App = () => {
  // Initialize state from sessionStorage to persist login on refresh
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync session storage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Toaster position="top-center" />
      <Routes>
        {/* 1. Root Authentication */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to={`/${currentUser.role}`} replace />
            ) : (
              <Login onLogin={setCurrentUser} />
            )
          }
        />

        {/* 2. Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            currentUser?.role === "admin" ? (
              <Admin user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/employees"
          element={
            currentUser?.role === "admin" ? (
              <EmployeeList user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/attendance"
          element={
            currentUser?.role === "admin" ? (
              <AdminAttendance user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/payroll"
          element={
            currentUser?.role === "admin" ? (
              <Payroll user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 3. Employee Portal Routes */}
        <Route
          path="/employee"
          element={
            currentUser ? (
              <Employee user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/employee/profile"
          element={
            currentUser ? (
              <Profile user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/employee/attendance"
          element={
            currentUser ? (
              <Attendance user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/employee/leave"
          element={
            currentUser ? (
              <Leave user={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
