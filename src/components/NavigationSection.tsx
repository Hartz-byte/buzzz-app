import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo/Buzzz.jpg";

const NavigationSection = ({
  onChangeSection,
}: {
  onChangeSection: (section: string) => void;
}) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [logoutDialog, setLogoutDialog] = useState(false);

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
        onClick={() => setLogoutDialog(true)}
        className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition focus:outline-none"
      >
        Log Out
      </button>

      {/* Logout Dialog */}
      {logoutDialog && (
        <>
          {/* Background Blur */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10" />

          {/* Dialog Box */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1A1A1A] p-6 rounded-md z-20 text-center w-[300px]">
            <p className="text-white mb-6 text-lg">Logout from Buzzz?</p>

            <div className="flex justify-around">
              <button
                onClick={handleLogout}
                className="bg-[#2A2A2A] text-white px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition focus:outline-none"
              >
                Yes
              </button>

              <button
                onClick={() => setLogoutDialog(false)}
                className="bg-[#2A2A2A] text-white px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationSection;
