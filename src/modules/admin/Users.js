import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/users/");
      const data = response.data;
      setUsers(Array.isArray(data.results) ? data.results : data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/accounts/users/${id}/`, {
          headers: getAuthHeaders(),
        });
        fetchUsers(); // Refresh after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const totalPages = Math.ceil(safeUsers.length / itemsPerPage);
  const paginatedUsers = safeUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        User Management
      </h1>

      {paginatedUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={
                        user.image && user.image.startsWith("http")
                          ? user.image
                          : user.image
                          ? `http://localhost:8000${user.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-gray-800">
                    {user.name}
                  </h2>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
