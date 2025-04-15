import { useState } from "react";

export default function MealTracker() {
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState({
    type: "",
    calories: "",
    protein: "",
    carbs: "",
    time: ""
  });

  const handleChange = (e) =>
    setMeal({ ...meal, [e.target.name]: e.target.value });

  const handleAdd = (e) => {
    e.preventDefault();
    setMeals([...meals, meal]);
    setMeal({ type: "", calories: "", protein: "", carbs: "", time: "" });
  };

  const totalCalories = meals.reduce((acc, curr) => acc + Number(curr.calories || 0), 0);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Meal Tracker</h1>
      <form onSubmit={handleAdd} className="space-y-4">
        <input type="text" name="type" value={meal.type} onChange={handleChange} placeholder="Meal Type" className="input" />
        <input type="number" name="calories" value={meal.calories} onChange={handleChange} placeholder="Calories" className="input" />
        <input type="number" name="protein" value={meal.protein} onChange={handleChange} placeholder="Protein (g)" className="input" />
        <input type="number" name="carbs" value={meal.carbs} onChange={handleChange} placeholder="Carbs (g)" className="input" />
        <input type="time" name="time" value={meal.time} onChange={handleChange} className="input" />
        <button type="submit" className="btn">Add Meal</button>
      </form>
      <div className="mt-4">
        <h2 className="text-lg font-medium">Total Calories Today: {totalCalories}</h2>
        <ul className="mt-2 space-y-2">
          {meals.map((m, i) => (
            <li key={i} className="bg-gray-100 p-2 rounded">
              {m.type} - {m.calories} cal at {m.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
