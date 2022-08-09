import {
  AnyAction,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import { bundle } from '../../bundler';
import { store } from '../store';

export const createBundle = (cellId: string, input: string) => {
  const thunk = async (dispatch: Dispatch<AnyAction>) => {
    dispatch(bundleActionCreators.bundleStart({ cellId }));

    const result = await bundle(input);

    dispatch(
      bundleActionCreators.bundleComplete({
        cellId,
        bundle: { code: result.code, err: result.err },
      })
    );
  };
  // @ts-ignore
  store.dispatch(thunk);
};

interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: BundlesState = {};

export const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,

  reducers: {
    bundleStart: (state, action: PayloadAction<{ cellId: string }>) => {
      state[action.payload.cellId] = {
        loading: true,
        code: '',
        err: '',
      };
    },
    bundleComplete: (
      state,
      action: PayloadAction<{
        cellId: string;
        bundle: {
          code: string;
          err: string;
        };
      }>
    ) => {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        err: action.payload.bundle.err,
      };
    },
  },
});

export const bundleActionCreators = bundlesSlice.actions;

export default bundlesSlice.reducer;
