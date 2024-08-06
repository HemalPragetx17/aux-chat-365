/* eslint-disable react-hooks/exhaustive-deps */
import { Backdrop, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import Calendar from '../../components/apps/calendar/Calendar';
import EventForm from '../../components/apps/calendar/EventForm';
import SidebarLeft from '../../components/apps/calendar/SidebarLeft';
import VirtualEventForm from '../../components/apps/calendar/VirtualEventForm';
import CalendarWrapper from '../../components/container/CalendarWrapper';
import { useAuth } from '../../hooks/useAuth';
import { AppState, dispatch } from '../../store/Store';
import {
  fetchCalendarEvents,
  setLoading,
  setRefresh,
} from '../../store/apps/calendar/CalendarSlice';
import axios from '../../utils/axios';

dayjs.extend(utc);

const AppCalendar = () => {
  const store = useSelector((state: AppState) => state.calendarReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openInternalForm, setOpenInternalForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [calendarTime, setCalendarTime] = useState<any>({});
  const { user } = useAuth();

  useEffect(() => {
    if (
      Boolean(store?.selectedCalendar) &&
      Boolean(calendarTime?.start) &&
      Boolean(calendarTime?.end)
    ) {
      fetchEvents();
    }
  }, [store?.selectedCalendar, calendarTime]);

  useEffect(() => {
    if (store.refresh) {
      dispatch(setRefresh(false));
      setOpenForm(false);
      setOpenInternalForm(false);
    }
  }, [store.refresh]);

  const fetchEvents = async () => {
    setOpenForm(false);
    setOpenInternalForm(false);
    const { grantId, calendarId } = store?.selectedCalendar;
    const param = {
      grantId,
      calendarId,
      start: calendarTime.start,
      end: calendarTime.end,
    };
    dispatch(fetchCalendarEvents(param));
  };

  const handleOnAdd = (data: any) => {
    if (Boolean(store.selectedCalendar)) {
      const { virtual } = store.selectedCalendar;
      console.log(store.selectedCalendar);
      setCurrentData(data);
      virtual ? setOpenInternalForm(true) : setOpenForm(true);
    } else {
      toast.error('Please select a calendar to add and view events!');
    }
  };

  const handleSelectEvent = async (event: any) => {
    const { grantId, calendarId } = store?.selectedCalendar;
    await dispatch(setLoading(true));
    const response = await axios.post(
      `/email-nylas/fetch-event-details/${grantId}/${calendarId}/${event?.id}`,
    );
    const _event = response?.data?.data;
    setCurrentData(_event);
    const { virtual } = store.selectedCalendar;
    await dispatch(setLoading(false));
    virtual ? setOpenInternalForm(true) : setOpenForm(true);
  };

  const handleOnDateChanged = async (dateInfo: any) => {
    setCalendarTime({
      start: dayjs(dateInfo.startStr).unix(),
      end: dayjs(dateInfo.endStr).unix(),
    });
  };

  return (
    <CalendarWrapper
      className="app-calendar"
      sx={{
        borderRadius: 0,
      }}
    >
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={store.loading}
      >
        <CircularProgress color="error" />
      </Backdrop>
      <SidebarLeft calendarApi={calendarApi} handleOnAdd={handleOnAdd} />
      <Box
        sx={{
          flexGrow: 1,
          boxShadow: 'none',
          borderRadius: 0,
          backgroundColor:
            customizer?.activeMode === 'dark' ? '#2C2C2C' : '#FFFFFF',
        }}
      >
        <Calendar
          calendarApi={calendarApi}
          setCalendarApi={setCalendarApi}
          handleSelectEvent={handleSelectEvent}
          handleOnDateChanged={handleOnDateChanged}
          handleOnAdd={handleOnAdd}
        />
        <EventForm
          open={openForm}
          currentData={currentData}
          addFlag={!Boolean(currentData?.id)}
          toggle={() => setOpenForm(false)}
          readonly={
            Boolean(currentData?.id) &&
            currentData?.organizer?.email !== store?.selectedCalendar?.email
          }
        />
        <VirtualEventForm
          open={openInternalForm}
          currentData={currentData}
          addFlag={!Boolean(currentData?.id)}
          toggle={() => setOpenInternalForm(false)}
          readonly={
            Boolean(currentData?.id) &&
            user?.uid !== currentData?.metadata?.createdBy
          }
        />
      </Box>
    </CalendarWrapper>
  );
};

export default AppCalendar;
