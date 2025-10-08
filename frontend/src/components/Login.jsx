import React, { useState } from 'react';
import Header from './Header';
import { BGIMG, PROFILEURL } from '../utils/constant';

const Login = () => {
  // State to track form mode (sign-in vs sign-up), input fields, and error message
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle the form submission
  const handleButtonClick = (e) => {
    e.preventDefault();
    // Add form validation and handle API requests here
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    // Simulate API call for sign in or sign up
    console.log('Form submitted:', { email, name, password });
    setErrorMessage('');
  };

  // Toggle between SignIn and SignUp forms
  const toggleSigninForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage('');
  };

  return (
    <div>
      <Header />
      <div>
        <img
          className="absolute"
          src="https://img.freepik.com/free-vector/detailed-hand-painted-pink-watercolour-background_1048-17039.jpg?semt=ais_hybrid&w=740&q=80"
          alt="bg-img"
        />
      </div>

      <form
         
        className="w-3/2 relative p-12 bg-black ">
      
        

        <input
          type="email"
          placeholder="Email Address"
          className="p-3 w-full bg-gray-800 rounded"></input>
          
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 w-full bg-gray-800 rounded"
             
          />
        

        <input
          type="password"
          placeholder="Password"
          className="p-3 w-full bg-gray-800 rounded"
           
        />

 
        <button
          className="p-3 bg-red-700 w-full hover:bg-red-600 transition"
         
        >
           
        </button>

        
      </form>
    </div>
  );
};

export default Login;
