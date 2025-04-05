// app/confirm-email/[uidb64]/[token]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EmailConfirmation() {
  const url = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter();
  const params = useParams();
  const [message, setMessage] = useState('Verifying email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { uidb64, token } = params;
        
        if (!uidb64 || !token) {
          throw new Error('Invalid verification link');
        }

        const response = await fetch(
          `${url}/verify-email/${uidb64}/${token}/`
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Email verification failed');
        }

        setMessage('Email successfully verified! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Error</h1>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => router.push('/register')}
              className="mt-4 text-blue-600 hover:text-blue-500"
            >
              Try registering again
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">{message}</h1>
            {!message.includes('successfully') && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}