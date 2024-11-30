import { useState, useEffect } from "react";
import ProfilePic from "../assets/images/ProfilePic.jpg";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useAuth } from "../navigation/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

// GraphQL querie to get all posts
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

// GraphQL querie to create posts
const CREATE_POST = gql`
  mutation CreatePost($text: String, $imageUrl: String, $tags: [String]) {
    createPost(text: $text, imageUrl: $imageUrl, tags: $tags) {
      text
      imageUrl
      createdAt
      tags {
        id
        name
      }
    }
  }
`;

// GraphQL querie to search for users
const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      id
      name
      email
    }
  }
`;

type Post = {
  createdAt: string;
  formattedDate?: string;
};

const NewsFeedSection = () => {
  const [text, setText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { userId: authUserId } = useAuth();

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    refetch,
  } = useQuery(GET_USER_POSTS, {
    variables: { userId: userId || authUserId },
    skip: !userId,
  });

  const [createPostMutation] = useMutation(CREATE_POST);

  const [searchUsers, { data: searchResults, loading: searchLoading }] =
    useLazyQuery(SEARCH_USERS);

  // useEffect to get current user and store it's id in local storage
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

  // useEffect for refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  // useEffect to store available posts and update date format
  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts);
      console.log(postsData);

      // Format the createdAt field for each post excluding seconds
      const formattedPosts: Post[] = postsData.posts.map((post: Post) => ({
        ...post,
        formattedDate: format(new Date(parseInt(post.createdAt)), "PPp"),
      }));

      setPosts(formattedPosts);
    }
  }, [postsData]);

  // useEffect to search for the required user
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tagSearch.trim()) {
        searchUsers({ variables: { searchTerm: tagSearch } });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [tagSearch, searchUsers]);

  // function to upload image on cloudinary
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

  // function to handle create post
  const handleCreatePost = async () => {
    if (!text.trim()) {
      alert("Post cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      let uploadedImageUrl = imageUrl;

      if (imageFile) {
        uploadedImageUrl = await uploadImageToCloudinary(imageFile);
      }

      await createPostMutation({
        variables: { text, imageUrl: uploadedImageUrl, tags },
      });

      setText("");
      setImageUrl("");
      setImageFile(null);
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  // function to handle user tags
  const handleTagClick = (userId: string, userName: string) => {
    setTags((prevTags) => [...prevTags, userName]);

    console.log(`User ${userName} id ${userId} tagged successfully`);

    setTagSearch("");
  };

  // function to handle upload image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // function to remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  return (
    <div className="w-[100%] flex flex-col items-center">
      {/* Top container, Tagging UI, Image Preview Section, Displaying tags, Icons */}
      <div className="w-full bg-[#2a2a2a] p-4 rounded-xl flex flex-col">
        {/* Top container */}
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
            {loading ? (
              <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></div>
            ) : (
              <span className="material-icons text-white text-2xl">send</span>
            )}
          </button>
        </div>

        {/* Tagging UI */}
        <div className="mb-4">
          {/* Render tag input field only if text is not empty */}
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
                  {searchResults.searchUsers.map((user: any) => (
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

      {/* Posts render */}
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
                key={index}
                className="bg-[#2a2a2a] p-4 mb-10 rounded-xl flex flex-col space-y-3"
              >
                {/* user's info */}
                <div className="flex justify-between space-x-2">
                  <div className="flex items-center">
                    <img
                      src={ProfilePic}
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full mr-4"
                    />

                    <div>
                      <p className="text-[#B39757] font-semibold">
                        {post.user.name}
                      </p>

                      <p className="text-md text-gray-400">@hrsh_line_up</p>
                    </div>
                  </div>

                  <div className="text-gray-500 text-sm mt-2">
                    {post.formattedDate}
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
                    src={ProfilePic}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full mr-4"
                  />
                  <input
                    type="text"
                    placeholder="Write your comment"
                    className="flex-1 h-12 bg-transparent rounded-xl text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#B39757]"
                  />
                  <button className="h-12 w-12 flex items-center justify-center bg-transparent hover:bg-[#1e1e1e] rounded-xl focus:outline-none">
                    <span className="material-icons text-white text-2xl">
                      send
                    </span>
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NewsFeedSection;
