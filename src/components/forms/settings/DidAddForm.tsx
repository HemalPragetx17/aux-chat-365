import { yupResolver } from '@hookform/resolvers/yup';
import { Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

import DidOrderForm from './DidOrderForm';

interface FormType {
  open: boolean;
  toggle: () => void;
  uid: string;
}

const DID_PROVIDER = [
  { label: 'BANDWIDTH', value: 'BANDWIDTH' },
  { label: 'TELNYX', value: 'TELNYX' },
];

const DidAddForm = (props: FormType) => {
  const { open, toggle, uid } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [numberList, setNumberList] = useState<any>([]);
  const [initialForm, setInitialForm] = useState<boolean>(true);

  const quantityOption = [
    { label: '2', value: 2 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
  ];

  const schema = yup.object().shape({
    areacode: yup
      .string()
      .required('Area Code is required field')
      .min(3, 'Invalid Code')
      .max(3, 'Invalid Code'),
    quantity: yup.string().required('Quantity is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      areacode: '',
      quantity: '',
      didProvider: 'BANDWIDTH',
    }),
    [],
  );

  useEffect(() => {
    reset(defaultValues);
    setNumberList([]);
    setInitialForm(true);
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
      const { areacode, quantity, didProvider } = data;
      const response = await axios.get(
        `/did/available-numbers/${areacode}/${quantity}/${didProvider}`,
      );
      setLoading(false);
      if (response.status === 200) {
        const telephoneList =
          response?.data?.telephoneNumberList?.telephoneNumber || [];
        if (telephoneList.length > 0) {
          const options = telephoneList.map((number: string) => ({
            label: number,
            value: number,
          }));
          setNumberList(options);
          setInitialForm(false);
          return false;
        }
        toast.error('Could not find any number.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
      console.error(error);
    }
  };

  const handleClose = () => {
    toggle();
    reset();
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
      <CustomHeader>
        <Typography variant="h6">
          {initialForm ? 'Add DID with Bandwidth' : 'Order DID Numbers'}
        </Typography>
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
        {initialForm ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <CustomFormSelect
              name={'didProvider'}
              label={'Select Provider'}
              options={DID_PROVIDER}
              errors={errors}
              control={control}
            /> */}

            <CustomFormText
              type={'number'}
              name={'areacode'}
              label={'Area Code'}
              errors={errors}
              control={control}
            />

            <CustomFormSelect
              name={'quantity'}
              label={'Quantity'}
              errors={errors}
              control={control}
              options={quantityOption || []}
            />

            <CustomFormFooter onCancelClick={handleClose} loading={loading} />
          </form>
        ) : (
          <DidOrderForm
            uid={uid}
            telephoneList={numberList}
            close={handleClose}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default DidAddForm;
