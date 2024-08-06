import { createSlice } from '@reduxjs/toolkit';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

const initialState = {
  loading: false,
  operator: [],
  notifications: 0,
  notificationList: [],
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOperatorList: (state, action) => {
      state.operator = action.payload;
    },
    setUserNotificationCount: (state, action) => {
      state.notifications = action.payload;
    },
    setNotificationList: (state, action) => {
      state.notificationList = action.payload;
    },
  },
});

export const {
  setOperatorList,
  setUserNotificationCount,
  setNotificationList,
} = UserSlice.actions;

export const getOperatorList = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post('/users/all-users');
    if (response.status === 200) {
      const users = response.status === 200 ? response.data : [];
      dispatch(setOperatorList(users));
    }
  } catch (err: any) {
    dispatch(setOperatorList([]));
    console.log(err);
  }
};

export const getUserNotifications = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post('/conversation/notification/count/');
    if (response.status === 201) {
      const notification = response.status === 201 ? response?.data : 0;
      dispatch(setUserNotificationCount(notification));
    }
  } catch (err: any) {
    dispatch(setOperatorList([]));
    console.log(err);
  }
};

export default UserSlice.reducer;
