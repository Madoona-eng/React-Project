import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fields) => {
    const errs = {};
    if (!fields.email) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Invalid email address";
    }
    if (!fields.password) {
      errs.password = "Password is required";
    } else if (fields.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", form);
        const res = response.data;

        if (res?.access) {
          dispatch(setUser(res.user));
          localStorage.setItem("token", res.access);
          localStorage.setItem("user", JSON.stringify(res.user));

          if (res.user.role === "Admin") window.location.href = "/admin/dashboard";
          else if (res.user.role === "Doctor") window.location.href = "/doctor";
          else window.location.href = "/patient/dashboard";
        } else {
          alert("Login failed. Check your credentials.");
        }
      } catch (err) {
        alert(err.response?.data?.detail || "Login failed");
      }
    }
  };

  const isValid = Object.keys(errors).length === 0 && form.email && form.password;

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#d9e0ff] via-[#f0f4ff] to-[#e6ebff] flex flex-col items-center justify-center px-6 py-12">
      <div className="flex justify-center mb-8">
        <img
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/ll.png"
          alt="MediConnect Logo"
          className="w-[250px] h-auto"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl shadow p-10 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8 select-none">Login</h2>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="abanob@gmail.com"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              touched.email && errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            autoComplete="off"
          />
          {touched.email && errors.email && (
            <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              touched.password && errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            autoComplete="off"
          />
          {touched.password && errors.password && (
            <p className="text-red-600 mt-1 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-300 text-white cursor-not-allowed"
          }`}
        >
          Sign In
        </button>

        {/* Register link */}
        <p className="mt-6 text-center text-gray-600 select-none">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
