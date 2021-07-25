import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/store';

export interface RouterState {
  redirectPath: string;
}

const initialState: RouterState = {
  redirectPath: '',
};

export const routerSlice = createSlice({
  name: 'router',
  initialState: initialState,
  reducers: {
    redirectTo: (state, action: PayloadAction<string>) => {
      state.redirectPath = action.payload;
    },
  },
});

export const selectRedirectPath = (state: RootState) =>
  state.router.redirectPath;

export default routerSlice.reducer;
