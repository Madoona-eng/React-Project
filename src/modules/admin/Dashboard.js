import React from "react";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-gray-600 mt-2">Overview of all users</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold">Doctors</h2>
          <p className="text-gray-600 mt-2">Manage doctor profiles</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <p className="text-gray-600 mt-2">View scheduled appointments</p>
        </div>
      </div>
    </div>
  );
}
