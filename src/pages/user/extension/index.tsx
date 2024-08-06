import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import ProfileBanner from '../../../components/apps/userprofile/profile/ProfileBanner';
import PageContainer from '../../../components/container/PageContainer';
import CustomFormSelect from '../../../components/custom/form/CustomFormSelect';
import CustomFormText from '../../../components/custom/form/CustomFormText';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';

export const ROLE_OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Administrator', value: 1 },
  { label: 'Supervisor', value: 2 },
  { label: 'Operator', value: 3 },
  { label: 'Employee', value: 4 },
  { label: 'Human Resource', value: 5 },
  { label: 'Accounting', value: 6 },
];
export default function ExtensionSettingCard() {
  const { user } = useAuth();
  const [currentData, setCurrentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addFlag, setAddFlag] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {
    !currentData?.Profile?.pbxConfig?.extensionId
      ? setAddFlag(true)
      : setAddFlag(false);
  }, [currentData]);

  const fetchUserData = async () => {
    const resposne = await axios.get(`/users/${user?.uid}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
    }
  };
  const schema = yup.object().shape({
    email_addr: yup.string().required('Call Email is required'),
    caller_id: yup.string().required('Caller Id is required'),
    extensionId: addFlag
      ? yup.number().nullable()
      : yup.number().required('Extension Id is required'),
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    reg_name: yup.string().required('Reg Name is required'),
    title: yup.string().required('Title is required'),
    // user_password: addFlag
    //   ? yup
    //       .string()
    //       .required('Password is required')
    //       .min(8, 'Password must be at least 8 characters long')
    //       .matches(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?!.*([0-9])\1{3,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    //         'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character. No 4 or more numbers allowed consecutively.',
    //       )
    //   : yup.string(),
    // reg_password: addFlag
    //   ? yup
    //       .string()
    //       .required('Password is required')
    //       .min(8, 'Password must be at least 8 characters long')
    //       .matches(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?!.*([0-9])\1{3,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    //         'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character. No 4 or more numbers allowed consecutively.',
    //       )
    //   : yup.string(),
    mobile_number: addFlag
      ? yup.string().required('Mobile Number is required')
      : yup.string(),
    number: addFlag
      ? yup.string().required('Number is required')
      : yup.string(),
    role_id: addFlag
      ? yup.number().required('Role Id is required')
      : yup.number().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      email_addr: currentData?.Profile?.pbxConfig?.callEmail || '',
      caller_id: currentData?.Profile?.pbxConfig?.caller_id || '',
      extensionId: currentData?.Profile?.pbxConfig?.extensionId || null,
      first_name: currentData?.Profile?.pbxConfig?.first_name || '',
      last_name: currentData?.Profile?.pbxConfig?.last_name || '',
      reg_name: currentData?.Profile?.pbxConfig?.reg_name || '',
      title: currentData?.Profile?.pbxConfig?.title || '',
      user_password: currentData?.Profile?.pbxConfig?.user_password || '',
      reg_password: currentData?.Profile?.pbxConfig?.reg_password || '',
      mobile_number: currentData?.Profile?.pbxConfig?.mobile_number || '',
      number: currentData?.Profile?.pbxConfig?.number || '',
      role_id: currentData?.Profile?.pbxConfig?.role_id || 0,
    }),
    [currentData],
  );

  useEffect(() => {
    setLoading(false);
    reset(defaultValues);
  }, [open, currentData]);

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
      let payload = {};

      if (!addFlag) {
        // payload["extensionId"] = currentData?.Profile?.pbxConfig?.extensionId;
        payload = {
          role_id: data?.role_id,
          mobile_number: data?.mobile_number,
          email_addr: data?.email_addr,
          title: data?.title,
          reg_name: data?.reg_name,
          last_name: data?.last_name,
          first_name: data?.first_name,
          extensionId: data?.extensionId,
          caller_id: data?.caller_id,
        };
      } else {
        payload = data;
      }

      setLoading(true);
      const response: any = await axios.post(
        `/call-features/reg-extension/${currentData?.id}`,
        payload,
      );
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
    }
  };

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item container spacing={3} sm={12} xs={12} padding={3}>
            <Grid item md={6} sm={12} xs={12}>
              {' '}
              <CustomFormText
                name={'title'}
                label={'Title'}
                errors={errors}
                control={control}
              />
            </Grid>

            {!addFlag && (
              <Grid item md={6} sm={12} xs={12}>
                {' '}
                <CustomFormText
                  disabled={!addFlag}
                  name={'extensionId'}
                  label={'Extension Id'}
                  errors={errors}
                  control={control}
                />
              </Grid>
            )}
            <Grid item md={6} sm={12} xs={12}>
              {' '}
              <CustomFormText
                disabled={!addFlag}
                name={'number'}
                label={'Extension Number'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              {' '}
              <CustomFormText
                name={'caller_id'}
                label={'Caller Id'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              {' '}
              <CustomFormText
                name={'reg_name'}
                label={'Reg Name'}
                errors={errors}
                control={control}
              />
            </Grid>
            {/* {addFlag && (
              <Grid item md={6} sm={12} xs={12}>
                {' '}
                <CustomFormText
                  type="password"
                  name={'reg_password'}
                  label={'Reg Password'}
                  errors={errors}
                  control={control}
                />
              </Grid>
            )} */}

            <Grid item md={6} sm={12} xs={12}>
              <CustomFormText
                name={'first_name'}
                label={'First Name'}
                errors={errors}
                control={control}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              {' '}
              <CustomFormText
                name={'last_name'}
                label={'Last Name'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              {' '}
              <CustomFormText
                name={'email_addr'}
                label={'Call Email'}
                errors={errors}
                control={control}
              />
            </Grid>

            {addFlag && (
              <Grid item md={6} sm={12} xs={12}>
                {' '}
                <CustomFormText
                  name={'mobile_number'}
                  label={'Mobile Number'}
                  errors={errors}
                  control={control}
                />
              </Grid>
            )}
            {/* {addFlag && (
              <Grid item md={6} sm={12} xs={12}>
                <CustomFormText
                  type="password"
                  name={'user_password'}
                  label={'User Password'}
                  errors={errors}
                  control={control}
                />
              </Grid>
            )} */}
            {addFlag && (
              <Grid item md={6} sm={12} xs={12}>
                {' '}
                <CustomFormSelect
                  name={'role_id'}
                  label={'Role Id'}
                  options={ROLE_OPTIONS}
                  errors={errors}
                  control={control}
                />
              </Grid>
            )}
          </Grid>
          <Grid item sm={12} xs={12} padding={3}>
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{
                float: 'right',
                mr: 1,
                background:
                  'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
              }}
              loading={loading}
              disabled={loading}
            >
              Submit
            </LoadingButton>
          </Grid>
        </form>
      </Grid>
    </PageContainer>
  );
}
