import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Trello Clone
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A collaborative project management tool inspired by Trello
          </p>
          <div className="space-x-4">
            <Link
              href="/(auth)/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/(auth)/register"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
