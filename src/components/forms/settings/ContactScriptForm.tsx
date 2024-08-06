import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Drawer,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  IconDeviceMobile,
  IconMessageCircle,
  IconQuote,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { PRIMARY_COLOR } from '../../../utils/constant';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
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

const uniqueId = Date.parse(new Date().toString());
const urlRegex =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const didScript = `<script id="auxScript" data-id="${uniqueId}" data-url="${process.env.HOST_API_URL}" src="https://auxchat.aux-developer.com/webscript/did.js"></script>`;
const departmentScript = `<script id="auxScript" data-id="${uniqueId}" data-url="${process.env.HOST_API_URL}" src="https://auxchat.aux-developer.com/webscript/departments.js"></script>`;

const ContactScriptForm = (props: FormType) => {
  const [didList, setDidList] = useState<any>([]);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>('1');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departmentMessage, setDepartmentMessage] = useState<string[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { open, toggle, currentData, addFlag, success } = props;

  const schema = yup.object().shape({
    website_name: yup
      .string()
      .required('Website Name is required field')
      .max(30, 'Max Length is 30 characters'),
    website_url: yup
      .string()
      .required('Website URL is required field')
      .matches(urlRegex, 'Invalid URL'),
    termsandconditions_url: yup
      .string()
      .required('Terms and Conditions URL is required field')
      .matches(urlRegex, 'Invalid URL'),
    description: yup.string().max(500, 'Max Length is 500 characters'),
    department: yup.string().required('Please Select a Type'),
    did: yup.string().when('department', {
      is: (val: string) => val === 'did',
      then: () => yup.string().required('Please select a DID'),
      otherwise: () => yup.string().nullable(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      website_name: currentData?.website_name || '',
      website_url: currentData?.website_url || '',
      termsandconditions_url: currentData?.termsandconditions_url || '',
      bubble_icon: currentData?.bubble_icon || '1',
      did: currentData?.did || '',
      uniqueId: currentData?.uniqueId || uniqueId,
      department: currentData?.department || '',
      description: currentData?.description || '',
      color: currentData?.color || PRIMARY_COLOR,
      script: currentData?.script || '',
    }),
    [currentData],
  );

  useEffect(() => {
    fetchDid();
    reset(defaultValues);
  }, [open]);

  const fetchDid = useCallback(async () => {
    const response = await axios.get(`/did/user/${user?.uid}?status=ACTIVE`);
    let did = response.status === 200 ? response.data.data : [];
    let department = did.filter((data: any) => Boolean(data.Department));
    department = department.map((dept: any) => {
      return `${dept.phoneNumber} - ${dept.Department.name}`;
    });
    did = did.map((data: any) => {
      return {
        label: `${data.phoneNumber} ${data.title}`,
        value: data.id,
      };
    });
    setDidList(did);
    setDepartmentList(department);
  }, []);

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

  const onSubmit = async (data: any) => {
    try {
      console.log;
      setLoading(true);
      const response = Boolean(currentData?.id)
        ? await axios.patch(`/contact-script/${currentData.id}`, data)
        : await axios.post(`/contact-script`, data);
      setLoading(false);
      if (response.status === 200) {
        success();
        reset();
        toast.success('Success!');
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  useEffect(() => {
    setSelectedIcon(watchForm?.bubble_icon);
  }, [watchForm?.bubble_icon]);

  useEffect(() => {
    const { department } = watchForm;
    if (department !== 'did') {
      setValue('did', null);
    }
    setSelectedDepartment(department);
    setDepartmentMessage(departmentList);
    if (addFlag) {
      setValue('script', department === 'did' ? didScript : departmentScript);
    }
  }, [watchForm?.department]);

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
          {addFlag ? 'Create' : 'Update'} Contact Script
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
            name={'website_name'}
            label={'Website Name'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'website_url'}
            label={'Website URL'}
            errors={errors}
            control={control}
          />

          <CustomFormText
            name={'termsandconditions_url'}
            label={'Website Terms and Conditions URL'}
            errors={errors}
            control={control}
          />

          <Box sx={{ mb: 4 }}>
            Bubble Icon
            <IconButton
              sx={{ ml: 2 }}
              onClick={() => setValue('bubble_icon', '1')}
            >
              <IconQuote
                color={selectedIcon === '1' ? PRIMARY_COLOR : 'currentColor'}
              />
            </IconButton>
            <IconButton onClick={() => setValue('bubble_icon', '2')}>
              <IconMessageCircle
                color={selectedIcon === '2' ? PRIMARY_COLOR : 'currentColor'}
              />
            </IconButton>
            <IconButton onClick={() => setValue('bubble_icon', '3')}>
              <IconDeviceMobile
                color={selectedIcon === '3' ? PRIMARY_COLOR : 'currentColor'}
              />
            </IconButton>
          </Box>

          <FormControl
            fullWidth
            sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}
          >
            <label htmlFor="color">Chat-Bot Color:</label>
            <Controller
              name="color"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <input
                  style={{ width: 100, marginLeft: 10 }}
                  type="color"
                  id="color"
                  name="color"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>

          <CustomFormTextArea
            name={'description'}
            label={'Chatboat Description'}
            rows={4}
            errors={errors}
            control={control}
          />

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="department"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  name="department"
                  value={value}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="department"
                    label="Department"
                    control={<Radio disabled={!addFlag} />}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="did"
                    label="Single DID"
                    control={<Radio disabled={!addFlag} />}
                    sx={{ mr: 2 }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          {selectedDepartment === 'did' && (
            <CustomFormSelect
              name={'did'}
              label={'Select DID'}
              options={didList}
              errors={errors}
              control={control}
            />
          )}

          {selectedDepartment === 'department' && (
            <Alert icon={false} severity={'success'}>
              {departmentMessage.map((msg: string, index: number) => (
                <p key={index}>{msg}</p>
              ))}
            </Alert>
          )}

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default ContactScriptForm;
