// app/register/success/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function RegistrationSuccess() {
  const url = process.env.NEXT_PUBLIC_API_URL
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('temp_email') : '';

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    
    try {
      const response = await fetch(`${url}/resend-verification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: storedEmail }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend email');
      }

      setResendMessage('Verification email resent successfully!');
    } catch (err) {
      setResendMessage(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Registration Successful!</h1>
        <p className="mb-4">
          Confirmation email sent to {storedEmail}. Please check your inbox and spam folders.
        </p>
        
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="text-blue-600 hover:text-blue-500 disabled:opacity-50"
        >
          {resendLoading ? 'Sending...' : 'Resend Email'}
        </button>
        
        {resendMessage && (
          <p className={`mt-2 text-sm ${
            resendMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}>
            {resendMessage}
          </p>
        )}

        <div className="mt-6">
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}