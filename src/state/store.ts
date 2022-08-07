import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/cellsReducer';

export const store = configureStore({
  reducer: reducers,
});
