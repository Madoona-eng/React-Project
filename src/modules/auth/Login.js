import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../services/authService";
import { setUser } from "./authSlice";
import { Link } from "react-router-dom"; // assuming react-router

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      const res = await loginUser(form);
      if (res?.access) {
        dispatch(setUser(res.user));
        localStorage.setItem("token", res.access);
        localStorage.setItem("user", JSON.stringify(res.user));
        if (res.user.role === "Admin") window.location.href = "/admin/dashboard";
        else if (res.user.role === "Doctor") window.location.href = "/doctor/dashboard";
        else window.location.href = "/patient/dashboard";
      } else {
        alert("Login failed. Check your credentials.");
      }
    }
  };

  const isValid = Object.keys(errors).length === 0 && form.email && form.password;

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
  <form
  onSubmit={handleSubmit}
  noValidate
  className="bg-[#e0e5ec] p-8 rounded-3xl shadow-neu w-full max-w-2xl" // made max width bigger
  style={{ minWidth: "350px" }} // prevent it from shrinking too small on very small screens
>

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 select-none">Login</h1>

        <div className="mb-6">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-5 rounded-xl bg-[#e0e5ec] shadow-inset border ${
    touched.email && errors.email ? "border-red-500" : "border-transparent"
  } text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            autoComplete="off"
          />
          {touched.email && errors.email && (
            <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-8">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-4 rounded-xl bg-[#e0e5ec] shadow-inset border ${
              touched.password && errors.password ? "border-red-500" : "border-transparent"
            } text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            autoComplete="off"
          />
          {touched.password && errors.password && (
            <p className="text-red-600 mt-1 text-sm">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-semibold transition duration-300
            ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-neu-btn"
                : "bg-blue-300 cursor-not-allowed text-white"
            }
          `}
        >
          Sign In
        </button>

        <p className="mt-6 text-center text-gray-600 select-none">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600 hover:underline font-semibold">
            Register
          </Link>
        </p>

        <style>{`
          .shadow-neu {
            box-shadow:
              8px 8px 16px #babecc,
              -8px -8px 16px #ffffff;
          }
          .shadow-inset {
            box-shadow: inset 6px 6px 8px #babecc, inset -6px -6px 8px #ffffff;
          }
          .shadow-neu-btn {
            box-shadow:
              0 4px 8px rgb(2 113 230 / 0.6),
              0 0 12px rgb(2 113 230 / 0.7);
          }
        `}</style>
      </form>
    </div>
  );
}
