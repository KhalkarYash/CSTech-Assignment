import React from "react";
import { Link } from "react-router-dom";
import AssignedTasks from "./AssignedTasks";
import Navbar from "./Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/add-agent"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Add Agent
          </Link>
          <Link
            to="/upload-csv"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Upload CSV
          </Link>
        </div>
        {/* Assigned Tasks Component */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mt-8">
          <AssignedTasks />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
