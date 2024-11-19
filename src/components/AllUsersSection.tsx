import { useQuery, gql } from "@apollo/client";

// GraphQL query to fetch all users
const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      name
      email
    }
  }
`;

// Query for the current logged in user
const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
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

  if (loadingUsers || loadingCurrentUser) return <p>Loading...</p>;

  if (errorUsers) return <p>Error fetching users: {errorUsers.message}</p>;
  if (errorCurrentUser)
    return <p>Error fetching current user: {errorCurrentUser.message}</p>;

  // Filter out the current user from the list
  const filteredUsers = dataUsers.getAllUsers.filter(
    (user: { id: string }) => user.id !== dataCurrentUser.currentUser.id
  );

  return (
    <div className="w-[20%] flex flex-col items-center justify-center bg-[#2a2a2a] rounded-xl">
      <p className="text-white text-xl mb-4">All Users</p>
      <div className="flex flex-col space-y-4">
        {filteredUsers.map(
          (user: { id: string; name: string; email: string }) => (
            <div
              key={user.id}
              className="bg-[#242424] p-4 px-6 rounded-lg text-white w-full flex justify-between"
            >
              <div>
                <p>{user.name}</p>
                <p className="text-sm">{user.email}</p>
              </div>

              <button className="bg-blue-500 text-white px-3 py-2 rounded-lg">
                Follow
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllUsersSection;
