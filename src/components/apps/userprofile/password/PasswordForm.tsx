import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { PASSWORD_REGEX } from '../../../../utils/constant';
import CustomTextField from '../../../custom/CustomTextField';

const PasswordForm = () => {
  const { user } = useAuth();
  const [toggleOldPassword, setToggleOldPassword] = useState<boolean>(true);
  const [togglePassword, setTogglePassword] = useState<boolean>(true);
  const [toggleConfirm, setToggleConfirm] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    oldPassword: yup.string().required('Please Enter your old password'),
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
      oldPassword: '',
      password: '',
      confirmPassword: '',
    }),
    [],
  );

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

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = {
        ...data,
        uid: user?.uid,
      };
      const response = await axios.put(`/users/change-password`, formData);
      if (response.status === 200) {
        toast.success('Password Updated Successfully');
        reset();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <Card
      sx={{
        padding: 0,
        borderColor: (theme: any) => theme.palette.divider,
      }}
      variant="outlined"
    >
      <CardHeader title={'Password Settings'} />
      <Divider />{' '}
      <CardContent
        sx={{
          backgroundImage: 'url(/images/backgrounds/password.png)',
          backgroundPosition: 'right',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      >
        <form style={{}} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ maxWidth: 320 }}>
                <Controller
                  name="oldPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      label="Old Password"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.oldPassword)}
                      fullWidth
                      type={toggleOldPassword ? 'password' : 'text'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setToggleOldPassword(!toggleOldPassword)
                              }
                              edge="end"
                            >
                              {toggleOldPassword ? (
                                <IconEyeOff fontSize={12} stroke={'#DFE5EF'} />
                              ) : (
                                <IconEye fontSize={12} stroke={'#DFE5EF'} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {errors.oldPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.oldPassword.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ maxWidth: 320 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      label="New Password"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      fullWidth
                      type={togglePassword ? 'password' : 'text'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setTogglePassword(!togglePassword)}
                              edge="end"
                            >
                              {togglePassword ? (
                                <IconEyeOff fontSize={12} stroke={'#DFE5EF'} />
                              ) : (
                                <IconEye fontSize={12} stroke={'#DFE5EF'} />
                              )}
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
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ maxWidth: 320 }}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      label="Confirm Password"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.confirmPassword)}
                      fullWidth
                      type={toggleConfirm ? 'password' : 'text'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setToggleConfirm(!toggleConfirm)}
                              edge="end"
                            >
                              {toggleConfirm ? (
                                <IconEyeOff fontSize={12} stroke={'#DFE5EF'} />
                              ) : (
                                <IconEye fontSize={12} stroke={'#DFE5EF'} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.confirmPassword.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                Change Password
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
