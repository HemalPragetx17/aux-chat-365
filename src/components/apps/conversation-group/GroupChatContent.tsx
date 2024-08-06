import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { IconMenu2, IconTrash } from '@tabler/icons-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { FC, useEffect, useRef, useState } from 'react';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import swal from 'sweetalert';

import { useAuth } from '../../../hooks/useAuth';
import {
  deleteConversation,
  deleteMessage,
} from '../../../store/apps/chat/ChatGroupSlice';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import { getChatFrom } from '../../../utils/conversation';
import CustomNotesComponent from '../../custom/CustomNotesComponent';
import CustomOptionsMenu from '../../custom/CustomOptionsMenu';

import GroupChatInsideSidebar from './GroupChatInsideSidebar';

interface ChatContentProps {
  toggleChatSidebar: () => void;
}

const GroupChatContent: FC<ChatContentProps> = ({ toggleChatSidebar }: any) => {
  const dispatch = useDispatch();
  const { selectedChat, isNewChat } = useSelector(
    (state) => state.chatGroupReducer,
  );
  const customizer = useSelector((state: AppState) => state.customizer);
  const rightContainer = useRef(null);
  const chatContainer = useRef(null);
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const { user } = useAuth();
  const [noteForm, setNoteForm] = useState<boolean>(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    const parentHeight = (rightContainer?.current as any)?.offsetHeight;
    setContainerHeight(parentHeight - 70);
    if (chatContainer?.current) {
      (chatContainer?.current as any).scrollTop = (
        chatContainer?.current as any
      )?.scrollHeight;
    }
  }, [selectedChat]);

  const handleDelete = async () => {
    const chat = selectedChat;
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
      dispatch(deleteConversation(chat.id));
    }
  };

  const handleMessageDelete = async (id: string) => {
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
  };

  return (
    <Box height={`calc(100% - 70px)`} ref={rightContainer}>
      {selectedChat ? (
        <Box height={'100%'}>
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
            <ListItem key={selectedChat?.id} dense disableGutters>
              <ListItemText
                primary={
                  <>
                    <Typography variant="h6">
                      {selectedChat?.ContactGroup?.title}
                    </Typography>
                    <Box display={'flex'} alignItems={'center'} mt={0.5}>
                      <Typography variant="caption">
                        {getChatFrom(selectedChat)}
                      </Typography>
                    </Box>
                  </>
                }
              />
            </ListItem>
            {!isNewChat && (
              <Stack direction={'row'}>
                <CustomOptionsMenu
                  menuProps={{ sx: { mt: 2 } }}
                  iconButtonProps={{
                    size: 'small',
                    sx: { color: 'text.secondary' },
                  }}
                  options={[
                    {
                      text: 'Notes',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          setNoteForm(true);
                        },
                      },
                    },
                    {
                      text: 'Delete Full Conversation',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          handleDelete();
                        },
                      },
                    },
                  ]}
                />
              </Stack>
            )}
          </Box>
          <Divider />
          <Box display={'flex'}>
            <SimpleBarReact
              style={{
                maxHeight: containerHeight,
                width: lgUp ? 'calc(100% - 280px)' : '100%',
              }}
              scrollableNodeProps={{ ref: chatContainer }}
            >
              <Box p={3} width="100%">
                {(selectedChat as any)?.Message?.map(
                  (message: any, index: number) => {
                    let messageText = message.message?.replaceAll('\n', '<br>');
                    if (message.media) {
                      const image = `<img src=${message.media} alt="media" height=200 width=160 />`;
                      messageText +=
                        messageText?.length > 0 ? `<br>${image}` : `${image}`;
                    }
                    return (
                      <Box key={index}>
                        <Box
                          mb={2}
                          display="flex"
                          alignItems="flex-end"
                          flexDirection="row-reverse"
                        >
                          <Box
                            alignItems="flex-end"
                            display="flex"
                            flexDirection={'column'}
                          >
                            <Box display={'flex'} alignItems={'center'}>
                              <Tooltip title={'Delete Message'}>
                                <IconButton
                                  onClick={() =>
                                    handleMessageDelete(message.id)
                                  }
                                >
                                  <IconTrash
                                    size={16}
                                    style={{
                                      marginRight: 5,
                                      cursor: 'pointer',
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Box
                                dangerouslySetInnerHTML={{
                                  __html: messageText,
                                }}
                                sx={{
                                  p: 1,
                                  backgroundColor: `primary.${customizer?.activeMode}`,
                                  ml: 'auto',
                                  maxWidth: '320px',
                                }}
                              ></Box>
                            </Box>
                            {message.createdAt && (
                              <Typography
                                variant="body2"
                                color="grey.400"
                                mt={1}
                              >
                                {message.sender},&nbsp;
                                {formatDistanceToNowStrict(
                                  new Date(message.createdAt),
                                  {
                                    addSuffix: false,
                                  },
                                )}{' '}
                                ago
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  },
                )}
              </Box>
            </SimpleBarReact>
            <SimpleBarReact
              style={{
                height: containerHeight,
                width: lgUp ? '280px' : '0%',
                border: '0',
                borderLeft: '1px',
                borderStyle: 'solid',
                borderColor: '#e5eaef',
                display: isNewChat ? 'none' : 'flex',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <GroupChatInsideSidebar
                  selectedChat={selectedChat}
                  handleAddNote={() => setNoteForm(true)}
                />
              </Box>
            </SimpleBarReact>
          </Box>
        </Box>
      ) : (
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
      )}

      <CustomNotesComponent
        open={noteForm}
        currentData={selectedChat}
        toggle={() => setNoteForm(false)}
      />
    </Box>
  );
};

export default GroupChatContent;
