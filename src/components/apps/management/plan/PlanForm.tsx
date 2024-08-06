import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { Box } from '@mui/system';
import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../../utils/axios';
import { STATUS } from '../../../../utils/constant';
import CustomFormAmount from '../../../custom/form/CustomFormAmount';
import CustomFormSelect from '../../../custom/form/CustomFormSelect';
import CustomFormText from '../../../custom/form/CustomFormText';

interface FormProps {
  currentData?: any;
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
    boxShadow: '0px 2px 8px rgba(0,0,0,0.60)',
  }),
);

const PlanForm = (props: FormProps) => {
  const { currentData } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const schema = yup.object().shape({
    title: yup.string().required('Please Enter Plan Name'),
    price: yup.object().shape({
      monthly: yup
        .number()
        .typeError('Please enter a valid number')
        .required('Please Enter Monthly Price'),
      yearly: yup
        .number()
        .typeError('Please enter a valid number')
        .required('Please Enter Yearly Price'),
    }),
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
      paymentProcessing: yup.object().shape({
        monthlyFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Monthly Fee'),
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
      phoneFees: yup.object().shape({
        monthlyFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Monthly Fee'),
        additionalUsersFee: yup
          .number()
          .typeError('Please enter a valid number')
          .required('Please Enter Additional User Fee'),
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
    }),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      description: currentData?.description || '',
      status: currentData?.status || 'ACTIVE',
      price: {
        monthly: currentData?.price?.monthly || '0.00',
        yearly: currentData?.price?.yearly || '0.00',
      },
      configuration: {
        chatterFees: {
          freeWithPlan:
            currentData?.configuration?.chatterFees?.freeWithPlan || 0,
          inboundFee:
            currentData?.configuration?.chatterFees?.inboundFee || '0.00',
          outboundFee:
            currentData?.configuration?.chatterFees?.outboundFee || '0.00',
          mmsFee: currentData?.configuration?.chatterFees?.mmsFee || '0.00',
          autoReplyFee:
            currentData?.configuration?.chatterFees?.autoReplyFee || '0.00',
        },
        paymentProcessing: {
          monthlyFee:
            currentData?.configuration?.paymentProcessing?.monthlyFee || '0.00',
          vtFee: currentData?.configuration?.paymentProcessing?.vtFee || '0.00',
          recurringFee:
            currentData?.configuration?.paymentProcessing?.recurringFee ||
            '0.00',
          txt2payFee:
            currentData?.configuration?.paymentProcessing?.txt2payFee || '0.00',
          cashPaymentFee:
            currentData?.configuration?.paymentProcessing?.cashPaymentFee ||
            '0.00',
          failedRecurringFee:
            currentData?.configuration?.paymentProcessing?.failedRecurringFee ||
            '0.00',
          achFee:
            currentData?.configuration?.paymentProcessing?.achFee || '0.00',
          giftCardFee:
            currentData?.configuration?.paymentProcessing?.giftCardFee ||
            '0.00',
          tapToPayIos:
            currentData?.configuration?.paymentProcessing?.tapToPayIos ||
            '0.00',
          tapToPayAndroid:
            currentData?.configuration?.paymentProcessing?.tapToPayAndroid ||
            '0.00',
        },
        phoneFees: {
          monthlyFee:
            currentData?.configuration?.phoneFees?.monthlyFee || '0.00',
          freeExtensions:
            currentData?.configuration?.phoneFees?.freeExtensions || 0,
          additionalUsersFee:
            currentData?.configuration?.phoneFees?.additionalUsersFee || '0.00',
          freeMinutesWithPlan:
            currentData?.configuration?.phoneFees?.freeMinutesWithPlan || 0,
          outboundPerMinFee:
            currentData?.configuration?.phoneFees?.outboundPerMinFee || '0.00',
          inboundPerMinFee:
            currentData?.configuration?.phoneFees?.inboundPerMinFee || '0.00',
          callRecordingsFree:
            currentData?.configuration?.phoneFees?.callRecordingsFree || 0,
          callRecordingsFee:
            currentData?.configuration?.phoneFees?.callRecordingsFee || '0.00',
          didFee: currentData?.configuration?.phoneFees?.didFee || '0.00',
          freeDid: currentData?.configuration?.phoneFees?.freeDid || 0,
        },
        licenseFees: {
          additionalUsersFee:
            currentData?.configuration?.licenseFees?.additionalUsersFee ||
            '0.00',
          didFee: currentData?.configuration?.licenseFees?.didFee || '0.00',
          freeDid: currentData?.configuration?.licenseFees?.freeDid || 0,
          freeUsers: currentData?.configuration?.licenseFees?.freeUsers || 0,
        },
      },
    }),
    [currentData],
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'configuration.extraFeatures',
  });

  useEffect(() => {
    reset(defaultValues);
    setLoading(false);
  }, []);

  useEffect(() => {
    reset(defaultValues);
    setLoading(false);
  }, [currentData]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const addFlag = Boolean(currentData?.id);
      const response = addFlag
        ? await axios.patch(`/plan/${currentData?.id}`, data)
        : await axios.post(`/plan`, data);
      if (response.status === 200) {
        toast.success('Success!');
        router.replace('/management/plan');
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <Card
      sx={{
        padding: 0,
        borderColor: (theme: any) => theme.palette.divider,
      }}
      variant="outlined"
    >
      <CardHeader
        title={`${
          Boolean(currentData?.id) ? 'Edit an existing' : 'Add a new'
        } Plan`}
      />
      <Divider />{' '}
      <CardContent>
        <form style={{}} onSubmit={handleSubmit(onSubmit)}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<IconChevronDown color="white" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">Plan Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} mt={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormText
                    name={'title'}
                    label={'Name'}
                    errors={errors}
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormText
                    name={'description'}
                    label={'Description'}
                    errors={errors}
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormSelect
                    name={'status'}
                    label={'Status'}
                    options={STATUS}
                    errors={errors}
                    control={control}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<IconChevronDown color="white" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">Price</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} mt={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'price.monthly'}
                    symbol="$"
                    label={'Monthly'}
                    errors={(errors['price'] as any)?.['monthly']}
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'price.yearly'}
                    symbol="$"
                    label={'Yearly'}
                    errors={(errors['price'] as any)?.['yearly']}
                    control={control}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<IconChevronDown color="white" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">Chatter Fees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} mt={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.chatterFees.freeWithPlan'}
                    symbol=""
                    label={'Free Messages'}
                    errors={
                      (errors['configuration'] as any)?.['chatterFees']?.[
                        'freeWithPlan'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.chatterFees.outboundFee'}
                    symbol="$"
                    label={'Outbound Fee'}
                    errors={
                      (errors['configuration'] as any)?.['chatterFees']?.[
                        'outboundFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.chatterFees.mmsFee'}
                    symbol="$"
                    label={'MMS Fee'}
                    errors={
                      (errors['configuration'] as any)?.['chatterFees']?.[
                        'mmsFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.chatterFees.autoReplyFee'}
                    symbol="$"
                    label={'Auto Reply Fee'}
                    errors={
                      (errors['configuration'] as any)?.['chatterFees']?.[
                        'autoReplyFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.chatterFees.inboundFee'}
                    symbol="$"
                    label={'Inbound Fee'}
                    errors={
                      (errors['configuration'] as any)?.['chatterFees']?.[
                        'inboundFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<IconChevronDown color="white" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">Licenses</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} mt={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.licenseFees.freeUsers'}
                    symbol=""
                    label={'Free Users'}
                    errors={
                      (errors['configuration'] as any)?.['licenseFees']?.[
                        'freeUsers'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.licenseFees.additionalUsersFee'}
                    symbol="$"
                    label={'Additional User Fee'}
                    errors={
                      (errors['configuration'] as any)?.['licenseFees']?.[
                        'additionalUsersFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.licenseFees.freeDid'}
                    symbol=""
                    label={'Free DIDs'}
                    errors={
                      (errors['configuration'] as any)?.['licenseFees']?.[
                        'freeDid'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.licenseFees.didFee'}
                    symbol="$"
                    label={'Additional DID Fee'}
                    errors={
                      (errors['configuration'] as any)?.['licenseFees']?.[
                        'didFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<IconChevronDown color="white" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">Payment Processing Fees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} mt={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.monthlyFee'}
                    symbol="$"
                    label={'Monthly Payment Fees'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'monthlyFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.vtFee'}
                    symbol="$"
                    label={'Virtual Terminal Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'vtFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.recurringFee'}
                    symbol="$"
                    label={'Technology Licence'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'recurringFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.txt2payFee'}
                    symbol="$"
                    label={'Text2Pay Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'txt2payFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.cashPaymentFee'}
                    symbol="$"
                    label={'Cash Payment Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'cashPaymentFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.failedRecurringFee'}
                    symbol="$"
                    label={'Failed Recurring Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'failedRecurringFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.achFee'}
                    symbol="$"
                    label={'ACH Payment Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'achFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.giftCardFee'}
                    symbol="$"
                    label={'Giftcard Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'giftCardFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.tapToPayIos'}
                    symbol="$"
                    label={'TapToPay IOS Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'tapToPayIos'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.paymentProcessing.tapToPayAndroid'}
                    symbol="$"
                    label={'TapToPay Android Fee'}
                    errors={
                      (errors['configuration'] as any)?.['paymentProcessing']?.[
                        'tapToPayAndroid'
                      ]
                    }
                    control={control}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<IconChevronDown color="white" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">Phone Fees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} mt={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.monthlyFee'}
                    symbol="$"
                    label={'Monthly Phone Fees'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'monthlyFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.freeExtensions'}
                    symbol=""
                    label={'Free Extensions'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'freeExtensions'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.additionalUsersFee'}
                    symbol="$"
                    label={'Additional User Phone Fees'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'additionalUsersFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.freeMinutesWithPlan'}
                    symbol=""
                    label={'Free Calling Minutes'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'freeMinutesWithPlan'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.outboundPerMinFee'}
                    symbol="$"
                    label={'Outbound Fees / min'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'outboundPerMinFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.inboundPerMinFee'}
                    symbol="$"
                    label={'Inbound Fees / min'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'inboundPerMinFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.callRecordingsFree'}
                    symbol=""
                    label={'Free Call Recording Minutes'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'callRecordingsFree'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.callRecordingsFee'}
                    symbol="$"
                    label={'Monthly Call Recording Fees'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'callRecordingsFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.freeDid'}
                    symbol=""
                    label={'Free DIDs'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'freeDid'
                      ]
                    }
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormAmount
                    name={'configuration.phoneFees.didFee'}
                    symbol="$"
                    label={'Additional DID Fee'}
                    errors={
                      (errors['configuration'] as any)?.['phoneFees']?.[
                        'didFee'
                      ]
                    }
                    control={control}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

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
            <Button
              variant="text"
              color="primary"
              onClick={() => router.replace('/management/plan')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlanForm;
