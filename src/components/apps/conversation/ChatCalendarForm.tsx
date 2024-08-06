import { yupResolver } from '@hookform/resolvers/yup';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  createFilterOptions,
  FormControl,
  FormHelperText,
  IconButton,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { sendMeetingRequest } from '../../../store/apps/chat/ChatSlice';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import axios from '../../../utils/axios';
import CustomFormCheckbox from '../../custom/form/CustomFormCheckboxVT';
import CustomFormTextAreaVT from '../../custom/form/CustomFormTextAreaVT';
import CustomFormTextVT from '../../custom/form/CustomFormTextVT';
import VTCustomTextField from '../../custom/VTCustomTextField';

dayjs.extend(utc);
dayjs.extend(timezone);

interface FormType {
  success: () => void;
  selectedChat: any;
  sender: string;
  open: boolean;
}

const CustomTextField = (props: any) => {
  return <VTCustomTextField {...props} size="small" />;
};

const ChatCalendarForm = (props: FormType) => {
  const { success, selectedChat, sender, open } = props;
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState<any>([]);
  const [masterEmailList, setMasterEmailList] = useState<any>([]);
  const { loading } = useSelector((state: AppState) => state.chatReducer);
  const filter = createFilterOptions();

  const schema = yup.object().shape({
    message: yup.string().required('Message is required field'),
    link: yup.string(),
    startTime: yup.string().required('Start Time is required'),
    endTime: yup.string().required('End Time is required'),
    sendEmail: yup.boolean(),
    toEmail: yup.string().when('sendEmail', {
      is: (sendEmail: boolean) => sendEmail === true,
      then: () =>
        yup
          .string()
          .email('Enter Valid Email Address')
          .required('Customer Email is Required'),
      otherwise: () => yup.string().nullable(),
    }),
    fromEmail: yup.string().when('sendEmail', {
      is: (sendEmail: boolean) => sendEmail === true,
      then: () =>
        yup
          .string()
          .email('Enter Valid Email Address')
          .required('Please enter your email'),
      otherwise: () => yup.string().nullable(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      message: '',
      link: '',
      startTime: null as any,
      endTime: null as any,
      sendEmail: false,
      toEmail: selectedChat?.Contact?.email || '',
      fromEmail:
        masterEmailList.find((data: any) => data.isDefault === true)?.email ||
        '',
    }),
    [selectedChat],
  );

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = useCallback(async () => {
    const response = await axios.get(`/email-nylas`);
    const list = response.status === 200 ? response.data.data : [];
    const _emailList = list.map((data: any) => data.email);
    setEmailList(_emailList);
    setMasterEmailList(list);
    const defaultEmail = list.find((data: any) => data.isDefault === true);
    if (defaultEmail) {
      setValue('fromEmail', defaultEmail.email, {
        shouldValidate: true,
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      const defaultEmail = masterEmailList.find(
        (data: any) => data.isDefault === true,
      );
      if (defaultEmail) {
        setValue('fromEmail', defaultEmail.email, {
          shouldValidate: true,
        });
      }
    }
  }, [open]);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  useEffect(() => {
    const startTime = watchForm?.startTime;
    if (startTime) {
      setValue('endTime', dayjs(startTime).add(30, 'minute').valueOf());
    }
  }, [watchForm?.startTime]);

  const onScheduleMeeting = async (data: any) => {
    const timeString = [
      dayjs(+data.startTime).format('YYYY-MM-DD, HH:mm:ss'),
      dayjs(+data.endTime).format('YYYY-MM-DD, HH:mm:ss'),
    ];
    const payload = {
      ...data,
      timeString,
      sender,
      id: selectedChat?.id,
      to: Boolean(selectedChat.Contact)
        ? selectedChat.Contact?.phone
        : selectedChat?.to,
      from: selectedChat?.from,
      startTime: +data.startTime,
      endTime: +data.endTime,
    };
    success();
    await dispatch(sendMeetingRequest(payload));
  };

  return (
    <>
      <div
        className="payment_link_modal_div"
        style={{
          width: '100%',
        }}
      >
        <Box
          sx={{
            padding: '15px',
            height: '100%',
            background: '#323441',
            border: 'none',
          }}
        >
          <form onSubmit={handleSubmit(onScheduleMeeting)}>
            <Typography
              variant="h6"
              style={{
                display: 'flex',
                color: 'white',
                gap: '15px',
                fontSize: '22px',
                textAlign: 'center',
                padding: '10px 20px 20px 0px',
              }}
            >
              Schedule a meeting
            </Typography>
            <IconButton
              aria-label="close"
              style={{ position: 'absolute', right: '5px', top: '5px' }}
              onClick={() => success()}
            >
              <CancelOutlinedIcon style={{ color: '#fff', fontSize: '30px' }} />
            </IconButton>

            <CustomFormTextAreaVT
              name={'message'}
              label={'Message'}
              errors={errors}
              control={control}
              rows={3}
            />

            <CustomFormTextVT
              name={'link'}
              label={'Meeting Link (Optional)'}
              errors={errors}
              control={control}
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
                      value={value ? dayjs(value) : null}
                      onChange={(date: any) =>
                        onChange(date ? date.valueOf() : null)
                      }
                      disablePast
                      slots={{ textField: CustomTextField }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: Boolean(errors.startTime),
                          placeholder: 'Start Time',
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
                      value={value ? dayjs(value) : null}
                      onChange={(date: any) =>
                        onChange(date ? date.valueOf() : null)
                      }
                      disablePast
                      minDateTime={
                        watchForm?.startTime
                          ? dayjs(watchForm?.startTime)
                          : undefined
                      }
                      slots={{ textField: CustomTextField }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: Boolean(errors.endTime),
                          placeholder: 'End Time',
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

            <CustomFormCheckbox
              name={'sendEmail'}
              label={'Add Email Invitation'}
              control={control}
            />

            {watchForm.sendEmail && (
              <Box sx={{ mt: 2 }}>
                To Email -
                <CustomFormTextVT
                  type="email"
                  name={'toEmail'}
                  label={'Send To'}
                  errors={errors}
                  control={control}
                />
                <FormControl fullWidth sx={{ mb: 1, display: 'flex' }}>
                  From Email -
                  <Autocomplete
                    options={emailList}
                    freeSolo
                    clearOnBlur
                    autoHighlight={true}
                    getOptionLabel={(option: any) => option}
                    value={watchForm?.fromEmail}
                    onChange={(e, newValue: any) => {
                      setValue('fromEmail', newValue, {
                        shouldValidate: true,
                      });
                    }}
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
                      <VTCustomTextField
                        {...params}
                        fullWidth
                        size="small"
                        placeholder="From Email"
                        error={
                          Boolean(errors?.fromEmail) &&
                          Boolean(errors?.fromEmail?.message)
                        }
                      />
                    )}
                  />
                  {errors.fromEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {(errors.fromEmail as any).message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}

            <Box sx={{ paddingRight: '1%' }}>
              <LoadingButton
                variant="contained"
                loading={loading}
                sx={{ mt: 2 }}
                fullWidth
                onClick={() => handleSubmit(onScheduleMeeting)()}
              >
                Submit
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </div>
    </>
  );
};

export default ChatCalendarForm;
