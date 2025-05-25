import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        User Management
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={user.image || "https://via.placeholder.com/100"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>

                <span
                  className={`mt-2 px-4 py-1 text-xs font-medium rounded-full ${
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "Doctor"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {user.role}
                </span>

                <button
                  onClick={() => deleteUser(user.id)}
                  className="mt-6 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full transition duration-300 shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
