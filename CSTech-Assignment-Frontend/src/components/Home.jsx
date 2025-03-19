import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading && (
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-12 w-12 animate-spin"></div>
      )}
    </div>
  );
}

export default Home;
