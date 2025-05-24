import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";




export const loginUser = async (credentials) => {
  try {
    // Get all users from json-server
    const res = await axios.get(`${API_URL}/users`, {
      params: {
        email: credentials.email,
        password: credentials.password
      }
    });

    const users = res.data;

    // json-server doesn't support filtering by multiple params in one request properly,
    // so let's do client-side filtering:

    const user = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return null; // login failed
    }

    // Generate a fake token (for demo)
    const fakeToken = "fake-jwt-token";

    // Return user data and token
    return {
      access: fakeToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  } catch (err) {
    console.error("Login failed", err);
    return null;
  }
};

// src/services/authService.js

export async function registerUser(formData) {
  try {
    // First, check if email already exists
    const existingUsersRes = await axios.get(`${API_URL}/users`, {
      params: { email: formData.email.trim() },
    });

    if (existingUsersRes.data.length > 0) {
      throw new Error("Email is already registered");
    }

    // Prepare new user object
    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,  // Note: plaintext for demo only
      role: formData.role || "Patient", // default role if none provided
      image: null,
    };

    // Optional: handle image file conversion to base64 (async)
    if (formData.image) {
      newUser.image = await toBase64(formData.image);
    }

    // POST new user to JSON Server
    const res = await axios.post(`${API_URL}/users`, newUser);

    return res.data; // newly created user object

  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
}

// Helper function to convert file to base64 string
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}


