import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

interface CardProps {
  cardId: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ cardId, content }) => {
  return (
    <Draggable draggableId={cardId} index={0}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg p-3 mb-2 shadow transition-all cursor-grab ${
            snapshot.isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'
          }`}
        >
          <h4 className="font-medium">{content}</h4>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
