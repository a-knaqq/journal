import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigate = (path) => {
    setIsCollapsed(true);
    navigate(path);
  };

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

      {/* Collapsible Navigation */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-95 flex items-center justify-center z-40">
          <div className="grid bg-zinc-400 rounded-lg grid-cols-3 grid-rows-2 gap-4 p-6">
            <button
              className="bg-zinc-600 text-gray-200 py-4 px-6 rounded text-lg font-semibold hover:bg-zinc-500"
              onClick={() => handleNavigate("/home")}
            >
              Home
            </button>
            <button
              className="bg-zinc-600 text-gray-200 py-4 px-6 rounded text-lg font-semibold hover:bg-zinc-500"
              onClick={() => handleNavigate("/page1")}
            >
              Page 1
            </button>
            <button
              className="bg-zinc-600 text-gray-200 py-4 px-6 rounded text-lg font-semibold hover:bg-zinc-500"
              onClick={() => handleNavigate("/page2")}
            >
              Page 2
            </button>
            <button
              className="bg-zinc-600 text-gray-200 py-4 px-6 rounded text-lg font-semibold hover:bg-zinc-500"
              onClick={() => handleNavigate("/page3")}
            >
              Page 3
            </button>
            <button
              className="bg-zinc-600 text-gray-200 py-4 px-6 rounded text-lg font-semibold hover:bg-zinc-500"
              onClick={() => handleNavigate("/page4")}
            >
              Page 4
            </button>
            <button
              className="bg-red-600 text-gray-200 py-4 px-6 rounded text-lg font-semibold hover:bg-red-500"
              onClick={() => {
                sessionStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all ${isCollapsed ? "" : "opacity-25"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
