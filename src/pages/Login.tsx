import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo/Buzzz-Logo.jpg";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {};

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1a1a1a]">
      {/* Left Half */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
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

      {/* Right Half - Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-8 md:py-0">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          {/* Login Title */}
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Login
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={`block w-full p-2 rounded ${
                focusedField === "email"
                  ? "border-2 border-[#9281BD]"
                  : "border-none"
              } bg-[#3B364C] text-white`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
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
              className={`block w-full p-2 rounded ${
                focusedField === "password"
                  ? "border-2 border-[#9281BD]"
                  : "border-none"
              } bg-[#3B364C] text-white`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 rounded bg-[#6E54B5] text-white hover:bg-[#5A4793]"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <p className="mt-4 text-sm text-white text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#9281BD]">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
