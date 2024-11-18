import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

import Logo from "../assets/logo/Buzzz.jpg";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showMainText, setShowMainText] = useState(false);
  const [showSubText, setShowSubText] = useState(false);

  useEffect(() => {
    // const auth = getAuth();

    // user authentication check
    const checkAuthStatus = () => {
      // onAuthStateChanged(auth, (user) => {
      //   if (user) {
      //     // if the user is logged in then navigate to home page
      //     setTimeout(() => {
      //       navigate("/home");
      //     }, 5000);
      //   } else {
      //     // if not logged in then navigate to login page
      //     setTimeout(() => {
      //       navigate("/login");
      //     }, 5000);
      //   }
      // });

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    };

    checkAuthStatus();

    // main text after the logo animation
    const mainTextTimeout = setTimeout(() => setShowMainText(true), 1000);
    // subtext after the main text animation
    const subTextTimeout = setTimeout(() => setShowSubText(true), 2000);

    return () => {
      clearTimeout(mainTextTimeout);
      clearTimeout(subTextTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="flex flex-col items-center">
        {/* logo animation */}
        <img
          src={Logo}
          alt="Buzzz Logo"
          className={`animate-bounceIn w-24 h-24 mb-4`}
        />

        {/* main text animation */}
        {showMainText && (
          <h1 className="font-gravitas text-3xl font-bold text-white animate-fadeIn">
            BUZZZ
          </h1>
        )}

        {/* subtext animation */}
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
