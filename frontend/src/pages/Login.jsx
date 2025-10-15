import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Assuming API URL is in your environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Send POST request to login API
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (response.ok) {
                // Store the token in local storage
                localStorage.setItem('authToken', data.token); 
                
                // Redirect to home page
                navigate('/home'); 
            } else {
                // Display error message if authentication fails
                setError(data.msg || 'Login failed. Please check your credentials.');
            }

        } catch (err) {
            // Handle any unexpected errors
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Log In</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Log In
                    </button>
                </form>
                <div className="text-center mt-4">
                    <a href="/signup" className="text-indigo-600 hover:underline">Don't have an account? Sign up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
