import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DeviceDetails from "./pages/DeviceDetails"
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅ changed
import Home from "./pages/Home";
import AddDevice from "./pages/AddDevice";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/device/:id" element={<DeviceDetails />} />
        <Route path="/add" element={<AddDevice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="author">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddDevice />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}