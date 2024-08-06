import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import AddCard from '../../../components/apps/invoice/add/AddCard';
import CustomDatePickerWrapper from '../../../components/custom/CustomDatePickerWrapper';
import {
  createInvoice,
  setInvoiceId,
} from '../../../store/apps/invoice/InvoiceSlice';
import { AppDispatch } from '../../../store/Store';

const InvoiceAdd = () => {
  // ** Hooks
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const store: any = useSelector((state: any) => state.user);
  const invoiceStore: any = useSelector((state: any) => state.invoice);
  const userDetail = JSON.parse(localStorage.getItem('userData') || '{}');
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<any>({
    iban: '',
    note: '',
    address: '',
    companyPhoneNumber: '',
    mobileNumber: '',
    authorizedPersonName: '',
    authorizedPersonSign: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      // await dispatch(getUser(userDetail?.id))
      // await dispatch(getSettings(1))
    };
    fetchData(); // Call the async function
  }, []);

  useEffect(() => {
    setInvoiceData(store?.settings);
  }, [store]);

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen);

  const schema = yup.object().shape({
    companyName: yup.string(),
    companyAddressNumber: yup.string(),
    companyPhoneNumber: yup.string(),

    issuedDate: yup.string().required('This field is required'),
    dueDate: yup.string().required('This field is required'),
    authorizedPersonName: yup.string().required('This field is required'),
    message: yup.string(),
    authorizedPersonSign: yup.string(),
    note: yup.string(),

    customerName: yup.string().required('This field is required'),
    customerAddress: yup.string().required('This field is required'),
    customerEmail: yup.string().required('This field is required'),
    customerPhoneNumber: yup
      .string()
      .required('This field is required')
      .test('length', 'Invalid Phone Number', (val) => {
        const value = val?.replace(/\-/g, '') || '';
        return value?.length >= 10;
      }),

    items: yup.array(
      yup.object().shape({
        name: yup.string().required('This field is required'),
        cost: yup.number().required('This field is required'),
      }),
    ),
    subtotal: yup.number().required('This field is required'),
    tax: yup.number().required('This field is required'),
    total: yup.number().required('This field is required'),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: 'Aux365',
      companyAddressNumber: invoiceData?.companyAddressNumber || '',
      companyPhoneNumber: invoiceData?.companyPhoneNumber || '',
      message: 'Thanks for your business',
      authorizedPersonName: invoiceData?.authorizedPersonName || '',
      authorizedPersonSign: invoiceData?.authorizedPersonSign || '',
      note: invoiceData?.note || '',
      issuedDate: dayjs(new Date()),
      dueDate: dayjs(new Date()),
      customerName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhoneNumber: '',
      customerCompanyName: '',
      items: [
        {
          name: '',
          cost: null,
        },
      ],
      subtotal: null,
      tax: null,
      total: null,
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
    toast.error('API Error! Please try later');
    return false;
    try {
      data.customerPhoneNumber = data.customerPhoneNumber.replace(/\-/g, '');
      data.status = 'PENDING';
      await dispatch(createInvoice(data))
        .then(async (res) => {
          toast.success('Invoice Created Successfully!');
          res?.data?.id && (await dispatch(setInvoiceId(res?.data?.id)));
          router.push('/invoice/preview');
        })
        .catch((error) => {
          toast.error(
            (error as any)?.message || 'API Error! Please try again.',
          );
          router.push('/payment');
        });
    } catch (error) {
      toast.error((error as any)?.message || 'API Error! Please try again.');
      router.push('/payment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDatePickerWrapper
        sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <AddCard
              control={control}
              formValues={formValues}
              errors={errors}
              invoiceData={invoiceData}
              setValue={setValue}
              toggleAddCustomerDrawer={toggleAddCustomerDrawer}
              invoiceStore={invoiceStore}
            />
          </Grid>
        </Grid>
      </CustomDatePickerWrapper>
    </form>
  );
};

export default InvoiceAdd;
