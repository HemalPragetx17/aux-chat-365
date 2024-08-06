import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputAdornment,
  Typography,
  createFilterOptions,
} from '@mui/material';
import Box from '@mui/material/Box';
import { IconSend } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import card from '../../../../../src/images/card.png';
import ccv from '../../../../../src/images/cvv.png';
import head from '../../../../../src/images/head.png';
import logo from '../../../../../src/images/logo1.png';
import { useAuth } from '../../../../hooks/useAuth';
import { AppState, useDispatch, useSelector } from '../../../../store/Store';
import { vtPaymentInvoice } from '../../../../store/apps/chat/ChatSlice';
import axios from '../../../../utils/axios';
import { COUNTRIES } from '../../../../utils/constant';
import { formatPayment } from '../../../../utils/format';
import VTCustomTextField from '../../../custom/VTCustomTextField';
import CustomFormCheckboxVT from '../../../custom/form/CustomFormCheckboxVT';
import CustomFormSelectVT from '../../../custom/form/CustomFormSelectVT';
import CustomFormTextVT from '../../../custom/form/CustomFormTextVT';
import CustomHeader from '../../../custom/form/CustomHeader';

const addPlusSignToBillingCountryCode = (billingCountryCode: string) => {
  if (billingCountryCode[0] !== '+') {
    return '+' + billingCountryCode;
  } else {
    return billingCountryCode;
  }
};

const defaultValuesOfInvoice = {
  UUID: '',
  id: '',
  CustomerId: '',
  MerchantId: '',
  TransactionId: '',
  BaseAmount: '',
  Amount: '',
  CardNumber: '',
  PaymentMethod: '',
  Type: '',
  Status: '',
  BillingEmail: '',
  BillingCustomerName: '',
  BillingAddress: '',
  BillingCity: '',
  BillingState: '',
  BillingPostalCode: '',
  BillingCountry: '',
  BillingCountryCode: '',
  BillingPhoneNumber: '',
  IsShippingSame: '',
  ShippingEmail: '',
  ShippingCustomerName: '',
  ShippingAddress: '',
  ShippingCity: '',
  ShippingState: '',
  ShippingPostalCode: '',
  ShippingCountry: '',
  ShippingPhoneNumber: '',
  FluidPayResponseCode: '',
  ExpiryDate: '',
  Cvv: '',
  ConvenienceFeeValue: '',
  ConvenienceFeeMinimum: '',
  ConvenienceFeeType: '',
  AuthCode: '',
  TransactionGateWay: '',
  Refund: '',
  Void: '',
  Capture: '',
  Tokenization: '',
  Message: '',
  Description: '',
  ReferenceNo: '',
  MinimumTxn: '',
  ConvenienceFeeActive: '',
  RequestOrigin: '',
  createdAt: '',
  updatedAt: '',
  ProcessorId: '',
  SuggestedMode: '',
  TipAmount: '',
  IpLookUp: {
    location: {
      averageIncome: '',
      populationDensity: '',
      accuracyRadius: '',
      latitude: '',
      longitude: '',
      metroCode: '',
      timeZone: '',
    },
    continent: '',
    country: '',
    city: '',
    postal: {
      confidence: '',
      code: '',
    },
    traits: {
      isAnonymous: '',
      isHostingProvider: '',
      userType: '',
      autonomousSystemNumber: '',
      autonomousSystemOrganization: '',
      connectionType: '',
      domain: '',
      isp: '',
      organization: '',
      ipAddress: '',
      network: '',
      isAnonymousProxy: '',
      isAnonymousVpn: '',
      isLegitimateProxy: '',
      isPublicProxy: '',
      isResidentialProxy: '',
      isSatelliteProvider: '',
      isTorExitNode: '',
    },
    OS: {
      Hostname: '',
      Type: '',
      Platform: '',
      Release: '',
      Architecture: '',
    },
  },
};

