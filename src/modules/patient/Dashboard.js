import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';  // أيقونة خروج

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Upcoming Appointments</h2>
          <p className="text-gray-600">No appointments scheduled currently.</p>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
          <ul className="space-y-3 text-blue-600">
            <li>
              <Link to="/patient/search" className="flex items-center gap-2 hover:underline">
                🔍 <span>Find a Doctor</span>
              </Link>
            </li>
            <li>
              <Link to="/patient/appointments" className="flex items-center gap-2 hover:underline">
                📅 <span>Manage Appointments</span>
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <Link to="/patient/profile" className="flex items-center gap-2 hover:underline text-blue-600">
                👤 <span>Your Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
                title="Logout"
                aria-label="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
