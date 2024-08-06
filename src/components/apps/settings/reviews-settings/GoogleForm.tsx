import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, FormHelperText, Grid } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomTextField from '../../../custom/CustomTextField';
import ChildCard from '../../../shared/ChildCard';

const GoogleForm = () => {
  const schema = yup.object().shape({
    reviewRequestMessage: yup
      .string()
      .required('Review Request Message is required'),
    siteReviewUrl: yup.string().required('Site Review URL is required'),
    reviewPageDescription: yup
      .string()
      .required('Review Page Description is required'),
    reviewSuccessMessage: yup
      .string()
      .required('Review Success Message is required'),
    redirectWebsiteUrl: yup
      .string()
      .required('Redirect Website URL is required'),
  });

  const defaultValues = useMemo(
    () => ({
      reviewRequestMessage: '',
      siteReviewUrl: '',
      reviewPageDescription: '',
      reviewSuccessMessage: '',
      redirectWebsiteUrl: '',
      logo: null,
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
    <ChildCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="reviewRequestMessage"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Review Request Message"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.reviewRequestMessage)}
                    fullWidth
                  />
                )}
              />
              {errors.reviewRequestMessage && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.reviewRequestMessage.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="siteReviewUrl"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Site Review URL"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.siteReviewUrl)}
                    fullWidth
                  />
                )}
              />
              {errors.siteReviewUrl && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.siteReviewUrl.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="reviewPageDescription"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Review Page Description"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.reviewPageDescription)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
              {errors.reviewPageDescription && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.reviewPageDescription.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="reviewSuccessMessage"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Review Success Message"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.reviewSuccessMessage)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
              {errors.reviewSuccessMessage && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.reviewSuccessMessage.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="redirectWebsiteUrl"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Redirect Website URL"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.redirectWebsiteUrl)}
                    fullWidth
                  />
                )}
              />
              {errors.redirectWebsiteUrl && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.redirectWebsiteUrl.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="logo"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Button variant="outlined" component="label">
                    Upload File For Review Page Logo
                    <input type="file" accept="image/png, image/jpeg" hidden />
                  </Button>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} mt={2}>
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </ChildCard>
  );
};

export default GoogleForm;
