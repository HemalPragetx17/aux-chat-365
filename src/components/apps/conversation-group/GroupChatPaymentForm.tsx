import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Radio,
  RadioGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { sendPaymentLink } from '../../../store/apps/chat/ChatGroupSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import CustomTextField from '../../custom/CustomTextField';
import CustomFormCheckbox from '../../custom/form/CustomFormCheckbox';
import CustomFormText from '../../custom/form/CustomFormText';

interface FormType {
  success: () => void;
  selectedChat: any;
  sender: string;
}

const GroupChatPaymentForm = (props: FormType) => {
  const { success, selectedChat, sender } = props;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chatGroupReducer.loading);

  const schema = yup.object().shape({
    amount: yup.string().required('Amount is required field'),
    description: yup.string().required('Description is required field'),
    invoiceNumber: yup.string().required('Invoice Number is required field'),
  });

  const defaultValues = useMemo(
    () => ({
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
    reset(defaultValues);
  }, [props]);

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

  const onPaymentFormSubmit = async (data: any) => {
    const {
      description,
      invoiceNumber,
      message,
      convenienceFee,
      amount,
      payment_type,
    } = data;
    const formData = {
      amount: parseFloat(amount).toFixed(2),
      description,
      message,
      invoiceNumber,
      convenienceFee: convenienceFee ? 0 : 1,
      type: payment_type === 'sale' ? '1' : '2',
      didId: selectedChat?.Did?.id,
      contactGroupId: selectedChat?.ContactGroup?.id,
      sender,
    };
    await dispatch(sendPaymentLink(formData));
    success();
  };

  return (
    <Box sx={{ p: (theme) => theme.spacing(0, 2, 2), mt: 1 }}>
      <form onSubmit={handleSubmit(onPaymentFormSubmit)}>
        <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
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
            variant="contained"
            loading={loading}
            sx={{ mr: 1,background:'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)' }}
            onClick={() => handleSubmit(onPaymentFormSubmit)()}
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default GroupChatPaymentForm;
