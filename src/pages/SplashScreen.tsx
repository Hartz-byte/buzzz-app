import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../navigation/AuthContext";

import Logo from "../assets/logo/Buzzz.jpg";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showMainText, setShowMainText] = useState(false);
  const [showSubText, setShowSubText] = useState(false);

  useEffect(() => {
    const mainTextTimeout = setTimeout(() => setShowMainText(true), 1000);
    const subTextTimeout = setTimeout(() => setShowSubText(true), 2000);

    // Check auth status and navigation
    const authTimeout = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }, 5000);

    return () => {
      clearTimeout(mainTextTimeout);
      clearTimeout(subTextTimeout);
      clearTimeout(authTimeout);
    };
  }, [navigate, isAuthenticated]);

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
