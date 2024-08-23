import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [totalPoints, setTotalPoints] = useState(null); // State to store total points
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    const userId = localStorage.getItem("userId"); // Fetch userId from localStorage

    const checkAuth = async () => {
      const response = await fetch("http://localhost:5000/api/v1/isUserAuth/", {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        const data = await response.json();
        console.log("Auth response data:", data); // Debug log

        // Check if the backend returns the username
        if (data.name) {
          setUsername(data.name);
          localStorage.setItem("username", data.name); // Update localStorage
        }

        // Fetch current round information
        const roundResponse = await fetch("http://localhost:5000/getCurrentRound", {
          method: "GET",
        });

        if (roundResponse.status === 200) {
          const roundData = await roundResponse.json();
          setCurrentRound(roundData);
        }

        // Fetch total points
        const pointsResponse = await fetch(`http://localhost:5000/api/v1/getpoints/${userId}`, {
          method: "GET",
        });

        if (pointsResponse.status === 200) {
          const pointsData = await pointsResponse.json();
          setTotalPoints(pointsData.points); // Set the total points
        }
      } else {
        setIsAuthenticated(false);
        navigate("/"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    console.log("Username from localStorage:", username); // Debug log
  }, [username]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Dashboard</h2>
        <p className="text-center text-gray-700">Welcome, {username}!</p>
        {currentRound && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800">Current Round Information</h3>
            <p className="text-gray-700"><strong>Round:</strong> {currentRound.currentRound}</p>
            <p className="text-gray-700"><strong>Start Date:</strong> {currentRound.currentRoundStartDate}</p>
            <p className="text-gray-700"><strong>End Date:</strong> {currentRound.currentRoundEndDate}</p>
            <p className="text-gray-700"><strong>Description:</strong> {currentRound.currentRoundDescription}</p>
            {totalPoints !== null && (
              <p className="text-gray-700"><strong>Total Points:</strong> {totalPoints}</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => navigate("/predictions")}
            >
              Predictions for the {currentRound.currentRoundDescription}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;