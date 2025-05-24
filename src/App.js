import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="*"
            element={
              <div className="text-center mt-10 text-2xl text-red-600">404 - Not Found</div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
