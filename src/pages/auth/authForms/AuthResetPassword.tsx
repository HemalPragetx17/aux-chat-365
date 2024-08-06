import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


import CustomFormText from '../../../components/custom/form/CustomFormText';
import { useAuth } from '../../../hooks/useAuth';
import { PASSWORD_REGEX } from '../../../utils/constant';

const AuthResetPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();

  const schema = yup.object().shape({
    code: yup
      .string()
      .required('Please enter the 6 digit code')
      .max(6, 'Maximum Length 6 Character'),
    password: yup
      .string()
      .required('Please enter your password')
      .matches(
        PASSWORD_REGEX,
        'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
    confirmPassword: yup
      .string()
      .required('Please re-enter your password')
      .oneOf([yup.ref('password'), ''], 'Passwords must match'),
  });

  const defaultValues = useMemo(
    () => ({
      code: '',
      password: '',
      confirmPassword: '',
    }),
    [],
  );

  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    auth.setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    reset(defaultValues);
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      auth.resetPassword({ ...data }, () => {
        setIsLoading(false);
        setError('code', {
          type: 'manual',
          message: 'Invalid Code',
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack mt={4} spacing={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomFormText
          type={'number'}
          name={'code'}
          label={'OTP'}
          errors={errors}
          control={control}
        />

        <CustomFormText
          type={'password'}
          name={'password'}
          label={'New Password'}
          errors={errors}
          control={control}
        />

        <CustomFormText
          type={'password'}
          name={'confirmPassword'}
          label={'Confirm Password'}
          errors={errors}
          control={control}
        />

        <LoadingButton
          loading={isLoading}
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          type="submit"
        >
          Reset Password
        </LoadingButton>

        <Button
          color="primary"
          size="large"
          variant="outlined"
          fullWidth
          component={Link}
          sx={{ mt: 2 }}
          href="/auth/login"
        >
          Back to Login
        </Button>
      </form>
    </Stack>
  );
};

export default AuthResetPassword;
