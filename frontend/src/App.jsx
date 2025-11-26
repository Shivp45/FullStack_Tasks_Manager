import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import ThemeToggle from "./components/ThemeToggle";
import NavLinkButton from "./components/NavLinkButton";
import { logout } from "./store/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-colors">

      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 shadow p-4">
        <div className="container mx-auto flex justify-between items-center">

          {/* BRAND */}
          <Link
            to="/"
            style={{ textDecoration: "none" }}
            className="font-extrabold text-2xl tracking-wide text-gray-900 dark:text-gray-100"
          >
            TasksApp
          </Link>

          {/* NAV BUTTONS */}
          <div className="flex items-center space-x-3">

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Guest menu */}
            {!user && (
              <>
                <NavLinkButton to="/login" label="Login" />
                <NavLinkButton to="/register" label="Register" />
              </>
            )}

            {/* Logged-in menu */}
            {user && (
              <>
                <NavLinkButton to="/" label="Dashboard" />

                {user.role === "admin" && (
                  <NavLinkButton to="/admin" label="Admin Panel" admin />
                )}

                <button
                  onClick={() => dispatch(logout())}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 
                             transition text-white font-semibold shadow"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container mx-auto p-4">
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER DASHBOARD */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
