import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "../pages/homePage";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleClose = () => setIsCollapsed(true);

  return (
    <div className="h-screen w-full bg-zinc-900 text-white relative">
      {/* Hamburger Icon */}
      <button
        className="absolute top-4 right-4 z-50 bg-zinc-700 p-2 rounded-md"
        onClick={handleToggle}
        aria-label="Toggle Navigation"
      >
        ☰
      </button>

      {/* Overlay Card Navigation */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-95 flex items-center justify-center z-40">
          <div className="relative">
            <HomePage onCardSelect={handleClose} />
            <button
              onClick={handleToggle}
              className="absolute top-2 right-2 bg-zinc-700 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className={`transition-opacity duration-300 ${!isCollapsed ? "opacity-25 pointer-events-none" : "opacity-100"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
