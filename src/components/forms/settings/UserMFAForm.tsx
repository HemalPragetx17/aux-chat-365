import { yupResolver } from '@hookform/resolvers/yup';
import { Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { BOOLEAN_OPTIONS } from '../../../utils/constant';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
}

const TIME_OPTIONS = [
  { label: 'Select Custom', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
];
const HOUR_OPTIONS = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
];

const UserMFAForm = (props: FormType) => {
  const [timeHours, setTimeHours] = useState<boolean>(false);

  const { open, toggle, currentData } = props;

  const schema = yup.object().shape({
    phone: yup
      .string()
      .required('Phone is a required')
      .max(15, 'Max Length is 15'),
    email: yup
      .string()
      .email('Enter valid Email')
      .required('Email is a required'),
    time_period: yup.string().required('Day Time Period is a required'),
    time_period_in_hours: yup.array().when('time_period', {
      is: (val: string) => val === '0',
      then: () => yup.string().required('Hour Time Period is a required'),
      otherwise: () => yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?.id || null,
      email: currentData?.email || '',
      phone: currentData?.phone || '',
      status: currentData?.status || '1',
      check_in_each_browser: currentData?.check_in_each_browser || '0',
      time_period: currentData?.time_period || '',
      time_period_in_hours: currentData?.time_period_in_hours || '',
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
    const hours = watchForm?.time_period === '0';
    setTimeHours(hours);
    if (!hours) {
      setValue('time_period_in_hours', '');
    }
  }, [watchForm?.time_period]);

  const onSubmit = async (data: any) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    toggle();
    reset();
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
        <Typography variant="h6">Multi Factor Authentication</Typography>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormText
            name={'phone'}
            type={'number'}
            label={'Phone'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'email'}
            label={'Email'}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'check_in_each_browser'}
            label={'Check in Each Browser'}
            options={BOOLEAN_OPTIONS}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={BOOLEAN_OPTIONS}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'time_period'}
            label={'Time Period (in day)'}
            options={TIME_OPTIONS}
            errors={errors}
            control={control}
          />
          {timeHours && (
            <CustomFormSelect
              name={'time_period_in_hours'}
              label={'Time Period (in hours)'}
              options={HOUR_OPTIONS}
              errors={errors}
              control={control}
            />
          )}

          <CustomFormFooter onCancelClick={handleClose} />
        </form>
      </Box>
    </Drawer>
  );
};

export default UserMFAForm;
