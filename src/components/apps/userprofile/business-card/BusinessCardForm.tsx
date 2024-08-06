import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Grid, styled } from '@mui/material';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import CustomFormText from '../../../custom/form/CustomFormText';
import ChildCard from '../../../shared/ChildCard';

const ROLE_OPTIONS = [
  { label: 'MASTER ADMIN', value: '1' },
  { label: 'ADMIN', value: '2' },
  { label: 'OPERATOR', value: '3' },
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const BusinessCardForm = (props: any) => {
  const { profile, success } = props;
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [previewURL, setPreviewURL] = useState<string | ArrayBuffer | null>(
    profile?.Profile?.BusinessDetails?.logo || null,
  );
  const fileInputRef = useRef(null);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Enter valid email')
      .required('Email is required'),
    phoneNumber: yup
      .string()
      .required('Phone Number is Required')
      .test('length', 'Invalid Phone Number', (val) => {
        return val?.length === 10;
      }),
    signature: yup.string(),
    invoiceMsg: yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: profile?.Profile?.BusinessDetails?.name || '',
      email: profile?.Profile?.BusinessDetails?.email || '',
      phoneNumber: profile?.Profile?.BusinessDetails?.phoneNumber || '',
      signature: profile?.Profile?.BusinessDetails?.signature || '',
      invoiceMsg: profile?.Profile?.BusinessDetails?.invoiceMsg || '',
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
    Boolean(profile?.Profile?.BusinessDetails?.logo) &&
      setPreviewURL(profile?.Profile?.BusinessDetails?.logo);
  }, [profile]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const dataToUpdate = {
        BusinessDetails: { ...data },
        file,
      };
      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const response = await axios.post(
        `/users/profile/${user?.uid}`,
        dataToUpdate,
        header,
      );
      if (response.status === 200) {
        toast.success('Profile Updated Successfully');
        success();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
    setFile(null);
  };

  const handleFileChange = async (event: any) => {
    setIsUploadingLogo(true);
    const file = event?.target?.files[0];
    if (file) {
      const isValid =
        file.type.startsWith('image/') ||
        file.type.startsWith('application/pdf');
      if (isValid) {
        setFile(file);
        previewFile(file); // Call function to preview the file
      } else {
        toast.error('Only Image or PDF Files allowed');
        (fileInputRef as any).current.value = '';
      }
    }
    setIsUploadingLogo(false);
  };

  const previewFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log(reader);
      setPreviewURL(reader.result);
    };
  };

  return (
    <ChildCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Boolean(profile) && (
          <Grid container spacing={3} paddingY={3}>
            <Grid item xs={12} md={8} container spacing={3} paddingY={3}>
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
                  name={'phoneNumber'}
                  label={'Phone Number'}
                  errors={errors}
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
                <CustomFormText
                  name={'signature'}
                  label={'Signature'}
                  errors={errors}
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
                <CustomFormText
                  name={'invoiceMsg'}
                  label={'Invoice Message'}
                  errors={errors}
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12} sx={{ paddingTop: '0px !important' }}>
                <LoadingButton
                  loading={isUploadingLogo}
                  component="label"
                  variant="contained"
                  sx={{
                    width: '100%',
                  }}
                >
                  {file ? ' UPLOADED' : ' UPLOAD LOGO'}
                  <VisuallyHiddenInput
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                  />
                </LoadingButton>
                {file?.name && `Selected: ${file?.name}`}
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ paddingTop: '0px !important', marginTop: '20px' }}
              >
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

            <Grid item xs={12} md={4} sx={{ paddingTop: '0px !important' }}>
              {file || (previewURL && file?.type.startsWith('image/')) ? (
                <>
                  <h2 style={{ marginTop: 0 }}>Preview Logo :</h2>
                  <Image
                    width={150}
                    height={150}
                    style={{
                      width: '100% !important',
                      maxWidth: 200,
                    }}
                    src={
                      typeof previewURL === 'string'
                        ? previewURL
                        : URL.createObjectURL(
                            new Blob([previewURL as ArrayBuffer]),
                          )
                    }
                    alt="Preview"
                  />
                </>
              ) : (
                previewURL &&
                !file && (
                  <>
                    <h2 style={{ padding: '0', margin: '0' }}>
                      Preview Logo :
                    </h2>
                    <Image
                      width={150}
                      height={150}
                      style={{
                        width: '100% !important',
                      }}
                      src={
                        typeof previewURL === 'string'
                          ? previewURL
                          : URL.createObjectURL(
                              new Blob([previewURL as ArrayBuffer]),
                            )
                      }
                      alt="Preview"
                    />
                  </>
                )
              )}
            </Grid>
          </Grid>
        )}
      </form>
    </ChildCard>
  );
};

export default BusinessCardForm;
