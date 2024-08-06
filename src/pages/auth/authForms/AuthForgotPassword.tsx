import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, FormControl, FormHelperText, Stack } from '@mui/material';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomTextField from '../../../components/custom/CustomTextField';
import { useAuth } from '../../../hooks/useAuth';
import CustomTextFieldLogin from '../../../components/custom/CustomTextFieldLogin';

const AuthForgotPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Enter valid email')
      .required('Email is required'),
  });

  const defaultValues = useMemo(
    () => ({
      email: '',
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
      const { email } = data;
      setIsLoading(true);
      auth.forgotPassword({ email }, () => {
        setIsLoading(false);
        setError('email', {
          type: 'manual',
          message: 'Invalid Email',
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack mt={1} spacing={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextFieldLogin
                type="email"
                value={value}
                label=""
                className="placeholder-white"
                placeholder={"Email"}
                size="small"
                // style={{ backgroundColor: "#233754", color: "white" }}
                onChange={onChange}
                error={Boolean(errors.email)}
                fullWidth
              />
            )}
          />
          {errors.email && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.email.message}
            </FormHelperText>
          )}
        </FormControl>

        <Stack mt={1} spacing={2}>
          <LoadingButton
            loading={isLoading}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            style={{
              fontSize: "11px",
              color: "#ffffff",
              backgroundColor: "#1EADC2",
              borderRadius: "3px",
              height: "23px",
            }}
          >
            Forgot Password
          </LoadingButton>
          <Button
            size="small"
            fullWidth
            component={Link}
            style={{ color: "#1eadc2" }}
            href="/auth/login"
          >
            Back to Login
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default AuthForgotPassword;
