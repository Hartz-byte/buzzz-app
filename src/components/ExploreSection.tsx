import { useState } from "react";

const ExploreSection = () => {
  const [searchText, setSearchText] = useState("");

  // function to handle search clear
  const handleClear = () => {
    setSearchText("");
  };

  return (
    <div className="w-[60%] flex flex-col items-center">
      {/* Container */}
      <div className="w-full bg-[#2a2a2a] p-4 rounded-xl flex justify-center">
        {/* Search Input Field */}
        <div className="relative w-full max-w-[500px]">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
            className="w-full h-12 bg-[#242424] text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B39757] pr-12"
          />

          {/* Close Icon */}
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
    </div>
  );
};

export default ExploreSection;
