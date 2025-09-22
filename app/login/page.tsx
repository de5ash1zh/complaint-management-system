'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Authentication Disabled</h1>
        <p className="text-gray-600 mt-2">
          Login is not required. Use the links below to navigate.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <Link href="/" className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700">
            Go to Home
          </Link>
          <Link href="/admin" className="w-full py-2 px-4 rounded-md font-medium bg-gray-100 hover:bg-gray-200 text-gray-900">
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
