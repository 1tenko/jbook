import { combineReducers } from '@reduxjs/toolkit';
import cellsReducer from './cellsReducer';

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

export type RootsState = ReturnType<typeof reducers>;
