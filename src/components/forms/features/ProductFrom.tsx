import { yupResolver } from '@hookform/resolvers/yup';
import {
  Drawer,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconMoodSmile, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import { BUTTON_ELEMENTS, STATUS } from '../../../utils/constant';
import CustomEmojiPicker from '../../custom/CustomEmojiPicker';
import CustomFormAmount from '../../custom/form/CustomFormAmount';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
}

const ProductForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [emojiContainer, setEmojiContainer] = useState<boolean>(false);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required field'),
    quantity: yup
      .number()
      .typeError('Please enter a valid number')
      .required('Quantity is required field'),
    price: yup
      .number()
      .typeError('Please enter a valid number')
      .required('Price is required field'),
    type: yup.string().required('Type is required field'),
    status: yup.string().required('Status is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      description: currentData?.description || '',
      quantity: currentData?.quantity || '',
      price: currentData?.price || '',
      discount: currentData?.discount || '',
      type: currentData?.type || 'Product',
      image: currentData?.image || [],
      status: currentData?.status || 'ACTIVE',
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [open]);

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    getValues,
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
        discount: Boolean(data?.discount) ? data?.discount : 0,
      };
      const response = addFlag
        ? await axios.post(`/products/`, formData)
        : await axios.patch(`/products/${currentData.id}`, formData);
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        success();
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleSelectEmoji = (e: any) => {
    const emoji = e?.native;
    let description = getValues('description');
    description += emoji;
    setValue('description', description);
  };

  const handleOutsideContainerClick = (e: Event) => {
    const tagName: any = (e.target as HTMLElement)?.tagName;
    if (BUTTON_ELEMENTS.indexOf(tagName) === -1) {
      setEmojiContainer(false);
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
      <CustomHeader>
        <Typography variant="h6">{addFlag ? 'Add' : 'Edit'} Product</Typography>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            Please select the type
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup row name="type" value={value} onChange={onChange}>
                  <FormControlLabel
                    value="Product"
                    label="PRODUCT"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="Service"
                    label="SERVICE"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          <CustomFormText
            name={'name'}
            label={'Name'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            type={'number'}
            name={'quantity'}
            label={'Quantity'}
            errors={errors}
            control={control}
          />

          <CustomFormAmount
            name={'price'}
            symbol="$"
            label={'Price'}
            errors={(errors as any).price}
            control={control}
          />

          <CustomFormAmount
            name={'discount'}
            symbol="$"
            label={'Discount'}
            errors={(errors as any).discount}
            control={control}
          />

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={STATUS}
            errors={errors}
            control={control}
          />

          <CustomFormTextArea
            name={'description'}
            label={'Description'}
            errors={errors}
            control={control}
            rows={6}
          />

          <IconButton
            sx={{ mt: '-16px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainer(!emojiContainer)}
          >
            <IconMoodSmile stroke={1.5} />
          </IconButton>

          {emojiContainer && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 10000,
                '& em-emoji-picker': {
                  mt: '-16px',
                  minHeight: 'unset',
                  height: 300,
                },
              }}
            >
              <CustomEmojiPicker
                navPosition={'none'}
                previewPosition={'none'}
                searchPosition={'none'}
                maxFrequentRows={'0'}
                onEmojiSelect={(e: any) => handleSelectEmoji(e)}
                onClickOutside={(e: any) => handleOutsideContainerClick(e)}
              />
            </Box>
          )}

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default ProductForm;
