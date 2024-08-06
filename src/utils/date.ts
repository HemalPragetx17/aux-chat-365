import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';
dayjs.extend(utc);

export const toLocalDate = (dateString: string) => {
  return moment(dateString).local();
};

export const formatTimeString = (timeString: string, startFlag?: boolean) => {
  if (Boolean(timeString)) {
    return dayjs.utc(`2000-01-01T${timeString}`);
  }
  return startFlag
    ? dayjs.utc('2000-01-01TT09:00')
    : dayjs.utc('2000-01-01TT17:00');
};
