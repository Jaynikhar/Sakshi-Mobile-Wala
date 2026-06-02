import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/auth/signup", form); // backend same रहेगा
      // alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Signup
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded 
                     bg-white dark:bg-gray-700 
                     text-black dark:text-white 
                     placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded 
                     bg-white dark:bg-gray-700 
                     text-black dark:text-white 
                     placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded 
                     bg-white dark:bg-gray-700 
                     text-black dark:text-white 
                     placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        
        <button 
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded transition"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
        
        <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}