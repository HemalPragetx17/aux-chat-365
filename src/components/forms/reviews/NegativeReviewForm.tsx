import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  replyFlag: boolean;
  success: () => void;
}

const NegativeReviewForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open, toggle, currentData, replyFlag, success } = props;

  const schema = yup.object().shape({
    reply: yup.string().required('This is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?.id,
      reply: '',
      sendTo: currentData?.customer_number,
      sendFrom: currentData?.sender_number,
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
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      console.log(data);
      //   setLoading(true);
      //   const response = replyFlag
      //     ? await axios.post(`/keyword/`, data)
      //     : await axios.patch(`/keyword/${currentData.id}`, data);
      //   setLoading(false);
      //   if (response.status === 200 || response.status === 201) {
      //     success();
      //     reset();
      //   }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
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
        <Typography variant="h6">{replyFlag ? 'Reply' : 'View'}</Typography>
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
        <Alert severity="error" icon={currentData?.rating} sx={{ mb: 2 }}>
          {currentData?.feedback}
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormTextArea
            name={'reply'}
            label={'Reply'}
            errors={errors}
            control={control}
            rows={4}
          />
          <CustomFormFooter
            onCancelClick={handleClose}
            loading={loading}
            disabled={!replyFlag}
          />
        </form>
      </Box>
    </Drawer>
  );
};

export default NegativeReviewForm;
