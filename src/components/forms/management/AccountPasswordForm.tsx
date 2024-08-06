import { yupResolver } from '@hookform/resolvers/yup';
import { Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
}

const AccountPasswordForm = (props: FormType) => {
  const { open, toggle, currentData } = props;

  const schema = yup.object().shape({
    password: yup
      .string()
      .required('Password is a required')
      .matches(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{9,}$/,
        'Invalid Password',
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), ''], 'Passwords must match'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?.id || null,
      password: '',
      confirmPassword: '',
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
        <Typography variant="h6">Change Password</Typography>
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
            name={'password'}
            type={'password'}
            label={'Password'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'confirmPassword'}
            type={'password'}
            label={'Confirm Password'}
            errors={errors}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} />
        </form>
      </Box>
    </Drawer>
  );
};

export default AccountPasswordForm;
