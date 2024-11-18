import { useState } from "react";

import NavigationSection from "../components/NavigationSection";
import ProfileSection from "../components/ProfileSection";
import NewsFeedSection from "../components/NewsFeedSection";
import AllUsersSection from "../components/AllUsersSection";
import ExploreSection from "../components/ExploreSection";

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Handle section change from Navigation
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col min-h-screen gap-4 p-4 bg-[#1a1a1a] text-white">
      {/* Navigation Section */}
      <NavigationSection onChangeSection={handleSectionChange} />

      {/* Profile, News Feed, and All Users Sections */}
      <div className="flex flex-1 gap-4">
        <ProfileSection />

        {/* Conditionally render based on activeSection */}
        {activeSection === "home" && <NewsFeedSection />}
        {activeSection === "explore" && <ExploreSection />}

        <AllUsersSection />
      </div>
    </div>
  );
};

export default Home;
