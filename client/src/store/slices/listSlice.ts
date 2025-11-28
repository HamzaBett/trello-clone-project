import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cardIds: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListState {
  lists: List[];
}

const initialState: ListState = {
  lists: [],
};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
    },
    moveList: (state, action: PayloadAction<{ id: string; newPosition: number }>) => {
      const listToMove = state.lists.find(list => list.id === action.payload.id);
      if (!listToMove) return;

      const currentIndex = state.lists.indexOf(listToMove);
      state.lists.splice(currentIndex, 1);
      state.lists.splice(action.payload.newPosition, 0, listToMove);

      // Update positions
      state.lists.forEach((list, index) => {
        list.position = index;
      });
    },
  },
});

export const { setLists, addList, updateList, deleteList, moveList } = listSlice.actions;

export const selectListsByBoard = (state: RootState, boardId: string): List[] =>
  state.list.lists
    .filter((list: List) => list.boardId === boardId && !list.archived)
    .sort((a: List, b: List) => a.position - b.position);

export default listSlice.reducer;
