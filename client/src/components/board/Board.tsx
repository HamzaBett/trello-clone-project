import React from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import List from './List';

interface BoardProps {
  boardId: string;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
  const onDragEnd = (result: DropResult) => {
    // Handle drag and drop logic here
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={boardId} type="LIST" direction="horizontal">
        {(provided) => (
          <div
            className="flex gap-4 p-4 overflow-x-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Lists will be rendered here */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
