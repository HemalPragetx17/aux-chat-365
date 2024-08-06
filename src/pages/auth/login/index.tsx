import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import AUXlogo from '../../../../src/images/side_icon/AUXlogo.png';
import LoginPage from '../../../../src/images/side_icon/Login.png';
import Phone from '../../../../src/images/side_icon/Phone.png';
import CustomTextFieldLogin from '../../../components/custom/CustomTextFieldLogin';
import { useAuth } from '../../../hooks/useAuth';

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const auth = useAuth();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required('Email is required')
      .email('Enter valid Email'),
    password: yup.string().required('Password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    [],
  );

  useEffect(() => {
    auth.setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('toggle_flag');
    reset(defaultValues);
  }, []);

  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { email, password } = data;
      setIsLoading(true);
      auth.login({ email, password }, (err: any) => {
        setIsLoading(false);
        setError('email', {
          type: 'manual',
          message: err?.message || 'Invalid email or password',
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="background-image"
      style={{
        overflowX: 'hidden',
        backgroundSize: '100% 100%',
        backgroundImage: `url(${LoginPage.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100%',
        backgroundColor: '#1d1f58',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="mobile-container">
        <Image alt="" src={Phone} className="img-mobile" />
        <div className="abs-mobile-form">
          <Image
            src={AUXlogo}
            alt="Google Play"
            style={{ height: '150px', width: '200px' }}
          />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0', fontSize: '15px', color: 'white' }}>
              LOGIN
            </h3>
            <p style={{ margin: '0', fontSize: '10px', color: 'white' }}>
              Please sign in to continue
            </p>
          </div>
          <Box>
            <Box sx={{ minWidth: '180px' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                  <FormControl fullWidth>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextFieldLogin
                          // style={{ backgroundColor: "#233754", color: "white" }}
                          defaultValue={value}
                          label=""
                          size="small"
                          placeholder="Email"
                          onChange={(e: any) => {
                            setValue('email', e?.target?.value);
                          }}
                          error={Boolean(errors.email)}
                        />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.email.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Box>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextFieldLogin
                          type={showPassword ? 'text' : 'password'}
                          value={value}
                          label=""
                          // style={{ backgroundColor: "#233754", color: "white" }}
                          placeholder="Password"
                          size="small"
                          onChange={(e: any) => {
                            setValue('password', e?.target?.value);
                          }}
                          error={Boolean(errors.password)}
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <IconEyeOff /> : <IconEye />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      fontSize: '12px',
                      color: '#ffffff',
                      backgroundColor: '#1EADC2',
                      borderRadius: '3px',
                      height: '24px',
                      maxWidth: '60%',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: '#1EADC2',
                      },
                    }}
                  >
                    Login
                  </LoadingButton>
                </Box>
                <Box>
                  <Typography
                    component={Link}
                    href="/auth/forgot-password"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      fontSize: '8px',
                      color: '#1eadc2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
                <Box sx={{ mt: '27px' }}>
                  <Typography
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      fontSize: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    style={{ color: 'white' }}
                  >
                    Don't have an access?
                  </Typography>
                  <Typography
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: '#1eadc2',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Create an account →
                  </Typography>
                </Box>
              </form>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

Login.layout = 'Blank';
export default Login;
