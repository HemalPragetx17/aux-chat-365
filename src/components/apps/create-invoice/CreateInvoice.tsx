import { yupResolver } from '@hookform/resolvers/yup';
import { Delete, Edit } from '@mui/icons-material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  Link,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconMail, IconMessages, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import FAIL from '../../../../src/images/FAIL.png';
import IV_BG from '../../../../src/images/IV_BG.png';
import PAID from '../../../../src/images/PAID.png';
import card from '../../../../src/images/card.png';
import check from '../../../../src/images/check.png';
import checkBG from '../../../../src/images/checkBG.png';
import checkBG_IV from '../../../../src/images/checkBG_IV.png';
import ccv from '../../../../src/images/cvv.png';
import download from '../../../../src/images/download.png';
import logo from '../../../../src/images/logo1.png';
import mail from '../../../../src/images/mail.png';
import paidBG from '../../../../src/images/paidBG.png';
import payment from '../../../../src/images/payment.png';
import text from '../../../../src/images/text.png';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../store/Store';
import {
  addProduct,
  createInvoice,
  invoiceRecurring,
  removeIsDraftInvoice,
  sendEmailInvoice,
  sendTextInvoice,
  vtPaymentInvoice,
} from '../../../store/apps/chat/ChatSlice';
import axios from '../../../utils/axios';
import { formatDate, formatPayment } from '../../../utils/format';
import VTCustomTextField from '../../custom/VTCustomTextField';
import { default as CustomFormCheckboxVT } from '../../custom/form/CustomFormCheckboxVT';
import { default as CustomFormTextVT } from '../../custom/form/CustomFormTextVT';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  toggle: () => void;
  open: boolean;
  profileData: any;
  SelecteData?: any;
  setSelecteData?: any;
}

interface CardDetails {
  CardNumber: string;
  Cvv: string;
  ExpiryDate: string;
}

const filter = createFilterOptions();

