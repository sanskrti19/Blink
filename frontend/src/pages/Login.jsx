import { useRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleAuth = async () => {
    setErrorMessage(""); // reset previous errors

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current?.value || "";

    if (!email || !password || (!isSignInForm && !name)) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      if (isSignInForm) {
        // 🔹 Sign In
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/"); // redirect after login
      } else {
        // 🔹 Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // update profile
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        navigate("/"); // redirect after signup
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const toggleForm = () => {
    setSignInForm(!isSignInForm);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {isSignInForm ? "Welcome Back 👋" : "Create an Account ✨"}
        </h1>

        {!isSignInForm && (
          <input
            ref={nameRef}
            type="text"
            placeholder="Full Name"
            className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        )}

        <input
          ref={emailRef}
          type="email"
          placeholder="Email Address"
          className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="p-3 w-full mb-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {errorMessage && (
          <p className="text-red-600 text-sm font-medium mb-3">{errorMessage}</p>
        )}

        <button
          onClick={handleAuth}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p
          onClick={toggleForm}
          className="text-sm text-center mt-4 text-gray-600 cursor-pointer hover:text-indigo-600 transition-all"
        >
          {isSignInForm
            ? "New here? Create an account"
            : "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
