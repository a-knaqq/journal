import React from "react";
import PineIcon from "../assets/PineIcon.png"; // Adjust the path based on your project structure

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900">
      <div className="bg-zinc-800 bg-opacity-70 p-6 rounded-2xl shadow-lg">
        <img src={PineIcon} alt="Logo" className="w-48 h-auto opacity-90" />
      </div>
    </div>
  );
};

export default HomePage;
