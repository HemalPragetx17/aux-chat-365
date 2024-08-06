import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Popover,
  Theme,
  Tooltip,
  createFilterOptions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import { IconClock, IconPaperclip, IconSend } from '@tabler/icons-react';
import { convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import * as yup from 'yup';

import { useAuth } from '../../../hooks/useAuth';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import { sendEmail } from '../../../store/apps/chat/ChatSlice';
import axios from '../../../utils/axios';
import { TEXT_EDITOR_OPTIONS } from '../../../utils/constant';
import { CustomRichTextFieldWrapper } from '../../custom/CustomRichTextFieldWrapper';
import CustomTextField from '../../custom/CustomTextField';

import ChatTimeForm from './ChatTimeForm';

const ReactDraftWysiwyg = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  {
    ssr: false,
  },
);

interface chatType {
  selectedChat?: any;
}

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

const ChatEmailDrawer = (props: chatType) => {
  const theme = useTheme();
  const { selectedChat } = props;
  const dispatch = useDispatch();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const [messageValue, setMessageValue] = useState(EditorState.createEmpty());
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { sending } = useSelector((state) => state.chatReducer);
  const [emailList, setEmailList] = useState<any>([]);
  const [defaultValue, setDefaultValue] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const filter = createFilterOptions();
  const customizer = useSelector((state: AppState) => state.customizer);
  const [anchorScheduleForm, setAnchorScheduleForm] = useState<any>(null);
  const [scheduleTime, setScheduleTime] = useState<any>(null);
  const popoverRef4 = useRef(null);

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
      toEmail: selectedChat?.Contact?.email || '',
      fromEmail: '',
      emailSubject: '',
    }),
    [selectedChat],
  );

  useEffect(() => {
    fetchEmail();
    setFile(null);
  }, []);

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
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
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
        id: selectedChat?.id,
        isNylus,
        scheduleAt: Boolean(scheduleTime) ? scheduleTime.value : null,
      };
      await dispatch(sendEmail(payload));
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
    <Box height={350}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={smUp ? 'flex' : 'block'}>
          <Box
            sx={{
              mt: 0.5,
              px: 0.5,
              pb: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 0,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              width: '100%',
            }}
          >
            <Box>
              <InputLabel
                sx={{ mr: 1, fontSize: '0.875rem' }}
                htmlFor="email-to-input"
              >
                To:
              </InputLabel>
            </Box>
            <FormControl fullWidth sx={{ display: 'block' }}>
              <Controller
                name={'toEmail'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    id="email-to-input"
                    onChange={onChange}
                    variant="standard"
                    autoComplete="off"
                    placeholder={
                      Boolean(errors?.toEmail) &&
                      Boolean(errors?.toEmail?.message)
                        ? errors?.toEmail?.message
                        : ''
                    }
                    error={
                      Boolean(errors?.toEmail) &&
                      Boolean(errors?.toEmail?.message)
                    }
                    sx={{
                      borderRadius: '10px',
                      padding: '0px 10px',
                      background:
                        theme.palette.mode === 'dark' ? '#323441' : '#fff',
                      '& .MuiInput-root': {
                        py: 1,
                        '&:before, &:after': {
                          borderBottom: 'none !important',
                        },
                      },
                      '& .MuiInput-root.Mui-error': {
                        '&:before, &:after': {
                          borderBottom: '2px  solid red !important',
                        },
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Box
            sx={{
              mt: 0.5,
              px: 0.5,
              pb: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 0,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              width: '100%',
            }}
          >
            <Box>
              <InputLabel
                sx={{ mr: 1, fontSize: '0.875rem' }}
                htmlFor="email-from-input"
              >
                From:
              </InputLabel>
            </Box>
            <FormControl fullWidth>
              {isLoaded && (
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
                      variant="standard"
                      placeholder={
                        Boolean(errors?.fromEmail) &&
                        Boolean(errors?.fromEmail?.message)
                          ? errors?.fromEmail?.message
                          : ''
                      }
                      error={
                        Boolean(errors?.fromEmail) &&
                        Boolean(errors?.fromEmail?.message)
                      }
                      sx={{
                        borderRadius: '10px',
                        padding: '10px',
                        background:
                          theme.palette.mode === 'dark' ? '#323441' : '#fff',
                        '& .MuiInput-root': {
                          '&:before, &:after': {
                            borderBottom: 'none !important',
                          },
                        },
                        '& .MuiInput-root.Mui-error': {
                          '&:before, &:after': {
                            borderBottom: '2px  solid red !important',
                          },
                        },
                      }}
                    />
                  )}
                />
              )}
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 0.5,
            pb: 0.5,
            px: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 0,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            <InputLabel
              sx={{ mr: 1, fontSize: '0.875rem' }}
              htmlFor="email-to-input"
            >
              Subject:
            </InputLabel>
          </Box>
          <FormControl fullWidth>
            <Controller
              name={'emailSubject'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  variant="standard"
                  value={value}
                  id="email-to-input"
                  onChange={onChange}
                  autoComplete="off"
                  placeholder={
                    Boolean(errors?.emailSubject) &&
                    Boolean(errors?.emailSubject?.message)
                      ? errors?.emailSubject?.message
                      : ''
                  }
                  error={
                    Boolean(errors?.emailSubject) &&
                    Boolean(errors?.emailSubject?.message)
                  }
                  sx={{
                    borderRadius: '10px',
                    padding: '0px 10px',
                    background:
                      theme.palette.mode === 'dark' ? '#323441' : '#fff',
                    '& .MuiInput-root': {
                      py: 1,
                      '&:before, &:after': {
                        borderBottom: 'none !important',
                      },
                    },
                    '& .MuiInput-root.Mui-error': {
                      '&:before, &:after': {
                        borderBottom: '2px  solid red !important',
                      },
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Box>

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
              width: 'calc(100% - 4px)',
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

            <Tooltip title={'Schedule Email'} arrow>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setAnchorScheduleForm(e.currentTarget)
                }
                sx={{ padding: '4px' }}
                color={Boolean(scheduleTime?.time) ? 'primary' : 'default'}
              >
                <IconClock strokeWidth={'1.5'} />
              </IconButton>
            </Tooltip>
            <Popover
              id="long-menu"
              anchorEl={anchorScheduleForm}
              open={Boolean(anchorScheduleForm)}
              keepMounted
              onClose={() => setAnchorScheduleForm(null)}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
              ref={popoverRef4}
            >
              <SimpleBarReact
                style={{
                  maxHeight: 400,
                  width: 350,
                }}
              >
                <ChatTimeForm
                  currentData={scheduleTime}
                  success={(e: any) => {
                    setScheduleTime(e);
                    setAnchorScheduleForm(null);
                  }}
                />
              </SimpleBarReact>
            </Popover>

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
    </Box>
  );
};

export default ChatEmailDrawer;
