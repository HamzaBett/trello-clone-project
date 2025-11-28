import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  position: number;
  labels: Array<{ name: string; color: string }>;
  dueDate?: string;
  assignedMembers: string[];
  attachments: string[];
  checklists: Array<{
    id: string;
    title: string;
    items: Array<{ id: string; text: string; completed: boolean }>;
  }>;
  comments: Array<{
    id: string;
    text: string;
    authorId: string;
    createdAt: string;
  }>;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CardState {
  cards: Card[];
}

const initialState: CardState = {
  cards: [],
};

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
    },
    addCard: (state, action: PayloadAction<Card>) => {
      state.cards.push(action.payload);
    },
    updateCard: (state, action: PayloadAction<Card>) => {
      const index = state.cards.findIndex(card => card.id === action.payload.id);
      if (index !== -1) {
        state.cards[index] = action.payload;
      }
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter(card => card.id !== action.payload);
    },
    moveCard: (state, action: PayloadAction<{ id: string; newListId: string; newPosition: number }>) => {
      const cardToMove = state.cards.find(card => card.id === action.payload.id);
      if (!cardToMove) return;

      // Remove from current list
      cardToMove.listId = action.payload.newListId;
      cardToMove.position = action.payload.newPosition;

      // Update positions in both lists
      const cardsInNewList = state.cards.filter(card => card.listId === action.payload.newListId);
      cardsInNewList.sort((a, b) => a.position - b.position);
      cardsInNewList.forEach((card, index) => {
        card.position = index;
      });
    },
  },
});

export const { setCards, addCard, updateCard, deleteCard, moveCard } = cardSlice.actions;

export const selectCardsByList = (state: RootState, listId: string): Card[] =>
  state.card.cards
    .filter((card: Card) => card.listId === listId && !card.archived)
    .sort((a: Card, b: Card) => a.position - b.position);

export default cardSlice.reducer;
