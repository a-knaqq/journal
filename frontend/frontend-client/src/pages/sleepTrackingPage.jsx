import { useState } from "react";

export default function SleepTracker() {
  const [form, setForm] = useState({
    sleepTime: "",
    wakeTime: "",
    outOfBedTime: "",
    notes: "",
    awakenings: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Sleep Tracker</h1>
      <form className="space-y-4">
        <input type="time" name="sleepTime" value={form.sleepTime} onChange={handleChange} placeholder="Sleep Time" className="input" />
        <input type="time" name="wakeTime" value={form.wakeTime} onChange={handleChange} placeholder="Wake Time" className="input" />
        <input type="time" name="outOfBedTime" value={form.outOfBedTime} onChange={handleChange} placeholder="Out of Bed Time" className="input" />
        <input type="text" name="awakenings" value={form.awakenings} onChange={handleChange} placeholder="Times Woken Up (e.g. 2:15 AM)" className="input" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="input" />
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}
