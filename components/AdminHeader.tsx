'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 hidden sm:inline">{session?.user?.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
      >
        Logout
      </button>
      <Link href="/" className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">
        Submit Complaint
      </Link>
    </div>
  );
}
