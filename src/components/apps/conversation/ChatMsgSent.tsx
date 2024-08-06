import { Icon } from '@iconify/react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { TabContext } from '@mui/lab';
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  Paper,
  Popover,
  Tab,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconLetterT,
  IconMoodSmile,
  IconPaperclip,
  IconSend,
  IconSparkles,
  IconTemplate,
  IconX,
} from '@tabler/icons-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

import head from '../../../../src/images/head.png';
import payment from '../../../../src/images/payment.png';
import transaction from '../../../../src/images/transaction.png';
import { useAuth } from '../../../hooks/useAuth';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import {
  clearAIResponse,
  fetchAIResponse,
  lockConversation,
  sendMessage,
  setLoading,
} from '../../../store/apps/chat/ChatSlice';
import axios from '../../../utils/axios';
import { PRIMARY_COLOR } from '../../../utils/constant';
import CustomTextField from '../../custom/CustomTextField';
import ContractTemplateDialog from '../contract-template/ContractTemplateDialog';
import CreateInvoice from '../create-invoice/CreateInvoice';
import VirtualTerminalForm from '../virtual-terminal/VirtualTerminalForm';

import ChatAIForm from './ChatAIForm';
import ChatCalendarForm from './ChatCalendarForm';
import ChatEmailDrawer from './ChatEmailDrawer';
import ChatPaymentForm from './ChatPaymentForm';
import ChatTimeForm from './ChatTimeForm';

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

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  paddingLeft: 20,
  minHeight: 'unset',
  '& .Mui-selected': {
    color: theme.palette.primary.main,
  },
  '& .MuiTab-root': {
    minHeight: 'unset',
    borderRadius: theme.shape.borderRadius,
  },
}));

