import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, FormHelperText, Grid } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomTextField from '../../custom/CustomTextField';

export default function SmsHelpDeskForm() {
  useEffect(() => {
    reset();
  }, []);

  const schema = yup.object().shape({
    phone: yup
      .string()
      .required('Phone Number is required')
      .matches(/^(|.{8,15})$/, 'Invalid phone number'),
    title: yup.string().required('Title is required'),
    description: yup.string().required('Discription is required'),
  });

  const defaultValues = useMemo(
    () => ({
      phone: '',
      title: '',
      description: '',
      by: 'sms',
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

  const onSubmit = async (data: any) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} maxWidth={'md'}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  type={'number'}
                  label="Please provide your Phone No."
                  size="small"
                  onChange={onChange}
                  error={Boolean(errors.phone)}
                  fullWidth
                />
              )}
            />
            {errors.phone && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.phone as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="title"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label="Please enter your query title"
                  size="small"
                  onChange={onChange}
                  error={Boolean(errors.title)}
                  fullWidth
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.title as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="description"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label="Please enter your query description/ more details"
                  size="small"
                  onChange={onChange}
                  multiline
                  rows={3}
                  error={Boolean(errors.description)}
                  fullWidth
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.description as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item md={12} xs={12}>
          <Button color="primary" type="submit" variant="contained">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
