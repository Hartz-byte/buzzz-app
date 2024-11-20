import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

// GraphQL queries and mutations
const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      name
      email
    }
  }
`;

const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
    }
  }
`;

const FOLLOW_USER = gql`
  mutation followUser($targetUserId: String!) {
    followUser(targetUserId: $targetUserId) {
      message
      followingCount
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation unfollowUser($targetUserId: String!) {
    unfollowUser(targetUserId: $targetUserId) {
      message
      followingCount
    }
  }
`;

const AllUsersSection = () => {
  // Apollo Client's useQuery hook to fetch all users
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(GET_ALL_USERS);

  // Apollo Client's useQuery hook to fetch the current user
  const {
    loading: loadingCurrentUser,
    error: errorCurrentUser,
    data: dataCurrentUser,
  } = useQuery(GET_CURRENT_USER);

  // Apollo Client's mutations for follow/unfollow
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  // State for the followed users to update UI dynamically
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  if (loadingUsers || loadingCurrentUser) return <p>Loading...</p>;

  if (errorUsers) return <p>Error fetching users: {errorUsers.message}</p>;
  if (errorCurrentUser)
    return <p>Error fetching current user: {errorCurrentUser.message}</p>;

  // Filter out the current user from the list
  const filteredUsers = dataUsers.getAllUsers.filter(
    (user: { id: string }) => user.id !== dataCurrentUser.currentUser.id
  );

  // Handle follow
  const handleFollow = async (userId: string) => {
    try {
      const { data } = await followUser({
        variables: { targetUserId: userId },
      });

      console.log("Follow data: ", data);

      if (data?.followUser) {
        setFollowedUsers((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error("Error following user", error);
    }
  };

  // Handle unfollow
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
    } catch (error) {
      console.error("Error unfollowing user", error);
    }
  };

  return (
    <div className="w-[20%] flex flex-col items-center justify-center bg-[#2a2a2a] rounded-xl">
      <p className="text-white text-xl mb-4">All Users</p>
      <div className="flex flex-col items-center space-y-4 w-full">
        {filteredUsers.map((user: any) => (
          <div
            key={user.id}
            className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e] w-[90%]"
          >
            {/* User details section */}
            <div className="flex flex-col justify-between flex-grow">
              <p className="text-white text-sm">{user.name}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>

            {/* Follow/Unfollow button container */}
            <div className="flex-shrink-0">
              {followedUsers.has(user.id) ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-full"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-blue-500 text-white py-1 px-7 rounded-full"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsersSection;
