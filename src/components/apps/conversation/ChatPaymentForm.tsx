import { yupResolver } from '@hookform/resolvers/yup';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  Autocomplete,
  Button,
  createFilterOptions,
  FormControl,
  FormHelperText,
  IconButton,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import transaction from '../../../../src/images/transaction.png';
import { useAuth } from '../../../hooks/useAuth';
import {
  sendPaymentLink,
  sendPaymentLinkWithInvoice,
} from '../../../store/apps/chat/ChatSlice';
import { useDispatch } from '../../../store/Store';
import axios from '../../../utils/axios';
import CustomFormCheckbox from '../../custom/form/CustomFormCheckboxVT';
import CustomFormTextVT from '../../custom/form/CustomFormTextVT';
import VTCustomTextField from '../../custom/VTCustomTextField';

interface FormType {
  success: () => void;
  selectedChat: any;
  sender: string;
  paymentFormOptionValue: string;
  open: boolean;
}

const ChatPaymentForm = (props: FormType) => {
  const { success, selectedChat, sender, paymentFormOptionValue, open } = props;
  const dispatch = useDispatch();
  const filter = createFilterOptions();
  const [emailList, setEmailList] = useState<any>([]);
  const [masterEmailList, setMasterEmailList] = useState<any>([]);
  const { settings } = useAuth();

  const schema = yup.object().shape({
    amount: yup.string().required('Amount is required field'),
    description: yup.string().required('Description is required field'),
    invoiceNumber: yup.string().required('Invoice Number is required field'),
    sendEmail: yup.boolean(),
    email: yup.string().when('sendEmail', {
      is: (sendEmail: boolean) => sendEmail === true,
      then: () =>
        yup
          .string()
          .email('Enter Valid Email Address')
          .required('Customer Email is Required'),
      otherwise: () => yup.string().nullable(),
    }),
    fromEmail: yup.string().when('sendEmail', {
      is: (sendEmail: boolean) => sendEmail === true,
      then: () =>
        yup
          .string()
          .email('Enter Valid Email Address')
          .required('Please enter your email'),
      otherwise: () => yup.string().nullable(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      amount: '',
      description: '',
      invoiceNumber: '',
      email: selectedChat?.Contact?.email || '',
      fromEmail:
        masterEmailList.find((data: any) => data.isDefault === true)?.email ||
        '',
      message: '',
      convenienceFee: false,
      sendEmail: false,
      payment_type: 'sale',
    }),
    [selectedChat],
  );

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = useCallback(async () => {
    const response = await axios.get(`/email-nylas`);
    const list = response.status === 200 ? response.data.data : [];
    const _emailList = list.map((data: any) => data.email);
    setEmailList(_emailList);
    setMasterEmailList(list);
    const defaultEmail = list.find((data: any) => data.isDefault === true);
    if (defaultEmail) {
      setValue('fromEmail', defaultEmail.email, {
        shouldValidate: true,
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      const defaultEmail = masterEmailList.find(
        (data: any) => data.isDefault === true,
      );
      if (defaultEmail) {
        setValue('fromEmail', defaultEmail.email, {
          shouldValidate: true,
        });
      }
    }
  }, [open]);

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

  const onPaymentFormSubmit = async (data: any) => {
    const {
      description,
      invoiceNumber,
      message,
      convenienceFee,
      amount,
      email,
      sendEmail,
      payment_type,
    } = data;
    const formData = {
      amount: parseFloat(amount).toFixed(2),
      description,
      message,
      sendEmail,
      email,
      invoiceNumber,
      convenienceFee: convenienceFee ? 0 : 1,
      type: payment_type === 'sale' ? '1' : '2',
      id: selectedChat?.id,
      to: Boolean(selectedChat.Contact)
        ? selectedChat.Contact?.phone
        : selectedChat?.to,
      from: selectedChat?.from,
      sender,
    };

    success();
    if (paymentFormOptionValue === '1') {
      await dispatch(sendPaymentLink({ ...formData }));
    } else if (paymentFormOptionValue === '2') {
      await dispatch(sendPaymentLinkWithInvoice({ ...formData }));
    }
  };

  return (
    <>
      <div
        className="payment_link_modal_div"
        style={{
          width: 350,
        }}
      >
        <Box
          sx={{
            padding: '15px',
            height: '100%',
            background: '#323441',
            border: 'none',
          }}
        >
          <form onSubmit={handleSubmit(onPaymentFormSubmit)}>
            <Typography
              variant="h6"
              style={{
                display: 'flex',
                color: 'white',
                gap: '15px',
                fontSize: '22px',
                textAlign: 'center',
                padding: '10px 20px 20px 0px',
              }}
            >
              <Image src={transaction} width={25} height={25} alt="" /> Send
              Payment Link
            </Typography>
            <IconButton
              aria-label="close"
              style={{ position: 'absolute', right: '5px', top: '5px' }}
              onClick={() => success()}
            >
              <CancelOutlinedIcon style={{ color: '#fff', fontSize: '30px' }} />
            </IconButton>
            <CustomFormTextVT
              type={'number'}
              name={'amount'}
              label={'Amount ($)'}
              errors={errors}
              control={control}
            />
            <CustomFormTextVT
              name={'description'}
              label={'Description'}
              errors={errors}
              control={control}
            />

            <CustomFormTextVT
              name={'invoiceNumber'}
              label={'PO/Invoice/Transaction Number'}
              errors={errors}
              control={control}
            />

            <CustomFormTextVT
              name={'message'}
              label={'Message (optional)'}
              errors={errors}
              control={control}
            />

            {settings?.user_settings?.waveTechFee && (
              <CustomFormCheckbox
                name={'convenienceFee'}
                label={'Do not send Tech Fee'}
                control={control}
              />
            )}

            <CustomFormCheckbox
              name={'sendEmail'}
              label={'Send to Email'}
              control={control}
            />

            {formValues.sendEmail && (
              <Box sx={{ mt: 2 }}>
                <CustomFormTextVT
                  type="email"
                  name={'email'}
                  label={'Send To'}
                  errors={errors}
                  control={control}
                />
                <FormControl fullWidth sx={{ mb: 1, display: 'flex' }}>
                  <Autocomplete
                    options={emailList}
                    freeSolo
                    clearOnBlur
                    autoHighlight={true}
                    getOptionLabel={(option: any) => option}
                    value={formValues?.fromEmail}
                    onChange={(e, newValue: any) => {
                      setValue('fromEmail', newValue, {
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
                        filtered.push(inputValue);
                      }
                      return filtered;
                    }}
                    renderInput={(params) => (
                      <VTCustomTextField
                        {...params}
                        fullWidth
                        size="small"
                        placeholder="From Email"
                        error={
                          Boolean(errors?.fromEmail) &&
                          Boolean(errors?.fromEmail?.message)
                        }
                      />
                    )}
                  />
                  {errors.fromEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {(errors.fromEmail as any).message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}

            <Button
              variant="contained"
              disableElevation
              style={{
                display: 'block',
                margin: 'auto',
                backgroundColor:
                  'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                marginTop: '20px',
                width: '100%',
              }}
              onClick={() => handleSubmit(onPaymentFormSubmit)()}
            >
              Submit
            </Button>
          </form>
        </Box>
      </div>
    </>
  );
};

export default ChatPaymentForm;
