import React, { useState, useEffect } from "react";
import RideForm from "../components/RideForm";
import { submitRideData, fetchRides } from "../api";

const RideTracking = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load previously submitted rides from DynamoDB (via API) when component mounts
  useEffect(() => {
    const loadRides = async () => {
      try {
        const data = await fetchRides();
        setRides(data); // Assuming API returns an array of rides
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRides();
  }, []);

  // Handle form submission
  const handleRideSubmit = async (newRide) => {
    try {
      // Submit the new ride to DynamoDB via the API
      const result = await submitRideData(newRide);
      console.log("Ride submitted successfully:", result);

      // Update the local state to reflect the new ride
      setRides((prevRides) => [...prevRides, result]); // Assuming the API returns the new ride data
    } catch (error) {
      console.error("Error submitting ride:", error);
      alert("Error submitting ride: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading rides...</div>;
  }

  return (
    <div className="p-6 text-white bg-zinc-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Track a New Ride</h2>

      {/* RideForm component */}
      <RideForm onSubmit={handleRideSubmit} />

      <h2 className="text-xl font-semibold mt-10">Previous Rides</h2>
      <div className="space-y-4">
        {rides.length === 0 && <p className="text-zinc-400">No rides submitted yet.</p>}
        {rides.map((ride, idx) => (
  <div key={idx} className="p-4 bg-zinc-800 rounded shadow border border-zinc-700">
    <p className="text-sm text-zinc-400 mb-2"><strong>Date:</strong> {ride.date || 'N/A'}</p>
    <p><strong>Front Tire Pressure:</strong> {ride.frontTirePressure} psi</p>
    <p><strong>Rear Tire Pressure:</strong> {ride.rearTirePressure} psi</p>
    <p><strong>Front Suspension Pressure:</strong> {ride.frontSuspensionPressure} psi</p>
    <p><strong>Rear Suspension Pressure:</strong> {ride.rearSuspensionPressure} psi</p>
    <p><strong>Avg Temperature:</strong> {ride.avgTemperature} °F</p>
    <p><strong>Time Rode:</strong> {ride.timeRode} minutes</p>
    <p><strong>Number of Descents:</strong> {ride.numberOfDescents}</p>
    <p><strong>Distance:</strong> {ride.distance} miles</p>
  </div>
))}

      </div>
    </div>
  );
};

export default RideTracking;
