import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TopContainer from "./NewsFeedSectionComponents/TopContainer.tsx";
import PostRender from "./NewsFeedSectionComponents/PostsRender.tsx";
import { useAuth } from "../navigation/AuthContext";
import ProfilePic from "../assets/images/ProfilePic.jpg";
import {
  GET_USER_POSTS,
  CREATE_POST,
  SEARCH_USERS,
  GET_CURRENT_USER_DETAIL,
  DELETE_POST_MUTATION,
} from "../graphql/graphql.ts";

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
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
  const [deletePost] = useMutation(DELETE_POST_MUTATION);

  const [searchUsers, { data: searchResults, loading: searchLoading }] =
    useLazyQuery(SEARCH_USERS);

  const { data } = useQuery(GET_CURRENT_USER_DETAIL);

  const profilePicture = data?.currentUser?.profilePicture || ProfilePic;

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
      toast.error("Post text cannot be empty.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
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

      toast.success("Posted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
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

  // function to toggle menu for a specific post
  const toggleMenu = (id: number) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  // function for deleting post
  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost({ variables: { postId } });
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
      setDeleteDialog(false);
    } catch (err) {
      toast.error("You can only delete your own posts", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
      setDeleteDialog(false);
    }
  };

  const openDeleteDialog = (postId: string, id: number) => {
    setPostIdToDelete(postId);
    setDeleteDialog(true);
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="w-[100%] flex flex-col items-center">
      {/* TopContainer */}
      <TopContainer
        profilePicture={profilePicture}
        text={text}
        setText={setText}
        handleCreatePost={handleCreatePost}
        loading={loading}
        tagSearch={tagSearch}
        setTagSearch={setTagSearch}
        searchResults={searchResults}
        searchLoading={searchLoading}
        handleTagClick={handleTagClick}
        imageUrl={imageUrl}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
        tags={tags}
      />

      {/* PostRender */}
      <PostRender
        posts={posts}
        postsLoading={postsLoading}
        postsError={!!postsError}
        handleEditPost={() => {}}
        handleDeletePost={handleDeletePost}
        toggleMenu={toggleMenu}
        openMenuId={openMenuId}
        profilePicture={profilePicture}
        deleteDialog={deleteDialog}
        postIdToDelete={postIdToDelete}
        setDeleteDialog={setDeleteDialog}
        openDeleteDialog={openDeleteDialog}
      />

      <ToastContainer />
    </div>
  );
};

export default NewsFeedSection;
