import { useState, useEffect } from "react";
import ProfilePic from "../assets/images/ProfilePic.jpg";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useAuth } from "../navigation/AuthContext";
import axios from "axios";

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: String!) {
    posts(userId: $userId) {
      text
      imageUrl
      createdAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($text: String, $imageUrl: String) {
    createPost(text: $text, imageUrl: $imageUrl) {
      text
      imageUrl
      createdAt
    }
  }
`;

const NewsFeedSection = () => {
  const [text, setText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const { userId } = useAuth();
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_USER_POSTS, {
    variables: { userId },
  });

  const [createPostMutation] = useMutation(CREATE_POST);

  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts || []);
    }
  }, [postsData]);

  // Upload the image to Cloudinary and get the URL
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_cloudinary_preset");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsxdbnx7u/image/upload`,
        formData
      );

      console.log("image upload success");

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return "";
    }
  };

  const handleCreatePost = async () => {
    try {
      let uploadedImageUrl = imageUrl;

      if (imageFile) {
        // Upload the image to Cloudinary and get the URL
        uploadedImageUrl = await uploadImageToCloudinary(imageFile);
      }

      // Create the post with or without an image
      await createPostMutation({
        variables: { text, imageUrl: uploadedImageUrl },
      });

      console.log("Post created");

      // Reset states
      setText("");
      setImageUrl("");
      setImageFile(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

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
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Send Button */}
          <button
            onClick={handleCreatePost}
            className="h-12 w-12 flex items-center justify-center bg-[#242424] rounded-xl hover:bg-[#1e1e1e] focus:outline-none"
          >
            <span className="material-icons text-white text-2xl">send</span>
          </button>
        </div>

        {/* Icons Section */}
        <div className="flex justify-between ml-16 mr-14">
          {/* Gallery */}
          <div className="flex items-center bg-[#242424] p-2 pl-4 pr-4 rounded-xl cursor-pointer hover:bg-[#1e1e1e] relative">
            <span className="material-icons text-[#20D997] mr-2">photo</span>
            <p className="text-white">Gallery</p>
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

      {/* Render the Posts */}
      <div className="mt-5 w-full bg-[#2a2a2a] p-4 rounded-xl flex flex-col">
        {postsLoading ? (
          <p className="text-white">Loading...</p>
        ) : postsError ? (
          <p className="text-white">Error loading posts</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="bg-[#2a2a2a] p-4 mb-4 rounded-xl">
              <p className="text-white">{post.text}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post Image"
                  className="mt-2 w-full h-56 object-cover rounded-xl"
                />
              )}
              <p className="text-[#B39757] mt-2 text-sm">{post.createdAt}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeedSection;
