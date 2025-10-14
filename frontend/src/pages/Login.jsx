import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Tailwind styling will go into your JSX/CSS

const API_URL = import.meta.env.VITE_API_BASE_URL; // Get the backend base URL

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // A & B Steps: Send Request, Receive Token, Store Token, Redirect
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Send Request
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (response.ok) {
                // 2. Receive Token & 3. Store Token
                localStorage.setItem('authToken', data.token); 
                
                // 4. Redirect
                navigate('/home'); 
            } else {
                // Handle authentication failure from the backend
                setError(data.msg || 'Login failed. Please check your credentials.');
            }

        } catch (err) {
            // Handle network or other errors
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="login-container">
            {/* Tailwind CSS styled form */}
            <form onSubmit={handleLogin}>
                <h2>Log In</h2>
                {error && <p className="text-red-500">{error}</p>}
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;