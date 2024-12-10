import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import {
  GET_ALL_USERS,
  GET_CURRENT_USER,
  GET_FOLLOWING,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../graphql/graphql.ts";

const AllUsersSection = () => {
  // useQuery hooks
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(GET_ALL_USERS);

  const {
    loading: loadingCurrentUser,
    error: errorCurrentUser,
    data: dataCurrentUser,
  } = useQuery(GET_CURRENT_USER);

  const { loading: loadingFollowing, data: dataFollowing } = useQuery(
    GET_FOLLOWING,
    {
      variables: { userId: dataCurrentUser?.currentUser?.id || "" },
      skip: !dataCurrentUser?.currentUser?.id,
    }
  );

  // mutation hooks
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  // useEffect to check if the logged-in user is following that particular user or not
  useEffect(() => {
    if (dataFollowing?.following) {
      const followedUserIds: Set<string> = new Set(
        dataFollowing.following.map((user: { id: string }) => user.id)
      );
      setFollowedUsers(followedUserIds);
    }
  }, [dataFollowing]);

  // status checking
  if (loadingUsers || loadingCurrentUser || loadingFollowing)
    return <p>Loading...</p>;

  if (errorUsers) return <p>Error fetching users: {errorUsers.message}</p>;
  if (errorCurrentUser)
    return <p>Error fetching current user: {errorCurrentUser.message}</p>;

  // filtering the logged-in user from the list
  const filteredUsers = dataUsers.getAllUsers.filter(
    (user: { id: string }) => user.id !== dataCurrentUser.currentUser.id
  );

  // Utility function to get user name by userId
  // const getUserNameById = (userId: string) => {
  //   const user = dataUsers.getAllUsers.find(
  //     (user: { id: string }) => user.id === userId
  //   );
  //   return user ? user.name : "Unknown User";
  // };

  // handle follow function
  const handleFollow = async (userId: string) => {
    try {
      const { data } = await followUser({
        variables: { targetUserId: userId },
      });

      if (data?.followUser) {
        setFollowedUsers((prev) => new Set(prev).add(userId));
      }

      // const userName = getUserNameById(userId);
      // toast.success(`Following ${userName} now!!`, {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      //   draggable: true,
      //   theme: "dark",
      // });
    } catch (error) {
      console.error("Error following user", error);
    }
  };

  // handle unfollow function
  const handleUnfollow = async (userId: string) => {
    try {
      const { data } = await unfollowUser({
        variables: { targetUserId: userId },
      });

      if (data?.unfollowUser) {
        setFollowedUsers((prev) => {
          const newFollowedUsers = new Set(prev);
          newFollowedUsers.delete(userId);
          return newFollowedUsers;
        });
      }

      // const userName = getUserNameById(userId);
      // toast.info(`Unfollowing ${userName} now.`, {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      //   draggable: true,
      //   theme: "dark",
      // });
    } catch (error) {
      console.error("Error unfollowing user", error);
    }
  };

  return (
    <div className="w-[20%] flex flex-col items-center justify-center bg-[#2a2a2a] rounded-xl">
      <p className="text-white text-xl mb-4">All Users</p>

      {/* Mapping all available users to follow/unfollow */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {filteredUsers.map((user: any) => (
          <div
            key={user.id}
            className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e] w-[90%]"
          >
            {/* Profile Picture */}
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full mr-4 flex-shrink-0"
            />

            {/* User Information */}
            <div className="flex flex-col justify-between flex-grow overflow-hidden">
              <p className="text-white text-sm truncate">{user.name}</p>
              <p className="text-gray-400 text-xs truncate">@{user.username}</p>
            </div>

            {/* Follow/Unfollow Button */}
            <div className="ml-4 flex-shrink-0">
              {followedUsers.has(user.id) ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-full flex items-center justify-center"
                >
                  <span className="material-icons">person_remove</span>
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-blue-500 text-white py-1 px-4 rounded-full flex items-center justify-center"
                >
                  <span className="material-icons">person_add</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* <ToastContainer /> */}
    </div>
  );
};

export default AllUsersSection;
