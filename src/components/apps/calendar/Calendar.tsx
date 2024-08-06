// ** React Import
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import 'bootstrap-icons/font/bootstrap-icons.css';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../../../hooks/useAuth';
import { AppState, useSelector } from '../../../store/Store';

dayjs.extend(utc);
dayjs.extend(timezone);

const Calendar = (props: any) => {
  const {
    calendarApi,
    setCalendarApi,
    handleSelectEvent,
    handleOnDateChanged,
    handleOnAdd,
  } = props;
  const calendarRef = useRef();
  const [events, setEvents] = useState<any>([]);
  const store = useSelector((state: AppState) => state.calendarReducer);
  const { user } = useAuth();

  const convertToLocalISO = (unixTimestamp: any) => {
    return dayjs.unix(unixTimestamp).tz(dayjs.tz.guess()).toISOString();
  };

  const convertDateToLocalISO = (date: any) => {
    return new Date(date).toISOString();
  };

  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi());
    }
  }, [calendarApi, setCalendarApi]);

  useEffect(() => {
    if (store.event && store.event.length) {
      let list: any = [...store.event];
      const { type, owner, assigned } = store.filter;
      list = list.filter((event: any) => {
        const createdBy =
          event?.metadata?.createdBy || event?.metadata?.created_by;
        if (
          assigned &&
          event?.metadata?.participants?.indexOf(user?.uid) === -1
        ) {
          return false;
        }

        if (type !== 'ALL' && event?.metadata?.type !== type) {
          return false;
        }
        if (
          owner === 'SELF' &&
          ((Boolean(createdBy) && createdBy !== user?.uid) ||
            (event?.organizer?.email &&
              event?.organizer?.email !== store?.selectedCalendar?.email))
        ) {
          return false;
        }
        if (
          owner === 'OTHER' &&
          ((Boolean(createdBy) && createdBy === user?.uid) ||
            (event?.organizer?.email &&
              event?.organizer?.email === store?.selectedCalendar?.email))
        ) {
          return false;
        }
        return true;
      });
      const _events = list.map((event: any) => {
        const dateFlag = event?.when?.object === 'datespan';
        return {
          id: event.id,
          title: event?.title || 'NO TITLE',
          start: dateFlag
            ? convertDateToLocalISO(
                event?.when?.startDate || event?.when?.start_date,
              )
            : convertToLocalISO(
                event?.when?.startTime || event?.when?.start_time,
              ),
          end: dateFlag
            ? convertDateToLocalISO(
                event?.when?.endDate || event?.when?.end_date,
              )
            : convertToLocalISO(event?.when?.endTime || event?.when?.end_time),
          description: event?.title,
          backgroundColor: event?.metadata?.color || '#a953df',
          borderColor: event?.metadata?.color || '#a953df',
        };
      });
      setEvents(_events);
    } else {
      setEvents([]);
    }
  }, [store.event, store.filter]);

  const calendarOptions = {
    events,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      bootstrap5Plugin,
    ],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: '',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      },
    },
    eventDisplay: 'block',
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick(info: any) {
      const event = store.event.find(
        (event: any) => event.id === info.event.id,
      );
      handleSelectEvent(event);
    },
    dateClick(info: any) {
      const event = {
        when: {
          startTime: info.date.valueOf() / 1000,
        },
      };
      handleOnAdd(event);
    },
    editable: true,
    eventResizableFromStart: false,
    eventResizableFromEnd: false,
    datesSet(dateInfo: any) {
      handleOnDateChanged(dateInfo);
    },
    ref: calendarRef,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  };

  // @ts-ignore
  return <FullCalendar {...calendarOptions} />;
};

export default Calendar;
