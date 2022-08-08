import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
export type CellTypes = 'code' | 'text';

export type Direction = 'up' | 'down';

export const cellsSlice = createSlice({
  name: 'cells',
  initialState,

  reducers: {
    updateCell: (
      state,
      action: PayloadAction<{
        id: string;
        content: string;
      }>
    ) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },

    deleteCell: (state, action: PayloadAction<string>) => {
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
    },

    moveCell: (
      state,
      action: PayloadAction<{
        id: string;
        direction: Direction;
      }>
    ) => {
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
    },

    insertCellBefore: (
      state,
      action: PayloadAction<{
        id: string | null;
        type: CellTypes;
      }>
    ) => {
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }
    },
  },
});

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export const actionCreators = cellsSlice.actions;

export default cellsSlice.reducer;
