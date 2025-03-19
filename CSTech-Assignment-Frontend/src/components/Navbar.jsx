// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = async () => {
    await axios.delete("http://localhost:5000/logout", {
      withCredentials: true,
    });
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center px-8">
        <div className="flex gap-8">
          <Link to="/dashboard" className="text-white text-lg">
            Dashboard
          </Link>
          <Link to="/add-agents" className="text-white mr-4 text-lg">
            Add Agents
          </Link>
          <Link to="/upload-csv" className="text-white text-lg">
            Upload CSV
          </Link>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="text-red-700 text-lg font-bold cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
