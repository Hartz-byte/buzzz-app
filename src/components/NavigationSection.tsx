import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo/Buzzz.jpg";

const NavigationSection = ({
  onChangeSection,
}: {
  onChangeSection: (section: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  // Function to handle log out
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page on success
    navigate("/login");

    console.log("User logged out");
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChangeSection(tab);
  };

  return (
    <div className="h-[80px] flex items-center justify-between px-4">
      {/* Logo */}
      <img src={Logo} alt="Buzzz Logo" className="h-full object-contain" />

      {/* Navigation Buttons */}
      <div className="flex gap-8">
        {/* Home Button */}
        <button
          onClick={() => handleTabChange("home")}
          className={`${
            activeTab === "home"
              ? "text-[#B39757]"
              : "text-white hover:text-[#B39757]"
          } focus:outline-none`}
        >
          <span className="material-icons text-3xl">home</span>
        </button>

        {/* Explore Button */}
        <button
          onClick={() => handleTabChange("explore")}
          className={`${
            activeTab === "explore"
              ? "text-[#B39757]"
              : "text-white hover:text-[#B39757]"
          } focus:outline-none`}
        >
          <span className="material-icons text-3xl">explore</span>
        </button>

        {/* Notifications Button */}
        <button className="text-white hover:text-[#B39757] focus:outline-none">
          <span className="material-icons text-3xl">notifications</span>
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition focus:outline-none"
      >
        Log Out
      </button>
    </div>
  );
};

export default NavigationSection;