const VirtualTerminal = () => {
  const dispatch = useDispatch();
  const { user, settings } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [feeDetail, setFeedetail] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>({});
  const UPDATED_COUNTRIES = COUNTRIES.map((obj) => {
    obj.value = obj.code;
    return obj;
  });
  const didList = useSelector((state: AppState) =>
    state.didReducer.did.map((did: any) => ({
      label: `${did?.countryCode}${did?.phoneNumber} (${did?.title})`,
      value: did.phoneNumber,
    })),
  );

  const filter = createFilterOptions();

  const schema = yup.object().shape({
    invoiceNumber: yup.string().required('Invoice Number is required field'),
    firstName: yup.string().required('First name field is required'),
    lastName: yup.string().required('Last name field is required'),
    fullAddress: yup.boolean(),
    sender: yup.string(),
    type: yup.string(),
    Amount: yup.string(),
    transactionAmount: yup.string().required('Amount is required field'),
    BillingAddress: yup.string(),
    BillingCity: yup.string(),
    BillingCountry: yup.string(),
    BillingCountryCode: yup.string(),
    BillingCustomerName: yup.string(),
    BillingEmail: yup
      .string()
      .required('Email field is required')
      .email('Invalid Email'),
    BillingPhoneNumber: yup.string().required('Contact Number is required'),
    FromNumber: yup.string().required('From number is required'),
    BillingPostalCode: yup.string().required('Postal Code field is required'),
    BillingState: yup.string(),
    CardNumber: yup.string().required('Card Number is required'),
    ConvenienceFeeActive: yup.boolean(),
    Cvv: yup
      .string()
      .required('CVV field is required')
      .matches(/^\d{3,4}$/, 'Invalid Cvv'),
    Description: yup.string().required('Description  field is required'),
    ExpiryDate: yup.string().required('ExpiryDate  field is required'),
    Giftcard: yup.boolean(),
    IsRecurring: yup.boolean(),
    MerchantId: yup.string(),
    Message: yup.string(),
    PaymentTokenization: yup.boolean(),
    ReferenceNo: yup.string(),
    RequestOrigin: yup.string(),
    SuggestedMode: yup.string(),
    tipValue: yup
      .string()
      .matches(/^\d+$/, 'Discount % must be a number')
      .test(
        'is-between-0-and-100',
        'Discount % must be between 0 and 100',
        (value) => {
          if (!value) return true;
          const numValue = parseInt(value);
          return numValue >= 0 && numValue <= 100;
        },
      ),
    TipAmount: yup
      .string()
      .test(
        'tip-amount-check',
        'Tip amount should be less than transaction amount',
        function (value) {
          const transactionAmount = this.parent.transactionAmount;
          const tipAmount = value;
          if (
            tipAmount &&
            parseFloat(tipAmount) >= parseFloat(transactionAmount)
          ) {
            return false;
          }
          return true;
        },
      ),
    TransactionType: yup.string(),
    checkType: yup.string(),
    UserPaymentMethod: yup.string(),
    shippingSameAsBilling: yup.boolean(),
    shippingName: yup.string().when('shippingSameAsBilling', {
      is: (val: boolean) => val === false,
      then: () => yup.string().required('Required Field'),
      otherwise: () => yup.string(),
    }),
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
    shippingAddress: yup.string().when('shippingSameAsBilling', {
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

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: '',
      transactionAmount: null,
      CardNumber: '',
      ExpiryDate: '',
      message: '',
      convenienceFee: false,
      fullAddress: false,
      type: 'sale',
      sender: '',
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
      Message: '',
      PaymentTokenization: true,
      ReferenceNo: '12345',
      RequestOrigin: 'aux365-vt',
      SuggestedMode: 'card',
      TipAmount: '',
      TipValue: '',
      discount_amount: '',
      TransactionType: '',
      shippingAddress: '',
      shippingCity: '',
      shippingCountry: 'US',
      shippingName: '',
      shippingPostalCode: '',
      shippingSameAsBilling: true,
      termsAndCondition: false,
      saveCreditCard: false,
      checkType: 'personal',
      UserPaymentMethod: 'debit',
      technologyFee: 4.99,
      lastName: '',
      firstName: '',
      FromNumber: settings?.defaultDid?.phoneNumber || '',
    }),
    [],
  );

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
  const watchForm = watch();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/users/${user?.uid}`);
      const profile = response.status === 200 ? response.data.data : {};
      setProfileData(profile);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    reset(defaultValues);
    fetchFeeDetails();
    setLoading(false);
  }, [profileData]);

  const fetchFeeDetails = async () => {
    const response = await axios.get('/payment/fee-detail');
    if (response?.status === 200) {
      const fee = response?.data?.data.find(
        (obj: any) => obj.ProcessorLevel === 'QuantumA',
      );
      setFeedetail(fee);
      const { ConvenienceFeeMinimum, ConvenienceFeeValue } = fee;
      const calculatedConvenienceFeeValue =
        (parseFloat(watchForm?.transactionAmount || '0') *
          parseFloat(ConvenienceFeeValue)) /
          100 || 0;
      let minFee =
        ConvenienceFeeMinimum > calculatedConvenienceFeeValue
          ? parseFloat(ConvenienceFeeMinimum)
          : parseFloat(calculatedConvenienceFeeValue?.toString()).toFixed(2);
      setValue('technologyFee', parseFloat(minFee?.toString()), {
        shouldValidate: true,
      });
    }
  };

  useEffect(() => {
    const ConvenienceFeeMinimum = feeDetail?.ConvenienceFeeMinimum;
    const ConvenienceFeeValue = feeDetail?.ConvenienceFeeValue;
    const calculatedConvenienceFeeValue =
      (parseFloat(watchForm.transactionAmount || '0') *
        parseFloat(ConvenienceFeeValue)) /
        100 || 0;
    let minFee =
      ConvenienceFeeMinimum > calculatedConvenienceFeeValue
        ? parseFloat(ConvenienceFeeMinimum).toFixed(2)
        : parseFloat(calculatedConvenienceFeeValue?.toString()).toFixed(2);
    setValue('technologyFee', parseFloat(minFee?.toString()), {
      shouldValidate: true,
    });
  }, [watchForm?.transactionAmount]);

  const onVTFormSubmit = async (data: any) => {
    setLoading(true);
    const formData = {
      ...data,
      convenienceFee: data.convenienceFee ? 0 : 1,
      type: data.type === 'sale' ? '1' : '2',
      sender: user?.name,
      CardNumber: data.CardNumber.replace(/ /g, ''),
      to: data?.BillingPhoneNumber,
      from: data?.FromNumber,
      BillingCountryCode: addPlusSignToBillingCountryCode(
        data.BillingCountryCode,
      ),
      ConvenienceFeeActive: !Boolean(data.convenienceFee),
    };
    await continueFormSubmittion({ finalFormData: formData });
  };

  const continueFormSubmittion = async ({
    finalFormData,
  }: {
    finalFormData: any;
  }) => {
    const _Amount =
      parseFloat(finalFormData?.Amount) -
      parseFloat(finalFormData?.technologyFee);

    let payload = {
      shippingSameAsBilling: finalFormData?.shippingSameAsBilling,
      UserPaymentMethod: finalFormData?.UserPaymentMethod,
      checkType: finalFormData?.checkType,
      shippingPostalCode: finalFormData?.shippingPostalCode,
      shippingName: finalFormData?.shippingName,
      shippingCountry: finalFormData?.shippingCountry,
      shippingCity: finalFormData?.shippingCity,
      shippingAddress: finalFormData?.shippingAddress,
      TransactionType: finalFormData?.TransactionType,
      SuggestedMode: finalFormData?.SuggestedMode,
      RequestOrigin: finalFormData?.RequestOrigin,
      ReferenceNo: finalFormData?.ReferenceNo,
      PaymentTokenization: finalFormData?.PaymentTokenization,
      Message: finalFormData?.Message,
      MerchantId: finalFormData?.MerchantId,
      IsRecurring: finalFormData?.IsRecurring,
      Giftcard: finalFormData?.Giftcard,
      ExpiryDate: finalFormData?.ExpiryDate,
      Description: finalFormData?.Description,
      Cvv: finalFormData?.Cvv,
      ConvenienceFeeActive: finalFormData?.ConvenienceFeeActive,
      CardNumber: finalFormData?.CardNumber,
      BillingState: finalFormData?.BillingState,
      BillingPostalCode: finalFormData?.BillingPostalCode,
      BillingPhoneNumber: finalFormData?.BillingPhoneNumber,
      BillingEmail: finalFormData?.BillingEmail,
      BillingCustomerName: finalFormData?.customerName,
      BillingCountryCode: finalFormData?.BillingCountryCode,
      BillingCountry: finalFormData?.BillingCountry,
      BillingCity: finalFormData?.BillingCity,
      BillingAddress: finalFormData?.BillingAddress,
      transactionAmount: finalFormData?.transactionAmount,
      Amount: _Amount,
      type: finalFormData?.type,
      sender: finalFormData?.sender,
      fullAddress: finalFormData?.fullAddress,
      invoiceNumber: finalFormData?.invoiceNumber,
      message: finalFormData?.message,
      convenienceFee: finalFormData?.convenienceFee,
      discount_amount: finalFormData?.TipAmount,
      termsAndCondition: finalFormData?.termsAndCondition,
      technologyFee: finalFormData?.technologyFee,
      to: finalFormData?.to,
      from: finalFormData?.from,
      customerAddressObj: {
        street: finalFormData?.BillingAddress,
        city: finalFormData?.BillingCity,
        state: finalFormData?.BillingState,
        zip: finalFormData?.BillingPostalCode,
      },
    };

    let VT_Data = await dispatch(vtPaymentInvoice(payload));
    if (VT_Data?.status === 'success') {
      toast.success('Payment Link sent successfully!');
      setValue('transactionAmount', null);
      setValue('Cvv', '');
      reset(defaultValues);
      setLoading(false);
    } else {
      toast.error(VT_Data?.message);
      setLoading(false);
    }
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

  const formatAndSetCvv = (e: any) => {
    const inputVal = e.target.value.replace(/ /g, '');
    let inputNumbersOnly = inputVal.replace(/\D/g, '');
    if (inputNumbersOnly.length >= 4) {
      inputNumbersOnly = inputNumbersOnly.substr(0, 4);
    }
    setValue('Cvv', inputNumbersOnly, { shouldValidate: true });
  };

  useEffect(() => {
    const TipValue = watchForm?.TipValue ?? '';
    const tipAmount = watchForm?.TipAmount ?? '';
    const technologyFee = watchForm?.technologyFee ?? '';

    const convenienceFeeCalculation =
      parseFloat((watchForm.transactionAmount || 0).toString()) -
      parseFloat(tipAmount ? tipAmount.toString() : '0');
    const totalAmonut = watchForm.convenienceFee
      ? convenienceFeeCalculation
      : convenienceFeeCalculation + parseFloat(technologyFee.toString());

    setValue('Amount', parseFloat(totalAmonut.toFixed(2)), {
      shouldValidate: true,
    });
    const tempAmount = parseFloat(
      (
        ((watchForm.transactionAmount || 0) *
          parseFloat(TipValue ? TipValue : '0')) /
        100
      ).toFixed(2),
    );
    setValue('TipAmount', !tempAmount ? '' : tempAmount?.toString(), {
      shouldValidate: true,
    });
  }, [
    watchForm.convenienceFee,
    watchForm.transactionAmount,
    watchForm.technologyFee,
  ]);

  useEffect(() => {
    const technologyFee = watchForm?.technologyFee ?? '';
    const tipAmount = watchForm?.TipAmount ?? '';
    const transactionAmount = watchForm?.transactionAmount ?? '0';
    const parsedTipAmount = parseFloat(tipAmount);
    const parsedTransactionAmount = parseFloat(transactionAmount);

    if (
      !isNaN(parsedTipAmount) &&
      !isNaN(parsedTransactionAmount) &&
      parsedTransactionAmount !== 0
    ) {
      const TipValue = parseFloat(
        ((parsedTipAmount / parsedTransactionAmount) * 100).toFixed(2),
      );
      setValue('TipValue', TipValue === 0 ? '' : TipValue.toString(), {
        shouldValidate: true,
      });

      const convenienceFeeCalculation =
        parseFloat((watchForm.transactionAmount || 0).toString()) -
        parseFloat(tipAmount ? tipAmount.toString() : '0');
      const totalAmonut = watchForm.convenienceFee
        ? convenienceFeeCalculation
        : convenienceFeeCalculation + parseFloat(technologyFee.toString());
      setValue('Amount', parseFloat(totalAmonut.toFixed(2)), {
        shouldValidate: true,
      });
    } else {
      setValue('TipValue', '', { shouldValidate: true });
    }
  }, [watchForm.TipAmount]);

  useEffect(() => {
    const technologyFee = watchForm?.technologyFee ?? '';
    const tipAmount = watchForm?.TipAmount ?? '';
    const TipValue = watchForm?.TipValue ?? '';
    const transactionAmount = watchForm?.transactionAmount ?? '0';

    const parsedTipValue = parseFloat(TipValue);
    const parsedTransactionAmount = parseFloat(transactionAmount);

    if (!isNaN(parsedTipValue) && !isNaN(parsedTransactionAmount)) {
      const tempAmount = parseFloat(
        ((parsedTransactionAmount * parsedTipValue) / 100).toFixed(2),
      );
      setValue('TipAmount', tempAmount?.toString(), { shouldValidate: true });

      const convenienceFeeCalculation =
        parseFloat((watchForm.transactionAmount || 0).toString()) -
        parseFloat(tipAmount ? tipAmount.toString() : '0');
      const totalAmonut = watchForm.convenienceFee
        ? convenienceFeeCalculation
        : convenienceFeeCalculation + parseFloat(technologyFee.toString());
      setValue('Amount', parseFloat(totalAmonut.toFixed(2)), {
        shouldValidate: true,
      });
    } else {
      setValue('TipAmount', '', { shouldValidate: true });
    }
  }, [watchForm.TipValue]);

  const inputDate = new Date(defaultValuesOfInvoice?.createdAt || new Date());

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate: string = new Intl.DateTimeFormat(
    'en-US',
    options,
  ).format(inputDate);

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
    setValue('ExpiryDate', input, { shouldValidate: true });
  };

  return (
    <div
      className="main"
      style={{ background: '#323441', height: 'calc(100vH - 100px)' }}
    >
      <form onSubmit={handleSubmit(onVTFormSubmit)}>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 6">
            <div
              className="left_div1"
              style={{ position: 'relative', maxHeight: 'calc(100vH - 140px)' }}
            >
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
                        <Image src={head} width={50} height={50} alt="" />
                        Virtual Terminal
                      </Typography>
                    </CustomHeader>
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  columnGap={2}
                >
                  <Box gridColumn="span 6">
                    <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                      <Controller
                        name={'transactionAmount'}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <VTCustomTextField
                            type={'number'}
                            placeholder="Amount $ 0.00"
                            value={value}
                            size="small"
                            onChange={onChange}
                            onWheel={(e: any) => e.target.blur()}
                            error={Boolean(errors.transactionAmount)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.transactionAmount && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {(errors.transactionAmount as any).message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box gridColumn="span 6">
                    <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                      <Controller
                        name={'FromNumber'}
                        control={control}
                        render={() => (
                          <Autocomplete
                            options={didList}
                            clearOnBlur
                            getOptionLabel={(option: any) => option.label}
                            defaultValue={
                              didList.find(
                                (did) =>
                                  did.value ===
                                  settings?.defaultDid?.phoneNumber,
                              ) || ''
                            }
                            autoHighlight={true}
                            onChange={(e, newValue: any) => {
                              setValue('FromNumber', newValue?.value, {
                                shouldValidate: true,
                              });
                            }}
                            filterOptions={(options: any[], params: any) => {
                              const filtered = filter(options, params);
                              return filtered;
                            }}
                            renderInput={(params) => (
                              <VTCustomTextField
                                {...params}
                                size="small"
                                placeholder={'Select From Number'}
                                InputProps={{
                                  ...params.InputProps,
                                }}
                              />
                            )}
                          />
                        )}
                      />
                      {errors.FromNumber && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {(errors.FromNumber as any).message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box gridColumn="span 6">
                    <FormControl fullWidth sx={{ mb: 2, mt: 0 }}>
                      <Controller
                        name={'TipAmount'}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <VTCustomTextField
                            type={'number'}
                            placeholder="Discount Amt $ 0.00"
                            value={value}
                            size="small"
                            onChange={onChange}
                            onWheel={(e: any) => e.target.blur()}
                            error={Boolean(errors.TipAmount)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.TipAmount && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {(errors.TipAmount as any).message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box gridColumn="span 6">
                    <CustomFormTextVT
                      type="number"
                      name={'TipValue'}
                      label={'Discount Percent (%)'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                </Box>

                <span style={{ width: 1000, display: 'block' }} />
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap={2}
                >
                  <Box gridColumn="span 12">
                    <CustomFormCheckboxVT
                      name={'convenienceFee'}
                      label={'Do Not Send Technology Fee'}
                      control={control}
                    />
                  </Box>
                </Box>
                <Box
                  gridColumn="span 12"
                  borderBottom={'2px dashed gray'}
                  marginBottom={4}
                  marginTop={2}
                />
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  columnGap={2}
                >
                  <Box gridColumn="span 6">
                    <CustomFormTextVT
                      name={'firstName'}
                      hasRequired={true}
                      label={'First Name'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box gridColumn="span 6">
                    <CustomFormTextVT
                      name={'lastName'}
                      hasRequired={true}
                      label={'Last Name'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box gridColumn="span 12">
                    <CustomFormTextVT
                      type="email"
                      name={'BillingEmail'}
                      hasRequired={true}
                      label={'Email'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box gridColumn="span 6">
                    <CustomFormTextVT
                      name={'BillingPhoneNumber'}
                      type="number"
                      label={'Phone Number'}
                      errors={errors}
                      control={control}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+1</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box gridColumn="span 6">
                    <CustomFormSelectVT
                      label={'Country'}
                      errors={errors}
                      name={'BillingCountry'}
                      control={control}
                      options={UPDATED_COUNTRIES}
                    />
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  columnGap={2}
                >
                  <Box gridColumn="span 12" sx={{ mb: 2 }}>
                    <CustomFormCheckboxVT
                      name={'fullAddress'}
                      control={control}
                      label={'Billing Address'}
                    />
                  </Box>
                  {watchForm.fullAddress && (
                    <>
                      <Box gridColumn="span 12">
                        <CustomFormTextVT
                          name={'BillingAddress'}
                          label={'Street Address'}
                          errors={errors}
                          control={control}
                        />
                      </Box>
                      <Box gridColumn="span 6">
                        <CustomFormTextVT
                          name={'BillingCity'}
                          label={'City'}
                          errors={errors}
                          control={control}
                        />
                      </Box>
                      <Box gridColumn="span 6">
                        <CustomFormTextVT
                          name={'BillingState'}
                          label={'State'}
                          errors={errors}
                          control={control}
                        />
                      </Box>
                    </>
                  )}
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  columnGap={2}
                >
                  <Box gridColumn="span 12">
                    <CustomFormTextVT
                      type="number"
                      name={'BillingPostalCode'}
                      hasRequired={true}
                      label={'Postal Code'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box gridColumn="span 12">
                    <CustomFormTextVT
                      name={'Description'}
                      hasRequired={true}
                      label={'Description'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box gridColumn="span 12">
                    <CustomFormTextVT
                      name={'invoiceNumber'}
                      hasRequired={true}
                      label={'PO/Invoice'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box gridColumn="span 12">
                    <CustomFormTextVT
                      name={'Message'}
                      label={'Message'}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  columnGap={2}
                >
                  <Box gridColumn="span 12">
                    <CustomFormCheckboxVT
                      name={'shippingSameAsBilling'}
                      control={control}
                      label={'Shipping information is the same as billing'}
                    />
                  </Box>
                  {!watchForm.shippingSameAsBilling && (
                    <>
                      <Box gridColumn="span 12" mt={2}>
                        <CustomFormTextVT
                          name={'shippingName'}
                          hasRequired={true}
                          label={'Shipping Name'}
                          errors={errors}
                          control={control}
                        />
                      </Box>
                      <Box gridColumn="span 12">
                        <CustomFormTextVT
                          name={'shippingAddress'}
                          hasRequired={true}
                          label={'Shipping Street Address'}
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
                          label={'Shipping Postal Code'}
                          errors={errors}
                          control={control}
                        />
                      </Box>
                      <Box gridColumn="span 6">
                        <CustomFormSelectVT
                          label={'Shipping Country'}
                          errors={errors}
                          name={'shippingCountry'}
                          control={control}
                          options={UPDATED_COUNTRIES}
                        />
                      </Box>
                    </>
                  )}
                </Box>

                <Box
                  gridColumn="span 12"
                  borderBottom={'2px dashed gray'}
                  marginBottom={2}
                  marginTop={2}
                />

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  columnGap={2}
                >
                  <Box
                    gridColumn="span 6"
                    style={{
                      fontSize: '1rem',
                      marginBottom: '15px',
                      display: 'flex',
                      justifyContent: 'start',
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: '1rem',
                        marginBottom: '15px',
                        color: '#49A8FF',
                      }}
                    >
                      Pay through Credit Card
                    </Typography>
                  </Box>
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

                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
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
                  <Box gridColumn="span 12">
                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      style={{
                        opacity: !watchForm.termsAndCondition ? 0.5 : 1,
                        backgroundColor: '#4570EA',
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                      onClick={() => handleSubmit(onVTFormSubmit)()}
                      disabled={!watchForm.termsAndCondition}
                    >
                      <IconSend style={{ marginRight: 5 }} />
                      PAY ${watchForm.Amount ? watchForm.Amount : 0}
                    </LoadingButton>
                  </Box>
                </Box>
              </div>
            </div>
          </Box>

          <Box gridColumn="span 6">
            <div className="box-outer">
              <div
                className="right_div"
                style={{
                  position: 'unset',
                  background: 'white',
                  padding: '28px',
                }}
              >
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap={2}
                  mb={2}
                >
                  <Box gridColumn="span 12" sx={{ width: '100%' }}>
                    <div
                      className="logo_vertual"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Image
                        width={200}
                        height={200}
                        alt="logo"
                        src={
                          profileData?.Profile?.BusinessDetails?.logo || logo
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
                  <Box gridColumn="span 6">
                    <ul>
                      <li className="li_list">
                        <p className="top-p2">Card PAYMENT</p>
                      </li>
                      <li className="li_list">
                        <p
                          className="top-p"
                          style={{ fontSize: 28, marginTop: '10px' }}
                        >
                          $
                          {watchForm?.transactionAmount
                            ? formatPayment(watchForm?.transactionAmount)
                            : '0.00'}
                        </p>
                      </li>
                      <li className="li_list">
                        <p
                          className="top-p"
                          style={{ fontSize: 14, marginTop: '5px' }}
                        >
                          USD
                        </p>
                      </li>
                      <li className="li_list">
                        <p
                          className="top-p2"
                          style={{ fontSize: 10, color: 'grey' }}
                        >
                          {defaultValuesOfInvoice?.Status === '1'
                            ? 'Aprroved'
                            : 'Pending'}
                        </p>
                      </li>
                    </ul>
                  </Box>
                  <Box gridColumn="span 6">
                    <ul>
                      <li className="li_list">
                        {' '}
                        <p className="top-p1">Transaction #</p>
                      </li>
                      <li className="li_list">
                        <p className="top-p2">
                          {defaultValuesOfInvoice?.TransactionId}
                        </p>
                      </li>

                      <li className="li_list d-flex">
                        <p className="top-p1">Date:</p>
                        <p className="top-p2">{formattedDate}</p>
                      </li>
                      <li className="li_list d-flex">
                        <p className="top-p1">Payment</p>
                        <p className="top-p2">
                          {''} {watch('CardNumber')?.slice(0, 5)}
                          *****{watch('CardNumber')?.slice(7, 12)}
                        </p>
                      </li>
                      <li className="li_list d-flex">
                        <p className="top-p1">Reference:</p>
                        <p className="top-p2">
                          {defaultValuesOfInvoice?.ReferenceNo}
                        </p>
                      </li>
                      <li className="li_list d-flex">
                        <p className="top-p1">Description:</p>
                        <p className="top-p2">{watchForm?.Description}</p>
                      </li>
                    </ul>
                  </Box>
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap={2}
                  mt={2}
                >
                  <Box gridColumn="span 12">
                    <ul>
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

                      <li className="li_list customer_div">
                        <p className="p1">Name:</p>
                        <p className="top-p2">
                          {watchForm?.firstName} {watchForm?.lastName}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Email:</p>
                        <p className="p2">{watchForm?.BillingEmail}</p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Postal Code:</p>
                        <p className="p2">{watchForm?.BillingPostalCode}</p>
                      </li>
                    </ul>
                  </Box>
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap={2}
                  mt={2}
                >
                  <Box gridColumn="span 12">
                    <ul>
                      <li className="li_list">
                        <p
                          style={{
                            borderBottom: ' solid',
                            paddingBottom: '2px',
                          }}
                          className="top-p heading"
                        >
                          Transaction Details:
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Date:</p>
                        <p className="top-p2">{formattedDate}</p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Status:</p>
                        <p className="top-p2">
                          {defaultValuesOfInvoice?.Status === '1'
                            ? 'Aprroved'
                            : 'Pending'}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Method:</p>
                        <p className="p2">
                          {defaultValuesOfInvoice?.SuggestedMode}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Card holder:</p>
                        <p className="p2">
                          {watchForm?.firstName} {watchForm?.lastName}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Authorization Code:</p>
                        <p className="p2">{defaultValuesOfInvoice?.AuthCode}</p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Gateway Ref: </p>
                        <p className="p2">
                          {defaultValuesOfInvoice?.TransactionGateWay}
                        </p>
                      </li>
                    </ul>
                  </Box>
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap={2}
                >
                  <Box gridColumn="span 6"></Box>
                  <Box gridColumn="span 6">
                    <ul>
                      <li className="li_list customer_div">
                        <p className="p1">Transaction Amount:</p>
                        <p className="top-p2">
                          $
                          {watchForm.transactionAmount
                            ? formatPayment(watchForm.transactionAmount)
                            : '0.00'}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Technology Fee:</p>
                        <p className="top-p2">
                          $
                          {!watchForm.convenienceFee
                            ? formatPayment(watchForm.technologyFee)
                            : '0.00'}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Discount:</p>
                        <p className="top-p2">
                          $
                          {watchForm.TipAmount
                            ? formatPayment(watchForm.TipAmount)
                            : '0.00'}
                        </p>
                      </li>
                      <li className="li_list customer_div">
                        <p className="p1">Total:</p>
                        <p className="top-p2">
                          $
                          {watchForm.Amount
                            ? formatPayment(watchForm.Amount)
                            : '0.00'}
                        </p>
                      </li>
                    </ul>
                  </Box>
                </Box>
              </div>
            </div>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default VirtualTerminal;
