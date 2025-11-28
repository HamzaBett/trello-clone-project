import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Board {
  id: string;
  title: string;
  description?: string;
  background?: string;
  ownerId: string;
  memberIds: Array<{ userId: string; role: 'owner' | 'editor' | 'viewer' }>;
  createdAt: string;
  updatedAt: string;
}

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      if (state.currentBoard && state.currentBoard.id === action.payload.id) {
        state.currentBoard = action.payload;
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
      if (state.currentBoard && state.currentBoard.id === action.payload) {
        state.currentBoard = null;
      }
    },
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
  },
});

export const { setBoards, addBoard, updateBoard, deleteBoard, setCurrentBoard } = boardSlice.actions;

export const selectBoards = (state: RootState) => state.board.boards;
export const selectCurrentBoard = (state: RootState) => state.board.currentBoard;

export default boardSlice.reducer;
