import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_ILLUSTATION } from "../utils/constant";

const API_BASE_URL = "http://localhost:5000/api";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!name || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setErrorMessage("Success! Redirecting to home...");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setErrorMessage(data.details || data.msg || "Registration failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Network error: Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500">

    
      <div className="hidden md:flex w-1/2 items-center justify-center rounded-2xl
                      bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950
                      transition-colors duration-500">
        <img
          src={LOGIN_ILLUSTATION}
          alt="B-link Illustration"
          className="w-3/4 max-w-md drop-shadow-2xl rounded-full animate-float"
        />
      </div>

      {/* Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center
                      bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] transition-colors duration-500">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border
                        bg-white/90 dark:bg-purple-900/70 backdrop-blur-xl
                        border-purple-200 dark:border-purple-800 transition-all duration-500">
          <h1 className="text-3xl font-extrabold text-center text-purple-700 dark:text-purple-300 mb-2">
            Join B-link
          </h1>
          <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-1 relative">
            Create your account{" "}
            <span className="relative text-purple-600 dark:text-purple-400">
              B-link
              <span className="absolute inset-0 blur-sm bg-purple-400 dark:bg-purple-700 opacity-30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-300 mb-6 italic">
            Connect. Create. Collaborate.
          </p>

          <form onSubmit={handleSignup}>
            <input
              ref={nameRef}
              type="text"
              placeholder="Full Name"
              className="p-3 w-full mb-3 rounded-lg border
                         bg-purple-50 dark:bg-purple-950
                         border-purple-200 dark:border-purple-800
                         text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600
                         outline-none transition-all"
              disabled={isLoading}
              required
            />

            <input
              ref={emailRef}
              type="email"
              placeholder="Email Address"
              className="p-3 w-full mb-3 rounded-lg border
                         bg-purple-50 dark:bg-purple-950
                         border-purple-200 dark:border-purple-800
                         text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600
                         outline-none transition-all"
              disabled={isLoading}
              required
            />

            <input
              ref={passwordRef}
              type=""
              placeholder="Password"
              className="p-3 w-full mb-3 rounded-lg border
                         bg-purple-50 dark:bg-purple-950
                         border-purple-200 dark:border-purple-800
                         text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600
                         outline-none transition-all"
              disabled={isLoading}
              required
            />

            {errorMessage && (
              <p className={`text-sm font-medium mb-3
                             ${errorMessage.startsWith("Success")
                               ? "text-green-600 dark:text-green-400"
                               : "text-red-600 dark:text-red-400"}`}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition-transform
                          ${isLoading
                            ? "bg-purple-400 dark:bg-purple-700 cursor-not-allowed flex justify-center items-center"
                            : "bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 hover:scale-[1.03] shadow-lg hover:shadow-indigo-200 dark:hover:shadow-purple-900"
                          }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p
            onClick={() => navigate("/login")}
            className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Already have an account?{" "}
            <span className="font-semibold text-purple-700 dark:text-purple-300 hover:underline">
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
