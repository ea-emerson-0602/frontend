// app/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const url = process.env.NEXT_PUBLIC_API_URL
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${url}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,  // or email depending on your setup
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store tokens and redirect
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        router.push('/expenses');
      } else {
        // Handle specific error messages
        const errorMessage = data.detail || 'Login failed, verify your account and login';
        if (errorMessage.toLowerCase().includes('not verified')) {
          setError('Please verify your email before logging in');
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
    <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
    
    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
    >
      Sign in
    </button>

    <div className="flex justify-between text-sm">
      <Link 
        href="/register" 
        className="text-blue-600 hover:text-blue-500"
      >
        Create Account
      </Link>
      <Link 
        href="/reset-password" 
        className="text-blue-600 hover:text-blue-500"
      >
        Forgot Password?
      </Link>
    </div>
  </form>
</div> );
}