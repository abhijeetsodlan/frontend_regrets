import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        {/* Privacy Policy Content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>

          <div className="text-gray-700 space-y-4">
            <p>
              Welcome to Regrets.in. Your privacy is important to us. This
              Privacy Policy explains how we collect, use, and protect your
              information when you use our website.
            </p>

            <section>
              <h2 className="text-xl font-semibold mt-6 mb-2">
                1. Information We Collect
              </h2>
              <p>We collect the following types of information:</p>
            </section>

            <section>
              <h3 className="text-lg font-medium mt-4 mb-2">
                1. Personal Information
              </h3>
              <p>
                When you sign up using Google Login, we collect your name and
                email address as provided by Google.
              </p>
              <p>
                We take reasonable steps to protect your personal information
                from unauthorized access or misuse. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <p className="mt-6">
                If you have any questions about this Privacy Policy, please
                contact us at:{' '}
                <a
                  href="mailto:abhijeetsodlan7@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  abhijeetsodlan7@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;