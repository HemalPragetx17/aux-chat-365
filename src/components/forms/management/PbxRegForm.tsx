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
import { PASSWORD_REGEX } from '../../../utils/constant';
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

const PbxRegForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    linkusUsername: yup.string().required('Linkus Username is required'),
    linkusPassword: yup.string().required('linkus Password is required'),
    pbxUrl: yup.string().required('Pbx Url is required'),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentData?.pbxDetails?.username || '',
      password: currentData?.pbxDetails?.password || '',
      linkusUsername: currentData?.pbxDetails?.linkusUsername || '',
      linkusPassword: currentData?.pbxDetails?.linkusPassword || '',
      pbxUrl: currentData?.pbxDetails?.pbxUrl || '',
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
      const response: any = await axios.post(
        `/call-features/pbx-reg/${currentData?.id}`,
        data,
      );
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        success();
        reset();
        handleClose();
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
          {addFlag ? 'Add' : 'Edit'} Pbx Account
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
            name={'username'}
            label={'Username'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            type="password"
            name={'password'}
            label={'Password'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'linkusUsername'}
            label={'Linkus Username'}
            errors={errors}
            control={control}
          />
          <CustomFormText
            type="password"
            name={'linkusPassword'}
            label={'Linkus Password'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'pbxUrl'}
            label={'Pbx Url'}
            errors={errors}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default PbxRegForm;
