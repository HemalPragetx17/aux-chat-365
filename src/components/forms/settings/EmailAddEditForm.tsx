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
  departmentList: any[];
  uid: string;
}

const EmailAddEditForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success, departmentList, uid } =
    props;

  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required('Title is required field')
      .max(30, 'Maxlength is 30 characters'),
    email: yup
      .string()
      .required('Email is required field')
      .email('Enter valid Email'),
    departmentId: yup.string(),
    isDefault: yup.boolean().required('Default is required field'),
    status: yup.string().required('Status is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      departmentId: currentData?.departmentId || '',
      email: currentData?.email || '',
      isDefault: currentData?.isDefault || false,
      status: currentData?.status || 'ACTIVE',
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
        ownerId: uid,
      };
      const response = addFlag
        ? await axios.post(`/email-nylas/`, formData)
        : await axios.patch(`/email-nylas/${currentData.id}`, formData);
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
        <Typography variant="h6">{addFlag ? 'Add' : 'Edit'} Email</Typography>
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
            disabled={!addFlag}
            name={'email'}
            label={'Email'}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'departmentId'}
            label={'Select Department'}
            options={departmentList}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'isDefault'}
            label={'Default'}
            options={[
              { label: 'False', value: false },
              { label: 'True', value: true },
            ]}
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

export default EmailAddEditForm;
