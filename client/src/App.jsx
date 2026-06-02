import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅ changed
import AdminDashboard from "./pages/AdminDashboard";
import DeviceDetails from "./pages/DeviceDetails"
import Footer from "./components/Footer";
import AddDevice from "./pages/AddDevice";
import PrivateRoute from "./components/PrivateRoute";



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={ <PrivateRoute role="author"> <AdminDashboard /> </PrivateRoute> } />
        <Route path="/device/:id" element={<DeviceDetails />} />
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