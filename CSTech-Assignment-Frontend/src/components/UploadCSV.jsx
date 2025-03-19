// components/UploadCSV.js
import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function UploadCSV() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      alert("Error uploading file");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl mb-4">Upload CSV</h2>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0] || null)}
            accept=".csv,.xlsx,.xls"
            required
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Upload
          </button>
        </form>
      </div>
    </>
  );
}

export default UploadCSV;