const CreateInvoice = (props: FormType) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { toggle, open, profileData, SelecteData, setSelecteData } = props;

  const dispatch = useDispatch();
  const [successCreateInvoice, setSuccessCreateInvoice] =
    useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    CardNumber: '',
    Cvv: '',
    ExpiryDate: '',
  });
  const [successPaidInvoice, setSuccessPaidInvoice] = useState<boolean>(false);
  const [isAddProductLoading, setAddProductLoading] = useState<boolean>(false);
  const [payModalOpen, setPayModalOpen] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any[]>(
    SelecteData ? SelecteData?.products : [],
  );
  const [productData, setProductData] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [createdInvoiceDetails, setCreatedInvoiceDetails] = useState<any>({});
  const { selectedChat } = useSelector((state) => state.chatReducer);
  const [feeDetail, setFeedetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [textLoading, setTextLoading] = useState<boolean>(false);
  const [InvoiceType, setInvoiceType] = useState<any>(null);

  useEffect(() => {
    if (SelecteData) {
      setOrderDetails(SelecteData?.products);
      setValue('customerName', SelecteData?.companyName || '');
      setValue('description', SelecteData?.description || '');
      setValue('customerEmail', SelecteData?.email || '');
      setValue('companyPhoneNumber', SelecteData?.companyPhoneNumber);
      setValue('customerStreet', SelecteData?.customerAddressObj?.street || '');
      setValue('customerCity', SelecteData?.customerAddressObj?.city || '');
      setValue('customerState', SelecteData?.customerAddressObj?.state || '');
      setValue('customerZip', SelecteData?.customerAddressObj?.zip || '');
      setValue('customerCompany', SelecteData?.company || '');
      setValue('companyName', SelecteData?.companyName || '');
      setValue('to', SelecteData?.customerPhoneNumber || '');
      setValue('isDraft', SelecteData?.isDraft || false);
    }
  }, [SelecteData]);

  let schema;
  const INVOICE_TYPE_VALUES = [
    {
      label: 'WEEKLY',
      value: 'WEEKLY',
    },
    {
      label: 'BIWEEKLY',
      value: 'BIWEEKLY',
    },
    {
      label: 'MONTHLY',
      value: 'MONTHLY',
    },
  ];

  if (!successCreateInvoice) {
    schema = yup.object().shape({
      to: yup
        .string()
        .required('Send To field is required')
        .matches(
          /^(\+(?:\d{1,3}|\d{1,4}[\s\-])?)?(\d{1,3}[\s\-]?){1,4}\d{1,6}$/,
          'Invalid Send To phone number',
        ),
      companyName: yup.string().required('Company name is required'),
      companyPhoneNumber: yup
        .string()
        .required('Phone number is required')
        .matches(
          /^(\+(?:\d{1,3}|\d{1,4}[\s\-])?)?(\d{1,3}[\s\-]?){1,4}\d{1,6}$/,
          'Invalid phone number',
        ),
      customerStreet: yup.string().required('Street field is required'),
      customerCity: yup.string().required('City Address field is required'),
      customerState: yup.string().required('State Address field is required'),
      customerZip: yup.string().required('Zip Address field is required'),
      customerName: yup.string().required('Contact field is required'),
      shippingSameAsBilling: yup.boolean(),
      isDraft: yup.boolean(),
      shippingPostalCode: yup.string().when('shippingSameAsBilling', {
        is: (val: boolean) => val === false,
        then: () => yup.string().required('Required Field'),
        otherwise: () => yup.string(),
      }),
      shippingCity: yup.string().when('shippingSameAsBilling', {
        is: (val: boolean) => val === false,
        then: () => yup.string().required('Required Field'),
        otherwise: () => yup.string(),
      }),
      shippingStreet: yup.string().when('shippingSameAsBilling', {
        is: (val: boolean) => val === false,
        then: () => yup.string().required('Required Field'),
        otherwise: () => yup.string(),
      }),
      shippingState: yup.string().when('shippingSameAsBilling', {
        is: (val: boolean) => val === false,
        then: () => yup.string().required('Required Field'),
        otherwise: () => yup.string(),
      }),
    });
  } else {
    schema = yup.object().shape({
      CardNumber: yup.string().required('Card Number field is required'),
      ExpiryDate: yup.string().required('ExpiryDate field is required'),
      Cvv: yup.string().required('Cvv field is required'),
    });
  }

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: '',
      CardNumber: '',
      ExpiryDate: '',
      message: profileData?.Profile?.BusinessDetails?.invoiceMsg || '',
      convenienceFee: false,
      fullAddress: false,
      type: 'sale',
      sender: '',
      files: [''],
      Amount: 0,
      BillingAddress: '',
      BillingCity: '',
      BillingCountry: 'US',
      BillingCountryCode: '1',
      BillingCustomerName: '',
      BillingEmail: '',
      BillingPhoneNumber: '',
      BillingPostalCode: '',
      BillingState: '',
      ConvenienceFeeActive: true,
      Cvv: '',
      Description: '',
      Giftcard: false,
      IsRecurring: false,
      MerchantId: '',
      PaymentTokenization: true,
      ReferenceNo: '12345',
      RequestOrigin: 'aux365-vt',
      SuggestedMode: 'card',
      TipAmount: '',
      TransactionType: '',
      shippingPostalCode: '',
      shippingCity: '',
      shippingStreet: '',
      shippingState: '',
      shippingCountry: 'US',
      shippingName: '',
      shippingSameAsBilling: true,
      isDraft: false,
      termsAndCondition: false,
      saveCreditCard: false,
      UserPaymentMethod: 'debit',
      technologyFee: 4.99,
      lastName: '',
      firstName: '',
      fullName: '',
      quantity: '',
      price: '',
      description: '',
      companyAddress: '',
      companyPhoneNumber: '',
      note: '',
      to: '',
      companyName: '',
      shippingAddress: '',
      customerName: '',
      customerCompany: '',
      customerStreet: '',
      customerCity: '',
      customerState: '',
      customerZip: '',
      customerPhoneNumber: '',
      customerEmail: '',
      issuedDate: dayjs(new Date()),
      dueDate: dayjs(new Date()),
    }),
    [],
  );

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const watchForm = watch();

  const fetchFeeDetails = async () => {
    const response = await axios.get('/payment/fee-detail');
    if (response?.status === 200) {
      const fee = response?.data?.data.find(
        (obj: any) => obj.ProcessorLevel === 'QuantumA',
      );
      setFeedetail(fee);
      const { ConvenienceFeeMinimum } = fee;
      let minFee: any = parseFloat(ConvenienceFeeMinimum?.toString());
      if (minFee <= 0) {
        minFee = 4.99;
      }
      minFee = minFee.toFixed(2);
      setValue('technologyFee', parseFloat(minFee?.toString()));
    }
  };

  const calculateDiscount = (discount: any, amount: any) => {
    return formatPayment((discount * amount) / 100);
  };

  const AmountAfterDiscount = (Discount: any, amount: any) => {
    const discountAmount = parseFloat(
      calculateDiscount(Discount, amount).toString(),
    );
    return formatPayment(amount - discountAmount);
  };

  const subTotal = orderDetails.reduce((accumulator, currentItem) => {
    const itemTotal = parseFloat(
      AmountAfterDiscount(
        currentItem.discount || 0,
        currentItem.quantity * currentItem.price || 0,
      ).toString(),
    );
    return accumulator + itemTotal;
  }, 0);

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  useEffect(() => {
    if (open) {
      fetchFeeDetails();
    }
    if (selectedChat) {
      const firstName = selectedChat?.Contact?.firstName || '';
      const lastName = selectedChat?.Contact?.lastName || '';
      const name = firstName ? `${firstName} ${lastName}` : lastName;

      setValue('customerName', name || '');
      setValue('description', '');
      setSelectedProductId('');
      setValue('customerEmail', selectedChat?.Contact?.email || '');
      setValue('customerPhoneNumber', selectedChat?.Contact?.phone || '');
      setValue('companyPhoneNumber', selectedChat?.from?.slice(2, 12));
      setValue('customerStreet', selectedChat?.Contact?.address?.street || '');
      setValue('customerCity', selectedChat?.Contact?.address?.city || '');
      setValue('customerState', selectedChat?.Contact?.address?.state || '');
      setValue('customerZip', selectedChat?.Contact?.address?.zip || '');
      setValue('customerCompany', selectedChat?.Contact?.company || '');
      setValue('companyName', selectedChat?.Contact?.company || '');
      setValue('to', selectedChat?.to?.slice(2, 12));
      setTextLoading(false);
      setEmailLoading(false);
    }
  }, [selectedChat, open]);

  useEffect(() => {
    setValue('message', profileData?.Profile?.BusinessDetails?.invoiceMsg);
  }, [profileData, open]);

  useEffect(() => {
    const ConvenienceFeeMinimum = feeDetail?.ConvenienceFeeMinimum;
    const ConvenienceFeeValue = feeDetail?.ConvenienceFeeValue;
    if (ConvenienceFeeMinimum && ConvenienceFeeValue) {
      const calculatedConvenienceFeeValue =
        (parseFloat(subTotal) * parseFloat(ConvenienceFeeValue)) / 100 || 0;
      let minFee: any =
        ConvenienceFeeMinimum > calculatedConvenienceFeeValue
          ? parseFloat(ConvenienceFeeMinimum)
          : parseFloat(calculatedConvenienceFeeValue?.toString());

      if (minFee <= 0) {
        minFee = 4.99;
      }
      minFee = minFee.toFixed(2);

      setValue('technologyFee', parseFloat(minFee?.toString()));
    }
  }, [subTotal]);

  let dueDate;
  let issueDate;

  if (watchForm.dueDate !== undefined && watchForm.dueDate !== null) {
    if (
      typeof watchForm.dueDate === 'string' ||
      typeof watchForm.dueDate === 'number' ||
      watchForm.dueDate instanceof Date
    ) {
      dueDate = dayjs(watchForm.dueDate);
    } else if (dayjs.isDayjs(watchForm.dueDate)) {
      dueDate = watchForm.dueDate;
    } else {
      console.error('Invalid type for dueDate:', typeof watchForm.dueDate);
    }
  } else {
    dueDate = dayjs();
  }

  const formattedDueDateInLocal: string = new Date(
    watchForm.dueDate.toString(),
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedIssuedDateInLocal: string = new Date(
    watchForm.issuedDate.toString(),
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  if (watchForm.issuedDate !== undefined && watchForm.issuedDate !== null) {
    if (
      typeof watchForm.issuedDate === 'string' ||
      typeof watchForm.issuedDate === 'number' ||
      watchForm.issuedDate instanceof Date
    ) {
      issueDate = dayjs(watchForm.issuedDate);
    } else if (dayjs.isDayjs(watchForm.issuedDate)) {
      issueDate = watchForm.issuedDate;
    } else {
      console.error(
        'Invalid type for issuedDate:',
        typeof watchForm.issuedDate,
      );
    }
  } else {
    issueDate = dayjs();
  }

  const formattedDueDate = (dueDate || dayjs())
    .locale('en')
    .format('MMM DD, YYYY');
  const formattedissueDate = (issueDate || dayjs())
    .locale('en')
    .format('MMM DD, YYYY');

  const handleCreateInvoice = async () => {
    setLoading(true);
    const {
      customerEmail,
      customerCity,
      customerState,
      customerStreet,
      customerZip,
      customerName,
      companyPhoneNumber,
      invoiceNumber,
      note,
      to,
      message,
      companyName,
      shippingSameAsBilling,
      isDraft,
      shippingPostalCode,
      shippingCity,
      shippingStreet,
      shippingState,
      technologyFee,
    } = watchForm;
    const payload = {
      conversationId: SelecteData ? SelecteData?.id : selectedChat?.id,
      description: note,
      message: message,
      to: to,
      invoiceNumber: invoiceNumber,
      companyName: companyName,
      companyPhoneNumber: companyPhoneNumber,
      companyEmail: user?.email,
      companyAddress: `${customerStreet}, ${customerCity}, ${customerState}, ${customerZip}`,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhoneNumber: SelecteData
        ? SelecteData?.customerPhoneNumber
        : selectedChat?.Contact?.phone,
      customerCity,
      customerState,
      customerStreet,
      customerZip,
      customerAddress: `${customerStreet}, ${customerCity}, ${customerState}, ${customerZip}`,
      customerCompany: selectedChat?.Contact?.company,
      from: SelecteData ? SelecteData?.from : selectedChat?.from,
      sender: user?.name,
      total: (subTotal + technologyFee || 4.99)?.toFixed(2),
      subtotal: subTotal,
      tax: technologyFee || 4.99,
      payment_url: '',
      productId: orderDetails.map((item) => item.id),
      products: orderDetails,
      dueDate: new Date(formattedDueDate).toISOString(),
      shippingAddress: `${customerStreet}, ${customerCity}, ${customerState}, ${customerZip}`,
      shippingPostalCode: shippingPostalCode || customerZip,
      shippingCity: shippingCity || customerCity,
      shippingStreet: shippingStreet || customerStreet,
      shippingState: shippingState || customerState,
      shippingSameAsBilling,
      isDraft,
      customerAddressObj: {
        street: customerStreet,
        city: customerCity,
        state: customerState,
        zip: customerZip,
      },
    };

    if (SelecteData) {
      delete payload?.customerPhoneNumber;
      payload.from = SelecteData?.customerPhoneNumber;
      await dispatch(removeIsDraftInvoice(SelecteData?.id, payload))
        .then((res: any) => {
          if (res) {
            if (res?.data?.isDraft === false) {
              setSuccessCreateInvoice(true);
            }
            setCreatedInvoiceDetails({
              ...watchForm,
              ...res.data,
              orderDetails,
              formattedDueDate,
              formattedissueDate,
            });
            toggle();
            reset(defaultValues);
            setOrderDetails([]);
          }
        })
        .catch((error: any) => {});
    } else {
      await dispatch(createInvoice(payload))
        .then((res: any) => {
          !isDraft && setSuccessCreateInvoice(true);
          setCreatedInvoiceDetails({
            ...watchForm,
            ...res.data,
            orderDetails,
            formattedDueDate,
            formattedissueDate,
          });
          toggle();
          reset(defaultValues);
          setOrderDetails([]);
        })
        .catch((error) => {});
    }
    setLoading(false);
  };

  const handleSendEmailInvoice = async (val: boolean) => {
    setEmailLoading(true);
    const { note, invoiceNumber } = createdInvoiceDetails;
    const payload = {
      conversationId: selectedChat?.id,
      contactId: selectedChat?.contactId,
      invoiceId: createdInvoiceDetails?.id,
      description: note || '',
      toEmail: selectedChat?.toEmail || selectedChat?.Contact?.email,
      fromEmail: user?.email,
      emailSubject: 'Invoice',
      invoiceNumber,
      sender: user?.name,
      total: createdInvoiceDetails?.total,
      subtotal: createdInvoiceDetails.subtotal,
      tax: createdInvoiceDetails?.tax,
      payment_url: createdInvoiceDetails.payment_url,
      isPaid: val,
      authCode: createdInvoiceDetails?.authCode,
      file: createdInvoiceDetails?.file,
    };
    // const formData = new FormData();
    // for (const key in payload) {
    //   formData.append(key, (payload as any)[key]);
    // }
    await dispatch(sendEmailInvoice(payload));
    setEmailLoading(false);
  };

  const handleSendTextInvoice = async (val: string) => {
    setTextLoading(true);
    const { note, invoiceNumber } = createdInvoiceDetails;
    const payload = {
      conversationId: selectedChat?.contactId,
      invoiceId: createdInvoiceDetails?.id,
      description: note,
      invoiceNumber,
      to: selectedChat?.to,
      from: selectedChat?.from,
      sender: user?.name,
      total: createdInvoiceDetails?.total,
      subtotal: createdInvoiceDetails.subtotal,
      tax: createdInvoiceDetails?.tax,
      payment_url: createdInvoiceDetails.payment_url,
      isPaid: val,
      authCode: createdInvoiceDetails?.authCode,
      file: createdInvoiceDetails?.file,
    };
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, (payload as any)[key]);
    }
    await dispatch(sendTextInvoice(formData));
    setTextLoading(false);
  };

  const handlePaymentInvoice = async () => {
    setLoading(true);
    const {
      customerEmail,
      Cvv,
      ExpiryDate,
      CardNumber,
      customerName,
      note,
      to,
      message,
      shippingAddress,
      invoiceNumber,
      shippingStreet,
      shippingState,
      shippingPostalCode,
      shippingCity,
      shippingSameAsBilling,
      isDraft,
      customerCity,
      customerState,
      customerStreet,
      customerZip,
    } = watchForm;
    const {
      street = '',
      city = '',
      state = '',
      zip = '',
    } = { ...selectedChat?.Contact?.address };

    let payload = {
      shippingSameAsBilling,
      isDraft,
      IsRecurring: false,
      Amount: createdInvoiceDetails?.total,
      ConvenienceFeeActive: true,
      BillingEmail: customerEmail,
      BillingCustomerName: customerName,
      BillingPostalCode: zip || '278965',
      BillingCountryCode: selectedChat?.Contact?.countryCode,
      BillingPhoneNumber: selectedChat?.Contact?.phone,
      BillingCountry: 'US',
      shippingName: customerName,
      shippingAddress,
      shippingCity,
      shippingStreet,
      shippingState,
      shippingPostalCode: shippingPostalCode || '',
      shippingCountry: 'AF',
      CardNumber: (CardNumber || '').replace(/ /g, ''),
      ExpiryDate: ExpiryDate,
      Cvv: Cvv,
      MerchantId: '',
      TransactionType: '1',
      PaymentTokenization: true,
      BillingAddress: street,
      BillingCity: city,
      BillingState: state,
      Description: note,
      ReferenceNo: (+new Date()).toString(),
      Message: message,
      RequestOrigin: 'vt',
      SuggestedMode: 'Card',
      TipAmount: 1,
      Giftcard: false,
      id: selectedChat?.Contact.id,
      to: to
        ? to
        : Boolean(selectedChat.Contact)
        ? selectedChat.Contact?.phone
        : selectedChat?.to,
      from: selectedChat?.from,
      sender: user?.name,
      type: '1',
      invoiceNumber,
      invoiceId: createdInvoiceDetails?.id,
      customerAddressObj: {
        street: customerStreet,
        city: customerCity,
        state: customerState,
        zip: customerZip,
      },
    };

    await dispatch(vtPaymentInvoice(payload))
      .then((res: any) => {
        if (res.status === 'success') {
          setCreatedInvoiceDetails({
            ...createdInvoiceDetails,
            authCode: res?.data?.AuthCode,
            CardNumber: (CardNumber || '').replace(/ /g, ''),
          });
        } else {
          setCreatedInvoiceDetails({});
        }
        reset(defaultValues);
        setSuccessCreateInvoice(false);
        setPayModalOpen(false);
        setSuccessPaidInvoice(true);
      })
      .catch((error: any) => {
        setCreatedInvoiceDetails({});
        reset(defaultValues);
        setSuccessCreateInvoice(false);
        setPayModalOpen(false);
        setSuccessPaidInvoice(true);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchData();
      fetchProductData();
    }
  }, [successCreateInvoice, open]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/invoice`);
      const resp = response.status === 200 ? response.data.data : [];
      let num = `INV0${resp?.length + 1}`;
      setValue('invoiceNumber', num);
    } catch (e) {}
  }, []);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await axios.get(`/products`);
      const resp = response.status === 200 ? response.data.data : [];
      setProductData(resp);
    } catch (e) {}
  }, []);

  const handleDownloadPDf = async () => {
    const response = await fetch(createdInvoiceDetails?.file);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let invoice_name = `${watchForm?.customerName}-${watchForm?.invoiceNumber}.pdf`;
    link.setAttribute('download', invoice_name);
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    if (watchForm.message) {
      clearErrors('message');
    }
  }, [watchForm.message]);

  useEffect(() => {
    if (watchForm.shippingSameAsBilling) {
      setValue('shippingAddress', '');
    }
  }, [watchForm.shippingSameAsBilling]);

  const handleAddProduct = async () => {
    const { quantity, price, description } = watchForm;
    const selectedProduct = productData.find(
      (product) => product.name === description && product.id !== description,
    );

    const existingProduct = orderDetails?.find(
      (product) => product.name === description,
    );

    if (existingProduct) {
      const tempOrder = orderDetails.filter(
        (product) => product.name !== description,
      );

      setOrderDetails([
        ...tempOrder,
        { ...existingProduct, price: price, quantity: quantity },
      ]);
      setValue('price', '');
      setValue('quantity', '');
      setValue('description', '');
      setSelectedProductId('');
      return;
    }

    if (!Boolean(selectedProduct)) {
      const filteredProduct = productData.find(
        (product) => product.id === description,
      );

      setAddProductLoading(true);
      const payload = {
        discount: 0,
        type: 'Product',
        status: 'ACTIVE',
        name: description,
        price: parseFloat(price || '0'),
        description: description,
        quantity: parseFloat(quantity || '0'),
      };
      const callBack = (result: any) => {
        setAddProductLoading(false);
        setOrderDetails((prevState) => [...prevState, result]);
        setValue('price', '');
        setValue('quantity', '');
        setValue('description', '');
        setSelectedProductId('');
        setProductData([...filteredProduct, result]);
      };
      await dispatch(addProduct(payload, callBack, setAddProductLoading));
    } else {
      console.log([{ ...selectedProduct, price, quantity }]);

      setOrderDetails((prevState) => [
        ...prevState,
        { ...selectedProduct, price, quantity },
      ]);
      setValue('price', '');
      setValue('quantity', '');
      setValue('description', '');
      setSelectedProductId('');
    }
  };

  const handleAutocompleteChange = (event: any, newValue: any) => {
    if (!Boolean(newValue)) {
      setValue('price', '');
      setValue('quantity', '');
      return false;
    }
    const selectedProduct = productData.find(
      (product) => product.id === newValue?.id,
    );
    if (!selectedProduct) {
      setProductData([...productData, newValue]);
    }
    setSelectedProductId(newValue?.id);
    setValue('description', newValue?.name);
    setValue('price', formatPayment(newValue?.price)?.toString());
  };

  const handleEditProductInInvoice = (item: any) => {
    setSelectedProductId(item?.id || null);
    setValue('description', item?.description);
    setValue('price', formatPayment(item?.price)?.toString());
    setValue('quantity', item?.quantity);
  };

  const handleDeleteProductFromInvoice = (item: any) => {
    setOrderDetails((prevOrderDetails) => {
      return prevOrderDetails.filter((order) => order.id !== item.id);
    });
  };

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
    setValue('CardNumber', spacedNumber, { shouldValidate: true });
  };

  const handleExpiryChange = (e: any) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length >= 2) {
      const month = input.slice(0, 2);
      const validMonth = parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;

      if (!validMonth) {
        e.target.value = '';
        setValue('ExpiryDate', '', { shouldValidate: true });
        return;
      }
    }

    if (input.length >= 4) {
      const year = input.slice(2, 4);
      const currentYear = new Date().getFullYear() % 100;
      const validYear = parseInt(year, 10) >= currentYear;

      if (!validYear) {
        e.target.value = '';
        setValue('ExpiryDate', '', { shouldValidate: true });
        return;
      }
      input = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
    }
    e.target.value = input;
    setCardDetails({
      ...cardDetails,
      ExpiryDate: input,
    });
    setValue('ExpiryDate', input, { shouldValidate: true });
  };

  const formatAndSetCvv = (e: any) => {
    const inputVal = e.target.value.replace(/ /g, '');
    let inputNumbersOnly = inputVal.replace(/\D/g, '');
    if (inputNumbersOnly.length >= 4) {
      inputNumbersOnly = inputNumbersOnly.substr(0, 4);
    }
    setValue('Cvv', inputNumbersOnly, { shouldValidate: true });
  };

  const formatUserAddress = () => {
    const firstLine = watchForm?.customerStreet || '-';
    const secondLine = [
      watchForm?.customerCity,
      watchForm?.customerState,
      watchForm?.customerZip,
    ]
      .filter((data) => Boolean(data))
      .join(', ');
    return firstLine + '<br>' + secondLine;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          toggle();
          reset(defaultValues);
          setOrderDetails([]);
          setSelecteData(null);
        }}
        maxWidth="xl"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ '& .MuiDialog-paper': { overflow: 'hidden !important' } }}
      >
        <div className="main1" style={{ background: '#323441' }}>
          <form>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 6" marginLeft={'50px'}>
                  <div className="left_div1" style={{ position: 'relative' }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // reset()
                        setCreatedInvoiceDetails([]);
                        setOrderDetails([]);
                        reset(defaultValues);
                        toggle();
                      }}
                      sx={{
                        borderRadius: 1,
                        color: 'black',
                        backgroundColor: 'white',
                      }}
                      style={{
                        background: 'white',
                        borderRadius: '50px',
                        position: 'absolute',
                        right: '10px',
                        zIndex: '1',
                        top: '20px',
                      }}
                    >
                      <IconX />
                    </IconButton>
                    <div
                      className="left_inner_div"
                      style={{ padding: '30px', paddingBottom: 0 }}
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                      >
                        <Box gridColumn="span 12">
                          <CustomHeader sx={{ mb: 0, pt: 0 }}>
                            <Typography
                              variant="h6"
                              style={{
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Image
                                src={payment}
                                width={50}
                                height={50}
                                alt=""
                              />{' '}
                              Create Invoice
                            </Typography>
                          </CustomHeader>
                        </Box>
                      </Box>
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                      >
                        <Box gridColumn="span 12">
                          <CustomHeader sx={{ mb: 0, pt: 0 }}>
                            <Typography
                              variant="h6"
                              style={{
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              Invoice To :{' '}
                              <span
                                style={{ color: '#49A8FF', fontSize: '15px' }}
                              >
                                {watchForm?.customerName}
                              </span>{' '}
                            </Typography>
                          </CustomHeader>
                        </Box>
                      </Box>
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                        sx={{ margin: '0 0 5px 0' }}
                      >
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'customerName'}
                            hasRequired={true}
                            label={'Contact'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'companyName'}
                            hasRequired={true}
                            label={'Company Name'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'to'}
                            type={'number'}
                            hasRequired={true}
                            label={'Send To'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'companyPhoneNumber'}
                            hasRequired={true}
                            type={'text'}
                            label={'Company Phone Number'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'customerStreet'}
                            hasRequired={true}
                            label={'Street'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'customerCity'}
                            hasRequired={true}
                            label={'City'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'customerState'}
                            hasRequired={true}
                            label={'State'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                        <Box gridColumn="span 6">
                          <CustomFormTextVT
                            name={'customerZip'}
                            hasRequired={true}
                            type={'number'}
                            label={'Zip'}
                            errors={errors}
                            control={control}
                            style={{ mb: 0 }}
                          />
                        </Box>
                      </Box>

                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                      >
                        <Box gridColumn="span 12">
                          <CustomFormCheckboxVT
                            name={'shippingSameAsBilling'}
                            control={control}
                            label={
                              'Shipping information is the same as billing'
                            }
                          />
                        </Box>
                        {!watchForm.shippingSameAsBilling && (
                          <>
                            <Box gridColumn="span 6">
                              <CustomFormTextVT
                                name={'shippingStreet'}
                                hasRequired={true}
                                label={'Shipping Street'}
                                errors={errors}
                                control={control}
                              />
                            </Box>
                            <Box gridColumn="span 6">
                              <CustomFormTextVT
                                name={'shippingCity'}
                                hasRequired={true}
                                label={'Shipping City'}
                                errors={errors}
                                control={control}
                              />
                            </Box>
                            <Box gridColumn="span 6">
                              <CustomFormTextVT
                                name={'shippingState'}
                                hasRequired={true}
                                label={'Shipping State'}
                                errors={errors}
                                control={control}
                              />
                            </Box>
                            <Box gridColumn="span 6">
                              <CustomFormTextVT
                                type="number"
                                name={'shippingPostalCode'}
                                hasRequired={true}
                                label={'Shipping ZipCode'}
                                errors={errors}
                                control={control}
                              />
                            </Box>
                          </>
                        )}
                      </Box>
                      <Box
                        gridColumn="span 12"
                        borderBottom={'2px solid gray'}
                        marginBottom={2}
                        marginTop={2}
                      ></Box>
                      <Box gridColumn="span 12">
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white',
                          }}
                        >
                          <div>
                            <h1
                              className="lightBlue"
                              style={{ margin: 0, fontSize: 40 }}
                            >
                              ${formatPayment(subTotal)}
                            </h1>
                            <p
                              className="lightBlue"
                              style={{
                                margin: 0,
                                marginTop: '15px',
                                fontSize: 20,
                              }}
                            >
                              USD
                            </p>
                            <p style={{ margin: 0, marginTop: '5px' }}>
                              Sub-Total
                            </p>
                          </div>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                textAlign: 'right',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <p style={{ margin: 0 }}>Issue Date:</p>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <FormControl fullWidth>
                                  <Controller
                                    name="issuedDate"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DatePicker
                                          openTo="day"
                                          value={value}
                                          format={'MMM DD, YYYY'}
                                          onChange={onChange}
                                          sx={{
                                            width: '170px',
                                            '& .MuiOutlinedInput-notchedOutline':
                                              {
                                                border: 'none !important',
                                              },
                                            '& .MuiOutlinedInput-root': {
                                              color: '#49a8ff !important',
                                            },
                                            '& .MuiSvgIcon-root': {
                                              color: 'white !important',
                                            },
                                          }}
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                  {errors.issuedDate && (
                                    <FormHelperText
                                      sx={{ color: 'error.main' }}
                                    >
                                      {errors.issuedDate.message}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Box>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                textAlign: 'right',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <p style={{ margin: 0 }}>Due Date:</p>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <FormControl fullWidth>
                                  <Controller
                                    name="dueDate"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DatePicker
                                          value={value}
                                          format={'MMM DD, YYYY'}
                                          onChange={onChange}
                                          sx={{
                                            width: '170px',
                                            '& .MuiOutlinedInput-notchedOutline':
                                              {
                                                border: 'none !important',
                                              },
                                            '& .MuiOutlinedInput-root': {
                                              color: '#49a8ff !important',
                                            },
                                            '& .MuiSvgIcon-root': {
                                              color: 'white !important',
                                            },
                                          }}
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                  {errors.dueDate && (
                                    <FormHelperText
                                      sx={{ color: 'error.main' }}
                                    >
                                      {errors.dueDate.message}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Box>
                            </div>
                          </div>
                        </div>
                      </Box>
                      <Box gridColumn="span 12" sx={{ mt: 4 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            gap: '5px',
                            color: 'white',
                            marginBottom: '3px',
                          }}
                        >
                          <p className="gray" style={{ margin: 0 }}>
                            Invoice #
                            <span
                              style={{
                                color: 'white',
                                paddingLeft: '5px',
                                fontSize: 20,
                              }}
                            >
                              {watchForm?.invoiceNumber}
                            </span>
                          </p>
                          <p className="gray" style={{ margin: 0 }}>
                            Total Items #
                            <span
                              style={{
                                color: 'white',
                                paddingLeft: '5px',
                                fontSize: 20,
                              }}
                            >
                              {orderDetails.length}
                            </span>
                          </p>
                        </div>
                      </Box>
                      <Box
                        gridColumn="span 12"
                        borderBottom={'2px solid gray'}
                      ></Box>
                      <Box
                        gridColumn="span 12"
                        sx={{
                          display: 'flex',
                          color: 'whitesmoke',
                          justifyContent: 'space-between',
                          fontSize: '10px',
                        }}
                      >
                        <div className="outer-table">
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th style={{ minWidth: '250px' }}>PRODUCT</th>
                                <th>PRODUCT QTY</th>
                                <th>PRICE/AMOUNT ($)</th>
                                <th>DIS(%)</th>
                                <th>TOTAL</th>
                                <th>ACTION</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails.map((item: any, index: any) => (
                                <tr key={index + 1}>
                                  <td>{index + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>${formatPayment(item.price)}</td>
                                  <td>
                                    $
                                    {calculateDiscount(
                                      item.discount || 0,
                                      item.quantity * item.price || 0,
                                    )}
                                  </td>
                                  <td>
                                    $
                                    {AmountAfterDiscount(
                                      item.discount || 0,
                                      item.quantity * item.price || 0,
                                    )}
                                  </td>
                                  <td style={{ display: 'flex' }}>
                                    <IconButton
                                      onClick={() =>
                                        handleEditProductInInvoice(item)
                                      }
                                    >
                                      <Edit />
                                    </IconButton>

                                    <IconButton
                                      onClick={() =>
                                        handleDeleteProductFromInvoice(item)
                                      }
                                    >
                                      <Delete />
                                    </IconButton>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={3}>
                                  <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Autocomplete
                                      value={
                                        selectedProductId &&
                                        selectedProductId != ''
                                          ? productData.find(
                                              (product) =>
                                                product.id ===
                                                selectedProductId,
                                            ) || null
                                          : ''
                                      }
                                      onChange={handleAutocompleteChange}
                                      options={productData}
                                      getOptionLabel={(option) =>
                                        option.name || ''
                                      }
                                      freeSolo
                                      clearOnBlur
                                      filterOptions={(
                                        options: any[],
                                        params: any,
                                      ) => {
                                        const filtered = filter(
                                          options,
                                          params,
                                        );
                                        const { inputValue } = params;
                                        const isExisting = options.some(
                                          (option: any) =>
                                            inputValue?.id === option.id,
                                        );
                                        if (inputValue !== '' && !isExisting) {
                                          const input = {
                                            id: inputValue,
                                            name: inputValue,
                                            description: inputValue,
                                            price: 0,
                                          };
                                          filtered.push(input);
                                        }
                                        return filtered;
                                      }}
                                      renderInput={(params) => (
                                        <VTCustomTextField
                                          {...params}
                                          size="small"
                                          label={'Enter or Select Product'}
                                          fontColor={'black'}
                                          sx={{
                                            '& .MuiInputLabel-shrink, legend, fieldset':
                                              {
                                                display: 'none !important',
                                              },
                                            '& .MuiButtonBase-root': {
                                              color: 'black !important',
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </td>
                                <td colSpan={1}>
                                  <CustomFormTextVT
                                    name={'quantity'}
                                    hasRequired={true}
                                    label={'QTY'}
                                    type="number"
                                    errors={errors}
                                    control={control}
                                  />
                                </td>
                                <td colSpan={2}>
                                  <CustomFormTextVT
                                    name={'price'}
                                    hasRequired={true}
                                    label={'Amount ($)'}
                                    type="number"
                                    errors={errors}
                                    control={control}
                                  />
                                </td>
                                <td>
                                  <Tooltip
                                    placement="top"
                                    title={
                                      !(
                                        watch('description') &&
                                        watch('quantity') &&
                                        watch('price')
                                      )
                                        ? 'Please fill all the input fields'
                                        : ''
                                    }
                                  >
                                    <div>
                                      <LoadingButton
                                        className=""
                                        loading={isAddProductLoading}
                                        onClick={() => handleAddProduct()}
                                        style={{
                                          padding: '7px',
                                          background:
                                            'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                                          color: 'white',
                                        }}
                                        disabled={
                                          !(
                                            watch('description') &&
                                            watch('quantity') &&
                                            watch('price')
                                          )
                                        }
                                      >
                                        Add
                                      </LoadingButton>
                                    </div>
                                  </Tooltip>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Box>
                    </div>

                    <div
                      className="bottom_div"
                      style={{
                        background: '#464854',
                        borderRadius: '20px',
                        padding: '30px',
                        paddingTop: '10px',
                        width: '100%',
                      }}
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                      >
                        <Box gridColumn="span 12">
                          <CustomFormTextVT
                            name={'message'}
                            multiline
                            label={'Message'}
                            errors={errors}
                            control={control}
                            rows={2}
                            style={{ mb: 0 }}
                          />
                        </Box>

                        <Box gridColumn="span 12">
                          <CustomFormTextVT
                            name={'note'}
                            multiline
                            label={'Note'}
                            errors={errors}
                            control={control}
                            rows={2}
                            style={{ mb: 0 }}
                          />
                        </Box>
                      </Box>
                    </div>
                  </div>
                </Box>
                <Box gridColumn="span 6">
                  <div className="create_inv_div_right">
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={2}
                    >
                      <Box gridColumn="span 12" sx={{ width: '100%', mb: 2 }}>
                        <div
                          className="logo_vertual1"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Image
                            width={150}
                            height={150}
                            alt="logo"
                            src={
                              profileData?.Profile?.BusinessDetails?.logo ||
                              logo
                            }
                          />
                        </div>
                      </Box>
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={2}
                    >
                      <Box gridColumn="span 4">
                        <ul className="list_ul">
                          <li className="li_list">
                            <p className="top-p2">
                              Invoice to{' '}
                              {watchForm?.customerCompany ||
                                watchForm?.customerName}
                            </p>
                          </li>
                          <li className="li_list">
                            <p
                              className="top-p"
                              style={{ fontSize: 18, fontWeight: 500 }}
                            >
                              $
                              {formatPayment(
                                subTotal
                                  ? subTotal + watchForm?.technologyFee
                                  : watchForm?.technologyFee || 0,
                              )}
                            </p>
                            USD
                          </li>
                          <li className="li_list">
                            <p className="top-p1">
                              Due : {formatDate(formattedDueDate)}
                            </p>
                          </li>
                          <li className="li_list">
                            <p className="top-p1">
                              Covered :
                              {formatDate(formattedIssuedDateInLocal) +
                                '-' +
                                formatDate(formattedDueDateInLocal)}
                            </p>
                          </li>
                        </ul>
                      </Box>
                      <Box gridColumn="span 8">
                        <ul className="list_ul">
                          <li className="li_list">
                            {' '}
                            <p className="top-p1">
                              Invoice #{' '}
                              <span
                                style={{
                                  fontSize: 14,
                                  margin: 0,
                                  marginBottom: 5,
                                  display: 'block',
                                }}
                              >
                                {watchForm?.invoiceNumber}
                              </span>
                            </p>
                          </li>

                          <li className="li_list d-flex">
                            <p className="top-p1">Date Issued:</p>
                            <p className="top-p2">{formattedissueDate}</p>
                          </li>
                          <li className="li_list d-flex">
                            <p className="top-p1">Requested by</p>
                            <p className="top-p2">AUX365</p>
                          </li>
                          <li className="li_list d-flex">
                            <p className="top-p1">Email:</p>
                            <p className="top-p2">aux365@auxgroup.net</p>
                          </li>
                          <li className="li_list d-flex">
                            <p className="top-p1">Phone:</p>
                            <p className="top-p2">
                              {watchForm?.companyPhoneNumber}
                            </p>
                          </li>
                          <li className="li_list d-flex">
                            <p className="top-p1">Message:</p>
                            <p className="top-p2">
                              {watchForm?.message ? watchForm?.message : '----'}
                            </p>
                          </li>
                        </ul>
                        {/* </div> */}
                      </Box>
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={2}
                    >
                      {!watchForm.shippingSameAsBilling && (
                        <Box gridColumn="span 12">
                          <ul className="list_ul">
                            <li className="li_list">
                              <p
                                style={{
                                  borderBottom: ' solid',
                                  paddingBottom: '2px',
                                }}
                                className="top-p heading"
                              >
                                Shipping details:
                              </p>
                            </li>
                            <li className="li_list customer_div">
                              <p className="p1">
                                Shipping Address:
                                <span style={{ margin: 0 }}>
                                  {watchForm.shippingStreet && (
                                    <span>{watchForm.shippingStreet}, </span>
                                  )}
                                  {watchForm.shippingCity && (
                                    <span>{watchForm.shippingCity}, </span>
                                  )}
                                  {watchForm.shippingState && (
                                    <span>{watchForm.shippingState}, </span>
                                  )}
                                  {watchForm.shippingPostalCode && (
                                    <span>{watchForm.shippingPostalCode} </span>
                                  )}
                                </span>
                              </p>
                            </li>
                          </ul>
                        </Box>
                      )}

                      <Box gridColumn="span 12" sx={{ m: 0, p: 0 }}>
                        <ul className="list_ul">
                          <li className="li_list">
                            <p
                              style={{
                                borderBottom: ' solid',
                                paddingBottom: '2px',
                              }}
                              className="top-p heading"
                            >
                              Customer Details:
                            </p>
                          </li>
                        </ul>
                      </Box>
                      <Box gridColumn="span 6" sx={{ m: 0, p: 0 }}>
                        <ul className="list_ul">
                          <li className="li_list customer_div">
                            <p className="p1">Name:</p>
                            <p className="top-p2">{watchForm.customerName}</p>
                          </li>
                          <li className="li_list customer_div">
                            <p className="p1">Email:</p>
                            <p className="p2">{watchForm.customerEmail}</p>
                          </li>
                          <li className="li_list customer_div">
                            <p className="p1">Phone Number:</p>
                            <p className="p2">
                              {watchForm.customerPhoneNumber}
                            </p>
                          </li>
                          <li className="li_list customer_div">
                            <p className="p1">Company Name:</p>
                            <p className="p2">{watchForm?.companyName}</p>
                          </li>
                        </ul>
                      </Box>
                      <Box gridColumn="span 6" sx={{ m: 0, p: 0 }}>
                        <ul>
                          <li className="li_list customer_div">
                            <p className="p1">Address:</p>
                            <p
                              className="p2"
                              dangerouslySetInnerHTML={{
                                __html: formatUserAddress(),
                              }}
                            />
                          </li>
                        </ul>
                      </Box>
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={2}
                    >
                      <Box gridColumn="span 12">
                        <div className="outer-table">
                          <ul className="list_ul">
                            <li className="li_list">
                              <p
                                style={{
                                  borderBottom: ' solid',
                                  paddingBottom: '2px',
                                }}
                                className="top-p heading"
                              >
                                Transaction Details:{' '}
                                <span style={{ float: 'right' }}>
                                  Total Items #
                                  <span>{orderDetails?.length}</span>
                                </span>
                              </p>
                            </li>
                          </ul>
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th style={{ minWidth: '250px' }}>PRODUCT</th>
                                <th>PRODUCT QTY</th>
                                <th>PRICE/AMOUNT ($)</th>
                                <th>DIS(%)</th>
                                <th>TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails.map((item: any, index: any) => (
                                <tr key={index + 1}>
                                  <td>{index + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>${formatPayment(item.price)}</td>
                                  <td>
                                    $
                                    {calculateDiscount(
                                      item.discount || 0,
                                      item.quantity * item.price || 0,
                                    )}
                                  </td>
                                  <td>
                                    $
                                    {AmountAfterDiscount(
                                      item.discount || 0,
                                      item.quantity * item.price || 0,
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Box>
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={2}
                    >
                      <Box gridColumn="span 5"></Box>
                      <Box gridColumn="span 7">
                        <ul className="list_ul">
                          <li className="li_list customer_div">
                            <p className="p1">Sub-Total Amount:</p>
                            <p className="top-p2">${formatPayment(subTotal)}</p>
                          </li>
                          <li className="li_list customer_div">
                            <p className="p1">Technology Fee:</p>
                            <p className="top-p2">
                              $
                              {formatPayment(
                                watchForm?.technologyFee || '4.99',
                              )}
                            </p>
                          </li>
                          <li className="li_list customer_div">
                            <p className="p1">Total:</p>
                            <p className="top-p2">
                              $
                              {formatPayment(
                                subTotal
                                  ? subTotal + watchForm?.technologyFee
                                  : watchForm?.technologyFee || 0,
                              )}
                            </p>
                          </li>
                        </ul>
                      </Box>
                    </Box>

                    <div
                      className="right_bottom_div"
                      style={{ padding: '0 0 0 35px' }}
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                      >
                        <Box gridColumn="span 12">
                          <p style={{ color: 'gray' }}>Note :</p>
                          <p
                            style={{
                              background: '#e8e8e8',
                              padding: '10px 15px',
                            }}
                          >
                            {watchForm?.note}
                          </p>
                        </Box>
                        <Box
                          gridColumn="span 12"
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <p style={{ color: 'gray' }}>Page 1 of 1</p>
                          <p>@ 2024 Aux 365.net. All Rights Reserved</p>
                        </Box>
                      </Box>
                    </div>
                  </div>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gap={2}
                  >
                    <Box gridColumn="span 12">
                      <CustomFormCheckboxVT
                        name={'isDraft'}
                        control={control}
                        label={'Save as draft'}
                      />
                      <LoadingButton
                        fullWidth
                        sx={{
                          mt: 1,
                          background:
                            'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                        }}
                        loading={loading}
                        variant="contained"
                        onClick={handleSubmit(handleCreateInvoice)}
                        disabled={orderDetails.length === 0}
                      >
                        Complete Invoice
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </FormControl>
          </form>
        </div>
      </Dialog>

      <Dialog
        open={successCreateInvoice}
        keepMounted
        onClose={() => reset(defaultValues)}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          '& .MuiDialog-paper': {
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 'calc(100vH - 64px)',
          },
        }}
      >
        <Box p={2}>
          <form>
            <IconButton
              aria-label="close"
              style={{ position: 'absolute', right: '0px', top: '0px' }}
              onClick={() => {
                setCreatedInvoiceDetails([]);
                setOrderDetails([]);
                setPayModalOpen(false);
                reset(defaultValues);
                setSuccessCreateInvoice(false);
              }}
            >
              <CancelOutlinedIcon style={{ color: '#fff', fontSize: '30px' }} />
            </IconButton>

            <div style={{ display: 'block', textAlign: 'center' }}>
              <IconButton aria-label="article">
                <div style={{ position: 'relative' }}>
                  <Image
                    src={IV_BG}
                    width={100}
                    height={110}
                    alt="icon"
                    style={{ background: '#393b48' }}
                  />
                  <Image
                    src={checkBG_IV}
                    width={30}
                    height={30}
                    alt="icon"
                    style={{
                      position: 'absolute',
                      top: '70px',
                      right: '-15px',
                    }}
                  />
                  <Image
                    src={check}
                    width={20}
                    height={30}
                    alt="icon"
                    style={{
                      position: 'absolute',
                      top: '65px',
                      right: '-10px',
                    }}
                  />
                </div>
              </IconButton>
              <DialogTitle
                style={{
                  color: theme.palette.mode === 'dark' ? 'white' : 'black',
                  fontSize: '12px',
                  fontStyle: 'revert',
                  textAlign: 'center',
                }}
              >
                {'Invoice Complete'}
              </DialogTitle>

              <DialogContent sx={{ marginTop: '10px' }}>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  style={{
                    color: '#00bfff',
                    fontSize: 26,
                    fontFamily: 'monospace',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  ${formatPayment(createdInvoiceDetails?.total)}
                </DialogContentText>
              </DialogContent>
            </div>

            <DialogActions style={{ justifyContent: 'space-around' }}>
              <LoadingButton
                variant="outlined"
                style={{
                  width: '100%',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  padding: '10px 40px',
                  borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
                onClick={() => handleDownloadPDf()}
              >
                <Image
                  src={download}
                  width={20}
                  height={20}
                  alt="icon"
                  style={{ margin: '0 10px 0 0' }}
                />{' '}
                Download
              </LoadingButton>
              <LoadingButton
                loading={emailLoading}
                variant="outlined"
                onClick={() => handleSendEmailInvoice(false)}
                style={{
                  width: '100%',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  padding: '10px 40px',
                  borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  minHeight: 46,
                }}
              >
                {!emailLoading && (
                  <>
                    <IconMail style={{ marginRight: '5px' }} />
                    Email
                  </>
                )}
              </LoadingButton>
              <LoadingButton
                loading={textLoading}
                variant="outlined"
                onClick={() => handleSendTextInvoice('false')}
                style={{
                  width: '100%',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  padding: '10px 40px',
                  borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  minHeight: 46,
                }}
              >
                {!textLoading && (
                  <>
                    <IconMessages style={{ marginRight: '5px' }} />
                    Text
                  </>
                )}
              </LoadingButton>
            </DialogActions>
            <Divider
              variant="middle"
              style={{ marginBottom: '16px', marginTop: '16px' }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <DialogContentText
                  id="alert-dialog-description"
                  style={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontSize: '12px',
                  }}
                >
                  Invoivce number
                </DialogContentText>
                <DialogContentText
                  id="alert-dialog-description"
                  style={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontSize: '12px',
                  }}
                >
                  Due Date
                </DialogContentText>
              </div>
              <div>
                <DialogContentText
                  id="alert-dialog-description"
                  style={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontSize: '12px',
                  }}
                >
                  {createdInvoiceDetails?.invoiceNumber}
                </DialogContentText>
                <DialogContentText
                  id="alert-dialog-description"
                  style={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontSize: '12px',
                  }}
                >
                  {formatDate(createdInvoiceDetails?.dueDate)}
                </DialogContentText>
              </div>
            </div>
            <TextField
              select
              fullWidth
              size="small"
              label={'Select Invoice Type'}
              value={InvoiceType}
              onChange={async (e) => {
                setInvoiceType(e?.target?.value);
                console.log(createdInvoiceDetails);
                await dispatch(
                  invoiceRecurring(createdInvoiceDetails?.id, {
                    invoiceType: e?.target?.value,
                  }),
                )
                  .then((res: any) => {
                    console.log(res);
                  })
                  .catch((error) => {});
              }}
              sx={{
                background: theme.palette.mode === 'dark' ? '#323441' : '#fff',
                my: 1,
              }}
            >
              {INVOICE_TYPE_VALUES.map((option, index) => (
                <MenuItem key={index + 1} value={option?.value}>
                  {option?.label}
                </MenuItem>
              ))}
            </TextField>

            {payModalOpen && (
              <Card sx={{ background: '#40414ee3', marginTop: '10px' }}>
                <CardContent sx={{ padding: '0px' }}>
                  <>
                    <Box display="grid" gridTemplateColumns="repeat(13, 1fr)">
                      <Box
                        gridColumn="span 6"
                        style={{
                          fontSize: '1rem',
                          marginBottom: '15px',
                          display: 'flex',
                          justifyContent: 'start',
                          // marginRight: '20px',
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: '0.85rem',
                            marginBottom: '5px',
                            color: '#40ff00',
                          }}
                        >
                          Pay via Credit Card
                        </Typography>
                      </Box>
                      {/* <Box gridColumn="span 1" style={{ color: 'white' }}>
                          <Typography
                            style={{ fontSize: '0.85rem', marginBottom: '5px' }}
                          >
                            |
                          </Typography>
                        </Box>
                        <Box
                          gridColumn="span 6"
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            marginBottom: '5px',
                            display: 'flex',
                            justifyContent: 'start',
                          }}
                        >
                          <Typography
                            style={{ fontSize: '0.85rem', marginBottom: '5px' }}
                          >
                            Pay thru ACH (Cheque)
                          </Typography>
                        </Box> */}
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={2}
                    >
                      <Box gridColumn="span 12">
                        <div className="card_icon">
                          <CustomFormTextVT
                            name={'CardNumber'}
                            hasRequired={true}
                            label={'Card Number'}
                            errors={errors}
                            control={control}
                            onChange={(e) => formatAndSetCcNumber(e)}
                          />
                          <Image alt={''} width={150} height={40} src={card} />
                        </div>
                      </Box>
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gridColumn="span 12"
                        gap={2}
                      >
                        <Box gridColumn="span 6">
                          <FormControl
                            fullWidth
                            sx={
                              true
                                ? {
                                    ...{},
                                  }
                                : { mb: 2 }
                            }
                          >
                            <VTCustomTextField
                              placeholder={'MM/YY'}
                              size="small"
                              name={'ExpiryDate'}
                              inputProps={{ maxLength: 5 }}
                              onChange={(e: any) => handleExpiryChange(e)}
                              error={Boolean(errors['ExpiryDate'])}
                            />

                            {errors['ExpiryDate'] && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors['ExpiryDate'].message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                        <Box gridColumn="span 6">
                          <div style={{ position: 'relative' }}>
                            <CustomFormTextVT
                              name={'Cvv'}
                              hasRequired={true}
                              label={'CVV'}
                              errors={errors}
                              control={control}
                              onChange={(e) => formatAndSetCvv(e)}
                              fontColor="#fff"
                            />
                            <Image
                              alt={''}
                              style={{
                                position: 'absolute',
                                right: '10px',
                                top: '-3px',
                              }}
                              width={42}
                              height={42}
                              src={ccv}
                            />
                          </div>
                        </Box>
                      </Box>

                      <Box gridColumn="span 4"></Box>

                      <Box gridColumn="span 12">
                        <CustomFormCheckboxVT
                          name={'saveCreditCard'}
                          control={control}
                          label={'Save Card information for later use'}
                        />
                      </Box>
                      <Box gridColumn="span 12">
                        <CustomFormCheckboxVT
                          name={'termsAndCondition'}
                          label={'Customer Agrees'}
                          control={control}
                        />
                      </Box>
                    </Box>
                  </>

                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    disableElevation
                    disabled={!Boolean(watchForm?.termsAndCondition)}
                    style={{
                      display: 'block',
                      margin: 'auto',
                      marginTop: '20px',
                      width: '100%',
                      backgroundColor: '#38BE51',
                    }}
                    onClick={handleSubmit(handlePaymentInvoice)}
                  >
                    Pay Now
                  </LoadingButton>
                </CardContent>
              </Card>
            )}

            {!payModalOpen && (
              <Button
                variant="contained"
                disableElevation
                style={{
                  display: 'block',
                  margin: 'auto',
                  marginTop: '20px',
                  width: '100%',
                  backgroundColor: '#00bfff',
                }}
                onClick={() => setPayModalOpen(!payModalOpen)}
              >
                Pay Now
              </Button>
            )}
            <Typography
              onClick={() => {
                setSuccessCreateInvoice(false);
                toggle();
              }}
              sx={{
                textDecoration: 'underline',
                color: '#00bfff',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              Create Another Invoice
            </Typography>
            <Typography
              onClick={() => {
                // reset()
                setPayModalOpen(false);
                setCreatedInvoiceDetails([]);
                setOrderDetails([]);
                setSuccessCreateInvoice(false);
              }}
              sx={{
                textDecoration: 'underline',
                color: 'red',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              Cancel
            </Typography>
          </form>
        </Box>
      </Dialog>

      <Dialog
        open={successPaidInvoice}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{ '& .MuiDialog-paper': { overflow: 'hidden !important' } }}
      >
        <Box p={2}>
          <IconButton
            aria-label="close"
            style={{ position: 'absolute', right: '0px', top: '0px' }}
            onClick={() => setSuccessPaidInvoice(false)}
          >
            <CancelOutlinedIcon style={{ color: '#fff', fontSize: '30px' }} />
          </IconButton>

          {createdInvoiceDetails?.total ? (
            <>
              <div style={{ display: 'block', textAlign: 'center' }}>
                <IconButton aria-label="article">
                  <div style={{ position: 'relative' }}>
                    <Image
                      src={PAID}
                      width={100}
                      height={70}
                      alt="icon"
                      style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                      }}
                    />
                    <Image src={paidBG} width={100} height={110} alt="icon" />
                    <Image
                      src={checkBG}
                      width={30}
                      height={30}
                      alt="icon"
                      style={{
                        position: 'absolute',
                        top: '70px',
                        right: '-15px',
                      }}
                    />
                    <Image
                      src={check}
                      width={20}
                      height={30}
                      alt="icon"
                      style={{
                        position: 'absolute',
                        top: '65px',
                        right: '-10px',
                      }}
                    />
                  </div>
                </IconButton>
                <DialogTitle
                  style={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontSize: '12px',
                    fontStyle: 'revert',
                    textAlign: 'center',
                  }}
                >
                  {'invoice Paid'}
                </DialogTitle>

                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-slide-description"
                    style={{
                      color: '#38BE51',
                      fontSize: 30,
                      fontFamily: 'monospace',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    ${createdInvoiceDetails?.total}
                  </DialogContentText>
                  <Link
                    href="#"
                    color="#38BE51"
                    underline="always"
                    style={{ marginBottom: 40 }}
                  >
                    View Paid Invoice Details
                  </Link>
                </DialogContent>
              </div>

              <DialogActions style={{ justifyContent: 'space-around' }}>
                <Button
                  variant="outlined"
                  style={{
                    width: '100%',
                    color: '#fff',
                    padding: '10px 40px',
                    background: '#38BE51',
                  }}
                  onClick={() => handleDownloadPDf()}
                >
                  <Image
                    src={download}
                    width={20}
                    height={20}
                    alt="icon"
                    style={{ margin: '0 10px 0 0' }}
                  />{' '}
                  Download
                </Button>
                <LoadingButton
                  loading={emailLoading}
                  variant="outlined"
                  onClick={() => handleSendEmailInvoice(true)}
                  style={{
                    width: '100%',
                    color: '#fff',
                    padding: '10px 40px',
                    background: '#38BE51',
                    minHeight: 46,
                  }}
                >
                  {!emailLoading && (
                    <>
                      <Image
                        src={mail}
                        width={20}
                        height={20}
                        alt="icon"
                        style={{ margin: '0 10px 0 0' }}
                      />
                      Email
                    </>
                  )}
                </LoadingButton>
                <LoadingButton
                  loading={textLoading}
                  variant="outlined"
                  onClick={() => handleSendTextInvoice('true')}
                  style={{
                    width: '100%',
                    color: '#fff',
                    padding: '10px 40px',
                    background: '#38BE51',
                    minHeight: 46,
                  }}
                >
                  {!textLoading && (
                    <>
                      <Image
                        src={text}
                        width={20}
                        height={20}
                        alt="icon"
                        style={{ margin: '0 10px 0 0' }}
                      />
                      Text
                    </>
                  )}
                </LoadingButton>
              </DialogActions>
              <Divider
                variant="middle"
                style={{ marginBottom: '16px', marginTop: '16px' }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <DialogContentText
                    id="alert-dialog-description"
                    style={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      fontSize: '12px',
                    }}
                  >
                    Invoivce number
                  </DialogContentText>
                  <DialogContentText
                    id="alert-dialog-description"
                    style={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      fontSize: '12px',
                    }}
                  >
                    Due Date
                  </DialogContentText>
                  <DialogContentText
                    id="alert-dialog-description"
                    style={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      fontSize: '12px',
                    }}
                  >
                    Payment Card
                  </DialogContentText>
                </div>
                <div>
                  <DialogContentText
                    id="alert-dialog-description"
                    style={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      fontSize: '12px',
                    }}
                  >
                    {createdInvoiceDetails?.invoiceNumber}
                  </DialogContentText>
                  <DialogContentText
                    id="alert-dialog-description"
                    style={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      fontSize: '12px',
                    }}
                  >
                    {formatDate(createdInvoiceDetails?.dueDate)}
                  </DialogContentText>
                  <DialogContentText
                    id="alert-dialog-description"
                    style={{
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      fontSize: '12px',
                    }}
                  >
                    **** **** ****{' '}
                    {createdInvoiceDetails?.CardNumber?.slice(12, 16)}
                  </DialogContentText>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'block', textAlign: 'center' }}>
                <IconButton aria-label="article">
                  <div style={{ position: 'relative' }}>
                    <Image
                      src={FAIL}
                      width={100}
                      height={70}
                      alt="icon"
                      style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                      }}
                    />
                    <Image src={paidBG} width={100} height={110} alt="icon" />
                  </div>
                </IconButton>
                <DialogTitle
                  style={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    fontSize: '12px',
                    fontStyle: 'revert',
                    textAlign: 'center',
                  }}
                >
                  {'invoice Payment Failed'}
                </DialogTitle>

                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-slide-description"
                    style={{
                      color: 'red',
                      fontSize: 30,
                      fontFamily: 'monospace',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Failed to Pay Try Again!
                  </DialogContentText>
                </DialogContent>
              </div>
            </>
          )}

          <Button
            variant="contained"
            disableElevation
            style={{
              display: 'block',
              margin: 'auto',
              marginTop: '20px',
              width: '100%',
              backgroundColor: 'red',
            }}
            onClick={() => setSuccessPaidInvoice(false)}
          >
            Exit
          </Button>
          <Link
            href="#"
            color="#38BE51"
            underline="always"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '7px',
            }}
            onClick={() => {
              setSuccessPaidInvoice(false);
              toggle();
            }}
          >
            Create Another Invoice
          </Link>
        </Box>
      </Dialog>
    </>
  );
};

export default CreateInvoice;
