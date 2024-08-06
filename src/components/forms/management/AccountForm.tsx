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
import CustomFormCheckbox from '../../custom/form/CustomFormCheckbox';
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

const ROLE_OPTIONS = [{ label: 'ADMIN', value: '2' }];

export const USER_STATUS = [
  { label: 'In-Active', value: 'Inactive' },
  { label: 'Active', value: 'Active' },
];

const DID_PROVIDER = [
  { label: 'BANDWIDTH', value: 'BANDWIDTH' },
  { label: 'TELNYX', value: 'TELNYX' },
];

const AccountForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Enter valid Email')
      .required('Email is a required'),
    phone: yup.string().required('Phone Number is required'),
    roleId: yup.string().required('Role is a required'),
    password: !addFlag
      ? yup.string()
      : yup
          .string()
          .required('Please enter your password')
          .matches(
            PASSWORD_REGEX,
            'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
          ),
    confirmPassword: !addFlag
      ? yup.string()
      : yup
          .string()
          .required('Please re-enter your password')
          .oneOf([yup.ref('password'), ''], 'Passwords must match'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      phone: currentData?.phone || '',
      email: currentData?.email || '',
      status: currentData?.status || 'Active',
      roleId: '2',
      password: '',
      confirmPassword: '',
      defaultDidId: null,
      assignedDidId: [],
      defaultEmailId: null,
      assignedEmailId: [],
      Providers:
        currentData?.Profile?.configuration?.Providers?.length > 0
          ? currentData?.Profile?.configuration?.Providers[0]
          : 'TELNYX',
      autoSuspend: false,
      setting: {
        waveTechFee: Boolean(currentData?.Profile?.setting?.waveTechFee),
        deletePermission: true,
      },
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
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { Providers, setting } = data;

      const payload = {
        ...data,
        Providers: [data.Providers],
      };

      if (!addFlag) {
        delete payload['password'];
        delete payload['confirmPassword'];
        delete payload['Providers'];
      }

      setLoading(true);
      const response = addFlag
        ? await axios.post(`/users/`, payload)
        : await axios.patch(`/users/${currentData.id}`, payload);
      setLoading(false);
      if (response.status === 200) {
        if (!addFlag) {
          const _response = await axios.post(
            `/users/profile/${currentData?.id}`,
            {
              configuration: {
                ...currentData?.Profile?.configuration,
                Providers: [Providers],
              },
              setting,
            },
          );
          if (_response.status === 200) {
            success();
            reset();
            return false;
          }
        }
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
          {addFlag ? 'Add' : 'Edit'} Admin Account
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
            type={'number'}
            name={'phone'}
            label={'Phone'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'email'}
            label={'Email'}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={USER_STATUS}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'roleId'}
            label={'Role'}
            options={ROLE_OPTIONS}
            errors={errors}
            control={control}
          />

          {addFlag && (
            <>
              <CustomFormText
                type={'password'}
                name={'password'}
                label={'Password'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                type={'password'}
                name={'confirmPassword'}
                label={'Confirm Password'}
                errors={errors}
                control={control}
              />
            </>
          )}

          <CustomFormSelect
            name={'Providers'}
            label={'Select Provider'}
            options={DID_PROVIDER}
            errors={errors}
            control={control}
          />

          <CustomFormCheckbox
            name={'setting.waveTechFee'}
            label={'Allow Account to Waive Tech Fee'}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default AccountForm;
