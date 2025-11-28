import React from 'react';
import Board from '@/components/board/Board';

const BoardsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock boards */}
          <div 
            key="board-1"
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer aspect-video flex items-center justify-center"
          >
            <span className="text-xl font-semibold text-gray-700">Project Alpha</span>
          </div>
          <div 
            key="board-2"
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer aspect-video flex items-center justify-center"
          >
            <span className="text-xl font-semibold text-gray-700">Marketing Campaign</span>
          </div>
          <div 
            key="board-3"
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer aspect-video flex items-center justify-center"
          >
            <span className="text-xl font-semibold text-gray-700">Product Roadmap</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardsPage;
