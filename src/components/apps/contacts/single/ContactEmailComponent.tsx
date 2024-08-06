import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  createFilterOptions,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import { IconPaperclip, IconSend } from '@tabler/icons-react';
import { convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import 'simplebar/src/simplebar.css';
import * as yup from 'yup';
import { useAuth } from '../../../../hooks/useAuth';
import { sendEmail } from '../../../../store/apps/chat/ChatSlice';
import { dispatch, useSelector } from '../../../../store/Store';
import axios from '../../../../utils/axios';
import { TEXT_EDITOR_OPTIONS } from '../../../../utils/constant';
import CustomCloseButton from '../../../custom/CustomCloseButton';
import { CustomRichTextFieldWrapper } from '../../../custom/CustomRichTextFieldWrapper';
import CustomTextField from '../../../custom/CustomTextField';

const ReactDraftWysiwyg = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  {
    ssr: false,
  },
);

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

const ContactEmailComponent = (props: any) => {
  const theme = useTheme();
  const { open, toggle } = props;
  const [messageValue, setMessageValue] = useState(EditorState.createEmpty());
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef(null);
  const { sending } = useSelector((state) => state.chatReducer);
  const store = useSelector((state) => state.contactsReducer);
  const { user } = useAuth();
  const [emailList, setEmailList] = useState<any>([]);
  const [defaultValue, setDefaultValue] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const filter = createFilterOptions();

  const schema = yup.object().shape({
    toEmail: yup
      .string()
      .email('Enter Valid Email Address')
      .required('To Email Required'),
    fromEmail: yup
      .string()
      .email('Enter Valid Email Address')
      .required('From Email Required'),
    emailSubject: yup.string().required('Please enter a subject'),
  });

  const defaultValues = useMemo(
    () => ({
      toEmail: store.currentData?.email || '',
      fromEmail: '',
      emailSubject: '',
    }),
    [store.currentData],
  );

  useEffect(() => {
    if (open) {
      fetchEmail();
      setFile(null);
      reset(defaultValues);
    }
  }, [open]);

  const fetchEmail = useCallback(async () => {
    const response = await axios.get(`/email-nylas`);
    const list = response.status === 200 ? response.data.data : [];
    const _emailList = list.map((data: any) => data.email);
    setEmailList(_emailList);
    const defaultEmail = list.find((data: any) => data.isDefault === true);
    if (defaultEmail) {
      setValue('fromEmail', defaultEmail.email, {
        shouldValidate: true,
      });
      setDefaultValue(defaultEmail.email);
    }
    setIsLoaded(true);
  }, [store.currentData]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const message = convertToHTML(messageValue.getCurrentContent());
      const { fromEmail } = data;
      const isNylus = emailList.indexOf(fromEmail) > -1;
      const payload = {
        ...data,
        emailBody: message,
        sender: user?.name as string,
        file,
        isNylus,
        scheduleAt: null,
      };
      await dispatch(sendEmail(payload));
      toggle();
    } catch (error) {
      toast.error('API Error! Please try again.');
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isValid =
        file.type.startsWith('image/') ||
        file.type.startsWith('application/pdf');
      if (isValid) {
        setFile(file);
      } else {
        toast.error('Only Image or PDF Files allowed');
        (fileInputRef as any).current.value = '';
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', maxHeight: 800 } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'toEmail'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  autoComplete="off"
                  label="To"
                  size="small"
                  error={Boolean(errors.toEmail)}
                />
              )}
            />
            {errors.toEmail && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.toEmail as any).message}
              </FormHelperText>
            )}
          </FormControl>

          {isLoaded && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name={'fromEmail'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={emailList}
                    freeSolo
                    clearOnBlur
                    autoHighlight={true}
                    getOptionLabel={(option: any) => option}
                    defaultValue={defaultValue}
                    onChange={(e, newValue: any) => {
                      setDefaultValue(newValue);
                      setValue('fromEmail', newValue, {
                        shouldValidate: true,
                      });
                    }}
                    filterOptions={(options: any[], params: any) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      const isExisting = options.some(
                        (option: any) => inputValue === option,
                      );
                      if (inputValue !== '' && !isExisting) {
                        filtered.push(inputValue);
                      }
                      return filtered;
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="From"
                        error={Boolean(errors.fromEmail)}
                      />
                    )}
                  />
                )}
              />
              {errors.fromEmail && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.fromEmail as any).message}
                </FormHelperText>
              )}
            </FormControl>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name={'emailSubject'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  variant="outlined"
                  autoComplete="off"
                  label="Subject"
                  error={Boolean(errors.emailSubject)}
                  size="small"
                />
              )}
            />
            {errors.emailSubject && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.emailSubject as any).message}
              </FormHelperText>
            )}
          </FormControl>

          <CustomRichTextFieldWrapper
            sx={{
              mt: 0.5,
              '& .rdw-editor-main': {
                borderRadius: '10px',
                padding: '10px',
                background: theme.palette.mode === 'dark' ? '#323441' : '#fff',
              },
              '& .rdw-editor-wrapper .rdw-editor-main': { px: 0.5 },
              '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 },
              '& .rdw-editor-wrapper': {
                width: '100%',
              },
            }}
          >
            <ReactDraftWysiwyg
              editorState={messageValue}
              onEditorStateChange={(editorState) => {
                setMessageValue(editorState);
              }}
              toolbar={TEXT_EDITOR_OPTIONS}
            />
          </CustomRichTextFieldWrapper>

          <Box
            sx={{
              py: 1,
              px: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LoadingButton
                variant="contained"
                loading={sending}
                type="submit"
                sx={{
                  '& svg': { mr: 1 },
                }}
              >
                <IconSend />
                Send
              </LoadingButton>

              <Button
                component="label"
                variant="text"
                sx={{
                  padding: 0,
                  minWidth: 36,
                }}
              >
                <IconPaperclip strokeWidth={'1.5'} />
                <VisuallyHiddenInput
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                />
              </Button>
              {Boolean(file) && (
                <Chip
                  label={`${file.name} (${
                    Math.round(file.size / 100) / 10 > 1000
                      ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                      : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`
                  })`}
                  onDelete={() => setFile(null)}
                />
              )}
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactEmailComponent;
