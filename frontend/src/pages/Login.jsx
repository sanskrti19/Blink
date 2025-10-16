import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:5000/api"; 

const Login = () => {
 const [email, setEmail] = useState(''); 
 const [password, setPassword] = useState(''); 
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
      const loginEndpoint = `${API_BASE_URL}/auth/login`;
      
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), 
      });

      // Attempt to parse JSON. If the server crashes and sends HTML, the catch block handles the SyntaxError.
      const data = await response.json(); 

      if (response.ok) {
        const token = data.token;
        // 🚨 CRITICAL: Use the consistent key 'token'
        localStorage.setItem('token', token); 
        
        setErrorMessage("Success! Logging you in...");
          
        setTimeout(() => navigate("/home"), 500); 
        
      } else {
        // Use data.message (from controller) if available, otherwise generic failure
        setErrorMessage(data.message || "Login failed. Invalid credentials or server response.");
      }

    } catch (error) {
        
      console.error("Login network error:", error);
      // Informative error message for network issues or JSON parsing failures (HTML response)
      setErrorMessage("Network error: Could not connect to the server or received invalid data. Please check the backend console for crashes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h1>
        
        <form onSubmit={handleLogin}>
          
          <input
            type="email"
            placeholder="Email Address"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={isLoading}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={isLoading}
            required
          />

          {errorMessage && (
            <p className={`text-sm font-medium mb-3 ${errorMessage.startsWith('Success') ? 'text-green-600' : 'text-red-600'}`}>
                {errorMessage}
            </p>
          )}

          <button
            type="submit" 
            className={`w-full py-3 text-white rounded-lg font-semibold transition-all ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed flex justify-center items-center' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={isLoading}
          >
            {isLoading 
              ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )
              : "Log In"}
          </button>
        </form>

        <p
          onClick={() => navigate('/signup')}
          className="text-sm text-center mt-4 text-gray-600 cursor-pointer hover:text-indigo-600 transition-all"
        >
          Don't have an account? Sign up
        </p>
      </div>
    </div>
  );
};

export default Login;