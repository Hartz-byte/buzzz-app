import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import axios from "axios";

import Logo from "../assets/logo/Buzzz-Logo.jpg";
import { SIGNUP_MUTATION, GET_ALL_USERNAMES } from "../graphql/graphql";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [signupMutation] = useMutation(SIGNUP_MUTATION);
  const {
    data,
    loading: usernamesLoading,
    error: usernamesError,
  } = useQuery(GET_ALL_USERNAMES);

  // Cloudinary image upload function
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

  // Function to handle sign-up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the username is unique (simulating with a mock API call)
    setUsernameError("");
    setLoading(true);
    setError("");

    try {
      const isUsernameUnique = await checkUsernameUniqueness(username);
      if (!isUsernameUnique) {
        setUsernameError("Username is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      let profilePictureUrl = "";
      if (profilePicture) {
        profilePictureUrl = await uploadImageToCloudinary(profilePicture);
      }

      const { data } = await signupMutation({
        variables: {
          name,
          email,
          password,
          username,
          profilePicture: profilePictureUrl,
          bio,
        },
      });

      if (data.signup.token) {
        localStorage.setItem("authToken", data.signup.token);
        navigate("/login");
      }
    } catch (err: any) {
      if (err.message === "USERNAME_TAKEN") {
        setUsernameError("The username is already taken.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock function to simulate username uniqueness check
  const checkUsernameUniqueness = (username: string) => {
    if (usernamesLoading || usernamesError) return true;
    const usernames = data?.getAllUsernames || [];
    return !usernames.includes(username);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#1a1a1a]">
      {/* Left Half */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-8 md:py-0">
        <img
          src={Logo}
          alt="Buzzz Logo"
          className="w-48 h-48 md:w-64 md:h-64 object-contain"
        />
      </div>

      {/* Divider */}
      <div
        className="hidden md:block w-0.5 bg-[#222423]"
        style={{ height: "50vh", alignSelf: "center" }}
      />

      {/* Right Half */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
        <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Sign Up
          </h2>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => document.getElementById("profilePicture")?.click()}
            >
              {profilePicture ? (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white">Profile Picture</span>
              )}
            </div>
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            />
          </div>

          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-white mb-2">
              Password
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-2 top-10 cursor-pointer text-white"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <span className="material-icons">
                {isPasswordVisible ? "visibility" : "visibility_off"}
              </span>
            </span>
          </div>

          {/* Username Input */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-white mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Bio Input */}
          <div className="flex flex-col">
            <label htmlFor="bio" className="text-white mb-2">
              Bio (Optional)
            </label>
            <input
              type="text"
              id="bio"
              placeholder="Your bio"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {usernameError && (
            <p className="text-red-500 mb-4 text-center">{usernameError}</p>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#9281BD] text-white rounded flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Log In Link */}
          <p className="mt-4 text-sm text-white text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#9281BD]">
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
