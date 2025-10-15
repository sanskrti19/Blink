import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
 
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

 

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current?.value || "";

    if (!email || !password || !name) {
      setErrorMessage("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
       
      const signupEndpoint = `${API_BASE_URL}/auth/register`;
      
       
      console.log("Attempting POST to:", signupEndpoint); 

      const response = await fetch(signupEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Successful signup/login
        const token = data.token;
        localStorage.setItem('authToken', token);
        
        // Success message for user
        setErrorMessage("Success! Redirecting to home...");
        
        // Navigate after a short delay for user to see the success message
        setTimeout(() => navigate("/home"), 1000); 
        
      } else {
         
        setErrorMessage(data.details || data.msg || "Registration failed. Please try again.");
      }

    } catch (error) {
 
      console.error("Signup network error:", error);
      setErrorMessage("Network error: Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create an Account ✨
        </h1>
        
        <form onSubmit={handleSignup}>
          
          <input
            ref={nameRef}
            type="text"
            placeholder="Full Name"
            className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={isLoading}
            required
          />

          <input
            ref={emailRef}
            type="email"
            placeholder="Email Address"
            className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={isLoading}
            required
          />

          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
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
              : "Sign Up"}
          </button>
        </form>

        <p
          onClick={() => navigate('/login')}
          className="text-sm text-center mt-4 text-gray-600 cursor-pointer hover:text-indigo-600 transition-all"
        >
          Already have an account? Log in
        </p>
      </div>
    </div>
  );
};

export default Signup;
