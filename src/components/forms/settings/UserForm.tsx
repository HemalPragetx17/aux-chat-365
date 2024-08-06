import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../hooks/useAuth';
import { AppState, dispatch, useSelector } from '../../../store/Store';
import { fetchDids } from '../../../store/apps/did/DidSlice';
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

const ROLE_OPTIONS = [{ label: 'OPERATOR', value: '3' }];

export const USER_STATUS = [
  { label: 'In-Active', value: 'Inactive' },
  { label: 'Active', value: 'Active' },
];

const UserForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [emailList, setEmailList] = useState<any>([]);
  const { user, setSettings } = useAuth();
  const didList = useSelector((state: AppState) =>
    state.didReducer.did.map((did: any) => ({
      label: `${did?.countryCode}${did?.phoneNumber} (${did?.title})`,
      value: did.id,
    })),
  );

  useEffect(() => {
    fetchNylasEmailList();
  }, []);

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

  useEffect(() => {
    if (Boolean(user) && didList.length === 0) {
      dispatch(fetchDids('ACTIVE', user?.uid as any));
    }
  }, [user]);

  const fetchNylasEmailList = async () => {
    const response = await axios.post('/email-nylas/get-nylas-emails');
    const data = response?.status === 201 ? response?.data : [];
    setEmailList(data);
  };

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      phone: currentData?.phone || '',
      email: currentData?.email || '',
      status: currentData?.status || 'Active',
      roleId: currentData?.Roles?.role === 'ADMIN' ? '2' : '3',
      password: '',
      confirmPassword: '',
      defaultDidId:
        currentData?.Roles?.role === 'ADMIN'
          ? null
          : currentData?.defaultDidId || null,
      assignedDidId:
        currentData?.Roles?.role === 'ADMIN'
          ? []
          : currentData?.assignedDidId || [],
      defaultEmailId:
        currentData?.Roles?.role === 'ADMIN'
          ? null
          : currentData?.defaultEmailId || null,
      assignedEmailId:
        currentData?.Roles?.role === 'ADMIN'
          ? []
          : currentData?.assignedEmailId || [],
      setting: {
        waveTechFee: Boolean(currentData?.Profile?.setting?.waveTechFee),
        deletePermission:
          currentData?.Roles?.role === 'ADMIN'
            ? true
            : Boolean(currentData?.Profile?.setting?.deletePermission),
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
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  useEffect(() => {
    const { defaultDidId, assignedDidId } = watchForm;
    if (assignedDidId.indexOf(defaultDidId) === -1) {
      setValue('defaultDidId', '');
    }
  }, [watchForm?.assignedDidId]);

  useEffect(() => {
    const { defaultEmailId, assignedEmailId } = watchForm;
    if (assignedEmailId.indexOf(defaultEmailId) === -1) {
      setValue('defaultEmailId', '');
    }
  }, [watchForm?.assignedEmailId]);

  const handleSelectAll = (event: any) => {
    const checked = watchForm?.assignedDidId.length === didList.length;
    if (checked) {
      setValue('assignedDidId', []);
    } else {
      const allDids = didList.map((did) => did.value);
      setValue('assignedDidId', allDids);
    }
  };

  const handleSelectAllEmail = (event: any) => {
    const checked = watchForm?.assignedEmailId.length === emailList.length;
    if (checked) {
      setValue('assignedEmailId', []);
    } else {
      const allEmails = emailList.map((obj: any) => obj.id);
      setValue('assignedEmailId', allEmails);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const { setting } = data;
      setLoading(true);

      const payload = {
        ...data,
      };

      if (!addFlag) {
        delete payload['password'];
        delete payload['confirmPassword'];
      }
      delete payload['setting'];

      const response = addFlag
        ? await axios.post(`/users/`, payload)
        : await axios.patch(`/users/${currentData.id}`, payload);

      setLoading(false);
      if (response.status === 200) {
        if (!addFlag) {
          const _response = await axios.post(
            `/users/profile/${currentData?.id}`,
            {
              setting,
            },
          );
          if (_response.status === 200) {
            success();
            reset();
            setSettings(undefined);
            return false;
          }
        }
        success();
        reset();
        setSettings(undefined);
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
    }
  };

  const fetchDidName = (didId: string) => {
    const did = didList.find((obj: any) => obj.value === didId);
    return did?.label;
  };

  const fetchEmailName = (emailId: string) => {
    const obj = emailList.find((obj: any) => obj.id === emailId);
    return obj?.email;
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
        <Typography variant="h6">{addFlag ? 'Add' : 'Edit'} User</Typography>
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

          {currentData?.Roles?.role === 'OPERATOR' && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="type-select" size="small">
                  Select DIDs
                </InputLabel>
                <Controller
                  name={'assignedDidId'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      size="small"
                      label={' Select DIDs'}
                      labelId="type-select"
                      value={value}
                      onChange={(event) => {
                        const selecedAll =
                          event.target.value.indexOf('select-all') > -1;
                        selecedAll ? handleSelectAll(event) : onChange(event);
                      }}
                      MenuProps={{
                        sx: {
                          maxHeight: 300,
                        },
                      }}
                      multiple
                    >
                      <MenuItem
                        key="select-all"
                        value="select-all"
                        dense
                        onClick={(event: any) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <Checkbox
                          checked={
                            watchForm?.assignedDidId.length === didList.length
                          }
                          onChange={(event: any) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleSelectAll(event);
                          }}
                          sx={{ padding: 0, marginRight: 2 }}
                        />
                        Select All
                      </MenuItem>
                      {didList.map((option, index) => (
                        <MenuItem dense key={index} value={option?.value}>
                          {option?.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="type-select" size="small">
                  Default DID
                </InputLabel>
                <Controller
                  name={'defaultDidId'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      size="small"
                      label={'Default DID'}
                      labelId="type-select"
                      value={value}
                      onChange={onChange}
                      disabled={watchForm?.assignedDidId?.length === 0}
                      MenuProps={{
                        sx: {
                          maxHeight: 300,
                        },
                      }}
                    >
                      {watchForm?.assignedDidId.map(
                        (option: string, index: number) => (
                          <MenuItem dense key={index} value={option}>
                            {fetchDidName(option)}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="type-select" size="small">
                  Assign Nylas Emails
                </InputLabel>
                <Controller
                  name={'assignedEmailId'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      size="small"
                      label={' Assign Nylas Emails'}
                      labelId="type-select"
                      value={value}
                      onChange={(event) => {
                        const selecedAll =
                          event.target.value.indexOf('select-all') > -1;
                        selecedAll
                          ? handleSelectAllEmail(event)
                          : onChange(event);
                      }}
                      MenuProps={{
                        sx: {
                          maxHeight: 300,
                        },
                      }}
                      multiple
                    >
                      <MenuItem
                        key="select-all"
                        value="select-all"
                        dense
                        onClick={(event: any) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <Checkbox
                          checked={
                            watchForm?.assignedEmailId.length ===
                            emailList.length
                          }
                          onChange={(event: any) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleSelectAllEmail(event);
                          }}
                          sx={{ padding: 0, marginRight: 2 }}
                        />
                        Select All
                      </MenuItem>
                      {emailList.map((option: any, index: number) => (
                        <MenuItem dense key={index} value={option?.id}>
                          {option?.email}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="type-select" size="small">
                  Default Nylas Email
                </InputLabel>
                <Controller
                  name={'defaultEmailId'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      size="small"
                      label={'Default Nylas Email'}
                      labelId="type-select"
                      value={value}
                      onChange={onChange}
                      disabled={watchForm?.assignedEmailId?.length === 0}
                      MenuProps={{
                        sx: {
                          maxHeight: 300,
                        },
                      }}
                    >
                      {watchForm?.assignedEmailId.map(
                        (option: string, index: number) => (
                          <MenuItem dense key={index} value={option}>
                            {fetchEmailName(option)}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </>
          )}

          <CustomFormCheckbox
            name={'setting.waveTechFee'}
            label={'Allow Operator to Waive Tech Fee'}
            control={control}
          />

          <CustomFormCheckbox
            name={'setting.deletePermission'}
            label={'Allow Deleting Conversation and Messages'}
            control={control}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default UserForm;
