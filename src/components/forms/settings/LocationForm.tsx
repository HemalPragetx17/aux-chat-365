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
import { STATUS } from '../../../utils/constant';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
}

const LocationForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open, toggle, currentData, addFlag, success } = props;

  const schema = yup.object().shape({
    title: yup.string().required('Title is required field'),
    address: yup.object().shape({
      street: yup.string().required('Street is required field'),
      city: yup.string().required('City is required field'),
      state: yup.string().required('State is required field'),
      zip: yup.string().required('Zip is required field'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      status: currentData?.status || 'ACTIVE',
      address: {
        street: currentData?.address?.street || '',
        city: currentData?.address?.city || '',
        state: currentData?.address?.state || '',
        zip: currentData?.address?.zip || '',
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
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = addFlag
        ? await axios.post(`/did-location/`, data)
        : await axios.patch(`/did-location/${currentData.id}`, data);
      setLoading(false);
      if (response.status === 200) {
        success();
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
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
        <Typography variant="h6">
          {addFlag ? 'Add' : 'Edit'} DID Location
        </Typography>
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
            name={'title'}
            label={'Title'}
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
            options={STATUS}
            errors={errors}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default LocationForm;
