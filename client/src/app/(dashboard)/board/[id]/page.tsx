import React from 'react';
import Board from '@/components/board/Board';

interface BoardPageProps {
  params: {
    id: string;
  };
}

const BoardPage: React.FC<BoardPageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Board: {params.id}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Board boardId={params.id} />
      </main>
    </div>
  );
};

export default BoardPage;
