import { createSlice } from '@reduxjs/toolkit';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

const initialState = {
  did: [] as any[],
};

export const DidSlice = createSlice({
  name: 'did',
  initialState,
  reducers: {
    setDidList: (state, action) => {
      state.did = action.payload;
    },
  },
});

export const { setDidList } = DidSlice.actions;

export const fetchDids =
  (status: string, userId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(`/did/user/${userId}?status=${status}`);
      const didList = response.status === 200 ? response.data.data : [];
      dispatch(setDidList(didList));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default DidSlice.reducer;
