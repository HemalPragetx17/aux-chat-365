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

export const ROLE_OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Administrator', value: 1 },
  { label: 'Supervisor', value: 2 },
  { label: 'Operator', value: 3 },
  { label: 'Employee', value: 4 },
  { label: 'Human Resource', value: 5 },
  { label: 'Accounting', value: 6 },
];

const PbxConfigForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  // type
  const schema = yup.object().shape({
    email_addr: yup.string().required('Call Email is required'),
    caller_id: yup.string().required('Caller Id is required'),
    extensionId: addFlag
      ? yup.number().nullable()
      : yup.number().required('Extension Id is required'),
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    reg_name: yup.string().required('Reg Name is required'),
    title: yup.string().required('Title is required'),
    mobile_number: addFlag
      ? yup.string().required('Mobile Number is required')
      : yup.string(),
    number: addFlag
      ? yup.string().required('Number is required')
      : yup.string(),
    role_id: addFlag
      ? yup.number().required('Role Id is required')
      : yup.number().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      email_addr: currentData?.Profile?.pbxConfig?.callEmail || '',
      caller_id: currentData?.Profile?.pbxConfig?.caller_id || '',
      extensionId: currentData?.Profile?.pbxConfig?.extensionId || null,
      first_name: currentData?.Profile?.pbxConfig?.first_name || '',
      last_name: currentData?.Profile?.pbxConfig?.last_name || '',
      reg_name: currentData?.Profile?.pbxConfig?.reg_name || '',
      title: currentData?.Profile?.pbxConfig?.title || '',
      user_password: currentData?.Profile?.pbxConfig?.user_password || '',
      reg_password: currentData?.Profile?.pbxConfig?.reg_password || '',
      mobile_number: currentData?.Profile?.pbxConfig?.mobile_number || '',
      number: currentData?.Profile?.pbxConfig?.number || '',
      role_id: currentData?.Profile?.pbxConfig?.role_id || 0,
    }),
    [currentData],
  );

  useEffect(() => {
    setLoading(false);
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
      let payload = {};

      if (!addFlag) {
        // payload["extensionId"] = currentData?.Profile?.pbxConfig?.extensionId;
        payload = {
          role_id: data?.role_id,
          mobile_number: data?.mobile_number,
          email_addr: data?.email_addr,
          title: data?.title,
          reg_name: data?.reg_name,
          last_name: data?.last_name,
          first_name: data?.first_name,
          extensionId: data?.extensionId,
          caller_id: data?.caller_id,
        };
      } else {
        payload = data;
      }

      setLoading(true);
      const response: any = await axios.post(
        `/call-features/reg-extension/${currentData?.id}`,
        payload,
      );
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        success();
        reset();
        handleClose();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
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
          {addFlag ? 'Add' : 'Edit'} Extension
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

          {!addFlag && (
            <CustomFormText
              disabled={!addFlag}
              name={'extensionId'}
              label={'Extension Id'}
              errors={errors}
              control={control}
            />
          )}
          <CustomFormText
            disabled={!addFlag}
            name={'number'}
            label={'Extension Number'}
            errors={errors}
            control={control}
          />
          <CustomFormText
            name={'caller_id'}
            label={'Caller Id'}
            errors={errors}
            control={control}
          />
          <CustomFormText
            name={'reg_name'}
            label={'Reg Name'}
            errors={errors}
            control={control}
          />
          {/* {addFlag && (
            <CustomFormText
              type="password"
              name={'reg_password'}
              label={'Reg Password'}
              errors={errors}
              control={control}
            />
          )} */}

          <CustomFormText
            name={'first_name'}
            label={'First Name'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'last_name'}
            label={'Last Name'}
            errors={errors}
            control={control}
          />
          <CustomFormText
            name={'email_addr'}
            label={'Call Email'}
            errors={errors}
            control={control}
          />

          {addFlag && (
            <CustomFormText
              name={'mobile_number'}
              label={'Mobile Number'}
              errors={errors}
              control={control}
            />
          )}
          {/* {addFlag && (
            <CustomFormText
              type="password"
              name={'user_password'}
              label={'User Password'}
              errors={errors}
              control={control}
            />
          )} */}
          {addFlag && (
            <CustomFormSelect
              name={'role_id'}
              label={'Role Id'}
              options={ROLE_OPTIONS}
              errors={errors}
              control={control}
            />
          )}
          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default PbxConfigForm;
