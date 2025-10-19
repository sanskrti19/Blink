import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_ILLUSTATION } from "../utils/constant";

const API_BASE_URL = "http://localhost:5000/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setErrorMessage("Success! Logging you in...");
        setTimeout(() => navigate("/home"), 500);
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Network error: Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white animate-gradient-x bg-[length:300%_300%]">
      {/* Left Illustration Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center rounded-2xl">
        <img
          src={LOGIN_ILLUSTATION}
          alt="B-link Illustration"
          className="w-3/4 max-w-md drop-shadow-2xl rounded-b-full animate-float rounded-t-full"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-green-100">
          <h1 className="text-3xl font-extrabold text-center text-green-700 mb-2">
            Hey there!
          </h1>
          <h2 className="text-2xl font-bold text-center text-green-600 mb-1 relative">
            Welcome back to{" "}
            <span className="relative text-emerald-600">
              B-link
              <span className="absolute inset-0 blur-sm bg-emerald-400 opacity-30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-6 italic">
            Connect. Create. Collaborate.
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-full mb-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition-all"
              disabled={isLoading}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 w-full mb-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition-all"
              disabled={isLoading}
              required
            />

            {errorMessage && (
              <p
                className={`text-sm font-medium mb-3 ${
                  errorMessage.startsWith("Success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition-transform ${
                isLoading
                  ? "bg-green-400 cursor-not-allowed flex justify-center items-center"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.03] shadow-lg hover:shadow-emerald-200"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 
                    0 5.373 0 12h4zm2 5.291A7.962 7.962 
                    0 014 12H0c0 3.042 1.135 5.824 3 
                    7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p
            onClick={() => navigate("/signup")}
            className="text-sm text-center mt-4 text-gray-600 cursor-pointer hover:text-green-600 transition-all"
          >
            Don’t have an account?{" "}
            <span className="font-semibold text-green-700 hover:underline">
              Join the fun
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
