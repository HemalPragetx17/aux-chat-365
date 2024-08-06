import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  IconBrandWechat,
  IconInfoCircle,
  IconMaximize,
  IconMenu2,
} from '@tabler/icons-react';
import { FC, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import swal from 'sweetalert';

import { useAuth } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../store/Store';
import {
  deleteMessage,
  fetchAudioFileTranscribe,
  fetchRemainingMessages,
  fetchTextTranscribe,
  saveTranscribe,
  setLoading,
  setMessageScroll,
} from '../../../store/apps/chat/ChatSlice';
import { getOperatorList } from '../../../store/apps/user/UserSlice';
import { ChatsType } from '../../../types/apps/chat';
import {
  getChatHeadMain,
  processPhoneNumber,
} from '../../../utils/conversation';
import CustomUserDetailsMenu from '../../custom/CustomUserDetailsMenu';

import CallUserButton from './CallUserButton';
import ChatInsideSidebar from './ChatInsideSidebar';
import ChatMessageComponent from './ChatMessageComponent';
import ChatMsgSent from './ChatMsgSent';

interface ChatContentProps {
  toggleChatSidebar: () => void;
}
type AppState = {
  customizer: any;
};

const ChatContent: FC<ChatContentProps> = ({ toggleChatSidebar }: any) => {
  const dispatch = useDispatch();
  const { selectedChat, isNewChat, scrollNotes, scrollMessage } = useSelector(
    (state) => state.chatReducer,
  );
  const customizer = useSelector((state: AppState) => state.customizer);
  const rightContainer = useRef(null);
  const chatContainer = useRef(null);
  const notesContainer = useRef(null);
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const { user } = useAuth();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const [formHeight, setFormHeight] = useState<number>(192);
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(true);
  const [topReached, setTopReached] = useState<boolean>(false);

  useEffect(() => {
    fetchOperatorList();
  }, []);

  useEffect(() => {
    handleAdjsutContainerHeight(192);
    if (chatContainer?.current) {
      (chatContainer?.current as any).scrollTop = (
        chatContainer?.current as any
      )?.scrollHeight;
    }
    const toggle_flag = localStorage.getItem('toggle_flag');
    if (toggle_flag === null) {
      localStorage.setItem('toggle_flag', 'true');
    }
    if (toggle_flag === 'false') {
      setSidebarToggle(false);
    }
    if (isNewChat) {
      setSidebarToggle(true);
    }

    if (scrollMessage) {
      const element = document?.getElementById(scrollMessage);
      if (element) {
        setTimeout(() => {
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
      }
      dispatch(setMessageScroll(false));
    }
  }, [selectedChat, scrollMessage]);

  const fetchOperatorList = () => {
    dispatch(getOperatorList());
  };

  useEffect(() => {
    setTopReached(false);
  }, [selectedChat?.id]);

  useEffect(() => {
    handleAdjsutContainerHeight(formHeight);
  }, [(rightContainer?.current as any)?.offsetHeight]);

  const handleAdjsutContainerHeight = (height: number) => {
    const parentHeight = (rightContainer?.current as any)?.offsetHeight;
    setContainerHeight(parentHeight - (62 + height));
    setFormHeight(height);
  };

  const handleToggleContact = async () => {};

  const handleAudioFileTranscibe = (message: any) => {
    console.log(message);
    const { callDetails } = message;
    const { call_type } = callDetails;
    const talk_duration = Boolean(callDetails.talk_duration)
      ? parseInt(callDetails?.talk_duration)
      : 0;
    if (!Boolean(talk_duration) || call_type === 'missed_calls') {
      toast.error('There is no recording in for this call');
      return false;
    }
    dispatch(
      fetchAudioFileTranscribe({ file: message?.media }, selectedChat, message),
    );
  };

  const handleTextTranscribe = (message: any) => {
    dispatch(
      fetchTextTranscribe({ message: message?.message }, selectedChat, message),
    );
  };

  const handleSaveTranscribe = (message: any) => {
    dispatch(
      saveTranscribe(
        { transcribeMessage: message?.transcribeMessage },
        selectedChat,
        message,
      ),
    );
  };

  const handleMessageDelete = async (id: string) => {
    const chat = selectedChat;
    if (chat?.locked?.status && chat?.locked?.lockedBy !== user?.uid) {
      toast.error('Cannot delete locked conversation');
    } else {
      const willDelete = await swal({
        title: 'Are you sure?',
        closeOnClickOutside: false,
        closeOnEsc: false,
        icon: 'warning',
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: '',
            closeModal: true,
          },
          confirm: {
            text: 'OK',
            value: true,
            visible: true,
            className: 'MuiButton-root',
            closeModal: true,
          },
        },
        dangerMode: true,
      });
      if (willDelete) {
        dispatch(deleteMessage(id));
      }
    }
  };

  const handleScroll = () => {
    const node = chatContainer.current as any;
    if (
      parseInt(node?.scrollTop) < 5 &&
      selectedChat.Message.length > 9 &&
      !topReached
    ) {
      setTopReached(true);
    }
  };

  useEffect(() => {
    if (chatContainer?.current) {
      const div = chatContainer?.current as any;
      div?.addEventListener('scroll', handleScroll);
    }
  }, [selectedChat, chatContainer]);

  useEffect(() => {
    const messagePagination = async () => {
      const { id, Message } = selectedChat;
      const oldScrollHeight = (chatContainer?.current as any)?.scrollHeight;
      const response = await dispatch(
        fetchRemainingMessages(id, Message.length),
      );
      const newScrollHeight = (chatContainer?.current as any)?.scrollHeight;
      (chatContainer?.current as any).scrollTop =
        newScrollHeight - oldScrollHeight;
      dispatch(setLoading(false));
      if (response && response.length > 0 && response.length === 50) {
        setTopReached(false);
      }
    };

    if (topReached) {
      messagePagination();
    }
  }, [topReached]);

  return (
    <div style={{ height: '100%' }} ref={rightContainer}>
      {selectedChat ? (
        <>
          <Box
            display="flex"
            alignItems="center"
            paddingX={2}
            height={60}
            borderRadius={0}
          >
            <Box
              sx={{
                display: {
                  xs: 'block',
                  md: 'block',
                  lg: 'none',
                },
                mr: '10px',
              }}
            >
              <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
            </Box>
            <ListItem key={selectedChat?.id} dense disableGutters>
              <ListItemAvatar>
                <Avatar
                  alt={selectedChat?.to}
                  src={
                    selectedChat?.Contact?.image?.src ||
                    '/images/profile/thumb.png'
                  }
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography variant="h6">
                      {getChatHeadMain(selectedChat)}
                    </Typography>
                    <Box display={'flex'} alignItems={'center'} mt={0.5}>
                      <Typography
                        variant="caption"
                        display={'flex'}
                        alignItems={'center'}
                      >
                        {processPhoneNumber(selectedChat?.from)} (
                        {selectedChat?.Did?.title}) &nbsp;
                        {selectedChat?.lastMessageDirection === 'OUTBOUND' ? (
                          <>→</>
                        ) : (
                          <>←</>
                        )}
                        &nbsp;{processPhoneNumber(selectedChat?.to)}
                      </Typography>
                    </Box>
                  </>
                }
              />
            </ListItem>

            {!isNewChat && (
              <Stack direction={'row'} sx={{ marginRight: '40px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {selectedChat?.Contact?.isShared && (
                    <CustomUserDetailsMenu
                      name="Add Note"
                      imageIcon={
                        <IconInfoCircle
                          color={
                            customizer?.activeMode === 'light'
                              ? 'black'
                              : 'white'
                          }
                          stroke={1}
                        />
                      }
                      selectedChat={selectedChat}
                      menuProps={{ sx: { mt: 2 } }}
                      imageIconStyle={{}}
                    />
                  )}
                  <CallUserButton
                    name="Call User"
                    selectedChat={selectedChat}
                  />
                </Box>
                <IconButton
                  aria-haspopup="true"
                  onClick={() => {
                    let toggle_flag: any =
                      localStorage.getItem('toggle_flag') === 'true';
                    toggle_flag = !toggle_flag;
                    localStorage.setItem('toggle_flag', toggle_flag.toString());
                    setSidebarToggle(toggle_flag);
                  }}
                >
                  <IconMaximize
                    color={
                      customizer?.activeMode === 'light' ? 'black' : 'white'
                    }
                    stroke={1}
                  />
                </IconButton>
              </Stack>
            )}
          </Box>
          <Divider />
          <Box
            display={'flex'}
            maxHeight={containerHeight}
            height={containerHeight}
            width={'100%'}
          >
            <SimpleBarReact
              style={{
                maxHeight: '100%',
                width: lgUp && sidebarToggle ? 'calc(100% - 280px)' : '100%',
                display: 'flex',
              }}
              scrollableNodeProps={{ ref: chatContainer }}
            >
              <Box p={3} width="100%">
                {(selectedChat as ChatsType)?.Message?.map((message, index) => {
                  return (
                    <ChatMessageComponent
                      key={index}
                      message={message}
                      onDelete={handleMessageDelete}
                      onAudioFileTranscribe={handleAudioFileTranscibe}
                      onTextTranscribe={handleTextTranscribe}
                      onSaveTranscribe={handleSaveTranscribe}
                    />
                  );
                })}
              </Box>
            </SimpleBarReact>
            <SimpleBarReact
              scrollableNodeProps={{ ref: notesContainer }}
              style={{
                height: containerHeight,
                width: lgUp && sidebarToggle ? '280px' : '0%',
                border: '0',
                borderLeft: '1px',
                borderStyle: 'solid',
                borderColor:
                  customizer?.activeMode === 'dark' ? '#333F55' : '#e5eaef',
                display: 'flex',
                backgroundColor:
                  customizer?.activeMode === 'dark' ? '#323441' : '#000000',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <ChatInsideSidebar
                  selectedChat={selectedChat}
                  handleAddContact={handleToggleContact}
                />
              </Box>
            </SimpleBarReact>
          </Box>
          <Divider />
          {selectedChat?.Contact?.status !== 'BLOCKED' && (
            <ChatMsgSent
              onTabChange={(value: number) => {
                handleAdjsutContainerHeight(value);
              }}
            />
          )}
        </>
      ) : (
        <>
          <Box display="flex" alignItems="center" paddingX={2} height={70}>
            <Box
              sx={{
                display: {
                  xs: 'block',
                  md: 'block',
                  lg: 'none',
                },
                mr: '10px',
              }}
            >
              <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={'100vh'}
          >
            <IconBrandWechat
              size={100}
              stroke={1}
              style={{
                marginRight: 5,
                cursor: 'pointer',
              }}
            />
            <Divider
              sx={{
                mr: '30px',
                ml: '30px',
                width: '70%',
                '::before': {
                  marginBottom: '20px',
                  borderTop: '2px solid #e5eaef !important',
                },
                '::after': {
                  marginBottom: '20px',
                  borderTop: '2px solid #e5eaef !important',
                },
              }}
            >
              Welcome to Chatter
            </Divider>
            <Box
              marginTop={'20px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
            >
              <Typography lineHeight={'15px'}>
                Unlock seamless communication with our innovative chat solution.
              </Typography>
              <Typography lineHeight={'15px'}>
                Experience the power of instant interaction, whether for
                personal
              </Typography>
              <Typography lineHeight={'15px'}>
                connections or professional collaborations.
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default ChatContent;
