import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../hooks/useAuth';
import { AppState, dispatch, useSelector } from '../../../store/Store';
import {
  createCalendarEvents,
  updateCalendarEvents,
} from '../../../store/apps/calendar/CalendarSlice';
import { fetchContactByPage } from '../../../store/apps/contacts/ContactSlice';
import axios from '../../../utils/axios';
import { CONTACT_BODY, TASK_TYPE } from '../../../utils/constant';
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

const VirtualEventForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, readonly } = props;
  const store = useSelector((state: AppState) => state.calendarReducer);
  const contact_store = useSelector((state: AppState) => state.contactsReducer);
  const [userList, setUserList] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);
  const { user } = useAuth();
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const autocompleteRef: any = useRef(null);

  const getEmailList = async () => {
    try {
      const response = await axios.post(`/users/all-users`);
      const data = response?.data || [];
      setUserList(data);
    } catch (e) {
      setUserList([]);
    }
  };

  useEffect(() => {
    getEmailList();
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    when: yup.object().shape({
      startTime: yup.string().required('Start Time is required'),
      endTime: yup.string().required('End Time is required'),
    }),
    metadata: yup.object().shape({
      type: yup.string().required('Event type is required'),
      assignSelf: yup.boolean(),
      participants: yup
        .array()
        .of(yup.string().required('Each participant must be a string'))
        .min(1, 'At least one participant is required')
        .required('Participants are required'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      metadata: {
        assignSelf: currentData?.metadata?.assignSelf === 'true',
        isInternal: true,
        type: currentData?.metadata?.type || 'MEETING',
        reminder: currentData?.metadata?.reminder === 'true',
        reminderMinutes: currentData?.metadata?.reminderMinutes
          ? parseInt(currentData?.metadata?.reminderMinutes)
          : 5,
        participants: currentData?.metadata?.participants
          ? currentData?.metadata?.participants.split(',')
          : [],
        color: currentData?.metadata?.color || '#a953df',
        description: currentData?.metadata?.description || '',
        contactId: currentData?.metadata?.contactId
          ? currentData?.metadata?.contactId.split(',')
          : [],
      },
      location: currentData?.location || '',
      when: {
        startTime: currentData?.when?.startTime * 1000 || null,
        endTime: currentData?.when?.endTime * 1000 || null,
      },
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
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  useEffect(() => {
    const startTime = watchForm?.when?.startTime;
    const endTime = watchForm?.when?.endTime;
    if (
      (startTime && endTime === null) ||
      (startTime && (endTime as any) < startTime)
    ) {
      setValue('when.endTime', dayjs(startTime).add(30, 'minute').valueOf(), {
        shouldValidate: true,
      });
    }
  }, [watchForm?.when?.startTime]);

  useEffect(() => {
    let participants = getValues('metadata.participants');
    participants = participants.filter((id: string) => id !== user?.uid);
    if (watchForm?.metadata?.assignSelf === true) {
      participants.push(user?.uid);
    }
    setValue('metadata.participants', participants, { shouldValidate: true });
  }, [watchForm?.metadata?.assignSelf]);

  useEffect(() => {
    let participants = getValues('metadata.participants');
    if (participants.length === 0) {
      setValue('metadata.assignSelf', false);
    }
  }, [watchForm?.metadata?.participants]);

  const onSubmit = async (data: any) => {
    try {
      const { title, location, metadata } = data;
      const {
        participants,
        reminderMinutes,
        reminder,
        type,
        assignSelf,
        color,
        description,
      } = metadata;
      let _participants = JSON.parse(JSON.stringify(participants));
      _participants = _participants.filter((id: string) => id !== user?.uid);
      if (assignSelf === true) {
        _participants.push(user?.uid);
      }

      const formData: any = {
        metadata: {
          isInternal: 'true',
          type,
          color,
          description,
          assignSelf: Boolean(assignSelf) ? 'true' : 'false',
          participants: _participants.join(','),
          reminder: Boolean(reminder) ? 'true' : 'false',
          reminderMinutes: reminderMinutes.toString(),
        },
        title,
        location,
        busy: true,
        hide_participants: true,
      };

      formData.when = {
        startTime: data?.when?.startTime / 1000,
        endTime: data?.when?.endTime / 1000,
        startTimezone: 'UTC',
        endTimezone: 'UTC',
      };

      if (reminder) {
        formData.reminder = {
          use_default: true,
          overrides: [{ reminderMinutes, reminderMethod: 'popup' }],
        };
      }

      const { grantId, calendarId } = store?.selectedCalendar;

      console.log(JSON.stringify(formData));

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

  useEffect(() => {
    const _contacts = contact_store.contacts.map((contact: any) => {
      return {
        firstName: contact.firstName || '',
        phone: contact.phone,
        id: contact.id,
      };
    });
    setData(_contacts);
  }, [contact_store.contacts]);

  const handleClose = () => {
    toggle();
    reset();
  };

  useEffect(() => {
    const handleScroll = (event: any) => {
      const bottom =
        event.target.scrollHeight - event.target.scrollTop ===
        event.target.clientHeight;
      if (bottom) {
        console.log('bottom');
        setBottomReached(true);
      }
    };

    const dropdown = autocompleteRef.current?.getElementsByClassName(
      'MuiAutocomplete-listbox',
    )[0];

    if (dropdown) {
      dropdown.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (dropdown) {
        dropdown.removeEventListener('scroll', handleScroll);
      }
    };
  }, [autocompleteRef]);

  useEffect(() => {
    const contactPagination = async () => {
      const response = await dispatch(
        fetchContactByPage({ ...CONTACT_BODY, page: contact_store.page + 1 }),
      );
      if (response.length >= 10) {
        setBottomReached(false);
      }
    };
    if (bottomReached) {
      contactPagination();
    }
  }, [bottomReached]);

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
          {addFlag ? 'Add' : readonly ? 'View' : 'Edit'} Internal Event
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
        </Box>
      </CustomHeader>

      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2) }}>
        {currentData?.user && (
          <Alert severity="success" icon={false} sx={{ mb: 4 }}>
            Event Created By {currentData?.user?.name}.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormSelect
            name={'metadata.type'}
            label={'Event Type'}
            options={TASK_TYPE}
            errors={errors}
            control={control}
            disabled={readonly}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'metadata.participants'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  autoHighlight={true}
                  options={userList}
                  getOptionLabel={(option: any) => option.name}
                  value={userList.filter((user) => value.includes(user.id))}
                  disabled={readonly}
                  onChange={(e, newValue) => {
                    onChange(newValue.map((option) => option.id));
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      autoComplete="off"
                      size="small"
                      disabled={readonly}
                      label={'Assign To'}
                    />
                  )}
                />
              )}
            />
            {(errors.metadata as any)?.participants && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.metadata as any)?.participants.message}
              </FormHelperText>
            )}
          </FormControl>

          {!readonly && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="metadata.assignSelf"
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    label="Assign Self"
                    control={
                      <CustomCheckbox
                        checked={value}
                        disabled={readonly}
                        onChange={onChange}
                        name="metadata.assignSelf"
                      />
                    }
                  />
                )}
              />
            </FormControl>
          )}

          <CustomFormText
            name={'title'}
            label={'Title *'}
            errors={errors}
            control={control}
            disabled={readonly}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'metadata.description'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label={'Message Body'}
                  size="small"
                  multiline
                  rows={5}
                  onChange={onChange}
                  error={Boolean(errors.metadata?.description)}
                  autoComplete="off"
                  InputProps={{
                    readOnly: readonly,
                  }}
                />
              )}
            />
            {errors.metadata?.description && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.metadata?.description as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <CustomFormText
            name={'location'}
            label={'Meeting Location (Optional)'}
            errors={errors}
            control={control}
            disabled={readonly}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="when.startTime"
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
                    slots={{
                      textField: (props) => (
                        <CustomTextField
                          {...props}
                          size="small"
                          error={Boolean(errors?.when?.startTime)}
                          disabled={readonly}
                        />
                      ),
                    }}
                  />
                </LocalizationProvider>
              )}
            />
            {(errors?.when as any)?.startTime && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {((errors?.when as any)?.startTime as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="when.endTime"
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
                      watchForm?.when?.startTime
                        ? dayjs(watchForm?.when?.startTime)
                        : undefined
                    }
                    disabled={readonly}
                    slots={{
                      textField: (props) => (
                        <CustomTextField
                          {...props}
                          size="small"
                          error={Boolean(errors?.when?.endTime)}
                          disabled={readonly}
                        />
                      ),
                    }}
                  />
                </LocalizationProvider>
              )}
            />
            {errors?.when?.endTime && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors?.when?.endTime as any).message}
              </FormHelperText>
            )}
          </FormControl>

          {!readonly && (
            <>
              <FormControl
                fullWidth
                sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}
              >
                <label htmlFor="color" style={{ width: 120 }}>
                  Event Color
                </label>
                <Controller
                  name="metadata.color"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <input
                      style={{ width: '100%' }}
                      type="color"
                      id="color"
                      name="color"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
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

export default VirtualEventForm;
