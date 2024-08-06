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

import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { STATUS } from '../../../utils/constant';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
}

const DepartmentForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      status: currentData?.status || 'ACTIVE',
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
      const form = {
        ...(addFlag && { uid: auth?.user?.uid }),
        ...data,
      };
      const response = addFlag
        ? await axios.post(`/department/`, form)
        : await axios.patch(`/department/${currentData.id}`, form);
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
        <Typography variant="h6">
          {addFlag ? 'Add' : 'Edit'} Department
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

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={STATUS}
            errors={errors}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default DepartmentForm;
