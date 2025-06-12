import { useState } from "react";
import axios from "axios";

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateImage = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSizeMB = 5;
    return validTypes.includes(file.type) && file.size / 1024 / 1024 <= maxSizeMB;
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

    if (!form.name.trim()) newErrors.name = "Full name is required";
    else if (form.name.trim().length < 3) newErrors.name = "Full name must be at least 3 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email.trim())) newErrors.email = "Invalid email address";

    if (!form.password) newErrors.password = "Password is required";
    else if (!validatePassword(form.password))
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";

    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";

    if (!form.image) newErrors.image = "Profile image is required";
    else if (!validateImage(form.image)) newErrors.image = "Image must be JPG/PNG/GIF and less than 5MB";

    if (!["Patient", "Doctor"].includes(form.role)) newErrors.role = "Please select a valid role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name); // changed from 'username' to 'name'
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      formData.append("image", form.image);

      const response = await axios.post("http://127.0.0.1:8000/api/accounts/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registration successful! Please login.");
      window.location.href = "/auth/login";
    } catch (err) {
      // Show all backend error messages if available
      const backendErrors = err.response?.data;
      let errorMsg = "Registration failed";
      if (backendErrors) {
        if (typeof backendErrors === "string") {
          errorMsg = backendErrors;
        } else if (backendErrors.detail) {
          errorMsg = backendErrors.detail;
        } else if (typeof backendErrors === "object") {
          errorMsg = Object.values(backendErrors).join(" ");
        }
      }
      setErrors({ submit: errorMsg });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#d9e0ff] via-[#f0f4ff] to-[#e6ebff] flex flex-col items-center justify-center px-6 py-12">
      <div className="flex justify-center mb-8">
        <img
          src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/ll.png"
          alt="MediConnect Logo"
          className="w-[250px] h-auto"
        />
      </div>

      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <form
          onSubmit={handleSubmit}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className="w-[500px] bg-white p-8 rounded-lg shadow-md"
          autoComplete="off"
          noValidate
        >
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Register</h2>

          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map(({ label, name, type }) => (
            <div key={name} className="mb-4">
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:border file:rounded file:px-3 file:py-2 file:bg-blue-50 file:text-blue-700"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 w-24 h-24 object-cover rounded border"
              />
            )}
            {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {["Patient", "Doctor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  form.role === r
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {errors.role && <p className="text-sm text-red-600 text-center mb-4">{errors.role}</p>}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-800"
          >
            Sign Up
          </button>

          {errors.submit && (
            <p className="text-sm text-red-600 mt-4 text-center">{errors.submit}</p>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-700 underline">
              Log in
            </a>
          </p>
        </form>
      </div>

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
