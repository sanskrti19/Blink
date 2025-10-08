import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- useNavigate is imported, now declare it
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../utils/firebase'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); // <--- DECLARATION: Initialize the hook here

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success: Redirect to the main app view
      navigate('/home'); // Changed to /home as per your Router setup
    } catch (firebaseError) {
      console.error(firebaseError.message);
      setError("Login failed. Please check your email and password or sign up.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-100">
        
        {/* UI HEADER/LOGO */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-gray-800">
             <span className="text-indigo-600">B</span>LINK
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Sign in to your BLINK account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Need an account? 
            <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer ml-1">
              Sign up here
            </span>
          </p>
        </div>
        {/* END UI HEADER/LOGO */}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* EMAIL INPUT FIELD */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD INPUT FIELD */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* END INPUT FIELDS */}

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <p className="text-sm text-red-600 font-medium text-center">{error}</p>
          )}

          {/* SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Sign in
            </button>
          </div>
        </form>
        
        {/* Optional: Divider and Google Sign-in */}
        <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
        </div>
        <div>
            <button
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
            >
              <span className="text-xl mr-2">G</span> 
              Sign in with Google
            </button>
        </div>

      </div>
    </div>
  );
};

export default Login;