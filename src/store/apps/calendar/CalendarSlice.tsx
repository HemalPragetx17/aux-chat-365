import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

interface StateType {
  event: any[];
  emailList: any[];
  refresh: boolean;
  selectedCalendar: any;
  loading: boolean;
  filter: any;
}

const initialState = {
  event: [],
  emailList: [],
  refresh: false,
  selectedCalendar: null as any,
  loading: false,
  filter: { type: 'ALL', owner: 'ALL', assigned: false },
};

export const CalendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setLoading: (state: StateType, action) => {
      state.loading = action.payload;
    },
    selectEmail: (state: StateType, action) => {
      state.selectedCalendar = action.payload;
    },
    setEvent: (state: StateType, action) => {
      state.event = action.payload;
    },
    setRefresh: (state: StateType, action) => {
      state.refresh = action.payload;
    },
    setEmailList: (state: StateType, action) => {
      state.emailList = action.payload;
    },
    setFilterType: (state: StateType, action) => {
      state.filter = action.payload;
    },
    updateEventList: (state: StateType, action) => {
      const event = { ...action.payload };
      const { when } = event;
      when.startTime = when.start_time || when.startTime;
      when.endTime = when.end_time || when.startTime;
      when.startTimezone = when.start_timezone || when.startTimezone;
      when.endTimezone = when.end_timezone || when.endTimezone;
      if (event.calendar_id === state.selectedCalendar?.calendarId) {
        const index = state.event.findIndex(
          (event) => event.id === action.payload.id,
        );
        const list = [...state.event];
        if (index === -1) {
          list.push(event);
        } else {
          list[index] = { ...event };
        }
        state.event = list;
      }
    },
    deleteEvent: (state: StateType, action) => {
      if (action.payload.calendar_id === state.selectedCalendar?.calendarId) {
        const index = state.event.findIndex(
          (event) => event.id === action.payload.id,
        );
        if (index > -1) {
          const list = [...state.event];
          list.splice(index, 1);
          state.event = list;
        }
      }
    },
  },
});

export const {
  setEvent,
  setEmailList,
  selectEmail,
  setLoading,
  updateEventList,
  deleteEvent,
  setFilterType,
  setRefresh,
} = CalendarSlice.actions;

export const fetchCalendarEvents =
  (params: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/email-nylas/fetch-calendar-event/`,
        params,
      );
      if (response.status === 201) {
        dispatch(setLoading(false));
        await dispatch(
          setFilterType({ type: 'ALL', owner: 'ALL', assigned: false }),
        );
        await dispatch(setEvent(response?.data?.data));
        return response.data;
      }
      dispatch(setLoading(false));
      return [];
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const createCalendarEvents =
  (grantId: string, calendarId: string, params: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/email-nylas/create-calendar-event/${grantId}/${calendarId}`,
        params,
      );
      if (response.status === 201) {
        toast.success('Event Created!');
        dispatch(setLoading(false));
        dispatch(setRefresh(true));
        return response.data;
      }
      dispatch(setLoading(false));
      return [];
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const updateCalendarEvents =
  (grantId: string, calendarId: string, eventId: string, params: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/email-nylas/update-calendar-event/${grantId}/${calendarId}/${eventId}`,
        params,
      );
      if (response.status === 201) {
        toast.success('Event Updated!');
        dispatch(setLoading(false));
        dispatch(setRefresh(true));
        return response.data;
      }
      dispatch(setLoading(false));
      return [];
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const deleteCalendarEvents =
  (grantId: string, calendarId: string, eventId: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/email-nylas/delete-calendar-event/${grantId}/${calendarId}/${eventId}`,
      );
      if (response.status === 201) {
        toast.success('Event Deleted!');
        dispatch(setLoading(false));
        dispatch(setRefresh(true));
        return response.data;
      }
      dispatch(setLoading(false));
      return [];
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export default CalendarSlice.reducer;
