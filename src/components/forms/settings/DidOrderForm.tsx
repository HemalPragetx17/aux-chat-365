import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';

interface FormType {
  uid: string;
  close: () => void;
  telephoneList: any[];
}

const DidOrderForm = (props: FormType) => {
  const { uid, close, telephoneList } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    numbers: yup.array().min(1, 'Please select one number'),
  });

  const defaultValues = useMemo(
    () => ({
      numbers: [],
    }),
    [],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [open]);

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
      setLoading(true);
      const formData = {
        ...data,
        uid,
      };
      const response = await axios.post(`/did/order/create`, formData);
      setLoading(false);
      if (response.status === 200) {
        toast.success(
          `${data.numbers.length} DID numbers ordered successfully. Please check back in a few hours to use them.`,
        );
        close();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
      console.error(error);
    }
  };

  const handleClose = () => {
    close();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomFormSelect
        name={'numbers'}
        label={'Choose DID Numbers'}
        errors={errors}
        control={control}
        multiple={true}
        options={telephoneList}
      />

      <CustomFormFooter onCancelClick={handleClose} loading={loading} />
    </form>
  );
};

export default DidOrderForm;
