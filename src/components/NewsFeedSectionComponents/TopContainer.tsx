import React from "react";

// Define the types for the props
interface User {
  id: string;
  name: string;
}

interface TopContainerProps {
  profilePicture: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleCreatePost: () => void;
  loading: boolean;
  tagSearch: string;
  setTagSearch: React.Dispatch<React.SetStateAction<string>>;
  searchResults: { searchUsers: User[] };
  searchLoading: boolean;
  handleTagClick: (id: string, name: string) => void;
  imageUrl: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  tags: string[];
}

const TopContainer = ({
  profilePicture,
  text,
  setText,
  handleCreatePost,
  loading,
  tagSearch,
  setTagSearch,
  searchResults,
  searchLoading,
  handleTagClick,
  imageUrl,
  handleImageUpload,
  handleRemoveImage,
  tags,
}: TopContainerProps) => {
  return (
    <div className="w-full bg-[#2a2a2a] p-4 rounded-xl flex flex-col">
      {/* Top container */}
      <div className="flex items-center mb-4">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-12 h-12 object-cover rounded-full mr-4"
        />
        <input
          type="text"
          placeholder="Tell your friends about your thoughts..."
          className="flex-1 h-12 bg-[#242424] text-white p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B39757] mr-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleCreatePost}
          className="h-12 w-12 flex items-center justify-center bg-[#242424] rounded-xl hover:bg-[#1e1e1e] focus:outline-none"
        >
          {loading ? (
            <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></div>
          ) : (
            <span className="material-icons text-white text-2xl">send</span>
          )}
        </button>
      </div>

      {/* Tagging UI */}
      <div className="mb-4">
        {text.trim() && (
          <>
            <input
              type="text"
              placeholder="Tag people..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="flex-1 h-12 bg-[#242424] text-white p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B39757] mr-2"
            />
            {tagSearch && searchResults?.searchUsers?.length > 0 && (
              <div className="bg-[#1e1e1e] rounded-xl mt-2 p-2 max-h-48 overflow-y-auto">
                {searchResults.searchUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-2 cursor-pointer hover:bg-[#3a3a3a]"
                    onClick={() => handleTagClick(user.id, user.name)}
                  >
                    <p className="text-white">{user.name}</p>
                  </div>
                ))}
              </div>
            )}
            {searchLoading && <p className="text-white">Searching...</p>}
          </>
        )}
      </div>

      {/* Image Preview Section */}
      {imageUrl && (
        <div className="relative mb-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-56 object-cover rounded-xl"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-[#DF7272] p-2 rounded-full text-white"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}

      {/* Displaying tags */}
      <div className="mt-4 flex flex-wrap space-x-2">
        {tags.length > 0 &&
          tags.map((tagName) => (
            <span
              key={tagName}
              className="bg-[#B39757] text-white rounded-xl px-4 py-1 mb-5"
            >
              {tagName}
            </span>
          ))}
      </div>

      {/* Icons */}
      <div className="flex justify-between ml-16 mr-14">
        {/* Gallery */}
        <div className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e] relative">
          <span className="material-icons text-[#20D997] mr-2">photo</span>
          <p className="text-white">Gallery</p>

          {/* Input Field for Image Upload */}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>

        {/* Video */}
        <div className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e]">
          <span className="material-icons text-[#4F94FC] mr-2">videocam</span>
          <p className="text-white">Video</p>
        </div>

        {/* Poll */}
        <div className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e]">
          <span className="material-icons text-[#DF7272] mr-2">poll</span>
          <p className="text-white">Poll</p>
        </div>

        {/* Schedule */}
        <div className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e]">
          <span className="material-icons text-[#DFB761] mr-2">
            calendar_today
          </span>
          <p className="text-white">Schedule</p>
        </div>
      </div>
    </div>
  );
};

export default TopContainer;
