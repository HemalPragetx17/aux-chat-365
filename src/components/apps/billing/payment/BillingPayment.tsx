import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { IconTrash, IconX } from '@tabler/icons-react';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import * as yup from 'yup';

import axios from '../../../../utils/axios';
import CustomTextField from '../../../custom/CustomTextField';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function BillingPayment() {
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [addPaymentDialog, setAddPaymentDialog] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await axios.post(`/users/plan`);
      const { Profile } = response?.data;
      setPaymentInfo(Profile?.cardDetails);
    } catch (error) {
      setPaymentInfo(null);
    }
  };

  const schema = yup.object().shape({
    cardNumber: yup.string().required('Card Number is required'),
    expiryDate: yup.string().required('Expiry Date is required'),
    cvv: yup.string().required('Phone Number is required'),
  });

  const deletePaymentMethod = async () => {
    const willDelete = await swal({
      title: 'Are you sure?',
      closeOnClickOutside: false,
      closeOnEsc: false,
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'MuiButton-root',
          closeModal: true,
        },
      },
      dangerMode: true,
    });
    if (willDelete) {
      try {
        await axios.post('/plan/remove-card');
        setPaymentInfo(null);
      } catch (error) {
        console.log(error);
        toast.error('API Error! Please try again');
      }
    }
  };

  const openPaymentForm = () => {
    reset({ cardNumber: '', cvv: '', expiryDate: '' });
    setAddPaymentDialog(true);
    setLoading(false);
  };

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { cardNumber: '', cvv: '', expiryDate: '' },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const formatAndSetCcNumber = (e: any) => {
    const inputVal = e.target.value.replace(/ /g, '');
    let inputNumbersOnly = inputVal.replace(/\D/g, '');
    if (inputNumbersOnly.length >= 16) {
      inputNumbersOnly = inputNumbersOnly.substr(0, 16);
    }
    const splits = inputNumbersOnly.match(/.{1,4}/g);
    let spacedNumber = '';
    if (splits) {
      spacedNumber = splits.join(' ');
    }
    setValue('cardNumber', spacedNumber, { shouldValidate: true });
  };

  const handleExpiryChange = (e: any) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length >= 2) {
      const month = input.slice(0, 2);
      const validMonth = parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;

      if (!validMonth) {
        e.target.value = '';
        setValue('expiryDate', '', { shouldValidate: true });
        return;
      }
    }

    if (input.length >= 4) {
      const year = input.slice(2, 4);
      const currentYear = new Date().getFullYear() % 100;
      const validYear = parseInt(year, 10) >= currentYear;

      if (!validYear) {
        e.target.value = '';
        setValue('expiryDate', '', { shouldValidate: true });
        return;
      }
      input = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
    }
    e.target.value = input;
    setValue('expiryDate', input, { shouldValidate: true });
  };

  const formatAndSetCvv = (e: any) => {
    const inputVal = e.target.value.replace(/ /g, '');
    let inputNumbersOnly = inputVal.replace(/\D/g, '');
    if (inputNumbersOnly.length >= 4) {
      inputNumbersOnly = inputNumbersOnly.substr(0, 4);
    }
    setValue('cvv', inputNumbersOnly, { shouldValidate: true });
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await axios.post('/plan/save-card', data);
      setPaymentInfo(response?.data);
      setAddPaymentDialog(false);
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {paymentInfo?.savedCardToken ? (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h2">Payment Method</Typography>
            <Typography variant="caption">
              Payment Card added on{' '}
              {moment(paymentInfo?.createdAt).format(`MM-DD-YYYY`)}
            </Typography>

            <Box
              display={'flex'}
              mt={3}
              justifyContent={'space-between'}
              alignContent={'center'}
            >
              <Box display={'flex'}>
                <Image
                  src={'/images/products/visa.png'}
                  width={100}
                  height={120}
                  alt="visa-icon"
                />
                <Box mt={2} ml={2}>
                  <Typography variant="h5">VISA</Typography>
                  <Typography variant="h5">
                    **** **** **** {paymentInfo?.cardNumber}
                  </Typography>
                  <Typography variant="h5">{paymentInfo?.expiry}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  aria-label="delete-payment-method"
                  size="medium"
                  onClick={() => deletePaymentMethod()}
                >
                  <IconTrash />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Alert severity="error">
            You do not have any payment method added to your account! Please add
            a payment method to enjoy seamless experience. Click{' '}
            <Typography
              variant="inherit"
              component={'span'}
              onClick={() => openPaymentForm()}
              sx={{
                fontWeight: 700,
                color: 'white',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              here
            </Typography>{' '}
            to add a payment method!
          </Alert>
        )}
      </Grid>

      <BootstrapDialog
        onClose={() => setAddPaymentDialog(false)}
        aria-labelledby="customized-dialog-title"
        open={addPaymentDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add Payment Method
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setAddPaymentDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IconX />
        </IconButton>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name={'cardNumber'}
                    control={control}
                    render={({ field: { value } }) => (
                      <CustomTextField
                        type={'text'}
                        value={value}
                        label={'Card Number'}
                        size="small"
                        onChange={(e: any) => formatAndSetCcNumber(e)}
                        error={Boolean(errors?.cardNumber)}
                        autoComplete="off"
                        InputProps={{
                          endAdornment: (
                            <Image
                              alt={'card-icon'}
                              width={180}
                              height={32}
                              src={'/images/products/card.png'}
                            />
                          ),
                        }}
                      />
                    )}
                  />
                  {errors?.cardNumber && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors?.cardNumber.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name={'expiryDate'}
                    control={control}
                    render={({ field: { value } }) => (
                      <CustomTextField
                        type={'text'}
                        value={value}
                        label={'Expiry Date (MM/DD)'}
                        inputProps={{ maxLength: 5 }}
                        size="small"
                        onChange={(e: any) => handleExpiryChange(e)}
                        error={Boolean(errors?.expiryDate)}
                        autoComplete="off"
                      />
                    )}
                  />
                  {errors?.expiryDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors?.expiryDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name={'cvv'}
                    control={control}
                    render={({ field: { value } }) => (
                      <CustomTextField
                        type={'text'}
                        value={value}
                        label={'CVV'}
                        inputProps={{ maxLength: 5 }}
                        size="small"
                        onChange={(e: any) => formatAndSetCvv(e)}
                        error={Boolean(errors?.cvv)}
                        autoComplete="off"
                        InputProps={{
                          endAdornment: (
                            <Image
                              alt={'cvv-icon'}
                              width={62}
                              height={32}
                              src={'/images/products/cvv.png'}
                            />
                          ),
                        }}
                      />
                    )}
                  />
                  {errors?.cvv && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors?.cvv.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setAddPaymentDialog(false)}
            >
              Cancel
            </Button>
            <LoadingButton loading={loading} variant="contained" type="submit">
              Save changes
            </LoadingButton>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </Grid>
  );
}