const ChatMsgSent = (props: any) => {
  const { onTabChange } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [templateDialog, setTemplateDialog] = useState<boolean>(false);
  const { selectedChat, isNewChat, sending, aiResponse, aiLoading } =
    useSelector((state) => state.chatReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const { user, settings } = useAuth();
  const [anchorTemplate, setAnchorTemplate] = useState<any>(null);
  const [template, setTemplate] = useState<any>([]);
  const wrapperRef = useRef(null);
  const popoverRef1 = useRef(null);
  const popoverRef2 = useRef(null);
  const popoverRef3 = useRef(null);
  const popoverRef4 = useRef(null);
  const popoverRef5 = useRef(null);
  const popoverRef6 = useRef(null);
  const popoverRef7 = useRef(null);
  const fileInputRef = useRef(null);
  const [anchorPaymentFormOptions, setAnchorPaymentFormOptions] =
    useState<any>(null);
  const [anchorPaymentForm, setAnchorPaymentForm] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [anchorScheduleForm, setAnchorScheduleForm] = useState<any>(null);
  const [AIForm, setAIForm] = useState<any>(false);
  const [lockingProgress, setLockingProgress] = useState<boolean>(false);
  const [scheduleTime, setScheduleTime] = useState<any>(null);
  const [tabValue, setTabValue] = useState<string>('192');
  const [profileData, setProfileData] = useState<any>({});
  const [virtualTerminalFormOpen, setVirtualTerminalFormOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [disabledText, setDisabledText] = useState(false);
  const [aiModal, setAIModal] = useState<boolean>(false);
  const [aiTextSearch, setAITextSearch] = useState<string>('');
  const [calendarForm, setCalendarForm] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
    resetChatMsg();
  }, [user]);

  useEffect(() => {
    setAITextSearch('');
    setAIModal(false);
    setAIForm(false);
  }, [selectedChat]);

  const resetChatMsg = () => {
    const element = document.getElementById('msg_container');
    if (element) {
      (element as any).value = '';
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/users/${user?.uid}`);
      const profile = response.status === 200 ? response.data.data : {};
      setProfileData(profile);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTemplateList();
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const element = document.getElementById('msg_container');
    const message = (element as any)?.value;
    (element as any).value = message + emojiData.emoji;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !sending) {
      event.preventDefault();
      const element = document.getElementById('msg_container');
      if (Boolean((element as any)?.value) || Boolean(file)) {
        onChatMsgSubmit();
      }
    }
  };

  const fetchTemplateList = useCallback(async () => {
    try {
      const response = await axios.get(`/template?status=ACTIVE,INACTIVE`);
      const resp = response.status === 200 ? response.data.data : [];
      setTemplate(resp);
    } catch (e) {
      setTemplate([]);
    }
  }, []);

  const onChatMsgSubmit = () => {
    if (!disabledText && !file) {
      return false;
    }
    const element = document.getElementById('msg_container');
    const payload = {
      id: selectedChat?.id,
      to: Boolean(selectedChat.Contact)
        ? selectedChat.Contact?.phone
        : selectedChat?.to,
      from: selectedChat?.from,
      sender: user?.name as string,
      message: (element as any)?.value,
      file,
      mediaType: Boolean(file)
        ? file.type.startsWith('image/')
          ? 'image'
          : 'pdf'
        : '',
      scheduleAt: Boolean(scheduleTime) ? scheduleTime.value : null,
    };

    dispatch(sendMessage(payload));
    resetChatMsg();
    setFile(null);
    setScheduleTime(null);
  };

  const handleClickOutside = (event: any) => {
    if (
      (wrapperRef.current &&
        !(wrapperRef.current as any)?.contains(event.target)) ||
      (popoverRef1.current as any)?.contains(event.target) ||
      (popoverRef2.current as any)?.contains(event.target) ||
      (popoverRef3.current as any)?.contains(event.target) ||
      (popoverRef4.current as any)?.contains(event.target) ||
      (popoverRef5.current as any)?.contains(event.target) ||
      (popoverRef6.current as any)?.contains(event.target) ||
      (popoverRef7.current as any)?.contains(event.target)
    ) {
      handleChatLocking(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedChat, lockingProgress]);

  useEffect(() => {
    setTabValue('192');
  }, [selectedChat]);

  const handleChatLocking = async (lockedFlag: boolean) => {
    const { id, locked } = selectedChat;
    const apiFlag = !isNewChat && !lockingProgress;

    if (apiFlag && Boolean(locked?.status) !== lockedFlag) {
      setLockingProgress(true);
      const payload = !lockedFlag
        ? { locked: null }
        : {
            locked: {
              status: true,
              lockedBy: user?.uid,
              lockedName: user?.name,
            },
          };
      const response = await dispatch(lockConversation(payload, id));
      if (response) {
        setLockingProgress(false);
      }
    }
  };

  const handleMessageChange = () => {
    const element = document.getElementById('msg_container');
    const flag = Boolean((element as any)?.value?.trim());
    if (flag !== disabledText) {
      setDisabledText(!disabledText);
    }
  };

  const handleTemplateSelect = (text: string) => {
    const element = document.getElementById('msg_container');
    const message = (element as any)?.value;
    (element as any).value = message + text;
    handleMessageChange();
    setAnchorTemplate(null);
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    onTabChange(parseInt(newValue));
    resetChatMsg();
    setFile(null);
    setScheduleTime(null);
  };

  const handleVTSuccess = () => {
    setVirtualTerminalFormOpen(false);
  };

  const getAIResponse = (message: string) => {
    dispatch(fetchAIResponse({ message }));
  };

  const resetAIResponse = () => {
    setAIModal(false);
    dispatch(clearAIResponse());
    setAITextSearch('');
  };

  const handleKeyPressAIInput = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey && !sending) {
      event.preventDefault();
      const element = document.getElementById('ai_text_container');
      if (Boolean((element as any)?.value)) {
        getAIResponse((element as any)?.value);
      }
    }
  };

  return (
    <Box
      ref={wrapperRef}
      position={'relative'}
      sx={{
        background: theme.palette.mode === 'dark' ? '#373945' : '#fff',
      }}
    >
      {aiModal && (
        <Paper
          className="bubble"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#373945' : '#fff',
          }}
        >
          <SimpleBarReact
            style={{
              maxHeight: '60vh',
            }}
          >
            {aiLoading ? (
              <div className="ai-loader"></div>
            ) : (
              <>
                <CustomTextField
                  fullWidth
                  placeholder="Ask AI to write a response"
                  type="text"
                  id="ai_text_container"
                  onChange={(e: any) => {
                    setAITextSearch(e?.target?.value);
                  }}
                  onKeyDown={handleKeyPressAIInput}
                />
                {aiResponse && (
                  <>
                    {aiResponse?.text?.value?.startsWith('1.') ? (
                      aiResponse?.text?.value
                        ?.split('\n')
                        ?.map((res: any, ind: any) => (
                          <Typography
                            key={ind}
                            className="res-text"
                            sx={{
                              backgroundColor:
                                customizer?.activeMode === 'dark'
                                  ? '#616163'
                                  : '#f5efff',
                              ':hover': {
                                background:
                                  customizer?.activeMode === 'dark'
                                    ? '#333F55'
                                    : '#ecdfff',
                              },
                            }}
                            onClick={() => {
                              const element =
                                document.getElementById('msg_container');
                              if (element) {
                                const match = res.match(/^\d+\.\s*(.*)/);
                                (element as any).value = match
                                  ? match[1]
                                  : null;
                                resetAIResponse();
                                handleMessageChange();
                              }
                            }}
                          >
                            {res}
                          </Typography>
                        ))
                    ) : (
                      <Typography
                        className="res-text"
                        sx={{
                          backgroundColor:
                            customizer?.activeMode === 'dark'
                              ? '#373945'
                              : '#f5efff',
                          ':hover': {
                            background:
                              customizer?.activeMode === 'dark'
                                ? '#333F55'
                                : '#ecdfff',
                          },
                        }}
                        onClick={() => {
                          const element =
                            document.getElementById('msg_container');
                          if (element) {
                            (element as any).value = aiResponse?.text?.value;
                            resetAIResponse();
                          }
                        }}
                      >
                        {aiResponse?.text?.value}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </SimpleBarReact>
        </Paper>
      )}

      {selectedChat?.locked?.status &&
      selectedChat?.locked?.lockedBy !== user?.uid ? (
        <Typography variant="h5" p={2} color={PRIMARY_COLOR}>
          Conversation is locked by {selectedChat?.locked?.lockedName}.
          {user?.role.role === 'ADMIN' && (
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={() => {
                dispatch(setLoading(true));
                handleChatLocking(false);
              }}
            >
              Unlock Now
            </Button>
          )}
        </Typography>
      ) : (
        <>
          <TabContext value={tabValue}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                padding: '6px 10px 0 10px',
                '.Mui-selected': {
                  background:
                    customizer?.activeMode === 'dark' ? '#323441' : '#eeeeee',
                  color: customizer?.activeMode === 'dark' ? 'white' : 'black',
                },
              }}
            >
              <Tab
                icon={<DescriptionOutlinedIcon />}
                iconPosition="start"
                disableRipple
                label={'SMS'}
                value={'192'}
                sx={{
                  border:
                    customizer?.activeMode === 'dark'
                      ? '2px solid #323441'
                      : '2px solid white',
                  borderadius: '7px 7px 0 0',
                  borderBottom: 'none',
                  marginRight: '2px',
                }}
                style={{
                  color: customizer?.activeMode === 'dark' ? 'white' : '',
                }}
              />
              {!isNewChat && (
                <Tab
                  icon={<EmailOutlinedIcon />}
                  iconPosition="start"
                  disableRipple
                  label={'EMAIL'}
                  value={'415'}
                  sx={{
                    border:
                      customizer?.activeMode === 'dark'
                        ? '2px solid #323441'
                        : '2px solid white',
                    borderadius: '7px 7px 0 0',
                    borderBottom: 'none',
                  }}
                  style={{
                    color: customizer?.activeMode === 'dark' ? 'white' : '',
                  }}
                />
              )}
            </TabList>
          </TabContext>
          {tabValue === '192' ? (
            <Box
              height={150}
              p={'10px'}
              sx={{
                background:
                  customizer?.activeMode === 'dark'
                    ? 'inherit'
                    : '#f5f5f5 !important',
              }}
            >
              <form onSubmit={onChatMsgSubmit}>
                <FormControl fullWidth>
                  <CustomTextField
                    fullWidth
                    onClick={() => {
                      handleChatLocking(true);
                    }}
                    variant="outlined"
                    placeholder="Type a Message"
                    autoComplete="off"
                    type="text"
                    multiline
                    rows={3}
                    id="msg_container"
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>

                <Box display={'flex'} justifyContent={'space-between'}>
                  <Box display={'flex'}>
                    {/* Contract Button */}
                    {settings?.configuration?.Contract && (
                      <Tooltip title={'Contracts'} arrow>
                        <IconButton
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                            setTemplateDialog(true)
                          }
                          sx={{ padding: '4px' }}
                        >
                          <IconTemplate strokeWidth={'1.5'} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <ContractTemplateDialog
                      open={templateDialog}
                      toggle={() => setTemplateDialog(false)}
                      selectedChat={selectedChat}
                    />

                    {/* Template Button */}
                    <Tooltip title={'Template'} arrow>
                      <IconButton
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          setAnchorTemplate(e.currentTarget)
                        }
                        sx={{ padding: '4px' }}
                        color={Boolean(anchorTemplate) ? 'primary' : 'default'}
                      >
                        <IconLetterT strokeWidth={'1.5'} />
                      </IconButton>
                    </Tooltip>
                    <Popover
                      id="long-menu"
                      anchorEl={anchorTemplate}
                      open={Boolean(anchorTemplate)}
                      keepMounted
                      onClose={() => setAnchorTemplate(null)}
                      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                      transformOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom',
                      }}
                      ref={popoverRef2}
                    >
                      <>
                        <SimpleBarReact
                          style={{
                            maxHeight: 400,
                            width: 350,
                            padding: '10px',
                          }}
                        >
                          {template.map((data: any, index: number) => (
                            <Box
                              key={index}
                              sx={{
                                backgroundColor: '#8A2BE2',
                                padding: 1,
                                marginBottom: '5px',
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleTemplateSelect(data.description)
                              }
                            >
                              <Typography variant="caption">
                                {data.title}
                              </Typography>
                              <Typography>{data.description}</Typography>
                            </Box>
                          ))}
                        </SimpleBarReact>
                        <Typography
                          component={Link}
                          href={'/features/templates'}
                          paddingX={1}
                          color={'text.primary'}
                        >
                          Go to Templates Settings
                        </Typography>
                      </>
                    </Popover>

                    {/* Payment Form Button */}
                    {settings?.configuration?.AuxVault && (
                      <Tooltip title={'Payments'} arrow>
                        <IconButton
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                            setAnchorPaymentFormOptions(e.currentTarget)
                          }
                          sx={{ padding: '4px' }}
                          color={
                            Boolean(anchorPaymentFormOptions)
                              ? 'primary'
                              : 'default'
                          }
                        >
                          <IconCurrencyDollar strokeWidth={'1.5'} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Popover
                      id="long-menu"
                      anchorEl={anchorPaymentFormOptions}
                      open={Boolean(anchorPaymentFormOptions)}
                      keepMounted
                      onClose={() => setAnchorPaymentFormOptions(null)}
                      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                      transformOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom',
                      }}
                      ref={popoverRef5}
                    >
                      <SimpleBarReact
                        style={{
                          maxHeight: 400,
                          width: 350,
                          background: '#32343e',
                          padding: '15px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'left',
                            textAlign: 'left',
                            alignItems: 'left',
                          }}
                        >
                          <Typography
                            style={{
                              color: 'white',
                              padding: '10px 20px',
                              fontSize: '30px',
                              marginBottom: '20px',
                            }}
                          >
                            {' '}
                            $ Payment
                            <IconButton
                              size="small"
                              sx={{
                                borderRadius: 1,
                                color: 'black',
                                backgroundColor: 'white',
                              }}
                              style={{
                                background: 'white',
                                borderRadius: '50px',
                                position: 'absolute',
                                right: '25px',
                                zIndex: '1',
                                top: '20px',
                              }}
                              onClick={() => setAnchorPaymentFormOptions(null)}
                            >
                              <IconX />
                            </IconButton>
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              marginBottom: '5px',
                              background: '#2d2f3a',
                              display: 'flex',
                              justifyContent: 'left',
                              gap: '10px',
                            }}
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              setAnchorPaymentForm(anchorPaymentFormOptions);
                              setAnchorPaymentFormOptions(null);
                            }}
                          >
                            <Image
                              src={transaction}
                              width={25}
                              height={25}
                              alt="payment"
                            />{' '}
                            Create Payment Link
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              marginBottom: '5px',
                              background: '#2d2f3a',
                              display: 'flex',
                              justifyContent: 'left',
                              gap: '10px',
                            }}
                            onClick={() => {
                              setAnchorPaymentFormOptions(null);
                              setCreateInvoiceOpen(true);
                            }}
                          >
                            <Image
                              src={payment}
                              width={25}
                              height={25}
                              alt="payment"
                            />{' '}
                            Create Invoice
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              marginBottom: '5px',
                              background: '#2d2f3a',
                              display: 'flex',
                              justifyContent: 'left',
                              gap: '10px',
                            }}
                            onClick={() => {
                              setAnchorPaymentFormOptions(null);
                              setVirtualTerminalFormOpen(true);
                            }}
                          >
                            <Image
                              src={head}
                              width={25}
                              height={25}
                              alt="payment"
                            />{' '}
                            Take Payment Now (VT)
                          </Button>
                        </Box>
                      </SimpleBarReact>
                    </Popover>
                    <VirtualTerminalForm
                      toggle={() =>
                        setVirtualTerminalFormOpen(!virtualTerminalFormOpen)
                      }
                      success={handleVTSuccess}
                      open={virtualTerminalFormOpen}
                      profileData={profileData}
                    />
                    <CreateInvoice
                      toggle={() => setCreateInvoiceOpen(!createInvoiceOpen)}
                      open={createInvoiceOpen}
                      profileData={profileData}
                    />
                    <Popover
                      id="long-menu"
                      anchorEl={anchorPaymentForm}
                      open={Boolean(anchorPaymentForm)}
                      keepMounted
                      onClose={() => setAnchorPaymentForm(null)}
                      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                      transformOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom',
                      }}
                      PaperProps={{ style: { borderTopRightRadius: '10%' } }}
                      ref={popoverRef3}
                    >
                      <SimpleBarReact
                        style={{
                          width: 350,
                          maxHeight: 450,
                        }}
                      >
                        <ChatPaymentForm
                          success={() => setAnchorPaymentForm(null)}
                          selectedChat={selectedChat}
                          sender={user?.name as string}
                          paymentFormOptionValue={'1'}
                          open={Boolean(anchorPaymentForm)}
                        />
                      </SimpleBarReact>
                    </Popover>

                    {/* Schedule Message Button */}
                    <Tooltip title={'Schedule Message'} arrow>
                      <IconButton
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          setAnchorScheduleForm(e.currentTarget)
                        }
                        sx={{ padding: '4px' }}
                        color={
                          Boolean(scheduleTime?.time) ? 'primary' : 'default'
                        }
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
                      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                      transformOrigin={{
                        horizontal: 'center',
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

                    {settings?.configuration?.OpenAI && (
                      <>
                        {/* AI Button */}
                        <Tooltip title={'AI Help'} arrow>
                          <IconButton
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              if (aiModal) {
                                resetAIResponse();
                              } else {
                                const element =
                                  document.getElementById('msg_container');
                                const message = (element as any)?.value;
                                if (message) {
                                  getAIResponse(message);
                                  setAITextSearch(message);
                                }
                                setAIModal(true);
                                setAIForm(null);
                              }
                            }}
                            sx={{ padding: '4px' }}
                            color={Boolean(aiModal) ? 'primary' : 'default'}
                          >
                            <Icon
                              icon={'tabler:ai'}
                              strokeWidth={2}
                              width={32}
                              height={32}
                            />
                          </IconButton>
                        </Tooltip>

                        {/* AI Tone Button */}
                        <Tooltip title={'AI Tone'} arrow>
                          <IconButton
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              setAIForm(e.currentTarget);
                              setAIModal(false);
                            }}
                            sx={{ padding: '4px' }}
                            color={Boolean(AIForm) ? 'primary' : 'default'}
                          >
                            <IconSparkles strokeWidth={'1.5'} />
                          </IconButton>
                        </Tooltip>
                        <Popover
                          id="long-menu"
                          anchorEl={AIForm}
                          open={Boolean(AIForm)}
                          keepMounted
                          onClose={() => setAIForm(null)}
                          anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'top',
                          }}
                          transformOrigin={{
                            horizontal: 'center',
                            vertical: 'bottom',
                          }}
                          ref={popoverRef6}
                        >
                          <SimpleBarReact
                            style={{
                              width: 550,
                              maxHeight: 470,
                            }}
                          >
                            <ChatAIForm
                              open={AIForm}
                              setAITextSearch={setAITextSearch}
                              aiTextSearch={aiTextSearch}
                              onSuccess={() => {
                                setAIForm(null);
                                var element =
                                  document.getElementById('msg_container');
                                if (element) {
                                  (element as any).value = aiTextSearch;
                                  handleMessageChange();
                                }
                              }}
                            />
                          </SimpleBarReact>
                        </Popover>
                      </>
                    )}

                    {/* Calendar Schedule Button */}
                    <Tooltip title={'Event'} arrow>
                      <IconButton
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          setCalendarForm(e.currentTarget);
                        }}
                        sx={{ padding: '4px' }}
                        color={Boolean(calendarForm) ? 'primary' : 'default'}
                      >
                        <IconCalendar strokeWidth={'1.5'} />
                      </IconButton>
                    </Tooltip>
                    <Popover
                      id="long-menu"
                      anchorEl={calendarForm}
                      open={Boolean(calendarForm)}
                      keepMounted
                      onClose={() => setCalendarForm(null)}
                      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                      transformOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom',
                      }}
                      ref={popoverRef7}
                    >
                      <SimpleBarReact
                        style={{
                          width: 350,
                          maxHeight: 420,
                        }}
                      >
                        <ChatCalendarForm
                          open={calendarForm}
                          success={() => setCalendarForm(null)}
                          selectedChat={selectedChat}
                          sender={user?.name as string}
                        />
                      </SimpleBarReact>
                    </Popover>
                  </Box>

                  <Box display={'flex'}>
                    {/* Emoji Button */}
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls="long-menu"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        setAnchorEl(e.currentTarget)
                      }
                      sx={{ padding: '4px' }}
                    >
                      <IconMoodSmile strokeWidth={'1.5'} />
                    </IconButton>
                    <Popover
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      keepMounted
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                      transformOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom',
                      }}
                      ref={popoverRef1}
                    >
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </Popover>

                    {/* File Button*/}

                    <Button
                      component="label"
                      variant="text"
                      sx={{
                        padding: 0,
                        minWidth: 36,
                        color: 'rgba(0,0,0,0.55)',
                      }}
                    >
                      <IconPaperclip
                        strokeWidth={'1.5'}
                        color={
                          Boolean(file)
                            ? PRIMARY_COLOR
                            : customizer?.activeMode === 'light'
                            ? 'currentColor'
                            : '#fff'
                        }
                      />
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
                        sx={{ marginTop: '2px' }}
                        label={`${file.name} (${
                          Math.round(file.size / 100) / 10 > 1000
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(
                                1,
                              )} mb`
                            : `${(Math.round(file.size / 100) / 10).toFixed(
                                1,
                              )} kb`
                        })`}
                        onDelete={() => setFile(null)}
                      />
                    )}

                    {/* Send Message Button */}
                    {sending ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress
                          color="primary"
                          sx={{
                            height: '20px !important',
                            width: '20px !important',
                            marginRight: 1,
                            marginTop: 0.5,
                          }}
                        />
                      </Box>
                    ) : (
                      <IconButton
                        aria-label="send"
                        onClick={onChatMsgSubmit}
                        disabled={!disabledText && !file}
                      >
                        <IconSend strokeWidth={'1.5'} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </form>
            </Box>
          ) : (
            <ChatEmailDrawer selectedChat={selectedChat} />
          )}
        </>
      )}
    </Box>
  );
};

export default ChatMsgSent;
