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

interface FormType {
  open: boolean;
  currentData: any;
  userList: any;
  toggle: () => void;
  success: () => void;
}

const DidAssignForm = (props: FormType) => {
  const { open, toggle, currentData, success, userList } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      phoneNumber: currentData?.phoneNumber || '',
      operatorId: currentData?.operatorId || [],
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
    setLoading(false);
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
      const response = await axios.patch(`/did/assign/${currentData.id}`, data);
      if (response.status === 200) {
        success();
        reset();
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
        <Typography variant="h6">Assign DID</Typography>
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
            name={'phoneNumber'}
            label={'DID'}
            errors={errors}
            control={control}
            disabled={true}
          />

          <CustomFormSelect
            name={'operatorId'}
            label={'Select Operators'}
            options={userList}
            errors={errors}
            control={control}
            multiple={true}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default DidAssignForm;
