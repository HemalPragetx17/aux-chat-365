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
import CustomFormPhone from '../../custom/form/CustomFormPhone';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
  departmentList: any[];
  locationList: any[];
  uid: string;
}

const DID_PROVIDER = [
  { label: 'BANDWIDTH', value: 'BANDWIDTH' },
  { label: 'TELNYX', value: 'TELNYX' },
];

const DidEditForm = (props: FormType) => {
  const {
    open,
    toggle,
    currentData,
    addFlag,
    success,
    departmentList,
    locationList,
    uid,
  } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required('Title is required field')
      .max(30, 'Maxlength is 30 characters'),
    phoneNumber: yup
      .string()
      .required('Phone Number is required field')
      .max(10, 'Invalid Phone Number'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      phoneNumber: currentData?.phoneNumber || '',
      departmentId: currentData?.departmentId || '',
      didProvider: currentData?.didProvider || 'BANDWIDTH',
      didLocationId: currentData?.didLocationId || [],
      countryCode: currentData?.countryCode || '+1',
      isDefault: currentData?.isDefault || false,
      status: currentData?.status || 'ACTIVE',
      uid: currentData?.uid || uid,
    }),
    [currentData, uid],
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
      const departmentId = Boolean(data?.departmentId)
        ? data?.departmentId
        : null;
      const formData = {
        ...data,
        departmentId,
      };
      const response = addFlag
        ? await axios.post(`/did/`, formData)
        : await axios.patch(`/did/${currentData.id}`, formData);
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
        <Typography variant="h6">{addFlag ? 'Add' : 'Edit'} DID</Typography>
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

          <CustomFormPhone
            name={'phoneNumber'}
            label={'Phone Number'}
            errors={errors}
            control={control}
            disabled={!addFlag}
          />

          <CustomFormSelect
            name={'departmentId'}
            label={'Select Department'}
            options={departmentList}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'didProvider'}
            label={'Select Provider'}
            options={DID_PROVIDER}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'didLocationId'}
            label={'Select Location'}
            options={locationList}
            errors={errors}
            control={control}
            multiple={true}
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

export default DidEditForm;
