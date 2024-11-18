import ProfilePic from "../assets/images/ProfilePic.jpg";

const NewsFeedSection = () => {
  return (
    <div className="w-[60%] flex flex-col items-center">
      {/* Container */}
      <div className="w-full bg-[#2a2a2a] p-4 rounded-xl flex flex-col">
        {/* Profile Pic and Input Field */}
        <div className="flex items-center mb-4">
          {/* Profile Pic */}
          <img
            src={ProfilePic}
            alt="Profile"
            className="w-12 h-12 object-cover rounded-full mr-4"
          />

          {/* Input Field */}
          <input
            type="text"
            placeholder="Tell your friends about your thoughts..."
            className="flex-1 h-12 bg-[#242424] text-white p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B39757] mr-2"
          />

          {/* Send Button */}
          <button className="h-12 w-12 flex items-center justify-center bg-[#242424] rounded-xl hover:bg-[#1e1e1e] focus:outline-none">
            <span className="material-icons text-white text-2xl">send</span>
          </button>
        </div>

        {/* Icons Section */}
        <div className="flex justify-between ml-16 mr-14">
          {/* Gallery */}
          <div className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e]">
            <span className="material-icons text-[#20D997] mr-2">photo</span>
            <p className="text-white">Gallery</p>
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
    </div>
  );
};

export default NewsFeedSection;
