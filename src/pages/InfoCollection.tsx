import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase/supabaseClient";
import { useState } from "react";

import Logo from "../assets/logo/Buzzz-Logo.jpg";

// GraphQL mutation to store user info
const ADD_USER_INFO = gql`
  mutation AddUserInfo(
    $username: String!
    $quote: String
    $profilePicUrl: String
  ) {
    insert_users_info(
      objects: {
        username: $username
        quote: $quote
        profile_pic_url: $profilePicUrl
      }
    ) {
      returning {
        username
        quote
        profile_pic_url
      }
    }
  }
`;

const InfoCollection = () => {
  const navigate = useNavigate();

  const [quote, setQuote] = useState("");
  const [username, setUsername] = useState("@");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [addUserInfo] = useMutation(ADD_USER_INFO);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicUrl = "";

      if (profilePic) {
        // Upload the profile picture to Supabase storage
        const { data, error } = await supabase.storage
          .from("profile-pictures")
          .upload(`profiles/${username}-${profilePic.name}`, profilePic);

        if (error) throw new Error(error.message);

        // Get the public URL of the uploaded image
        const { publicURL } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(`profiles/${username}-${profilePic.name}`);

        profilePicUrl = publicURL;
      }

      // Call the mutation to insert the user information into the database
      const { data } = await addUserInfo({
        variables: {
          username,
          quote,
          profilePicUrl,
        },
      });

      console.log("User Info added:", data);

      // Navigate on success
      navigate("/login");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1a1a1a]">
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
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* Information Collection Title */}
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Fill out your information
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          {/* Profile Pic */}
          <div className="flex flex-col items-center mb-4">
            <label
              htmlFor="profilePic"
              className="block w-24 h-24 rounded-full bg-[#3B364C] flex justify-center items-center text-white cursor-pointer relative"
              style={{
                backgroundImage: profilePicPreview
                  ? `url(${profilePicPreview})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!profilePicPreview && <span>Upload</span>}
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
            <p className="text-sm text-gray-400 mt-2">Profile Picture</p>
          </div>

          {/* Username Input */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-white mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="@"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Quote Input */}
          <div className="flex flex-col">
            <label htmlFor="quote" className="text-white mb-2">
              Quote
            </label>
            <input
              type="text"
              id="quote"
              placeholder="Write one of your quotes or thoughts"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#9281BD] text-white rounded flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfoCollection;
