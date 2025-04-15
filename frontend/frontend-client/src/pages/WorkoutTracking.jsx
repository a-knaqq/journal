import { useState } from "react";

export default function WorkoutTracker() {
  const [form, setForm] = useState({
    activity: "",
    reps: "",
    weight: "",
    duration: "",
    time: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Workout Tracker</h1>
      <form className="space-y-4">
        <input type="text" name="activity" value={form.activity} onChange={handleChange} placeholder="Type of Activity" className="input" />
        <input type="number" name="reps" value={form.reps} onChange={handleChange} placeholder="Reps" className="input" />
        <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (if any)" className="input" />
        <input type="text" name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (e.g. 45 mins)" className="input" />
        <input type="time" name="time" value={form.time} onChange={handleChange} className="input" />
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}
