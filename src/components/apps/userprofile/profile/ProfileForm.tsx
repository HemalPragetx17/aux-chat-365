import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import ChildCard from '../../../../components/shared/ChildCard';
import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import CustomFormSelect from '../../../custom/form/CustomFormSelect';
import CustomFormText from '../../../custom/form/CustomFormText';
import CustomFormTextArea from '../../../custom/form/CustomFormTextArea';

const ROLE_OPTIONS = [
  { label: 'MASTER ADMIN', value: '1' },
  { label: 'ADMIN', value: '2' },
  { label: 'OPERATOR', value: '3' },
];

const ProfileForm = (props: any) => {
  const { profile, success } = props;
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Enter valid email')
      .required('Email is required'),
    phone: yup
      .string()
      .required('Phone Number is Required')
      .test('length', 'Invalid Phone Number', (val) => {
        return val?.length === 10;
      }),
  });

  const defaultValues = useMemo(
    () => ({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      roleId: profile?.Roles?.roleId.toString() || '',
      address: {
        street: profile?.Profile?.address?.street || '',
        city: profile?.Profile?.address?.city || '',
        state: profile?.Profile?.address?.state || '',
        zip: profile?.Profile?.address?.zip || '',
      },
      status: profile?.status || '',
      about: profile?.Profile?.about || '',
      company: profile?.Profile?.company || '',
    }),
    [profile],
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
  }, [profile]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { name, phone, email, status, company, about, address } = data;
      const response = await axios.patch(`/users/partial-update/${user?.uid}`, {
        name,
        phone,
        email,
        status,
      });
      if (response.status === 200) {
        const profile_payload = {
          company,
          about,
          address,
        };
        const _response = await axios.post(
          `/users/profile/${user?.uid}`,
          profile_payload,
        );
        if (_response.status === 200) {
          toast.success('Profile Updated Successfully');
          success();
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <ChildCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Boolean(profile) && (
          <Grid container spacing={3} paddingY={3}>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                name={'name'}
                label={'Name'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                name={'email'}
                label={'Email'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                type={'number'}
                name={'phone'}
                label={'Phone'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormSelect
                name={'roleId'}
                label={'Role'}
                options={ROLE_OPTIONS}
                errors={errors}
                control={control}
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                name={'address.street'}
                label={'Street'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                name={'address.city'}
                label={'City'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                name={'address.state'}
                label={'State'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                type={'number'}
                name={'address.zip'}
                label={'Zip Code'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormText
                name={'company'}
                label={'Company'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
              <CustomFormTextArea
                name={'about'}
                label={'About'}
                errors={errors}
                control={control}
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                fullWidth
              >
                Update
              </LoadingButton>
            </Grid>
          </Grid>
        )}
      </form>
    </ChildCard>
  );
};

export default ProfileForm;
