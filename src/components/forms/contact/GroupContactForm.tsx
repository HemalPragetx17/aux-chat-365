import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Drawer,
  FormControl,
  FormHelperText,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import { fetchContactCategory } from '../../../store/apps/contacts/ContactSlice';
import { AppState, dispatch } from '../../../store/Store';
import axios from '../../../utils/axios';
import CustomTextField from '../../custom/CustomTextField';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
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

const GroupContactForm = (props: FormType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open, toggle, currentData, addFlag, success } = props;
  const [categoryFilter, setCategoryFilter] = useState<any>('');
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const store = useSelector((state: AppState) => state.contactsReducer);
  const [data, setData] = useState<any>([]);
  const [contactList, setContactList] = useState<any[]>([]);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  const fetchFiltersData = async () => {
    const categories = await dispatch(fetchContactCategory());
    setCategoryList(categories);
  };

  const schema = yup.object().shape({
    title: yup.string().required('Title is required field'),
    description: yup.string().required('Description is required field'),
    contactId: yup.array().min(1, 'Please select atleast one contact'),
  });

  const handleCategorySelected = async (category: any) => {
    setCategoryFilter(category);
    if (category) {
      setLoading(true);
      const response = await axios.post(
        `/contact/get-category/${category.value}`,
      );
      const contacts = response.status === 201 ? response.data : [];
      const existing_contacts = getValues('contactId');
      let newData = [...existing_contacts, ...contacts];
      newData = removeDuplicatesById(newData);
      setValue('contactId', newData);
      setLoading(false);
      setCategoryFilter('');
      toast.success(
        `Contacts with ${category.label} category added successfully!`,
      );
    }
  };

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      description: currentData?.description || '',
      status: currentData?.status || 'ACTIVE',
      contactId: currentData?.contacts || [],
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
    fetchFiltersData();
    setContactList(currentData?.contacts || []);
  }, [open]);

  useEffect(() => {
    setData(store.contacts);
  }, [store.contacts]);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const removeDuplicatesById = (array: any[]) => {
    const seen = new Set<number>();
    return array.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  };

  const onSubmit = async (data: any) => {
    try {
      let contactId = removeDuplicatesById(data.contactId);
      contactId = contactId.map((contact: any) => contact.id);
      const params = { ...data, contactId };
      setLoading(true);
      const response = addFlag
        ? await axios.post(`/contact-group/`, params)
        : await axios.patch(`/contact-group/${currentData.id}`, params);
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
          {addFlag ? 'Add' : 'Edit'} Contact Group
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
            name={'title'}
            label={'Title'}
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

          {open && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name={'contactId'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    autoHighlight={true}
                    options={data}
                    getOptionLabel={(option) => {
                      if (typeof option === 'object' && option !== null) {
                        const firstName = option.firstName
                          ? ` (${option.firstName})`
                          : '';
                        return `${option.phone}${firstName}`;
                      }
                      return '';
                    }}
                    value={contactList}
                    onChange={(e, newValue) => {
                      const value = removeDuplicatesById(newValue);
                      setContactList(value);
                      onChange(value);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        size="small"
                        label={'Contacts'}
                      />
                    )}
                  />
                )}
              />
              {errors.contactId && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.contactId as any).message}
                </FormHelperText>
              )}
            </FormControl>
          )}

          <Autocomplete
            disableCloseOnSelect
            loading={loading}
            autoHighlight={true}
            options={categoryList}
            getOptionLabel={(option) => {
              if (typeof option === 'object' && option !== null) {
                return `${option.label}`;
              }
              return '';
            }}
            value={categoryFilter}
            onChange={(e, newValue) => handleCategorySelected(newValue)}
            filterSelectedOptions={true}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                size="small"
                label={'Select contacts from type'}
              />
            )}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default GroupContactForm;
