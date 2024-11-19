import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo/Buzzz.jpg";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showMainText, setShowMainText] = useState(false);
  const [showSubText, setShowSubText] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    };

    // Call checkAuthStatus after a short delay
    const authTimeout = setTimeout(checkAuthStatus, 5000);

    // Show main text after the logo animation
    const mainTextTimeout = setTimeout(() => setShowMainText(true), 1000);
    // Show subtext after the main text animation
    const subTextTimeout = setTimeout(() => setShowSubText(true), 2000);

    return () => {
      clearTimeout(authTimeout);
      clearTimeout(mainTextTimeout);
      clearTimeout(subTextTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="flex flex-col items-center">
        {/* Logo animation */}
        <img
          src={Logo}
          alt="Buzzz Logo"
          className={`animate-bounceIn w-24 h-24 mb-4`}
        />

        {/* Main text animation */}
        {showMainText && (
          <h1 className="font-gravitas text-3xl font-bold text-white animate-fadeIn">
            BUZZZ
          </h1>
        )}

        {/* Subtext animation */}
        {showSubText && (
          <h2 className="mt-2 text-[#B39757] text-lg font-medium overflow-hidden whitespace-nowrap animate-typing">
            WHERE CONNECTIONS HUMMM!!
          </h2>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
