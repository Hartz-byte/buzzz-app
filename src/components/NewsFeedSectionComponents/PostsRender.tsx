import React from "react";
import { ToastContainer } from "react-toastify";

// Define the types for the post object and props
interface Post {
  _id?: string;
  id: string;
  user: {
    profilePicture: string;
    name: string;
    username: string;
  };
  text: string;
  imageUrl?: string;
  formattedDate: string;
}

interface PostRenderProps {
  posts: Post[];
  postsLoading: boolean;
  postsError: boolean;
  handleDeletePost: (postId: string) => void;
  toggleMenu: (index: number) => void;
  openMenuId: number | null;
  profilePicture: string;
  deleteDialog: boolean;
  postIdToDelete: string | null;
  setDeleteDialog: (open: boolean) => void;
  openDeleteDialog: (postId: string, index: number) => void;
}

const PostRender: React.FC<PostRenderProps> = ({
  posts,
  postsLoading,
  postsError,
  handleDeletePost,
  toggleMenu,
  openMenuId,
  profilePicture,
  deleteDialog,
  postIdToDelete,
  setDeleteDialog,
  openDeleteDialog,
}) => {
  return (
    <div className="mt-5 w-full p-4 rounded-xl flex flex-col">
      {postsLoading ? (
        <p className="text-white">Loading...</p>
      ) : postsError ? (
        <div>
          <p className="text-white">Error loading posts</p>
        </div>
      ) : (
        posts
          .slice()
          .reverse()
          .map((post, index) => (
            <div
              key={post._id?.toString() || index}
              id={post._id?.toString() || `post-${index}`}
              className="bg-[#2a2a2a] p-4 mb-10 rounded-xl flex flex-col space-y-3"
            >
              {/* user's info */}
              <div className="flex justify-between space-x-2">
                {/* info */}
                <div className="flex items-center">
                  <img
                    src={post.user.profilePicture}
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full mr-4"
                  />

                  <div>
                    <p className="text-[#B39757] font-semibold">
                      {post.user.name}
                    </p>

                    <p className="text-md text-gray-400">
                      @{post.user.username}
                    </p>
                  </div>
                </div>

                {/* menu button and date/time */}
                <div className="relative flex flex-col items-end">
                  {/* menu icon */}
                  <button
                    onClick={() => toggleMenu(index)}
                    className="bg-[#2A2A2A] p-0 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-icons text-2xl">more_horiz</span>
                  </button>

                  {/* Date and Time */}
                  <div className="text-gray-500 text-sm">
                    {post.formattedDate}
                  </div>

                  {/* Menu */}
                  {openMenuId === index && (
                    <div className="absolute top-7 right-0 bg-[#1e1e1e] rounded-xl shadow-lg w-32">
                      <button className="block w-full text-left px-4 py-2 text-white hover:bg-[#1e1e1e]">
                        Edit post
                      </button>

                      <button
                        onClick={() => openDeleteDialog(post.id, index)}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[#1e1e1e]"
                      >
                        Delete post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* text post */}
              <p className="text-white">{post.text}</p>

              {/* image post */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post Image"
                  className="mt-2 w-full h-56 object-cover rounded-xl"
                />
              )}

              {/* like, comment, share icon */}
              <div className="flex items-center pt-5 space-x-4">
                <button className="text-gray-400 hover:text-gray-300 p-0 bg-[#2a2a2a]">
                  <span className="material-icons text-md">favorite</span>
                </button>
                <button className="text-gray-400 hover:text-gray-300 p-0 bg-[#2a2a2a]">
                  <span className="material-icons text-md">comment</span>
                </button>
                <button className="text-gray-400 hover:text-gray-300 p-0 bg-[#2a2a2a]">
                  <span className="material-icons text-md">share</span>
                </button>
              </div>

              {/* divider */}
              <div className="w-full h-[0.2px] bg-gray-600" />

              {/* comment input */}
              <div className="flex items-center mb-4 bg-[#242424] rounded-xl p-2">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-10 h-10 object-cover rounded-full mr-4"
                />
                <input
                  type="text"
                  placeholder="Write your comment"
                  className="flex-1 h-12 bg-transparent rounded-xl text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#B39757]"
                />
              </div>
            </div>
          ))
      )}
      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-[#00000099] flex justify-center items-center z-10">
          <div className="bg-[#242424] p-5 rounded-xl w-[300px]">
            <p className="text-white text-xl">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setDeleteDialog(false)}
                className="bg-[#1e1e1e] text-white rounded-xl px-4 py-2 hover:bg-[#333]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(postIdToDelete!)}
                className="bg-[#DF7272] text-white rounded-xl px-4 py-2 hover:bg-[#d65f5f]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PostRender;
