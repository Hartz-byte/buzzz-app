import React, { useState, useEffect } from "react";

import CoverPic from "../assets/images/CoverPic.jpg";
import ProfilePic from "../assets/images/ProfilePic.jpg";

const ProfileSection: React.FC = () => {
  return (
    <div className="w-[20%] flex flex-col items-center bg-[#2a2a2a] rounded-xl">
      {/* Cover and Profile Picture */}
      <div className="relative w-full h-32 rounded-t-xl overflow-hidden mb-8">
        <img
          src={CoverPic}
          alt="Cover Photo"
          className="w-full h-full object-cover rounded-t-xl"
        />
        <img
          src={ProfilePic}
          alt="Profile"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full object-cover border-2 border-white"
        />
      </div>

      {/* User Info */}
      <div className="text-center text-white">
        <p className="text-xl font-semibold">Harsh Gupta</p>
        <p className="text-md text-gray-400">@hrsh_line_up</p>
        <p className="text-sm text-gray-500 mt-5">Believe in yourself</p>
      </div>

      {/* Following and Followers */}
      <div className="flex mt-5 text-white">
        <div className="flex flex-col items-center mx-4">
          <p className="text-lg font-semibold">Followers</p>
          <p className="text-xl">150</p>
        </div>
        <div className="flex flex-col items-center mx-4">
          <p className="text-lg font-semibold">Following</p>
          <p className="text-xl">120</p>
        </div>
      </div>

      {/* My Profile Button */}
      <button className="mt-10 w-[90%] py-2 bg-[#2f2e2e] text-white rounded-lg hover:bg-[#242424] transition-colors">
        My Profile
      </button>
    </div>
  );
};

export default ProfileSection;
