import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import Logo from "../assets/logo/Buzzz-Logo.jpg";

// GraphQL mutation for sign-up
const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      message
    }
  }
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  // function to handle sign-up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await signupMutation({
        variables: {
          name,
          email,
          password,
        },
      });

      if (data.signup.token) {
        localStorage.setItem("authToken", data.signup.token);
        navigate("/login");

        console.log("User signed up and profile created.");
      }
    } catch (err) {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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
          <div className="flex flex-col">
            <label htmlFor="password" className="text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="block w-full p-2 rounded bg-[#3B364C] text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#9281BD] text-white rounded flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
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
