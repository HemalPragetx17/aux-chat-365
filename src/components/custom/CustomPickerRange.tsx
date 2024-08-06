// ** React Imports
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import format from 'date-fns/format';
import { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import CustomDatePickerWrapper from './CustomDatePickerWrapper';
import CustomTextField from './CustomTextField';

interface PickerProps {
  label?: string;
  end: Date | number;
  start: Date | number;
}

type DateType = Date | null | undefined;

interface PickersRangeProps {
  onChange: (val: any) => void;
  dates?: string[];
  disableClear?: boolean;
}

const CustomPickerRange = (props: PickersRangeProps) => {
  const { onChange, dates, disableClear } = props;
  const start = dates?.length ? new Date(dates[0]) : null;
  const end = dates?.length ? new Date(dates[1]) : null;
  const hideClear = disableClear === true;
  const [startDateRange, setStartDateRange] = useState<DateType | null>(start);
  const [endDateRange, setEndDateRange] = useState<DateType | null>(end);

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
    if (start === null && end === null) {
      onChange(null);
    }
    if (start && end) {
      const _start = format(start, 'yyyy-MM-dd');
      const _end = format(end, 'yyyy-MM-dd');
      onChange([_start, _end]);
    }
  };

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = props.start ? format(props.start, 'MM/dd/yyyy') : null;
    const endDate =
      props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null;
    const value = `${startDate !== null ? startDate : ''}${
      endDate !== null ? endDate : ''
    }`;

    return (
      <CustomTextField
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
        size="small"
        autoComplete={'off'}
      />
    );
  });

  CustomInput.displayName = 'CustomInput';

  return (
    <CustomDatePickerWrapper>
      <Box sx={{ width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            selectsRange
            monthsShown={1}
            endDate={endDateRange}
            selected={startDateRange}
            startDate={startDateRange}
            shouldCloseOnSelect
            id="date-range-picker-months"
            onChange={handleOnChangeRange}
            isClearable={!hideClear}
            customInput={
              <CustomInput
                label="Select Custom Date Range"
                end={endDateRange as Date | number}
                start={startDateRange as Date | number}
              />
            }
          />
        </LocalizationProvider>
      </Box>
    </CustomDatePickerWrapper>
  );
};

export default CustomPickerRange;
