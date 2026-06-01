import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Error parsing user:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    // localStorage.setItem("user", JSON.stringify(data.user)); // ✅ correct
    // setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data)); // ✅ SAVE
    
    setUser(data); //
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);