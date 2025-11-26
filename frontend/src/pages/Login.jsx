import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await dispatch(login(form));

    if (res.meta.requestStatus === "fulfilled") {
      setToast("Login successful!");
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="card max-w-md mx-auto relative">

      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        {/* Login */}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {status === "loading" ? "Logging in..." : "Login"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center">
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <p className="text-center text-sm mt-3">
          New user?{" "}
          <Link className="text-blue-500" to="/register">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
