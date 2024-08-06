import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import CustomTextField from '../../../custom/CustomTextField';
import ChildCard from '../../../shared/ChildCard';

const MerchantForm = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);

  const schema = yup.object().shape({
    NotificationEmail: yup
      .string()
      .required('Notification Email is required')
      .email('Enter valid email'),
    PrivacyPolicyURL: yup.string().required('Privacy Policy URL is required'),
    ReturnPolicyURL: yup.string().required('Return Policy URL is required'),
    CancellationPolicyURL: yup
      .string()
      .required('Cancellation Policy URL is required'),
    ShippingPolicyURL: yup.string().required('Shipping Policy URL is required'),
    CompanyName: yup.string().required('Company Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      brandColor: '#ff0000',
      CompanyName: data?.CompanyName || '',
      NotificationEmail: data?.NotificationEmail || '',
      DisplaySaveCard: data?.DisplaySaveCard === true ? 1 : 0,
      PrivacyPolicyURL: data?.PrivacyPolicyURL || '',
      ReturnPolicyURL: data?.ReturnPolicyURL || '',
      CancellationPolicyURL: data?.CancellationPolicyURL || '',
      ShippingPolicyURL: data?.ShippingPolicyURL || '',
      uid: user?.uid,
    }),
    [data, user],
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
    setImageChanged(false);
    setFile(data?.MerchantLogo || null);
  }, [data]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = useCallback(async () => {
    const response = await axios.get(`/auxvault/${user?.uid}`);
    setData(response?.data);
    setLoading(false);
  }, [user]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (imageChanged) {
      }
      let formData = {
        ...data,
      };
      if (imageChanged) {
        formData = {
          ...formData,
          file,
        };
      }

      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const response = await axios.post(
        `/users/av-merchant/update`,
        formData,
        header,
      );
      if (response.status === 200) {
        toast.success('Updated Successfully');
        fetchData();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('API Error.');
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setFile(file);
        setImageChanged(true);
      } else {
        toast.error('Only File Type Image Format Allowed!');
      }
    }
  };

  const handleFilePreview = (data: any) => {
    if (!Boolean(data)) {
      return 'https://auxchat.com/wp-content/uploads/2021/07/rsz_auxchat-logo.png';
    }
    if (typeof data === 'string') {
      return data;
    }
    return URL.createObjectURL(data as any);
  };

  return (
    <ChildCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="CompanyName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Company Name"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.CompanyName)}
                    fullWidth
                  />
                )}
              />
              {errors.CompanyName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.CompanyName as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Controller
                name="NotificationEmail"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Notification Email"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.NotificationEmail)}
                    fullWidth
                  />
                )}
              />
              {errors.NotificationEmail && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.NotificationEmail as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-select" size="small">
                Display Save Card
              </InputLabel>
              <Controller
                name="DisplaySaveCard"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    size="small"
                    id="select-type"
                    label="Display Save Card"
                    labelId="type-select"
                    value={value}
                    onChange={onChange}
                    inputProps={{ placeholder: 'Display Save Card' }}
                  >
                    <MenuItem value={1}>YES</MenuItem>
                    <MenuItem value={0}>NO</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Button
                variant="outlined"
                component="label"
                onChange={handleFileChange}
              >
                Upload File
                <input type="file" accept="image/png, image/jpeg" hidden />
              </Button>
              <Typography variant="body1" component={'p'} mt={2}>
                For resize MerchantLogo{' '}
                <a href="https://online-image-resizer.com" target="_blank">
                  click here
                </a>{' '}
                (Width:600px and Height:118 px)
              </Typography>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Avatar
              alt={'merchantLogo'}
              src={handleFilePreview(file)}
              sx={{ width: '300px', height: '59px', objectFit: 'contain' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Alert icon={false} severity="info">
              <Typography variant="h3" mb={2}>
                Policies and Terms
              </Typography>
              There will be presented to your customers, as appropriate. Each
              link must be a full UPL to a document or page, starting with
              https://.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="PrivacyPolicyURL"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Privacy Policy URL"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.PrivacyPolicyURL)}
                    fullWidth
                    helperText="It should explain to your customers how you will treat their data/identity."
                  />
                )}
              />
              {errors.PrivacyPolicyURL && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.PrivacyPolicyURL as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="ReturnPolicyURL"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Return Policy URL"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.ReturnPolicyURL)}
                    fullWidth
                    helperText="Let your customers know how they can return a product/purchase."
                  />
                )}
              />
              {errors.ReturnPolicyURL && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.ReturnPolicyURL as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="CancellationPolicyURL"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Cancellation Policy URL"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.CancellationPolicyURL)}
                    fullWidth
                    helperText="Let your customer know hem they can cancel services."
                  />
                )}
              />
              {errors.CancellationPolicyURL && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.CancellationPolicyURL as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="ShippingPolicyURL"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Shipping Policy URL"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.ShippingPolicyURL)}
                    fullWidth
                    helperText="Explain how your business handles shipping products to your customers."
                  />
                )}
              />
              {errors.ShippingPolicyURL && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.ShippingPolicyURL as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} mt={2}>
            <LoadingButton
              color="primary"
              type="submit"
              variant="contained"
              loading={loading}
              disabled={!Boolean(data?.ownerId)}
            >
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </ChildCard>
  );
};

export default MerchantForm;
