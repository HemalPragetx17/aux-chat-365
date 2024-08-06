import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomCheckbox from '../../../components/custom/CustomCheckbox';
import RegisterText from '../../../components/custom/CustomRegisterTextField';
import { registerType } from '../../../types/auth/auth';

const AuthRegister = ({ title, subtitle }: registerType) => {
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState<boolean>(false);

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    userName: yup.string().required('Username is required'),
    accountTitle: yup.string().required('Account is required'),
    email: yup
      .string()
      .email('Enter valid email')
      .required('Email is required'),
    phoneNo: yup
      .string()
      .required('Phone Number is Required')
      .test('length', 'Invalid Phone Number', (val) => {
        return val?.length === 10;
      }),
    typeOfBuisness: yup.string().required('Type of Buisness is a required'),
    applicationUse: yup.string().required('This field is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: null,
      firstName: '',
      lastName: '',
      userName: '',
      accountTitle: '',
      email: '',
      phoneNo: '',
      typeOfBuisness: '',
      applicationUse: '',
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1} color={'#ffffff'}>
          {title}
        </Typography>
      )}

      <Typography variant="subtitle1" color="#ffffff" mb={4}>
        Create an account and start texting your customers! You'll need access
        to your business line so we can text enable it for you.
      </Typography>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      label="First Name"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.firstName)}
                      fullWidth
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.firstName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      label="Last Name"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.lastName)}
                      fullWidth
                    />
                  )}
                />
                {errors.lastName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.lastName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="userName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      label="Username"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.userName)}
                      fullWidth
                    />
                  )}
                />
                {errors.userName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.userName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="accountTitle"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      label="Account Title"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.accountTitle)}
                      fullWidth
                    />
                  )}
                />
                {errors.accountTitle && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.accountTitle.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      type="email"
                      label="Email"
                      size="small"
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
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="phoneNo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      type="number"
                      value={value}
                      label="Phone Number"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.phoneNo)}
                      fullWidth
                    />
                  )}
                />
                {errors.phoneNo && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.phoneNo.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="typeOfBuisness"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      label="Type of Buisness"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.typeOfBuisness)}
                      fullWidth
                    />
                  )}
                />
                {errors.typeOfBuisness && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.typeOfBuisness.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="applicationUse"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RegisterText
                      value={value}
                      label="Explain how you will be using this application"
                      size="small"
                      multiline
                      rows={3}
                      onChange={onChange}
                      error={Boolean(errors.applicationUse)}
                      fullWidth
                    />
                  )}
                />
                {errors.applicationUse && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.applicationUse.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 100,
                    color: '#ffffff',
                  },
                  '& a': { color: '#f72b73' },
                }}
                label={
                  <>
                    By clicking “Create Account” you understand that you are
                    agreeing to the{' '}
                    <a target="_blank" href="https://www.auxchat.com/terms">
                      Terms &amp; Condition
                    </a>
                  </>
                }
                control={
                  <CustomCheckbox
                    checked={termsChecked}
                    onChange={() => setTermsChecked(!termsChecked)}
                    name="controlled"
                  />
                }
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 100,
                    color: '#ffffff',
                  },
                }}
                label="This application is not intended for blast and marketing campaigns."
                control={
                  <CustomCheckbox
                    checked={disclaimerChecked}
                    onChange={() => setDisclaimerChecked(!disclaimerChecked)}
                    name="controlled"
                  />
                }
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <LoadingButton
                loading={false}
                color="primary"
                type="submit"
                variant="contained"
                fullWidth
                disabled={!disclaimerChecked || !termsChecked}
                sx={{
                  '&:disabled': {
                    backgroundColor: 'grey',
                    color: '#ffffff',
                    opacity: 0.5,
                  },
                }}
              >
                Create An Account
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
