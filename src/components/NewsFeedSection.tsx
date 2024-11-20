import { useState, useEffect } from "react";
import ProfilePic from "../assets/images/ProfilePic.jpg";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useAuth } from "../navigation/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// GraphQL queries
const GET_USER_POSTS = gql`
  query GetUserPosts($userId: String!) {
    posts(userId: $userId) {
      text
      imageUrl
      createdAt
      user {
        name
      }
    }
  }
`;

const CREATE_POST = gql`
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
  const [imageUrl, setImageUrl] = useState<string>(""); // For the preview
  const [imageFile, setImageFile] = useState<File | null>(null); // For the file
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>("");

  const { userId: authUserId } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken: any = jwtDecode(storedToken);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_USER_POSTS, {
    variables: { userId: userId || authUserId },
    skip: !userId,
  });

  const [createPostMutation] = useMutation(CREATE_POST);

  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts);
    }
  }, [postsData]);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_cloudinary_preset");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsxdbnx7u/image/upload`,
        formData
      );
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
        uploadedImageUrl = await uploadImageToCloudinary(imageFile);
      }

      await createPostMutation({
        variables: { text, imageUrl: uploadedImageUrl },
      });

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
      setImageUrl(URL.createObjectURL(file)); // Display the image preview
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  return (
    <div className="w-[100%] flex flex-col items-center">
      <div className="w-full bg-[#2a2a2a] p-4 rounded-xl flex flex-col">
        <div className="flex items-center mb-4">
          <img
            src={ProfilePic}
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
            <span className="material-icons text-white text-2xl">send</span>
          </button>
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

        <div className="flex justify-between ml-16 mr-14">
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

      <div className="mt-5 w-full p-4 rounded-xl flex flex-col">
        {postsLoading ? (
          <p className="text-white">Loading...</p>
        ) : postsError ? (
          <div>
            <p className="text-white">Error loading posts</p>
            <pre className="text-white">
              {JSON.stringify(postsError, null, 2)}
            </pre>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-[#2a2a2a] p-4 mb-10 rounded-xl flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <p className="text-white font-semibold">{post.user.name}</p>
              </div>
              <p className="text-white">{post.text}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post Image"
                  className="mt-2 w-full h-56 object-cover rounded-xl"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeedSection;
