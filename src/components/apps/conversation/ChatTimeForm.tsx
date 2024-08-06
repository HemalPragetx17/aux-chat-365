import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { TIMEZONE_VALUES } from '../../../utils/constant';
import CustomFormSelect from '../../custom/form/CustomFormSelect';

interface FormType {
  success: (data: any) => void;
  currentData: any;
}

const ChatTimeForm = (props: FormType) => {
  const { success, currentData } = props;

  const schema = yup.object().shape({
    time: yup.string().required('Please select time'),
  });

  const defaultValues = useMemo(
    () => ({
      time: Boolean(currentData?.time) ? dayjs(currentData?.time) : null,
      timezone: currentData?.timezone || 'America/Los_Angeles',
      value: '',
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [props]);

  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  const onSubmit = async (data: any) => {
    const current = dayjs().tz(data.timezone).valueOf();
    const selected = data.value?.valueOf();

    if (!Boolean(data.time)) {
      toast.error('Invalid Date!');
      return false;
    }
    if (current > selected) {
      toast.error('Please select future date!');
      return false;
    }
    success({ time: data.time, timezone: data.timezone, value: selected });
  };

  useEffect(() => {
    setValue('time', null);
    setValue('value', '');
  }, [watchForm?.timezone]);

  return (
    <Box sx={{ p: (theme) => theme.spacing(2, 2, 2), mt: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name={'time'}
            control={control}
            render={({ field: { value, onChange } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  format={'MM-DD-YYYY hh:mm:ss'}
                  ampm={false}
                  label={'Select Time'}
                  value={value}
                  onChange={(v: any) => {
                    setValue('value', v);
                    onChange(v);
                  }}
                  slotProps={{ textField: { size: 'small' } }}
                  timezone={watchForm?.timezone}
                />
              </LocalizationProvider>
            )}
          />
        </FormControl>

        <CustomFormSelect
          name={'timezone'}
          label={'Select Timezone'}
          options={TIMEZONE_VALUES}
          errors={errors}
          control={control}
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LoadingButton
            variant="contained"
            sx={{
              mr: 1,
              background:
                'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
            }}
            onClick={() => handleSubmit(onSubmit)()}
          >
            Submit
          </LoadingButton>
          <Button
            variant="text"
            onClick={() =>
              success({ time: 0, timezome: 'America/Los_Angeles' })
            }
          >
            Clear
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ChatTimeForm;
