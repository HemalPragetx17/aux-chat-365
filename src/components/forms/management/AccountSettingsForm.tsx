import { yupResolver } from '@hookform/resolvers/yup';
import { Drawer, FormControl, Switch } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  success: () => void;
}

const AccountSettingsForm = (props: FormType) => {
  const { open, toggle, currentData, success } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    AuxVault: yup.boolean(),
    Contract: yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      AuxVault: currentData?.configuration?.AuxVault === false ? false : true,
      Contract: currentData?.configuration?.Contract === false ? false : true,
      OpenAI: currentData?.configuration?.OpenAI === false ? false : true,
      TranslateAI:
        currentData?.configuration?.TranslateAI === false ? false : true,
      Ipos: currentData?.configuration?.Ipos === false ? false : true,
    }),
    [currentData],
  );

  useEffect(() => {
    setLoading(false);
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
      const response = await axios.patch(
        `/users/change-settings/${currentData.id}`,
        { configuration: data },
      );
      setLoading(false);
      if (response.status === 200) {
        success();
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
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
        <Typography variant="h6">Manage Configurations</Typography>
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
          <FormControl fullWidth sx={{ display: 'flex' }}>
            <Typography component="span" sx={{ width: '50%' }}>
              AuxVault
            </Typography>
            <Controller
              name="AuxVault"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography>Contract</Typography>
            <Controller
              name="Contract"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography>IPOS</Typography>
            <Controller
              name="Ipos"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography>Open AI</Typography>
            <Controller
              name="OpenAI"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography>Translate and Transcribe AI</Typography>
            <Controller
              name="TranslateAI"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </FormControl>

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default AccountSettingsForm;
