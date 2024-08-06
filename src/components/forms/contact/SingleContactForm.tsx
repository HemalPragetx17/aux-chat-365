import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  styled,
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
import { AppState, useSelector } from '../../../store/Store';
import axios from '../../../utils/axios';
import CustomCheckbox from '../../custom/CustomCheckbox';
import CustomFormCheckbox from '../../custom/form/CustomFormCheckbox';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormPhone from '../../custom/form/CustomFormPhone';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomHeader from '../../custom/form/CustomHeader';

export const CONTACT_STATUS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Blocked', value: 'BLOCKED' },
];

export const CONTACT_STAGES = [
  { label: 'None', value: false },
  { label: 'New', value: 'NEW' },
  { label: 'Engaged', value: 'ENGAGED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Proposal Sent', value: 'PROPOSALSENT' },
  { label: 'Negotations', value: 'NEGOTIATIONS' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
  { label: 'Nurturing', value: 'NURTURING' },
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: (data: any) => void;
  chatContact?: boolean;
}

const SingleContactForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const { open, toggle, currentData, addFlag, success, chatContact } = props;
  const { user } = useAuth();
  const [showCustomField, setShowCustomField] = useState<boolean>(false);
  const roleId = user?.role?.roleId;
  const { contactCategory, contactService } = useSelector(
    (state: AppState) => state.contactsReducer,
  );

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required field'),
    email: yup.string().email('Enter Valid Email Address'),
    phone: yup.string().required('Phone Number is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentData?.firstName || '',
      lastName: currentData?.lastName || '',
      email: currentData?.email || '',
      phone: currentData?.phone || '',
      status: currentData?.status || 'ACTIVE',
      address: {
        street: currentData?.address?.street || '',
        city: currentData?.address?.city || '',
        state: currentData?.address?.state || '',
        zip: currentData?.address?.zip || '',
      },
      company: currentData?.company || '',
      jobTitle: currentData?.jobTitle || '',
      customFields: {
        labelOne: currentData?.customFields?.labelOne || 'Custom Field Label 1',
        valueOne: currentData?.customFields?.valueOne || '',
        labelTwo: currentData?.customFields?.labelTwo || 'Custom Field Label 2',
        valueTwo: currentData?.customFields?.valueTwo || '',
        labelThree:
          currentData?.customFields?.labelThree || 'Custom Field Label 3',
        valueThree: currentData?.customFields?.valueThree || '',
      },
      image: currentData?.image || null,
      stage: currentData?.stage || '',
      isShared: currentData?.isShared === false ? false : true,
      contactCategoryId: currentData?.contactCategoryId || '',
      servicesId: currentData?.servicesId || [],
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
    setImageChanged(false);
  }, [open]);

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  const onSubmit = async (data: any) => {
    try {
      const { image } = data;
      const formData = {
        ...data,
        stage: Boolean(data.stage) ? data.stage : null,
        contactCategoryId: Boolean(data.contactCategoryId)
          ? data.contactCategoryId
          : null,
        servicesId: Boolean(data.servicesId) ? data.servicesId : [],
      };
      delete formData['image'];

      setLoading(true);
      const response = addFlag
        ? await axios.post(`/contact/`, formData)
        : await axios.patch(`/contact/${currentData.id}`, formData);
      if (response.status === 200 || response.status === 201) {
        let contact = response.data?.data;
        if (imageChanged) {
          handleImageUpload(contact?.id || contact?.data?.id, image);
          return false;
        }
        setLoading(false);
        toast.success(`Contact ${addFlag ? 'added' : 'updated'} successfully.`);
        success(contact);
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleImageUpload = async (id: string, image: any) => {
    try {
      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const upload = await axios.put(
        `/contact/upload/${id}`,
        { file: image },
        header,
      );
      setLoading(false);
      toast.success(`Contact ${addFlag ? 'added' : 'updated'} successfully.`);
      success(upload);
      reset();
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setValue('image', file);
        setImageChanged(true);
      } else {
        toast.error('Only File Type Image Format Allowed!');
      }
    }
  };

  const handleFilePreview = (data: any) => {
    if (!Boolean(data)) {
      return '/images/profile/thumb.png';
    }
    if (data.src) {
      return data.src;
    }
    return URL.createObjectURL(data as any);
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
        <Typography variant="h6">{addFlag ? 'Add' : 'Edit'} Contact</Typography>
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
          <FormControl
            sx={{
              mb: 5,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Controller
              name={'image'}
              control={control}
              render={({ field: { value } }) => (
                <Avatar
                  alt={'profile'}
                  src={handleFilePreview(value)}
                  sx={{ width: '84px', height: '84px' }}
                />
              )}
            />

            <Box
              sx={{
                ml: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {open && (
                <Button sx={{ height: 24 }} component="label" variant="text">
                  Change
                  <VisuallyHiddenInput
                    onChange={handleFileChange}
                    type="file"
                    accept="image/*"
                    hidden
                  />
                </Button>
              )}
              {watchForm?.image && (
                <Button
                  sx={{ height: 20 }}
                  component="label"
                  variant="text"
                  onClick={() => {
                    setValue('image', '');
                    setImageChanged(true);
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </FormControl>
          {errors.image && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {(errors.image as any).message}
            </FormHelperText>
          )}

          <CustomFormText
            name={'firstName'}
            label={'First Name'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'lastName'}
            label={'Last Name'}
            errors={errors}
            control={control}
          />

          <CustomFormPhone
            name={'phone'}
            label={'Phone Number'}
            errors={errors}
            control={control}
            disabled={chatContact}
          />

          <CustomFormText
            name={'email'}
            label={'Email'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'address.street'}
            label={'Street'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'address.city'}
            label={'City'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'address.state'}
            label={'State'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            type={'number'}
            name={'address.zip'}
            label={'Zip Code'}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'status'}
            label={'Status'}
            options={CONTACT_STATUS}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'company'}
            label={'Company'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'jobTitle'}
            label={'Job Title'}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'contactCategoryId'}
            label={'Contact Type'}
            options={contactCategory}
            errors={errors}
            control={control}
          />

          <CustomFormSelect
            name={'servicesId'}
            label={'Service'}
            options={contactService}
            errors={errors}
            control={control}
            multiple={true}
          />

          <CustomFormSelect
            name={'stage'}
            label={'Stage'}
            options={CONTACT_STAGES}
            errors={errors}
            control={control}
          />

          {(roleId !== 3 ||
            currentData?.createdById === user?.uid ||
            addFlag) && (
            <CustomFormCheckbox
              name={'isShared'}
              label={'Make this a shared contact'}
              control={control}
            />
          )}

          <FormControlLabel
            label={'Add Custom Fields'}
            control={
              <CustomCheckbox
                checked={showCustomField}
                onChange={(e, checked) => {
                  setShowCustomField(checked);
                }}
                name={'showCustomField'}
              />
            }
          />

          {showCustomField && (
            <Box mt={'30px'}>
              <CustomFormText
                name={'customFields.labelOne'}
                label={'Custom Field One'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                name={'customFields.valueOne'}
                label={'Value One'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                name={'customFields.labelTwo'}
                label={'Custom Field Two'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                name={'customFields.valueTwo'}
                label={'Value Two'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                name={'customFields.labelThree'}
                label={'Custom Field Three'}
                errors={errors}
                control={control}
              />

              <CustomFormText
                name={'customFields.valueThree'}
                label={'Value Three'}
                errors={errors}
                control={control}
              />
            </Box>
          )}

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default SingleContactForm;
