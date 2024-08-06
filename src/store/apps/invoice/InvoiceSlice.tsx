import { createSlice } from '@reduxjs/toolkit';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

const initialState = {
  invoiceId: null,
  loading: false,
};

export const InvoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoiceId: (state, action) => {
      state.invoiceId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addInvoice: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setInvoiceId, setLoading, addInvoice } = InvoiceSlice.actions;

export const SetInvoiceId = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setInvoiceId(id));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const sendInvoice = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
        bodyParser: false,
      },
    };
    const response = await axios.post(
      `/conversation-group/send-message`,
      data,
      header,
    );
    if (response.status === 201) {
      dispatch(setLoading(false));
    }
    return response.data;
  } catch (err: any) {
    dispatch(setLoading(false));
    throw new Error(err);
  }
};

export const createInvoice = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`/invoice`, data);
    if (response.status === 201) {
      dispatch(setLoading(false));
    }
    return response.data;
  } catch (err: any) {
    dispatch(setLoading(false));
    throw new Error(err);
  }
};

export default InvoiceSlice.reducer;
