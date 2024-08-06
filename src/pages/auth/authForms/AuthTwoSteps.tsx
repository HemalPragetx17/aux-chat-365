import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomFormLabel from '../../../components/custom/CustomFormLabel';
import CustomTextField from '../../../components/custom/CustomTextField';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: '',
};

const AuthTwoSteps = () => {
  const [isBackspace, setIsBackspace] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { email, counts, lastAttemptedAt } = JSON.parse(
    localStorage.getItem('otp_data') || '{}',
  );
  const hideResend =
    counts >= 3 &&
    moment.utc().diff(moment.utc(lastAttemptedAt), 'minutes') < 60;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.replace('/auth/login');
    }
    auth.setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setError(false);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleChange = (
    event: ChangeEvent,
    onChange: (...event: any[]) => void,
  ) => {
    if (!isBackspace) {
      // @ts-ignore
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      const value = form[index].value && form[index].value.length;
      if (value && index < 10) {
        form.elements[index + 2].focus();
      }
    }
    onChange(event);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    setIsBackspace(event.key === 'Backspace');
  };

  const onSubmit = (data: any) => {
    setIsLoading(true);
    const { val1, val2, val3, val4, val5, val6 } = data;
    const token = `${val1}${val2}${val3}${val4}${val5}${val6}`;
    auth.loginOTP({ token }, () => {
      setIsLoading(false);
      setError(true);
    });
  };

  const onResend = async () => {
    setIsLoading(true);
    const response = await axios.post('/auth/login/resend/otp', { email });
    const otp_data = { ...response.data?.OtpRetries, email };
    localStorage.setItem('otp_data', JSON.stringify(otp_data));
    setIsLoading(false);
    toast.success('OTP Sent Successfully!');
  };

  return (
    <Box mt={4}>
      <Stack mb={3}>
        <CustomFormLabel htmlFor="code">
          Type your 6 digits security code{' '}
        </CustomFormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} direction="row" mb={2}>
            {Object.keys(defaultValues).map((val, index) => (
              <Controller
                key={index}
                name={val}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    variant="outlined"
                    type={'tel'}
                    inputProps={{ maxLength: 1 }}
                    onKeyDown={handleKeyDown}
                    onChange={(event: ChangeEvent) =>
                      handleChange(event, onChange)
                    }
                    value={value}
                    fullWidth
                  />
                )}
              />
            ))}
          </Stack>
          {error && (
            <Alert icon={false} severity={'error'} sx={{ mb: 2 }}>
              OTP is Invalid
            </Alert>
          )}
          <LoadingButton
            loading={isLoading}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Verify My Account
          </LoadingButton>
        </form>
      </Stack>
      <Button
        color="primary"
        size="large"
        variant="outlined"
        fullWidth
        component={Link}
        href="/auth/login"
      >
        Back to Login
      </Button>

      {!hideResend && (
        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Didn't get the code?
          </Typography>
          <Typography
            fontWeight="500"
            onClick={onResend}
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Resend
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default AuthTwoSteps;
