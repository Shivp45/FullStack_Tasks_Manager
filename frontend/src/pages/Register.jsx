import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const res = await dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setToast("Account created successfully!");
      setTimeout(() => navigate("/"), 1200);
    }
  };

  return (
    <div className="card max-w-md mx-auto relative">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Full Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          value={form.name}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            value={form.password}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            value={form.confirmPassword}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showConfirm ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        {/* Submit */}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {status === "loading" ? "Creating..." : "Register"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center">
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <p className="text-center text-sm mt-3">
          Already registered?{" "}
          <Link className="text-blue-500" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
