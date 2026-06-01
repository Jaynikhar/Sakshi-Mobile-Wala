import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // ✅ ROLE
  const role =
    user?.role ||
    user?.user?.role ||
    user?.data?.role;

  const isEditor = ["author", "editor"].includes(role?.toLowerCase());
  

  // ✅ SYNC ON LOAD (VERY IMPORTANT)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  // ✅ TOGGLE FUNCTION (NO BUGS)
  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/30 dark:bg-black/40 border-b border-white/20 shadow-md">
      
      <div className="flex justify-between items-center px-6 py-3">

        {/* 🔷 LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3523/3523887.png"
            className="w-8 h-8"
            alt="."
          />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            Devices
          </span>
        </Link>

        {/* 🖥 DESKTOP RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">

          {isEditor && (
            <Link to="/add">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:scale-105 transition">
                + Add Device
              </button>
            </Link>
          )}

          {!user ? (
            <div className="flex items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
              <Link
                to="/login"
                className="inline-block px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="inline-block px-3 py-1 rounded bg-blue-500 text-white"
              >
                Signup
              </Link>
            </div>
          ) : (
            <>
              { role?.toLowerCase() === "author" && (
                <Link
                  to="/admin"
                  className="px-3 py-1 rounded-md bg-purple-500 text-white text-sm hover:bg-purple-600 transition"
                >
                  Dashboard
                </Link>
              )}
              <span className="text-gray-800 dark:text-white text-sm">
                {user?.user?.name || "User"}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-full"
              >
                Logout
              </button>
            </>
          )}

          {/* 🌙 DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* 📱 MOBILE RIGHT SIDE */}
        <div className="md:hidden flex items-center gap-2">

          {/* 🌙 DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* ☰ MENU */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 📱 SMALL RIGHT DROPDOWN (FIXED) */}
      {open && (
        <div className="absolute right-4 mt-2 w-52 rounded-xl shadow-lg backdrop-blur-lg bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 p-4 space-y-3">

          {isEditor && (
            <Link to="/add" onClick={() => setOpen(false)}>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
                + Add Device
              </button>
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="w-full mt-2 mb-3 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg text-black dark:text-white">
                  Login
                </button>
              </Link>

              <Link to="/signup" onClick={() => setOpen(false)}>
                <button 
                  // className="inline-block px-3 py-1 rounded bg-blue-500 text-white"
                  className="w-full mt-2 mb-3 bg-blue-300 dark:bg-blue-600 py-2 rounded-lg text-black dark:text-white"
                >
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <>
              {role?.toLowerCase() === "author" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                >
                  <button className="w-full mt-3 mb-3 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg text-black dark:text-white">
                    Dashboard
                  </button>
                  
                </Link>
              )}
              <p className="text-sm mt-2 mb-2 text-gray-800 dark:text-white">
                {user?.user?.name || "User"}
              </p>

              <button
                onClick={logout}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

