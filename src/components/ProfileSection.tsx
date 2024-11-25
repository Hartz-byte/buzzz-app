import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import CoverPic from "../assets/images/CoverPic.jpg";
import ProfilePic from "../assets/images/ProfilePic.jpg";

// GraphQL query to fetch the current user and their followers/following
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      name
      followers {
        id
        name
      }
      following {
        id
        name
      }
    }
  }
`;

const ProfileSection: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER);

  // useEffect for refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  // status checking
  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    console.error("Error fetching user data:", error);
    return <p className="text-red-500 text-center">Error loading profile</p>;
  }

  // value updation
  const userName = data?.currentUser?.name || "User";
  const followersCount = data?.currentUser?.followers.length || 0;
  const followingCount = data?.currentUser?.following.length || 0;

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
        <p className="text-xl font-semibold">{userName}</p>
        <p className="text-md text-gray-400">@hrsh_line_up</p>
        <p className="text-sm text-gray-500 mt-5">Believe in yourself</p>
      </div>

      {/* Following and Followers */}
      <div className="flex mt-5 text-white">
        <div className="flex flex-col items-center mx-4">
          <p className="text-lg font-semibold">Followers</p>
          <p className="text-xl">{followersCount}</p>
        </div>
        <div className="flex flex-col items-center mx-4">
          <p className="text-lg font-semibold">Following</p>
          <p className="text-xl">{followingCount}</p>
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
