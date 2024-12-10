import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import debounce from "lodash.debounce";
import {
  GET_ALL_USERS,
  GET_CURRENT_USER,
  GET_FOLLOWING,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../graphql/graphql.ts";

const ExploreSection = () => {
  // Queries and mutations
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

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((query: string) => {
      setIsLoadingSearch(true);

      setTimeout(() => {
        setIsLoadingSearch(false);
      }, 500);

      if (dataUsers?.getAllUsers) {
        const results = dataUsers.getAllUsers.filter(
          (user: { name: string; username: string; id: string }) =>
            (user.name.toLowerCase().includes(query.toLowerCase()) ||
              user.username.toLowerCase().includes(query.toLowerCase())) &&
            user.id !== dataCurrentUser?.currentUser?.id
        );
        setFilteredUsers(results);
      }
    }, 500),
    [dataUsers, dataCurrentUser]
  );

  // Update search results when search text changes
  useEffect(() => {
    if (searchText.trim()) {
      handleSearch(searchText);
    } else {
      setFilteredUsers([]);
    }
  }, [searchText, handleSearch]);

  // Populate followed users from query
  useEffect(() => {
    if (dataFollowing?.following) {
      const followedUserIds: Set<string> = new Set(
        dataFollowing.following.map((user: { id: string }) => user.id)
      );
      setFollowedUsers(followedUserIds);
    }
  }, [dataFollowing]);

  if (loadingUsers || loadingCurrentUser || loadingFollowing)
    return <p>Loading...</p>;

  if (errorUsers) return <p>Error fetching users: {errorUsers.message}</p>;
  if (errorCurrentUser)
    return <p>Error fetching current user: {errorCurrentUser.message}</p>;

  const handleFollow = async (userId: string) => {
    try {
      const { data } = await followUser({
        variables: { targetUserId: userId },
      });
      if (data?.followUser) {
        setFollowedUsers((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error("Error following user", error);
    }
  };

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

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <div className="w-[100%] flex flex-col items-center">
      {/* Search Bar */}
      <div className="w-full bg-[#2a2a2a] p-4 rounded-xl flex justify-center">
        <div className="relative w-full max-w-[500px]">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for users"
            className="w-full h-12 bg-[#242424] text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B39757] pr-12"
          />
          {searchText.length > 0 && (
            <span
              onClick={handleClear}
              className="material-icons text-white absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              close
            </span>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="w-full max-w-[500px] mt-4">
        {isLoadingSearch ? (
          <div className="flex justify-center items-center h-20">
            <span className="material-icons animate-spin text-white text-4xl">
              autorenew
            </span>
          </div>
        ) : (
          filteredUsers.map(
            (user: {
              id: string;
              name: string;
              username: string;
              profilePicture: string;
            }) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-lg mb-2"
              >
                <div className="flex items-center">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full mr-4 flex-shrink-0"
                  />
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    followedUsers.has(user.id)
                      ? handleUnfollow(user.id)
                      : handleFollow(user.id)
                  }
                  className={`py-2 px-4 rounded-full ${
                    followedUsers.has(user.id)
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {followedUsers.has(user.id) ? "Unfollow" : "Follow"}
                </button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default ExploreSection;
