import React from 'react';
import { Droppable, Draggable, DraggingStyle, NotDraggingStyle } from '@hello-pangea/dnd';
import Card from './Card';

interface ListProps {
  listId: string;
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? '#e6eaf0' : '#f4f5f7',
  borderRadius: '8px',
  padding: '8px',
  minHeight: '100px',
});

const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): React.CSSProperties => ({
  userSelect: 'none',
  margin: `0 0 8px 0`,
  padding: '8px',
  background: isDragging ? '#fff' : '#fff',
  borderRadius: '8px',
  border: '1px solid #dfe3e8',
  boxShadow: isDragging ? '0 5px 10px rgba(0,0,0,0.1)' : 'none',
  ...draggableStyle,
});

const List: React.FC<ListProps> = ({ listId }) => {
  // Mock cards for demonstration
  const cards = [
    { id: 'card-1', content: 'Take out the garbage' },
    { id: 'card-2', content: 'Watch my favorite show' },
    { id: 'card-3', content: 'Charge my phone' },
    { id: 'card-4', content: 'Cook dinner' },
  ];

  return (
    <Droppable droppableId={listId}>
      {(provided, snapshot) => (
        <div
          className="bg-gray-100 rounded-lg p-2 min-w-80"
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          <h3 className="font-semibold mb-2">List Title</h3>
          {cards.map((card, index) => (
            <Draggable key={card.id} draggableId={card.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  <Card cardId={card.id} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default List;
