import {Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user, logout } = useAuth();

  return (
    // <footer className="bg-black text-gray-300 mt-16">
    <footer className="mt-auto z-50 backdrop-blur-lg bg-white/50 dark:bg-black/40 border-t border-black/20 shadow-md">

      <div className="max-w-6xl mx-auto py-10 px-5 grid md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-xl text-black font-bold  dark:text-white">
            Sakshi Mobile Wala
          </h2>
          <p className="mt-2 text-sm">
            Your trusted mobile shop for latest smartphones 📱
          </p>
        </div>

        <div>
          

            
            {!user ? (
              <>
                <h3 className="text-black font-semibold mb-2  dark:text-white">Quick Links</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link to="/login" className="text-blue-600 hover:underline font-semibold" > Login</Link></li>
                  <li><Link to="/signup" className="text-blue-600 hover:underline font-semibold" > Sign up </Link></li>
                </ul>
              </>
              
            ) : (
              <>
                
                <span className="text-gray-800 mb-5 dark:text-white text-sm">
                  <h3 className="text-black font-semibold mb-2  dark:text-white">Welcome {user?.user?.name || "User"}</h3>
                </span>
                <h3 className="text-black font-semibold mt-5 mb-2  dark:text-white">Quick Links</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link onClick={logout} className="text-blue-600 hover:underline font-semibold" > Logout </Link></li>
                </ul>
              </>




            )}
            
          
        </div>

        <div>
          <h3 className="text-black font-semibold mb-2  dark:text-white">Contact</h3>
          <p className="text-sm">📍 Konch, India</p>
          <p className="text-sm">📞 +91-xyz</p>
        </div>

      </div>

      <div className="text-center py-4 border-t border-gray-700 text-sm">
        © 2026 Sakshi Mobile Wala. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;

