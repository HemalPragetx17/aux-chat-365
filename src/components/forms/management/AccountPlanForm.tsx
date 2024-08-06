import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  Autocomplete,
  Button,
  createFilterOptions,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Radio,
  RadioGroup,
} from '@mui/material';
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import * as yup from 'yup';

import { LoadingButton } from '@mui/lab';
import axios from '../../../utils/axios';
import { formatPayment } from '../../../utils/format';
import CustomCheckbox from '../../custom/CustomCheckbox';
import CustomTextField from '../../custom/CustomTextField';
import CustomFormAmount from '../../custom/form/CustomFormAmount';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomHeader from '../../custom/form/CustomHeader';

dayjs.extend(utc);

const filter = createFilterOptions();

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  success: () => void;
}

const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(
  () => ({
    borderBlockEnd: '0 !important',
    color: 'white',
    borderRadius: '5px 5px 0px 0px',
    background:
      'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
    '&.Mui-expanded': {
      maxHeight: '48px',
      minHeight: 'unset',
    },
  }),
);

const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(
  () => ({
    padding: '8px 0px',
  }),
);

const AccountPlanForm = (props: FormType) => {
  const { open, toggle, currentData, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<any>([]);
  const [planOptions, setPlanOptions] = useState<any>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [product, setProduct] = useState<any>([]);

  const schema = yup.object().shape({
    assignedPlanId: yup.string().required('Please select plan'),
    planType: yup.string().required('Please select plan duration'),
    startDate: yup.string().required('Start Date is required'),
    additionalPhoneUsers: yup
      .number()
      .typeError('Please enter a valid number')
      .required('Please Enter Number of Additional Phone users'),
    configuration: yup.object().shape({
      chatterFees: yup.object().shape({
        freeWithPlan: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Number of Free Messages'),
        inboundFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Inbound Fee'),
        outboundFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Outbound Fee'),
        mmsFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter MMS Fee'),
        autoReplyFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter AutoReply Fee'),
      }),
      licenseFees: yup.object().shape({
        additionalUsersFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Additional User Fee'),
        didFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter DID Fee'),
        freeUsers: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Number of Free Users with Plan'),
        freeDid: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Number of Free DIDs with Plan'),
      }),
      phoneFees: yup.object().shape({
        monthlyFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Monthly Fee'),
        additionalUsersFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Addtional User Fee'),
        freeMinutesWithPlan: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Free Call Minutes'),
        outboundPerMinFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Outbound Per Minute Fee'),
        inboundPerMinFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Inbound Per Minute Fee'),
        callRecordingsFree: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Free Call Recording Minutes'),
        callRecordingsFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Call Recording Fee'),
        didFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter DID Fee'),
        freeDid: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Number of Free DIDs with Plan'),
        freeExtensions: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Number of Free Extensions with Plan'),
      }),
      paymentProcessing: yup.object().shape({
        monthlyFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Monthly Fee'),
        vtFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Virtual Terminal Fee'),
        recurringFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Recurring Fee'),
        txt2payFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Text2Pay Fee'),
        cashPaymentFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Cash Payment Fee'),
        failedRecurringFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Failed Recurring Fee'),
        achFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Gift Card Fee'),
        giftCardFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Additional User Fee'),
        tapToPayIos: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Fee for IOS'),
        tapToPayAndroid: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Fee for Android'),
      }),
      extraFeatures: yup.array().of(
        yup.object().shape({
          name: yup.string().required('Name is required'),
          price: yup
            .number()
            .typeError('Price must be a number')
            .required('Price is required')
            .positive('Price must be positive'),
          quantity: yup
            .number()
            .typeError('Quantity must be a number')
            .required('Quantity is required')
            .positive('Quantity must be positive'),
        }),
      ),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      assignedPlanId: '',
      planType: currentData?.planDetails?.planType || 'MONTHLY',
      startDate: null,
      term: currentData?.planDetails?.term || 5,
      customizeFlag: currentData?.planDetails?.customizeFlag || false,
      chatterFlag: currentData?.planDetails?.chatterFlag || false,
      phoneFlag: currentData?.planDetails?.phoneFlag || false,
      paymentFlag: currentData?.planDetails?.paymentFlag || false,
      discount: currentData?.planDetails?.discount || '0.0',
      discountUnit: currentData?.planDetails?.discountUnit || '%',
      additionalPhoneUsers: currentData?.planDetails?.additionalPhoneUsers || 0,
      configuration: {
        userToGoOver:
          currentData?.planDetails?.PlanConfiguration?.userToGoOver || false,
        userAutoSuspend:
          currentData?.planDetails?.PlanConfiguration?.userAutoSuspend || false,
        chatterFees:
          currentData?.planDetails?.PlanConfiguration?.chatterFees || {},
        licenseFees:
          currentData?.planDetails?.PlanConfiguration?.licenseFees || {},
        phoneFees: currentData?.planDetails?.PlanConfiguration?.phoneFees || {},
        paymentProcessing:
          currentData?.planDetails?.PlanConfiguration?.paymentProcessing || {},
        extraFeatures:
          currentData?.planDetails?.PlanConfiguration?.extraFeatures || [],
      },
    }),
    [currentData],
  );

  useEffect(() => {
    setLoading(false);
    reset(defaultValues);
    setSelectedPlan(null);
    if (open) {
      fetchData();
      fetchMasterProduct();
    }
  }, [open]);

  const fetchData = useCallback(async () => {
    const response = await axios.get(`/plan?status=ACTIVE`);
    const data = response.status === 200 ? response.data.data : [];
    const plans = data
      .filter((plan: any) => plan.status === 'ACTIVE')
      .map((plan: any) => {
        return { label: plan.title, value: plan.id };
      });
    setPlans(data);
    setPlanOptions(plans);
    setValue('assignedPlanId', currentData?.planDetails?.plan?.id || '');
  }, [currentData]);

  const fetchMasterProduct = useCallback(async () => {
    const response = await axios.post(`/products/master`);
    let data = response.status === 201 ? response.data : [];
    data = data.map((product: any) => {
      const { name, price, quantity } = product;
      return {
        name,
        price,
        quantity,
      };
    });
    setProduct(data);
  }, []);

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'configuration.extraFeatures',
  });

  const watchForm = watch();

  useEffect(() => {
    const selectedPlan = plans.find(
      (plan: any) => plan.id === watchForm.assignedPlanId,
    );
    if (selectedPlan) {
      const { configuration } = selectedPlan;
      const { chatterFees, phoneFees, licenseFees, paymentProcessing } =
        configuration;
      const { customizeFlag } = watchForm;
      if (customizeFlag) {
        setValue(
          'configuration.chatterFees',
          currentData?.planDetails?.PlanConfiguration?.chatterFees ||
            chatterFees,
        );
        setValue(
          'configuration.licenseFees',
          currentData?.planDetails?.PlanConfiguration?.licenseFees ||
            licenseFees,
        );
        setValue(
          'configuration.phoneFees',
          currentData?.planDetails?.PlanConfiguration?.phoneFees || phoneFees,
        );
        setValue(
          'configuration.paymentProcessing',
          currentData?.planDetails?.PlanConfiguration?.paymentProcessing ||
            paymentProcessing,
        );
      } else {
        setValue('configuration.chatterFees', chatterFees);
        setValue('configuration.licenseFees', licenseFees);
        setValue('configuration.phoneFees', phoneFees);
        setValue('configuration.paymentProcessing', paymentProcessing);
      }
    }
    setSelectedPlan(selectedPlan);
  }, [watchForm?.assignedPlanId]);

  useEffect(() => {
    if (!watchForm.customizeFlag && selectedPlan) {
      const { configuration } = selectedPlan;
      const { chatterFees, phoneFees, licenseFees, paymentProcessing } =
        configuration;
      setValue('configuration.chatterFees', chatterFees);
      setValue('configuration.licenseFees', licenseFees);
      setValue('configuration.phoneFees', phoneFees);
      setValue('configuration.paymentProcessing', paymentProcessing);
    }
  }, [watchForm?.customizeFlag]);

  const handleClose = () => {
    toggle();
    reset();
  };

  const calculateTotal = () => {
    let total = selectedPlan?.price?.monthly || 0;
    if (watchForm.phoneFlag) {
      total += watchForm.configuration.phoneFees.monthlyFee || 0;
      total += watchForm.configuration.phoneFees.callRecordingsFee || 0;
    }
    if (watchForm.paymentFlag) {
      total += watchForm.configuration.paymentProcessing.monthlyFee || 0;
    }
    if (watchForm.configuration.extraFeatures.length) {
      for (let feature of watchForm.configuration.extraFeatures) {
        const { quantity, price } = feature;
        total += quantity * price;
      }
    }
    return total;
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const {
        chatterFlag,
        phoneFlag,
        paymentFlag,
        customizeFlag,
        configuration,
      } = data;
      let additionalPhoneUsers = 0;
      const _config: any = {
        userToGoOver: configuration?.userToGoOver,
        userAutoSuspend: configuration?.userAutoSuspend,
        extraFeatures: configuration?.extraFeatures,
      };

      if (chatterFlag && customizeFlag) {
        _config.chatterFees = configuration.chatterFees;
        _config.licenseFees = configuration.licenseFees;
      }
      if (phoneFlag) {
        additionalPhoneUsers = data.additionalPhoneUsers || 0;
        if (customizeFlag) {
          _config.phoneFees = configuration.phoneFees;
        }
      }
      if (paymentFlag && customizeFlag) {
        _config.paymentProcessing = configuration.paymentProcessing;
      }

      const payload = {
        ...data,
        startDate: +data.startDate,
        additionalPhoneUsers,
        PlanConfiguration: _config,
        discount: parseFloat(data?.discount) || 0,
      };

      const response = await axios.post(
        `/plan/update-user/${currentData?.id}`,
        payload,
      );
      if (response?.status === 201) {
        success();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const onPreview = async (data: any) => {
    try {
      setLoading(true);
      const {
        chatterFlag,
        phoneFlag,
        paymentFlag,
        customizeFlag,
        configuration,
      } = data;
      let additionalPhoneUsers = 0;
      const _config: any = {
        userToGoOver: configuration?.userToGoOver,
        userAutoSuspend: configuration?.userAutoSuspend,
        extraFeatures: configuration?.extraFeatures,
      };

      if (chatterFlag && customizeFlag) {
        _config.chatterFees = configuration.chatterFees;
        _config.licenseFees = configuration.licenseFees;
      }
      if (phoneFlag) {
        additionalPhoneUsers = data.additionalPhoneUsers || 0;
        if (customizeFlag) {
          _config.phoneFees = configuration.phoneFees;
        }
      }
      if (paymentFlag && customizeFlag) {
        _config.paymentProcessing = configuration.paymentProcessing;
      }

      const payload = {
        ...data,
        startDate: +data.startDate,
        additionalPhoneUsers,
        PlanConfiguration: _config,
        discount: parseFloat(data?.discount) || 0,
      };

      const response = await axios.post(
        `/plan/preview-invoice/${currentData?.id}`,
        payload,
      );
      if (response?.status === 201) {
        window.open(response?.data, '_blank');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
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
      <SimpleBarReact
        style={{
          maxHeight: '100vH',
          width: '100%',
        }}
      >
        <CustomHeader>
          <Typography variant="h6">Plan Settings</Typography>
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
            <CustomFormSelect
              name={'assignedPlanId'}
              label={'Select Base Plan'}
              options={planOptions}
              errors={errors}
              control={control}
            />
            <FormControl
              fullWidth
              sx={{
                mb: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              Plan Duration
              <Controller
                name="planType"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <RadioGroup
                    row
                    name="planType"
                    value={value}
                    onChange={onChange}
                  >
                    <FormControlLabel
                      value="MONTHLY"
                      label="MONTHLY"
                      control={<Radio />}
                      sx={{ mr: 2 }}
                    />
                    <FormControlLabel
                      value="YEARLY"
                      label="YEARLY"
                      disabled
                      control={<Radio />}
                      sx={{ mr: 2 }}
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {selectedPlan && (
              <>
                <FormControl
                  fullWidth
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Controller
                    name="chatterFlag"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label="Chatter"
                        control={
                          <CustomCheckbox
                            checked={value}
                            onChange={onChange}
                            name="chatterFlag"
                          />
                        }
                      />
                    )}
                  />
                  <Controller
                    name="phoneFlag"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label="Phone"
                        control={
                          <CustomCheckbox
                            checked={value}
                            onChange={onChange}
                            name="phoneFlag"
                          />
                        }
                      />
                    )}
                  />
                  <Controller
                    name="paymentFlag"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label="Payments"
                        control={
                          <CustomCheckbox
                            checked={value}
                            onChange={onChange}
                            name="paymentFlag"
                          />
                        }
                      />
                    )}
                  />
                </FormControl>

                <Paper
                  sx={{
                    padding: 2,
                    mb: 4,
                    background: '#9b00ffc7',
                    color: 'white !important',
                  }}
                >
                  <Box mt={2}>
                    <Grid container spacing={0.5}>
                      {watchForm?.planType === 'MONTHLY' ? (
                        <>
                          <Grid item xs={8}>
                            <Typography>Monthly Plan Price :</Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography>
                              ${formatPayment(selectedPlan?.price?.monthly)}
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={8}>
                            <Typography>Yearly Price :</Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography>
                              ${formatPayment(selectedPlan?.price?.yearly)}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      {watchForm?.phoneFlag && (
                        <>
                          <Grid item xs={8}>
                            <Typography>Monthly Phone Fees :</Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography>
                              $
                              {formatPayment(
                                watchForm?.configuration?.phoneFees?.monthlyFee,
                              )}
                            </Typography>
                          </Grid>

                          <Grid item xs={8}>
                            <Typography>Call Recording Fee :</Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography>
                              $
                              {formatPayment(
                                watchForm?.configuration?.phoneFees
                                  ?.callRecordingsFee,
                              )}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      {watchForm?.paymentFlag && (
                        <>
                          <Grid item xs={8}>
                            <Typography>Payment Platform Fees :</Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography>
                              $
                              {formatPayment(
                                watchForm?.configuration?.paymentProcessing
                                  ?.monthlyFee,
                              )}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      {watchForm?.configuration?.extraFeatures?.length > 0 && (
                        <>
                          {watchForm?.configuration?.extraFeatures.map(
                            (features: any, index: number) => {
                              const { name, price, quantity } = features;
                              const total = price * quantity;
                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    width: '100%',
                                    display: 'flex',
                                    padding: '4px',
                                  }}
                                >
                                  <Grid item xs={8}>
                                    <Typography>{name}</Typography>
                                  </Grid>
                                  <Grid item xs={4} textAlign="right">
                                    <Typography>
                                      ${formatPayment(total)}
                                    </Typography>
                                  </Grid>
                                </Box>
                              );
                            },
                          )}
                        </>
                      )}

                      <Grid
                        item
                        xs={12}
                        sx={{ borderTop: '1px solid white', mt: 1 }}
                      />
                      <Grid item xs={8}>
                        <Typography>Total :</Typography>
                      </Grid>
                      <Grid item xs={4} textAlign="right">
                        <Typography>
                          ${formatPayment(calculateTotal())}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} textAlign="right">
                        <Typography variant="caption">
                          (Addtional User Cost Extra)
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>

                <FormControl
                  fullWidth
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <Box width={'39%'}>
                    <CustomFormSelect
                      name={'discountUnit'}
                      label={'Discount Unit'}
                      options={[
                        { value: '%', label: '%' },
                        { value: '$', label: '$' },
                      ]}
                      errors={errors}
                      control={control}
                    />
                  </Box>
                  <Box width={'59%'}>
                    <CustomFormAmount
                      name={'discount'}
                      symbol={watchForm?.discountUnit}
                      label={'Discount'}
                      errors={errors['discount'] as any}
                      control={control}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                          format={'MM-DD-YYYY'}
                          label="Plan Start Date"
                          value={value ? dayjs(value) : null}
                          onChange={(date) =>
                            onChange(date ? +date.valueOf() : null)
                          }
                          timezone="UTC"
                          slotProps={{
                            textField: {
                              size: 'small',
                              error: Boolean(errors.startDate),
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.startDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {(errors.startDate as any).message}
                    </FormHelperText>
                  )}
                </FormControl>

                <CustomFormSelect
                  name={'term'}
                  label={'Invoice Term'}
                  options={[
                    { value: 1, label: 1 },
                    { value: 5, label: 5 },
                    { value: 10, label: 10 },
                    { value: 15, label: 15 },
                  ]}
                  errors={errors}
                  control={control}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Controller
                    name="configuration.userToGoOver"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label={
                          <>
                            Allow Users to go over when the free limit is
                            exhausted? <br />
                            (Extra services will be invoiced in the next cycle)
                          </>
                        }
                        control={
                          <CustomCheckbox
                            checked={value}
                            disabled={true}
                            onChange={onChange}
                            name="userToGoOver"
                          />
                        }
                      />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Controller
                    name="configuration.userAutoSuspend"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label={
                          <>
                            Automatically suspend user when they don't make
                            payment within 5 days?
                          </>
                        }
                        control={
                          <CustomCheckbox
                            checked={value}
                            onChange={onChange}
                            name="userAutoSuspend"
                          />
                        }
                      />
                    )}
                  />
                </FormControl>

                {(watchForm?.chatterFlag ||
                  watchForm?.phoneFlag ||
                  watchForm?.paymentFlag) && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Controller
                      name="customizeFlag"
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          label="Do you wish to overwrite plan price with custom pricing?"
                          control={
                            <CustomCheckbox
                              checked={value}
                              onChange={onChange}
                              name="customizeFlag"
                            />
                          }
                        />
                      )}
                    />
                  </FormControl>
                )}

                {watchForm?.chatterFlag && (
                  <>
                    <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
                      <AccordionSummary
                        expandIcon={<IconChevronDown color="white" />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography variant="h6">Chatter Fees</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container mt={2}>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.chatterFees.freeWithPlan'}
                              symbol=""
                              label={'Free Messages'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'chatterFees'
                                ]?.['freeWithPlan']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.chatterFees.outboundFee'}
                              symbol="$"
                              label={'Outbound Fee'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'chatterFees'
                                ]?.['outboundFee']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.chatterFees.mmsFee'}
                              symbol="$"
                              label={'MMS Fee'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'chatterFees'
                                ]?.['mmsFee']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.chatterFees.autoReplyFee'}
                              symbol="$"
                              label={'Auto Reply Fee'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'chatterFees'
                                ]?.['autoReplyFee']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.chatterFees.inboundFee'}
                              symbol="$"
                              label={'Inbound Fee'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'chatterFees'
                                ]?.['inboundFee']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
                      <AccordionSummary
                        expandIcon={<IconChevronDown color="white" />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography variant="h6">Licenses</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container mt={2}>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.licenseFees.freeUsers'}
                              symbol=""
                              label={'Free Users'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'licenseFees'
                                ]?.['freeUsers']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={
                                'configuration.licenseFees.additionalUsersFee'
                              }
                              symbol="$"
                              label={'Additional User Fee'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'licenseFees'
                                ]?.['additionalUsersFee']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.licenseFees.freeDid'}
                              symbol=""
                              label={'Free DIDs'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'licenseFees'
                                ]?.['freeDid']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFormAmount
                              name={'configuration.licenseFees.didFee'}
                              symbol="$"
                              label={'Additional DID Fee'}
                              errors={
                                (errors['configuration'] as any)?.[
                                  'licenseFees'
                                ]?.['didFee']
                              }
                              disabled={!Boolean(watchForm?.customizeFlag)}
                              control={control}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </>
                )}

                {watchForm?.phoneFlag && (
                  <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
                    <AccordionSummary
                      expandIcon={<IconChevronDown color="white" />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography variant="h6">Phone Fees</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'additionalPhoneUsers'}
                            symbol=""
                            label={'Total Phone users'}
                            errors={errors['additionalPhoneUsers'] as any}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.additionalUsersFee'}
                            symbol="$"
                            label={'Additional Phone User Fee'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'additionalUsersFee'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.monthlyFee'}
                            symbol="$"
                            label={'Monthly Phone Fee'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'monthlyFee'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.freeExtensions'}
                            symbol=""
                            label={'Free Extensions'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'freeExtensions'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.freeMinutesWithPlan'}
                            symbol=""
                            label={'Free Calling Minutes'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'freeMinutesWithPlan'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.outboundPerMinFee'}
                            symbol="$"
                            label={'Outbound Fees / min'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'outboundPerMinFee'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.inboundPerMinFee'}
                            symbol="$"
                            label={'Inbound Fees / min'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'inboundPerMinFee'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.callRecordingsFree'}
                            symbol=""
                            label={'Free Call Recording Minutes'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'callRecordingsFree'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.callRecordingsFee'}
                            symbol="$"
                            label={'Monthly Call Recording Fees'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'callRecordingsFee'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.freeDid'}
                            symbol=""
                            label={'Free Voice DIDs'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'freeDid'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.phoneFees.didFee'}
                            symbol="$"
                            label={'Additional Voice DID Fee'}
                            errors={
                              (errors['configuration'] as any)?.['phoneFees']?.[
                                'didFee'
                              ]
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}

                {watchForm?.paymentFlag && (
                  <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
                    <AccordionSummary
                      expandIcon={<IconChevronDown color="white" />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography variant="h6">
                        Payment Processing Fees
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container mt={2}>
                        <Grid item xs={12}>
                          <CustomFormAmount
                            name={'configuration.paymentProcessing.monthlyFee'}
                            symbol="$"
                            label={'Monthly Payment Fee'}
                            errors={
                              (errors['configuration'] as any)?.[
                                'paymentProcessing'
                              ]?.['monthlyFee']
                            }
                            disabled={!Boolean(watchForm?.customizeFlag)}
                            control={control}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}

                {product.length && (
                  <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
                    <AccordionSummary
                      expandIcon={<IconChevronDown color="white" />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography variant="h6">Additional Services</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {fields.map((field, index) => {
                        const nameError = (errors['configuration'] as any)?.[
                          'extraFeatures'
                        ]?.[index]?.['name'];
                        const value =
                          watchForm?.configuration?.extraFeatures?.[index]
                            ?.name;

                        return (
                          <Grid container key={field.id}>
                            <Grid item xs={12} display={'flex'} mb={1}>
                              <Typography
                                variant="body1"
                                onClick={(event: any) => {
                                  event.preventDefault();
                                  remove(index);
                                }}
                                component={Link}
                                href={''}
                                sx={{
                                  color: '#5858ff',
                                }}
                              >
                                Remove
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Autocomplete
                                options={product}
                                sx={{ mb: 3 }}
                                clearOnBlur
                                freeSolo
                                getOptionLabel={(option: any) => option.name}
                                defaultValue={
                                  product.find(
                                    (prod: any) => prod.name === value,
                                  ) || null
                                }
                                autoHighlight={true}
                                onChange={(e, newValue: any) => {
                                  setValue(
                                    `configuration.extraFeatures.${index}.name`,
                                    newValue?.name || '',
                                  );
                                  setValue(
                                    `configuration.extraFeatures.${index}.quantity`,
                                    newValue?.quantity || '',
                                  );
                                  setValue(
                                    `configuration.extraFeatures.${index}.price`,
                                    newValue?.price || '',
                                  );
                                }}
                                filterOptions={(
                                  options: any[],
                                  params: any,
                                ) => {
                                  const filtered = filter(options, params);
                                  const { inputValue } = params;
                                  const isExisting = options.some(
                                    (option: any) => inputValue === option.name,
                                  );
                                  if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                      name: inputValue,
                                      price: 0,
                                      quantity: 0,
                                    });
                                  }
                                  return filtered;
                                }}
                                renderInput={(params) => (
                                  <>
                                    <CustomTextField
                                      {...params}
                                      size="small"
                                      label={'Product Name'}
                                      error={Boolean(nameError)}
                                      InputProps={{
                                        ...params.InputProps,
                                      }}
                                    />
                                    {nameError && (
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {nameError.message}
                                      </FormHelperText>
                                    )}
                                  </>
                                )}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomFormAmount
                                name={`configuration.extraFeatures.${index}.quantity`}
                                symbol=""
                                label={'Quantity'}
                                errors={
                                  (errors['configuration'] as any)?.[
                                    'extraFeatures'
                                  ]?.[index]?.['quantity']
                                }
                                control={control}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFormAmount
                                name={`configuration.extraFeatures.${index}.price`}
                                symbol="$"
                                label={'Price'}
                                errors={
                                  (errors['configuration'] as any)?.[
                                    'extraFeatures'
                                  ]?.[index]?.['price']
                                }
                                control={control}
                              />
                            </Grid>
                          </Grid>
                        );
                      })}
                      <Typography
                        variant="body1"
                        component={Link}
                        href={''}
                        sx={{
                          color: '#5858ff',
                        }}
                        onClick={(event: any) => {
                          event.preventDefault();
                          append({ name: '', price: '', quantity: '' });
                        }}
                      >
                        Add Service
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}
              </>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  mr: 1,
                  background:
                    'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                }}
                loading={loading}
              >
                Submit
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                sx={{
                  mr: 1,
                }}
                onClick={() => handleSubmit(onPreview)()}
                loading={loading}
              >
                Preview Invoice
              </LoadingButton>
              <Button variant="text" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </SimpleBarReact>
    </Drawer>
  );
};

export default AccountPlanForm;
