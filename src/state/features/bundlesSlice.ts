import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = true;

export const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,

  reducers: {
    bundleStart: (state, action: PayloadAction<string>) => {},
    bundleComplete: (
      state,
      action: PayloadAction<{
        cellId: string;
        bundle: {
          code: string;
          err: string;
        };
      }>
    ) => {},
  },
});

export const bundleActionCreators = bundlesSlice.actions;

export default bundlesSlice.reducer;
