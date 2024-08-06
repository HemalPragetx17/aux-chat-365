import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Radio,
  RadioGroup,
  createFilterOptions,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconTrash, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import * as yup from 'yup';

import { IconCopy } from '@tabler/icons-react';
import { AppState, dispatch, useSelector } from '../../../store/Store';
import {
  createCalendarEvents,
  deleteCalendarEvents,
  updateCalendarEvents,
} from '../../../store/apps/calendar/CalendarSlice';
import axios from '../../../utils/axios';
import CustomCheckbox from '../../custom/CustomCheckbox';
import CustomTextField from '../../custom/CustomTextField';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

dayjs.extend(utc);
dayjs.extend(timezone);

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  readonly: boolean;
}

const REMINDERS = [
  { label: '5 Minutes before event', value: 5 },
  { label: '10 Minutes before event', value: 10 },
  { label: '30 Minutes before event', value: 30 },
  { label: '1  Hour before event', value: 60 },
];

const filter = createFilterOptions();

const EventForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, readonly } = props;
  const store = useSelector((state: AppState) => state.calendarReducer);
  const [emailList, setEmailList] = useState<string[]>([]);

  const getEmailList = async () => {
    try {
      const response = await axios.post(`/email-nylas/search-emails`);
      const data = response?.data || [];
      setEmailList(data);
    } catch (e) {
      setEmailList([]);
    }
  };

  useEffect(() => {
    getEmailList();
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    startTime: yup.string().when('metadata', {
      is: (metadata: any) => metadata.type === 'MEETING',
      then: () => yup.string().required('Start Time is required'),
      otherwise: () => yup.string().nullable(),
    }),
    endTime: yup.string().when('metadata', {
      is: (metadata: any) => metadata.type === 'MEETING',
      then: () => yup.string().required('End Time is required'),
      otherwise: () => yup.string().nullable(),
    }),
    metadata: yup.object().shape({
      type: yup.string().required('Event type is required'),
      participants: yup
        .array()
        .of(yup.string().required('Each participant must be a string')),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      description: currentData?.metadata?.description || '',
      metadata: {
        type: currentData?.metadata?.type || 'MEETING',
        reminder: currentData?.metadata?.reminder === 'true',
        reminderMinutes: currentData?.metadata?.reminderMinutes
          ? parseInt(currentData?.metadata?.reminderMinutes)
          : 5,
        participants: currentData?.metadata?.participants
          ? currentData?.metadata?.participants.split(',')
          : currentData?.participants?.length
          ? currentData?.participants?.map(
              (participant: any) => participant.email,
            )
          : [],
      },
      location: currentData?.location || '',
      startTime: currentData?.when?.startTime * 1000 || null,
      endTime: currentData?.when?.endTime * 1000 || null,
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [open]);

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

  useEffect(() => {
    const startTime = watchForm?.startTime;
    const endTime = watchForm?.endTime;
    if (
      (startTime && endTime === null) ||
      (startTime && (endTime as any) < startTime)
    ) {
      setValue('endTime', dayjs(startTime).add(30, 'minute').valueOf());
    }
  }, [watchForm?.startTime]);

  const onSubmit = async (data: any) => {
    try {
      const { title, description, location, startTime, endTime, metadata } =
        data;
      const { participants, reminderMinutes, reminder, type } = metadata;
      let _participants = JSON.parse(JSON.stringify(participants));

      const formData: any = {
        metadata: {
          type,
          participants: _participants.join(','),
          reminder: Boolean(reminder) ? 'true' : 'false',
          reminderMinutes: reminderMinutes.toString(),
        },
        description,
        title,
        location,
        busy: true,
        hide_participants: true,
      };

      formData.metadata.description = description;
      formData.when = {
        startTime: startTime / 1000,
        endTime: endTime / 1000,
        startTimezone: 'UTC',
        endTimezone: 'UTC',
      };
      _participants = _participants.map((email: string) => {
        return { email, status: 'noreply' };
      });
      formData.participants = _participants;
      if (reminder) {
        formData.reminder = {
          use_default: true,
          overrides: [{ reminderMinutes, reminderMethod: 'popup' }],
        };
      }

      const { grantId, calendarId } = store?.selectedCalendar;

      addFlag
        ? dispatch(createCalendarEvents(grantId, calendarId, formData))
        : dispatch(
            updateCalendarEvents(
              grantId,
              calendarId,
              currentData?.id,
              formData,
            ),
          );
    } catch (error) {
      console.log(error);
      toast.error('API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDelete = async () => {
    const willDelete = await swal({
      title: 'Are you sure?',
      closeOnClickOutside: false,
      closeOnEsc: false,
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'MuiButton-root',
          closeModal: true,
        },
      },
      dangerMode: true,
    });
    if (willDelete) {
      try {
        const { grantId, calendarId } = store?.selectedCalendar;
        dispatch(deleteCalendarEvents(grantId, calendarId, currentData?.id));
      } catch (error) {
        console.log(error);
        toast.error('API Error! Please try again');
      }
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <CustomHeader>
        <Typography variant="h6">
          {addFlag ? 'Add' : readonly ? 'View' : 'Edit'} Event
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
            }}
          >
            <IconX />
          </IconButton>
          {!readonly && !addFlag && (
            <IconButton onClick={handleDelete}>
              <IconTrash />
            </IconButton>
          )}
        </Box>
      </CustomHeader>

      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            Please select the type of event -
            <Controller
              name="metadata.type"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  name="metadata.type"
                  value={value}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="MEETING"
                    label="APPOINTMENT"
                    control={<Radio disabled={readonly} />}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="TASK"
                    label="TASK"
                    control={<Radio disabled={readonly} />}
                    sx={{ mr: 2 }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'metadata.participants'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  autoHighlight={true}
                  options={emailList}
                  value={value}
                  disabled={readonly}
                  onChange={(e, newValue) => {
                    onChange(newValue);
                  }}
                  filterSelectedOptions
                  filterOptions={(options: any[], params: any) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option: any) => inputValue === option,
                    );
                    if (inputValue !== '' && !isExisting) {
                      filtered.push(inputValue);
                    }
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      autoComplete="off"
                      size="small"
                      disabled={readonly}
                      label={'To Email'}
                    />
                  )}
                />
              )}
            />
          </FormControl>

          <CustomFormText
            name={'title'}
            label={'Title *'}
            errors={errors}
            control={control}
            disabled={readonly}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'description'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label={'Message Body'}
                  size="small"
                  multiline
                  rows={5}
                  onChange={onChange}
                  error={Boolean(errors.description)}
                  autoComplete="off"
                  InputProps={{
                    readOnly: readonly,
                  }}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.description as any).message}
              </FormHelperText>
            )}
          </FormControl>

          {currentData?.conferencing?.details?.url && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <CustomTextField
                value={currentData?.conferencing?.details?.url}
                label={'Meeting URL'}
                size="small"
                InputProps={{
                  readOnly: readonly,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(
                            currentData?.conferencing?.details?.url,
                          );
                          toast.success('Copied!');
                        }}
                      >
                        <IconCopy />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          )}

          <CustomFormText
            name={'location'}
            label={'Meeting Location (Optional)'}
            errors={errors}
            control={control}
            disabled={readonly}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    format={'MM-DD-YYYY [at] hh:mm:ss A'}
                    disableHighlightToday
                    label="Start Time *"
                    value={value ? dayjs(value) : null}
                    onChange={(date) => onChange(date ? date.valueOf() : null)}
                    disabled={readonly}
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: Boolean(errors.startTime),
                        disabled: readonly,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.startTime && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.startTime as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="endTime"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    format={'MM-DD-YYYY [at] hh:mm:ss A'}
                    disableHighlightToday
                    label="End Time *"
                    value={value ? dayjs(value) : null}
                    onChange={(date) => onChange(date ? date.valueOf() : null)}
                    minDateTime={
                      watchForm?.startTime
                        ? dayjs(watchForm?.startTime)
                        : undefined
                    }
                    disabled={readonly}
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: Boolean(errors.endTime),
                        disabled: readonly,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.endTime && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.endTime as any).message}
              </FormHelperText>
            )}
          </FormControl>

          {!readonly && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="metadata.reminder"
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      label="Do you want to set a reminder for this event?"
                      control={
                        <CustomCheckbox
                          checked={value}
                          onChange={onChange}
                          name="metadata.reminder"
                        />
                      }
                    />
                  )}
                />
              </FormControl>

              {watchForm?.metadata?.reminder && (
                <CustomFormSelect
                  name={'metadata.reminderMinutes'}
                  label={'When would you liek to get reminded?'}
                  options={REMINDERS}
                  errors={errors}
                  control={control}
                />
              )}
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 4,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  mr: 1,
                  background:
                    'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                }}
                loading={store.loading}
                disabled={readonly}
              >
                Submit
              </LoadingButton>
              <Button variant="text" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default EventForm;
