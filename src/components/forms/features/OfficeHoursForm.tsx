import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconMoodSmile, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import { BUTTON_ELEMENTS, STATUS, TIMEZONE_VALUES } from '../../../utils/constant';
import { formatTimeString } from '../../../utils/date';
import CustomFormCheckbox from '../../custom/form/CustomFormCheckbox';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormTimePicker from '../../custom/form/CustomFormTimePicker';
import CustomHeader from '../../custom/form/CustomHeader';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomEmojiPicker from '../../custom/CustomEmojiPicker';

dayjs.extend(utc);

interface FormType {
  addFlag: boolean;
  open: boolean;
  departmentList: any[];
  currentData: any;
  toggle: () => void;
  success: () => void;
}

const OfficeHoursForm = (props: FormType) => {
  const { addFlag, open, toggle, currentData, departmentList, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<any>(null);
  const [emojiContainer, setEmojiContainer] = useState<any>({ status: false, fieldName: null });


  const schema = yup.object().shape({
    timeZone: yup.string().required('Timezone is required'),
    departmentId: yup.string().required('Department is required'),
    afterOfficeHoursReply: yup.string().required('After Office Hours Reply is required'),
    officeHoursReply: yup.string().required('Office Hours Reply is required'),
    reply_days: yup.array().when('reply_time_type', {
      is: (val: string) => val === 'specific_time',
      then: () => yup.array().min(1, 'Please select a day'),
      otherwise: () => yup.array(),
    }),

  });

  const DAY_VALUES = [
    {
      label: 'Monday',
      value: 'Monday',
    },
    {
      label: 'Tuesday',
      value: 'Tuesday',
    },
    {
      label: 'Wednesday',
      value: 'Wednesday',
    },
    {
      label: 'Thursday',
      value: 'Thursday',
    },
    {
      label: 'Friday',
      value: 'Friday',
    },
    {
      label: 'Saturday',
      value: 'Saturday',
    },
    {
      label: 'Sunday',
      value: 'Sunday',
    },
  ];

  const defaultValues = useMemo(
    () => ({
      departmentId: currentData?.departmentId || '',
      timeZone: currentData?.timezone || 'America/Los_Angeles',
      status: currentData?.status || 'ACTIVE',
      afterOfficeHoursReply: currentData?.afterOfficeHoursReply || '',
      officeHoursReply: currentData?.officeHoursReply || '',
      reply_days: currentData && DAY_VALUES.filter(day => {
        const dayKey = day.value.toLowerCase();
        return currentData[dayKey] && currentData[dayKey].status === 'OPEN';
      }).map(day => day.value) || [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
      reply_start_time: formatTimeString(currentData?.monday?.startTime, true),
      reply_end_time: formatTimeString(currentData?.monday?.endTime, false),
    }),
    [currentData],
  );



  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setStatus(null);
    }
  }, [open]);

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });



  const onSubmit = async (data: any) => {

    try {
      setLoading(true);
      const formData = formatData(data);
      const response = addFlag
        ? await axios.post(`/features/create-officehours/`, formData)
        : await axios.patch(
          `/features/update-officehours/${currentData.id}`,
          formData,
        );
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        success();
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };


  const formatData = (formData: any) => {
    const { timeZone, departmentId, status, afterOfficeHoursReply, officeHoursReply, reply_days, reply_start_time, reply_end_time } = formData;
    const response: any = { timeZone, departmentId, status, afterOfficeHoursReply, officeHoursReply, };
    const dayArr = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];


    for (let day of dayArr) {
      const status = `${day}status`;
      const startTime = `${day}startTime`;
      const endTime = `${day}endTime`;
      response[startTime] = dayjs.utc(reply_start_time).format('HH:mm')
        || '09:00';
      response[endTime] = dayjs.utc(reply_end_time).format('HH:mm')
        || '17:00';

      if (reply_days.includes(day.charAt(0).toUpperCase() + day.slice(1))) {
        response[status] = 'OPEN'
      } else {
        response[status] = 'CLOSED';
      }
    }
    return response;
  };

  const handleSelectEmoji = (e: any) => {
    const emoji = e?.native;
    let description = getValues(emojiContainer?.fieldName);
    description += emoji;
    setValue(emojiContainer?.fieldName, description);
  };

  const handleOutsideContainerClick = (e: Event) => {
    const tagName: any = (e.target as HTMLElement)?.tagName;
    if (BUTTON_ELEMENTS.indexOf(tagName) === -1) {
      setEmojiContainer({ status: false, fieldName: null });
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
        <Box>
          <Typography variant="h6">
            {addFlag ? 'Add' : 'Edit'} Office Hours
          </Typography>
        </Box>
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
      </CustomHeader>

      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2) }}>
        <Alert severity={'info'} icon={false} sx={{ mb: 5 }}>
          Set your hours to determine when your auto replies send.
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormSelect
            name={'departmentId'}
            label={'Select Department'}
            options={departmentList}
            errors={errors}
            control={control}
          />


          <CustomFormSelect
            name={'reply_days'}
            label={'Select Days'}
            options={DAY_VALUES}
            errors={errors}
            control={control}
            multiple={true}
          />
          <CustomFormTimePicker
            label="Open Time"
            name={'reply_start_time'}
            control={control}
            errors={errors}
          />

          <CustomFormTimePicker
            label="Close Time"
            name={'reply_end_time'}
            control={control}
            errors={errors}
          />

          <CustomFormSelect
            name={'timeZone'}
            label={'Select Timezone'}
            options={TIMEZONE_VALUES}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={STATUS}
            errors={errors}
            control={control}
          />
          <CustomFormTextArea
            name={'afterOfficeHoursReply'}
            label={'After Office Hours Reply'}
            errors={errors}
            control={control}
            rows={3}
          />
          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainer({ status: !emojiContainer?.status, fieldName: 'afterOfficeHoursReply' })}
          >
            <IconMoodSmile stroke={1.5} />
          </IconButton>

          <CustomFormTextArea
            name={'officeHoursReply'}
            label={'Office Hours Reply'}
            errors={errors}
            control={control}
            rows={3}
          />

          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainer({ status: !emojiContainer?.status, fieldName: 'officeHoursReply' })}
          >
            <IconMoodSmile stroke={1.5} />
          </IconButton>
          {emojiContainer?.status && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 10000,
                '& em-emoji-picker': {
                  mt: '-16px',
                  minHeight: 'unset',
                  height: 300,
                },
              }}
            >
              <CustomEmojiPicker
                navPosition={'none'}
                previewPosition={'none'}
                searchPosition={'none'}
                maxFrequentRows={'0'}
                onEmojiSelect={(e: any) => handleSelectEmoji(e)}
                onClickOutside={(e: any) => handleOutsideContainerClick(e)}
              />
            </Box>
          )}

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default OfficeHoursForm;
