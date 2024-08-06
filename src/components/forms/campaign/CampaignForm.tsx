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

import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
}

const urlRegex =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

const CampaignForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open, toggle, currentData, addFlag, success } = props;

  const schema = yup.object().shape({
    name: yup.string().required('Name is required field'),
    url: yup
      .string()
      .required('URL is required field')
      .matches(urlRegex, 'Invalid URL'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      url: currentData?.url || '',
      domain: currentData?.domain || 'https://c.auxchat.com',
      slug: currentData?.slug || '',
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
      //   const response = addFlag
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
        <Typography variant="h6">
          {addFlag ? 'Add' : 'Edit'} Campaign
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormText
            name={'name'}
            label={'Name'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'url'}
            label={'URL (Destination)'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'domain'}
            label={'Domain'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'slug'}
            label={'Slug'}
            errors={errors}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default CampaignForm;
