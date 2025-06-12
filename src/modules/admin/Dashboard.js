import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [totals, setTotals] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, docsRes, apptsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/accounts/users/"),
          axios.get("http://127.0.0.1:8000/api/accounts/doctors"),
          axios.get("http://127.0.0.1:8000/api/accounts/appointments"),
        ]);

        // Support paginated or non-paginated response for users, doctors, appointments
        const usersArr = Array.isArray(usersRes.data.results) ? usersRes.data.results : (Array.isArray(usersRes.data) ? usersRes.data : []);
        const docsArr = Array.isArray(docsRes.data.results) ? docsRes.data.results : (Array.isArray(docsRes.data) ? docsRes.data : []);
        const apptsArr = Array.isArray(apptsRes.data.results) ? apptsRes.data.results : (Array.isArray(apptsRes.data) ? apptsRes.data : []);

        const users = usersArr.length;
        const doctors = docsArr.length;
        const appointments = apptsArr.length;

        const monthly = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleString("default", { month: "short" }),
          count: 0,
        }));

        apptsArr.forEach((a) => {
          const m = new Date(a.date).getMonth();
          monthly[m].count += 1;
        });

        setTotals({ users, doctors, appointments });
        setChartData(monthly);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totals.users,
      icon: <Users className="w-6 h-6" />,
      color: "bg-gradient-to-tr from-indigo-500 to-purple-500",
    },
    {
      title: "Total Doctors",
      value: totals.doctors,
      icon: <Stethoscope className="w-6 h-6" />,
      color: "bg-gradient-to-tr from-green-400 to-emerald-500",
    },
    {
      title: "Appointments",
      value: totals.appointments,
      icon: <CalendarCheck className="w-6 h-6" />,
      color: "bg-gradient-to-tr from-pink-500 to-rose-400",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 text-white shadow-xl hover:scale-105 transform transition-all duration-300 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase opacity-80">{stat.title}</p>
                <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
              </div>
              <div className="bg-white/20 p-3 rounded-full">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Monthly Appointments</h2>
          <BarChart2 className="w-6 h-6 text-indigo-600" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
