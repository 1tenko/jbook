import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { cellActionCreators } from '../state/features/cellsSlice';

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(cellActionCreators, dispatch);
};
