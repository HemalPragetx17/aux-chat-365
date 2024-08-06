import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Dialog,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useAuth } from '../../hooks/useAuth';
import { AppState, useDispatch, useSelector } from '../../store/Store';
import { sendPaymentLink } from '../../store/apps/chat/ChatSlice';
import CustomTextField from '../custom/CustomTextField';
import CustomFormCheckbox from '../custom/form/CustomFormCheckbox';
import CustomFormText from '../custom/form/CustomFormText';
import CustomHeader from '../custom/form/CustomHeader';

interface FormType {
  toggle: () => void;
  open: boolean;
}

const PaymentForm = (props: FormType) => {
  const { toggle, open } = props;
  const dispatch = useDispatch();
  const { user, settings } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [destination, setDestination] = useState<any>('');
  const didList = useSelector((state: AppState) =>
    state.didReducer.did.map((did: any) => ({
      label: `${did?.countryCode}${did?.phoneNumber} (${did?.title})`,
      value: did.phoneNumber,
    })),
  );
  const contactList = useSelector(
    (state: AppState) => state.contactsReducer.contacts,
  );
  const filter = createFilterOptions();

  const schema = yup.object().shape({
    to: yup.string().required('To number is required field'),
    from: yup.string().required('From number is required field'),
    amount: yup.string().required('Amount is required field'),
    description: yup.string().required('Description is required field'),
    invoiceNumber: yup.string().required('Invoice Number is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      to: '',
      from: settings?.defaultDid?.phoneNumber || '',
      amount: '',
      description: '',
      invoiceNumber: '',
      message: '',
      convenienceFee: false,
      payment_type: 'sale',
    }),
    [],
  );

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setLoading(false);
    }
  }, [open]);

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onPaymentFormSubmit = async (data: any) => {
    const {
      description,
      invoiceNumber,
      message,
      convenienceFee,
      amount,
      payment_type,
      to,
      from,
    } = data;
    setLoading(true);
    const formData = {
      amount: parseFloat(amount).toFixed(2),
      description,
      message,
      invoiceNumber,
      convenienceFee: convenienceFee ? 0 : 1,
      type: payment_type === 'sale' ? '1' : '2',
      to,
      from,
      sender: user?.name,
    };
    await dispatch(sendPaymentLink(formData));
    toggle();
  };

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomHeader>
        <Typography variant="h6">Send Payment Link</Typography>
        <IconButton
          size="small"
          onClick={toggle}
          sx={{
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
          }}
        >
          <IconX />
        </IconButton>
      </CustomHeader>
      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2), mt: 1 }}>
        <form onSubmit={handleSubmit(onPaymentFormSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={didList}
              clearOnBlur
              getOptionLabel={(option: any) => option.label}
              defaultValue={
                didList.find(
                  (did) => did.value === settings?.defaultDid?.phoneNumber,
                ) || ''
              }
              autoHighlight={true}
              onChange={(e, newValue: any) => {
                setValue('from', newValue?.value);
              }}
              filterOptions={(options: any[], params: any) => {
                const filtered = filter(options, params);
                return filtered;
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  size="small"
                  label={'Select From Number'}
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={contactList}
              freeSolo
              clearOnBlur
              getOptionLabel={(option: any) => {
                const firstName = Boolean(option.firstName)
                  ? `(${option.firstName})`
                  : '';
                return `${option.phone} ${firstName}`;
              }}
              defaultValue={destination || undefined}
              autoHighlight={true}
              onChange={(e, newValue: any) => {
                setDestination(newValue);
                setValue('to', `+1${newValue?.phone}`, {
                  shouldValidate: true,
                });
              }}
              filterOptions={(options: any[], params: any) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some(
                  (option: any) => inputValue === option,
                );
                if (inputValue !== '' && !isExisting) {
                  const input = {
                    firstName: `${inputValue}`,
                    phone: inputValue,
                  };
                  filtered.push(input);
                }

                return filtered;
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  size="small"
                  label={'To Number'}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">+1</InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors.to && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.to as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'amount'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  type={'number'}
                  placeholder="0.00"
                  value={value}
                  label={'Amount'}
                  size="small"
                  onChange={onChange}
                  onWheel={(e: any) => e.target.blur()}
                  error={Boolean(errors.amount)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors.amount && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.amount as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <CustomFormText
            name={'description'}
            label={'Description'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'invoiceNumber'}
            label={'PO/Invoice/Transaction Number'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'message'}
            label={'Message (optional)'}
            errors={errors}
            control={control}
          />

          <CustomFormCheckbox
            name={'convenienceFee'}
            label={'Do not send Tech Fee'}
            control={control}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="payment_type"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  name="payment_type"
                  value={value}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="sale"
                    label="Sale"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="auth_only"
                    label="Auth Only"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton
              fullWidth
              variant="contained"
              loading={loading}
              sx={{
                mr: 1,
                background:
                  'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
              }}
              type="submit"
            >
              Submit
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default PaymentForm;
