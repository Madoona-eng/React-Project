import { useState } from "react";
import { registerUser } from "../../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Patient",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Min 8 chars, at least one uppercase, one lowercase, one digit, one special char
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validateImage = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSizeMB = 5;
    return (
      validTypes.includes(file.type) && file.size / 1024 / 1024 <= maxSizeMB
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (role) => {
    setForm({ ...form, role });
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.image) {
      newErrors.image = "Profile image is required";
    } else if (!validateImage(form.image)) {
      newErrors.image = "Image must be JPG/PNG/GIF and less than 5MB";
    }

    if (!["Patient", "Doctor"].includes(form.role)) {
      newErrors.role = "Please select a valid role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await registerUser(form);
      alert("Registration successful! Please login.");
      window.location.href = "/auth/login";
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#d9e0ff] via-[#f0f4ff] to-[#e6ebff] flex items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className="relative bg-white rounded-3xl p-12 max-w-lg w-full
                   shadow-2xl hover:shadow-3xl transition-shadow duration-500"
        autoComplete="off"
        noValidate
      >
        <h2 className="text-5xl font-extrabold text-[#1824ad] mb-12 text-center tracking-wider">
          Create Account
        </h2>

        {/* Inputs */}
        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Confirm Password", name: "confirmPassword", type: "password" },
        ].map(({ label, name, type }) => (
          <div key={name} className="relative z-0 w-full mb-6 group">
            <input
              type={type}
              name={name}
              id={name}
              value={form[name]}
              onChange={handleChange}
              placeholder=" "
              className={`peer block w-full rounded-xl border
                py-5 px-6 font-semibold
                shadow-neumorph
                focus:outline-none focus:border-[#1824ad] focus:shadow-neumorph-focus
                transition-all duration-300
                ${
                  errors[name]
                    ? "border-red-600 text-red-600 placeholder-red-600"
                    : "border-transparent text-[#1824ad] bg-[#e4e9ff]"
                }
              `}
            />
            <label
              htmlFor={name}
              className="absolute left-6 top-6 text-[#1824ad] text-lg font-semibold
                         peer-placeholder-shown:top-10 peer-placeholder-shown:text-[#a0a8e7] peer-placeholder-shown:text-base
                         peer-focus:top-3 peer-focus:text-[#121f7f] peer-focus:text-sm
                         transition-all duration-300 pointer-events-none select-none"
            >
              {label}
            </label>
            {errors[name] && (
              <p className="text-red-600 text-sm mt-1 ml-1">{errors[name]}</p>
            )}
          </div>
        ))}

        {/* Modern Upload area */}
        <div className="mb-6">
          <label className="block mb-2 text-[#1824ad] font-semibold text-lg">
            Upload Profile Image
          </label>
          <div
            className={`relative flex flex-col items-center justify-center
              rounded-xl border-2 border-dashed cursor-pointer
              transition-colors duration-300
              ${
                dragActive
                  ? "border-[#1824ad] bg-[#e4e9ff]"
                  : errors.image
                  ? "border-red-600 bg-[#ffe6e6]"
                  : "border-[#a0a8e7] bg-[#f9fbff]"
              }
              hover:border-[#1824ad] hover:bg-[#e4e9ff]
              py-14 px-8 text-center select-none`}
          >
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-3 h-12 w-12 text-[#1824ad]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 4v8m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <p className="text-[#1824ad] font-semibold">
              Drag & drop an image, or click to select file
            </p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-xl border border-[#1824ad]"
              />
            )}
          </div>
          {errors.image && (
            <p className="text-red-600 text-sm mt-1 ml-1">{errors.image}</p>
          )}
        </div>

        {/* Role selector */}
        <div className="flex gap-6 justify-center mb-12">
          {["Patient", "Doctor"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`px-8 py-3 rounded-full font-semibold text-lg
                          transition-all duration-300 shadow-neumorph
                          ${
                            form.role === r
                              ? "bg-[#1824ad] text-white shadow-neumorph-active"
                              : "bg-[#d0d6ff] text-[#1824ad] hover:bg-[#a2aaff]"
                          }
                          focus:outline-none`}
            >
              {r}
            </button>
          ))}
        </div>
        {errors.role && (
          <p className="text-red-600 text-center mb-6 font-semibold">{errors.role}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#1824ad] to-[#0f1a7d]
                     text-white py-5 rounded-xl font-extrabold text-2xl tracking-wide
                     shadow-lg hover:shadow-2xl active:scale-95
                     transition transform duration-300 flex items-center justify-center gap-3"
        >
          Sign Up
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Submission error */}
        {errors.submit && (
          <p className="text-red-600 text-center mt-4 font-semibold">{errors.submit}</p>
        )}

        {/* Login message below */}
        <p className="mt-6 text-center text-[#1824ad] font-semibold text-lg">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="underline hover:text-[#0f1a7d] transition-colors duration-300"
          >
            Log in
          </a>
        </p>
      </form>

      <style jsx>{`
        .shadow-neumorph {
          box-shadow: 6px 6px 12px #aab4ff, -6px -6px 12px #ffffff;
        }
        .shadow-neumorph-focus {
          box-shadow: inset 4px 4px 6px #aab4ff, inset -4px -4px 6px #ffffff;
          border-color: #1824ad;
        }
        .shadow-neumorph-active {
          box-shadow: inset 4px 4px 8px #0f1a7d, inset -4px -4px 8px #323fbb;
        }
      `}</style>
    </div>
  );
}
