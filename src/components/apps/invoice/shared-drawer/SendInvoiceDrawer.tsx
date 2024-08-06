// ** React Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { FormHelperText } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { pdf } from '@react-pdf/renderer';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { useAuth } from '../../../../hooks/useAuth';
import { sendInvoice } from '../../../../store/apps/invoice/InvoiceSlice';
import { AppDispatch } from '../../../../store/Store';
import { InvoiceType } from '../../../../types/apps/invoiceTypes';
import InvoicePDF from '../../../pdf/InvoicePDF';

interface Props {
  open: boolean;
  toggle: () => void;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const SendInvoiceDrawer = ({ open, toggle }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [invoiceData, setInvoiceData] = useState<null | InvoiceType>(null);
  const invoiceStore: any = useSelector((state: any) => state.invoice);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    setInvoiceData(invoiceStore?.selectedData);
  }, [invoiceStore]);

  const schema = yup.object().shape({
    subject: yup.string(),
    message: yup.string(),
    customerEmail: yup
      .string()
      .email('Enter valid Email')
      .required('Email is a required'),
  });

  const defaultValues = useMemo(
    () => ({
      fromEmail: 'whvs@auxoffice.io' || '',
      subject: 'WHVS Invoice',
      message: '',
      customerEmail: invoiceData?.customerEmail || '',
    }),
    [invoiceData],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [invoiceData]);

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
      setIsLoading(true);
      let blob;
      if (Boolean(invoiceData)) {
        blob = await pdf(<InvoicePDF data={invoiceData} />)?.toBlob();
      }

      await dispatch(
        sendInvoice({
          ...data,
          files: [blob],
          invoice_id: invoiceData?.id,
        }),
      ).then((response: any) => {
        if (response.status === 'SUCCESS') {
          toast.success(response?.message || 'Invoice Sent Successfully');
        } else {
          toast.error(
            (response as any)?.message || 'API Error! Please try again.',
          );
        }

        setIsLoading(false);
        router.push('/apps/invoice/list');
      });
    } catch (error) {
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={toggle}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header>
        <Typography variant="h6">Send Invoice</Typography>
        <IconButton size="small" onClick={toggle}>
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </IconButton>
      </Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name={'fromEmail'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled
                  value={value}
                  label={'From Email'}
                  size="small"
                  onChange={onChange}
                />
              )}
            />
            {errors.fromEmail && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.fromEmail as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name={'customerEmail'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label={'To Email'}
                  size="small"
                  onChange={onChange}
                />
              )}
            />
            {errors.customerEmail && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.customerEmail as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name={'subject'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type={'text'}
                  value={value}
                  label={'Subject'}
                  size="small"
                  onChange={onChange}
                />
              )}
            />
            {errors.subject && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.subject as any).message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name={'message'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type={'text'}
                  value={value}
                  label={'Message'}
                  multiline
                  rows={8}
                  size="small"
                  onChange={onChange}
                />
              )}
            />
            {errors.message && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.message as any).message}
              </FormHelperText>
            )}
          </FormControl>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <LoadingButton
              loading={isLoading}
              variant="contained"
              type="submit"
              sx={{ mr: 4 }}
            >
              Send
            </LoadingButton>
            <Button variant="outlined" color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </div>
        </Box>
      </form>
    </Drawer>
  );
};

export default SendInvoiceDrawer;
