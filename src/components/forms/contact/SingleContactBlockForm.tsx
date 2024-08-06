import { yupResolver } from '@hookform/resolvers/yup';
import { Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormPhone from '../../custom/form/CustomFormPhone';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

export const CONTACT_STATUS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Blocked', value: 'BLOCKED' },
];
interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  success: (data: any) => void;
}

const SingleContactBlockForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open, toggle, currentData, success } = props;

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required field'),
    email: yup.string().email('Enter Valid Email Address'),
    phone: yup.string().required('Phone Number is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentData?.firstName || '',
      lastName: currentData?.lastName || '',
      email: currentData?.email || '',
      phone: currentData?.phone || '',
      status: 'BLOCKED',
      address: {
        street: currentData?.address?.street || '',
        city: currentData?.address?.city || '',
        state: currentData?.address?.state || '',
        zip: currentData?.address?.zip || '',
      },
      company: currentData?.company || '',
      jobTitle: currentData?.jobTitle || '',
      customFields: {
        labelOne: currentData?.customFields?.labelOne || 'Custom Field Label 1',
        valueOne: currentData?.customFields?.valueOne || '',
        labelTwo: currentData?.customFields?.labelTwo || 'Custom Field Label 2',
        valueTwo: currentData?.customFields?.valueTwo || '',
        labelThree:
          currentData?.customFields?.labelThree || 'Custom Field Label 3',
        valueThree: currentData?.customFields?.valueThree || '',
      },
      image: null,
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
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`/contact/`, data);
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        toast.success(`Number Blocked Successfully!`);
        success(response.data?.data);
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
        <Typography variant="h6">Block Contact</Typography>
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
            name={'firstName'}
            label={'First Name'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'lastName'}
            label={'Last Name'}
            errors={errors}
            control={control}
          />

          <CustomFormPhone
            name={'phone'}
            label={'Phone Number'}
            errors={errors}
            control={control}
            disabled={true}
          />

          <CustomFormText
            name={'email'}
            label={'Email'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'address.street'}
            label={'Street'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'address.city'}
            label={'City'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'address.state'}
            label={'State'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            type={'number'}
            name={'address.zip'}
            label={'Zip Code'}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={CONTACT_STATUS}
            errors={errors}
            control={control}
            disabled={true}
          />

          <CustomFormText
            name={'company'}
            label={'Company'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'jobTitle'}
            label={'Job Title'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'customFields.labelOne'}
            label={'Custom Field One'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'customFields.valueOne'}
            label={'Value One'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'customFields.labelTwo'}
            label={'Custom Field Two'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'customFields.valueTwo'}
            label={'Value Two'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'customFields.labelThree'}
            label={'Custom Field Three'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'customFields.valueThree'}
            label={'Value Three'}
            errors={errors}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default SingleContactBlockForm;
