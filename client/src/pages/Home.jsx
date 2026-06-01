import { useEffect, useState, useContext  } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { getDevices } from "../services/deviceService";
import { useNavigate } from "react-router-dom";

import DeviceCard from "../components/DeviceCard"
export default function Home() {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchDevices();
    }
  }, [user]);

  

  const fetchDevices = async () => {
    try {
      const res = await getDevices();

      console.log("DEVICES:", res);

      // FIX: handle axios response correctly
      const data = Array.isArray(res.data) ? res.data : [];

      setDevices(data);
      setFilteredDevices(data);
    } catch (err) {
      console.log(err);
    }
  };
  //   try {
  //     const res = await getDevices();
  //     console.log("DEVICES:", res);
  //     setDevices(Array.isArray(res.data) ? res.data : []);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // 🔥 DEBOUNCE (wait 400ms after typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔍 SEARCH LOGIC (NAME + FIELDS)
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredDevices(devices);
      setSuggestions([]);
      return;
    }

    const value = debouncedSearch.toLowerCase();

    const filtered = devices.filter((d) => {
      // search in name
      const nameMatch = d.name.toLowerCase().includes(value);

      // search in dynamic fields
      const fieldMatch = Object.values(d.fields || {}).some((val) =>
        val.toLowerCase().includes(value)
      );

      return nameMatch || fieldMatch;
    });

    setFilteredDevices(filtered);
    setSuggestions(filtered.slice(0, 5)); // top 5 suggestions
  }, [debouncedSearch, devices]);

  // ✅ CLICK SUGGESTION
  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800">

        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-10 max-w-lg text-center">

          {/* IMAGE / ICON */}
          <div className="mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
              alt="login"
              className="w-24 mx-auto opacity-90"
            />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Device Manager
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Manage your Excel files, upload data, and control your dashboard easily.
            <br />
            Please login to continue.
          </p>

          {/* FEATURES */}
          <div className="text-left mb-6 text-gray-700 dark:text-gray-300">
            <ul className="space-y-2">
              <li>📂 Upload Excel files</li>
              <li>📊 View & manage data</li>
              <li>⬇️ Download reports</li>
              <li>🗑️ Delete files easily</li>
            </ul>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Login Now
          </button>
          <div
            className="text-centre ml-3 mt-4 mb-3 text-gray-700 dark:text-gray-300"
            
          >
            Or if don't have an account ? 

          </div>
          {/* BUTTON */}
          <button
            onClick={() => window.location.href = "/Signup"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Signup Now
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 🔍 SEARCH BAR */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name, RAM, Storage..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border text-black p-3 w-full rounded shadow"
        />

        {/* 🧠 SMART DROPDOWN */}
        {search && suggestions.length > 0 && (
          <div className="absolute w-full bg-white border rounded shadow mt-1 z-10">
            {suggestions.map((s) => (
              <div
                key={s._id}
                onClick={() => handleSuggestionClick(s.name)}
                className="p-2 text-black hover:bg-gray-200 cursor-pointer"
              >
                🔍 {s.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📱 DEVICES GRID */}
      <h1 className="text-2xl font-bold mb-4">Devices</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDevices.map((d) => (
          <div
            key={d._id}
            onClick={() => navigate(`/device/${d._id}`)}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            {/* 🖼 IMAGE */}
            {d.image && (
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            {/* 📌 NAME */}
            <h2 className="text-lg font-semibold mb-2">{d.name}</h2>

            {/* 🎯 FIELDS */}
            {Object.entries(d.fields || {}).map(([key, value]) => (
              <p key={key} className="text-sm">
                <span className="font-medium">{key}:</span> {value}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* ❌ NO RESULTS */}
      {filteredDevices.length === 0 && (
        <p className="text-gray-500 mt-4 text-center">
          No devices found 😢
        </p>
      )}
    </div>
  );
}