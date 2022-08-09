import { bindActionCreators } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { cellActionCreators } from '../state/features/cellsSlice';

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(cellActionCreators, dispatch);
  }, [dispatch]);
};
