import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    const checkAuth = async () => {
      const response = await fetch("http://localhost:5000/api/v1/isUserAuth/", {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        // Assuming the backend returns the username, else handle as necessary
        const data = await response.json();
        setUsername(data.name);
      } else {
        setIsAuthenticated(false);
        navigate("/"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Dashboard</h2>
        <p className="text-center text-gray-700">Welcome, {username}!</p>
      </div>
    </div>
  );
}

export default Dashboard;
