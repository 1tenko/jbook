import { configureStore } from '@reduxjs/toolkit';
// import { applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';

import cellsReducer from './features/cellsSlice';
import bundlesReducer from './features/bundlesSlice';
// import { cellActionCreators } from './features/cellsSlice';

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundles: bundlesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// testing
// store.dispatch({
//   type: actionCreators.insertCellAfter,
//   payload: {
//     id: null,
//     type: 'code',
//   },
// });

// store.dispatch({
//   type: actionCreators.insertCellAfter,
//   payload: {
//     id: null,
//     type: 'text',
//   },
// });

// store.dispatch({
//   type: actionCreators.insertCellAfter,
//   payload: {
//     id: null,
//     type: 'code',
//   },
// });

// store.dispatch({
//   type: actionCreators.insertCellAfter,
//   payload: {
//     id: null,
//     type: 'text',
//   },
// });

// const id = store.getState().cells.order[0];

// console.log(store.getState());
// console.log(id);
