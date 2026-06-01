// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function PrivateRoute({ children, role }) {
//   const { user } = useAuth();
//   const location = useLocation();

//   // ❌ Not logged in
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // ❌ Role not allowed
//   if (role && user.role !== role) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// }
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}