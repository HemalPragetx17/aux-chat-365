import { yupResolver } from '@hookform/resolvers/yup';
import {
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Radio,
  RadioGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import CustomTextField from '../../custom/CustomTextField';
import CustomFormAmount from '../../custom/form/CustomFormAmount';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  success: () => void;
  operatorFlag: boolean;
}

const UserIposDetailsForm = (props: FormType) => {
  const { open, toggle, currentData, success, operatorFlag } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    ConvenienceFeeValue: yup.string().required('Field is required'),
    ConvenienceFeeMinimum: yup.string().required('Field is required'),
    AndroidMerchantId: yup.string().required('Merchant Id is required'),

    AndroidTpn: yup.string().when('device_type', {
      is: (val: string) => val === 'android',
      then: () => yup.string().required('Field is required for Android'),
      otherwise: () => yup.string(),
    }),
    AndroidToken: yup.string(),
    IosTpn: yup.string().when('device_type', {
      is: (val: string) => val === 'iphone',
      then: () => yup.string().required('Field is required for Android'),
      otherwise: () => yup.string(),
    }),
    IosToken: yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      ConvenienceFeeSymbol:
        currentData?.Profile?.iposDetails?.ConvenienceFeeSymbol || '$',
      ConvenienceFeeValue:
        currentData?.Profile?.iposDetails?.ConvenienceFeeValue || '0.00',
      ConvenienceFeeMinimum:
        currentData?.Profile?.iposDetails?.ConvenienceFeeMinimum || '0.00',
      device_type: currentData?.Profile?.iposDetails?.AndroidToken
        ? 'android'
        : 'iphone',
      AndroidMerchantId:
        currentData?.Profile?.iposDetails?.AndroidMerchantId || '',
      AndroidTpn: currentData?.Profile?.iposDetails?.AndroidTpn || '',
      AndroidToken: currentData?.Profile?.iposDetails?.AndroidToken || '',
      IosTpn: currentData?.Profile?.iposDetails?.IosTpn || '',
      IosToken: currentData?.Profile?.iposDetails?.IosToken || '',
    }),
    [currentData],
  );

  useEffect(() => {
    setLoading(false);
    reset(defaultValues);
  }, [open]);

  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  useEffect(() => {
    if (watchForm?.device_type === 'android') {
      setValue('IosToken', '');
      setValue('IosTpn', '');
      setValue(
        'AndroidToken',
        currentData?.Profile?.iposDetails?.AndroidToken || '',
      );
      setValue(
        'AndroidTpn',
        currentData?.Profile?.iposDetails?.AndroidTpn || '',
      );
    } else {
      setValue('AndroidToken', '');
      setValue('AndroidTpn', '');
      setValue('IosToken', currentData?.Profile?.iposDetails?.IosToken || '');
      setValue('IosTpn', currentData?.Profile?.iposDetails?.IosTpn || '');
    }
  }, [watchForm?.device_type]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
      };
      delete payload['device_type'];
      const response = await axios.post(`/users/profile/${currentData.id}`, {
        iposDetails: payload,
      });

      setLoading(false);
      if (response.status === 200) {
        success();
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleBlur = (e: any, onChange: any) => {
    if (watchForm?.ConvenienceFeeSymbol === '$') {
      let value = e?.target?.value;
      onChange(value);
    } else {
      let value = e?.target?.value;
      value = parseFloat(value);
      onChange(value);
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <CustomHeader>
        <Typography variant="h6">IPOS Details</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
          }}
        >
          <IconX />
        </IconButton>
      </CustomHeader>

      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!operatorFlag && (
            <>
              <Box display={'flex'}>
                <Box sx={{ mr: 1, minWidth: '100px' }}>
                  <CustomFormSelect
                    name={'ConvenienceFeeSymbol'}
                    label={'Unit'}
                    options={[
                      { label: '%', value: '%' },
                      { label: '$', value: '$' },
                    ]}
                    errors={errors}
                    control={control}
                  />
                </Box>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name={'ConvenienceFeeValue'}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        type="number"
                        label={'Convenience Fee'}
                        value={value}
                        size="small"
                        onChange={onChange}
                        onBlur={(e: any) => handleBlur(e, onChange)}
                        onWheel={(e: any) => e.target.blur()}
                        error={Boolean(errors['ConvenienceFeeValue'])}
                        InputProps={{
                          startAdornment: (
                            <>
                              {Boolean(watchForm?.ConvenienceFeeSymbol) && (
                                <InputAdornment position="start">
                                  {watchForm?.ConvenienceFeeSymbol}
                                </InputAdornment>
                              )}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {errors['ConvenienceFeeValue'] && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {(errors['ConvenienceFeeValue'] as any)?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <CustomFormAmount
                name={'ConvenienceFeeMinimum'}
                symbol="$"
                label={'Convenience Fee Minimum'}
                errors={errors['ConvenienceFeeMinimum']}
                control={control}
              />
            </>
          )}

          <CustomFormText
            name={'AndroidMerchantId'}
            label={'Merchant Id'}
            errors={errors}
            control={control}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            Please select your device
            <Controller
              name="device_type"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  name="device_type"
                  value={value}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="android"
                    label="Android"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="iphone"
                    label="Iphone"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          {watchForm?.device_type === 'android' && (
            <>
              <CustomFormText
                name={'AndroidTpn'}
                label={'Android TPN'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                name={'AndroidToken'}
                label={'Android Token'}
                errors={errors}
                control={control}
              />
            </>
          )}

          {watchForm?.device_type === 'iphone' && (
            <>
              <CustomFormText
                name={'IosTpn'}
                label={'IOS TPN'}
                errors={errors}
                control={control}
              />

              <CustomFormTextArea
                name={'IosToken'}
                label={'IOS Token'}
                rows={5}
                errors={errors}
                control={control}
              />
            </>
          )}

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default UserIposDetailsForm;
