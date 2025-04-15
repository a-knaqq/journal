import { useState } from "react";

export default function RideForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: "",
    frontTirePressure: "",
    rearTirePressure: "",
    frontSuspensionPressure: "",
    rearSuspensionPressure: "",
    avgTemperature: "",
    timeRode: "",
    numberOfDescents: "",
    distance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      date: "",
      frontTirePressure: "",
      rearTirePressure: "",
      frontSuspensionPressure: "",
      rearSuspensionPressure: "",
      avgTemperature: "",
      timeRode: "",
      numberOfDescents: "",
      distance: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-zinc-800 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-white">
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="frontTirePressure"
        placeholder="Front Tire Pressure (psi)"
        value={formData.frontTirePressure}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="rearTirePressure"
        placeholder="Rear Tire Pressure (psi)"
        value={formData.rearTirePressure}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="frontSuspensionPressure"
        placeholder="Front Suspension Pressure (psi)"
        value={formData.frontSuspensionPressure}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="rearSuspensionPressure"
        placeholder="Rear Suspension Pressure (psi)"
        value={formData.rearSuspensionPressure}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="avgTemperature"
        placeholder="Average Temperature (°F)"
        value={formData.avgTemperature}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="timeRode"
        placeholder="Time Rode (minutes)"
        value={formData.timeRode}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        name="numberOfDescents"
        placeholder="Number of Descents"
        value={formData.numberOfDescents}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <input
        type="number"
        step="any"
        name="distance"
        placeholder="Distance (miles)"
        value={formData.distance}
        onChange={handleChange}
        className="border border-zinc-600 bg-zinc-900 p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded col-span-full">
        Submit Ride
      </button>
    </form>
  );
}
