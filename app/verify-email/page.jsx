'use client';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const [token, setToken] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);

  // Check if the email was already verified in this session
  useEffect(() => {
    if (sessionStorage.getItem('email_verified') === 'true') {
      setIsAlreadyVerified(true);
      setStatus('Email already verified in this session.');
      return;
    }

    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      setToken(urlToken);
    //   console.log('Token found:', urlToken);
    } else {
      setStatus('Invalid or missing token.');
    }

    return () => {
      setToken('');
      setStatus('');
      setAgreed(false);
    };
  }, []);

  const handleVerify = async () => {
    if (!agreed || !token) {
      console.log('Verification skipped: checkbox unchecked or missing token');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch(`/api/verify-email?token=${token}`);
      const data = await res.json();

      if (res.ok && data.message === 'Email verified. Credentials sent.') {
        // Mark session as verified
        sessionStorage.setItem('email_verified', 'true');
        setStatus('Verification successful! Redirecting to Infrapulse...');

        // Clear the token to prevent re-use
        setToken('');
        setTimeout(() => {
          window.location.href = 'https://infrapulse.net/';
        }, 3000);
      } else {
        setStatus(`${data.message || 'Verification failed.'}`);
      }
    } catch (err) {
      console.error('Error during verification:', err);
      setStatus('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white border-2 border-gray-700 shadow-lg rounded-lg max-w-md w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h2>

        {status && (
          <p
            className={`mb-4 font-medium text-sm ${
              status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}

        {!status.startsWith('✅') && !isAlreadyVerified && (
          <>
            <p className="text-gray-600 mb-4">Please confirm to verify your email.</p>

            <label className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              I confirm to verify my email.
            </label>

            <button
              onClick={handleVerify}
              disabled={!agreed || loading}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-all ${
                !agreed || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
