import { yupResolver } from '@hookform/resolvers/yup';
import { FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../../utils/axios';
import CustomCheckbox from '../../../custom/CustomCheckbox';
import CustomFormStandardText from '../../../custom/form/CustomFormStandardText';

interface FormType {
  currentData: any;
  success: (data: any) => void;
}

const ContactCustomFieldForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentData, success } = props;
  const [showCustomField, setShowCustomField] = useState<boolean>(false);

  useEffect(() => {
    reset(defaultValues);
  }, [currentData]);

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required field'),
    email: yup.string().email('Enter Valid Email Address'),
    phone: yup.string().required('Phone Number is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      customFields: {
        labelOne: currentData?.customFields?.labelOne || 'Custom Field Label 1',
        valueOne: currentData?.customFields?.valueOne || '',
        labelTwo: currentData?.customFields?.labelTwo || 'Custom Field Label 2',
        valueTwo: currentData?.customFields?.valueTwo || '',
        labelThree:
          currentData?.customFields?.labelThree || 'Custom Field Label 3',
        valueThree: currentData?.customFields?.valueThree || '',
      },
    }),
    [currentData],
  );

  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  const onSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.patch(
          `/contact/${currentData.id}`,
          watchForm,
        );
        if (response.status === 200 || response.status === 201) {
          let contact = response.data?.data;
          setLoading(false);
          toast.success(`Contact updated successfully.`);
          success(contact);
        }
      } catch (error) {
        setLoading(false);
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }, 1000);
  };

  return (
    <Box>
      <form>
        <FormControlLabel
          label={'Show Custom Fields'}
          control={
            <CustomCheckbox
              checked={showCustomField}
              onChange={(e, checked) => {
                setShowCustomField(checked);
              }}
              name={'showCustomField'}
            />
          }
        />
        {showCustomField && (
          <Box mt={'20px'}>
            <CustomFormStandardText
              name={'customFields.labelOne'}
              label={'Custom Field One'}
              errors={errors}
              control={control}
              handleBlur={onSubmit}
              loading={loading}
            />

            <CustomFormStandardText
              name={'customFields.valueOne'}
              label={'Value One'}
              errors={errors}
              control={control}
              handleBlur={onSubmit}
              loading={loading}
            />

            <CustomFormStandardText
              style={{ marginTop: 10 }}
              name={'customFields.labelTwo'}
              label={'Custom Field Two'}
              errors={errors}
              control={control}
              handleBlur={onSubmit}
              loading={loading}
            />

            <CustomFormStandardText
              name={'customFields.valueTwo'}
              label={'Value Two'}
              errors={errors}
              control={control}
              handleBlur={onSubmit}
              loading={loading}
            />

            <CustomFormStandardText
              style={{ marginTop: 10 }}
              name={'customFields.labelThree'}
              label={'Custom Field Three'}
              errors={errors}
              control={control}
              handleBlur={onSubmit}
              loading={loading}
            />

            <CustomFormStandardText
              name={'customFields.valueThree'}
              label={'Value Three'}
              errors={errors}
              control={control}
              handleBlur={onSubmit}
              loading={loading}
            />
          </Box>
        )}
      </form>
    </Box>
  );
};

export default ContactCustomFieldForm;
