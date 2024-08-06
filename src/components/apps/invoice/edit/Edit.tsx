import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { setInvoiceId } from '../../../../store/apps/invoice/InvoiceSlice';
import { AppDispatch } from '../../../../store/Store';
import {
  InvoiceLayoutProps,
  InvoiceType,
} from '../../../../types/apps/invoiceTypes';
import AddPaymentDrawer from '../shared-drawer/AddPaymentDrawer';
import SendInvoiceDrawer from '../shared-drawer/SendInvoiceDrawer';

import EditCard from './EditCard';

const InvoiceEdit = ({ id }: InvoiceLayoutProps) => {
  // ** Hooks
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // ** State
  const [error, setError] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<null | InvoiceType>(null);
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false);
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false);

  // STORE
  const invoiceStore: any = useSelector((state: any) => state.invoice);

  useEffect(() => {
    setInvoiceData(invoiceStore?.selectedData);
  }, [invoiceStore]);

  const schema = yup.object().shape({
    // General Detail
    companyName: yup.string(),
    address: yup.string(),
    phoneNumber: yup.string(),

    issuedDate: yup.string(),
    dueDate: yup.string(),

    // bankName: yup.string(),
    // country: yup.string(),
    // iban: yup.string(),
    // totalDue: yup.number(),
    // swiftCode: yup.string(),
    message: yup.string(),
    authorizedPersonName: yup.string(),
    authorizedPersonSign: yup.string(),
    note: yup.string(),

    // Invoice To / Customer Detail
    customerName: yup.string(),
    customerAddress: yup.string(),
    customerEmail: yup.string(),
    customerPhoneNumber: yup
      .string()
      .required('This field is required')
      .test('length', 'Invalid Phone Number', (val) => {
        const value = val?.replace(/\-/g, '') || '';
        return value?.length >= 10;
      }),
    customerCompanyName: yup.string(),

    // Billing Items
    items: yup.array(
      yup.object().shape({
        name: yup.string(),
        // description: yup.string(),
        cost: yup.number(),
        // hours: yup.number()
        // discount: yup.number(), //In percentage
        // price: yup.number()
      }),
    ),
    // Total
    subtotal: yup.number(),
    // totalDiscount: yup.number(),
    tax: yup.number(),
    finalTotal: yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: 'WHVS',
      address: invoiceData?.companyAddress || '',
      phoneNumber: invoiceData?.companyPhoneNumber || null,
      // bankName: invoiceData?.bankName || '',
      // country: invoiceData?.country || '',
      // iban: invoiceData?.iban || '',
      // swiftCode: invoiceData?.swiftCode || '',
      message: 'Thanks For Business',
      authorizedPersonName: invoiceData?.customerName || '',
      authorizedPersonSign: invoiceData?.customerName || '',
      note: '',
      issuedDate: dayjs(invoiceData?.createdAt) || '',
      // Invoice To / Customer Detail
      customerName: invoiceData?.customerName || '',
      customerAddress: invoiceData?.customerAddress || '',
      customerEmail: invoiceData?.customerEmail || '',
      customerPhoneNumber: invoiceData?.customerPhoneNumber || '',
      customerCompanyName: invoiceData?.companyName || '',
      // totalDue: invoiceData?.totalDue || 0,
      // Billing Items
      items: invoiceData?.items || [
        {
          name: '',
          // description: '',
          cost: null,
          // hours: 0
          // discount: 0,
          // price: 0
        },
      ],
      // Total
      subtotal: invoiceData?.subtotal || null,
      // totalDiscount: invoiceData?.totalDiscount || 0,
      tax: invoiceData?.tax || null,
      finalTotal: invoiceData?.total || null,
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
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const formValues = watch();
  const onSubmit = async (data: any) => {
    try {
      data.customerPhoneNumber = data.customerPhoneNumber.replace(/\-/g, '');
      // await dispatch(updateInvoice({ ...data, id: invoiceData?.id })).then((response: any) => {
      //   if (response.status === 'SUCCESS') {
      //     toast.success(response?.message || 'Edit Successfull')
      //   } else {
      //     toast.error((error as any)?.message || 'API Error! Please try again.')
      //   }
      // })
      invoiceData?.id && (await dispatch(setInvoiceId(invoiceData?.id)));
      router.push('/apps/invoice/preview');
    } catch (error) {
      invoiceData?.id && (await dispatch(setInvoiceId(invoiceData?.id)));
      router.push('/apps/invoice/preview');
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen);
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen);

  if (invoiceData) {
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <EditCard
                formValues={formValues}
                setValue={setValue}
                invoiceData={invoiceData}
                control={control}
                errors={errors}
                invoiceStore={invoiceStore}
                id={id}
                toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
                toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              />
            </Grid>
          </Grid>
        </form>
        <SendInvoiceDrawer
          open={sendInvoiceOpen}
          toggle={toggleSendInvoiceDrawer}
        />
        <AddPaymentDrawer
          open={addPaymentOpen}
          toggle={toggleAddPaymentDrawer}
        />
      </>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Invoice with the id: {id} does not exist. Please check the list of
            invoices: <Link href="/apps/invoice/list">Invoice List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default InvoiceEdit;
