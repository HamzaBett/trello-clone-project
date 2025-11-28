'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Navigation</h2>
        <nav className="space-y-2">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/(dashboard)/boards"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Your Boards
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
