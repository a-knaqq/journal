// src/pages/homePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PineIcon from "../assets/PineIcon.png";
import Wheel from "../assets/Wheel.png";
import Gallery from "../assets/Gallery.png";
import Notifcation from "../assets/Notification.png";

const HomePage = ({ onCardSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNav = (path) => {
    navigate(path);
    if (onCardSelect) onCardSelect(); // Call the onCardSelect prop when navigating
  };

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900">
      <motion.div
        className="w-64 h-64 perspective"
        onClick={handleFlip}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* Front of the card */}
          {!isFlipped && (
            <motion.div
              key="front"
              className="relative w-full h-full bg-zinc-800 rounded-2xl shadow-lg cursor-pointer"
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
              }}
              style={{
                backfaceVisibility: "hidden",
                width: "256px",
                height: "256px",
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <img src={PineIcon} alt="Logo" className="w-48 h-auto opacity-90" />
              </div>
            </motion.div>
          )}

          {/* Back of the card with 2x3 button grid */}
          {isFlipped && (
            <motion.div
              key="back"
              className="relative w-full h-full bg-zinc-800 rounded-2xl shadow-lg cursor-pointer"
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
              }}
              style={{
                backfaceVisibility: "hidden",
                width: "256px",
                height: "256px",
              }}
            >
 <div className="grid grid-cols-1 grid-rows-3 gap-2 p-2 w-full h-full">
      {/* Track Ride */}
      <button
        className="bg-blue-500 hover:bg-blue-600 rounded-2xl shadow flex items-center justify-center px-2"
        onClick={(e) => {
          e.stopPropagation();
          handleNav("/track-rides");
        }}
      >
        <img src={Wheel} alt="Track Ride" className="w-12 h-12 object-contain" />
      </button>

      {/* Gallery */}
      <button
        className="bg-green-500 hover:bg-green-600 rounded-2xl shadow flex items-center justify-center px-2"
        onClick={(e) => {
          e.stopPropagation();
          handleNav("/gallery");
        }}
      >
        <img src={Gallery} alt="Gallery" className="w-12 h-12 object-contain" />
      </button>

      {/* NEW: Notification */}
      <button
        className="bg-yellow-500 hover:bg-yellow-600 rounded-2xl shadow flex items-center justify-center px-2"
        onClick={(e) => {
          e.stopPropagation();
          handleNav("/notifications"); // you'll build this page next
        }}
      >
        <img src={Notifcation} alt="Notifications" className="w-12 h-12 object-contain" />
      </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HomePage;
