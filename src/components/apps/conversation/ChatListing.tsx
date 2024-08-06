import {
  Alert,
  Avatar,
  Badge,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  IconBan,
  IconLock,
  IconMapPin,
  IconMessageCircleOff,
  IconTrash,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import swal from 'sweetalert';

import { useAuth } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../store/Store';
import {
  deleteConversation,
  fetchChatById,
  fetchChatByNumber,
  fetchChats,
  getNewChats,
  lockConversation,
  markConversationAsUnread,
  selectChatById,
  setLoading,
  updateChatContact,
} from '../../../store/apps/chat/ChatSlice';
import axios from '../../../utils/axios';
import { PRIMARY_COLOR } from '../../../utils/constant';
import {
  getChatHead,
  getDetails,
  processPhoneNumber,
} from '../../../utils/conversation';
import SingleContactBlockForm from '../../forms/contact/SingleContactBlockForm';

const ChatListing = ({ chatCollaps = false }) => {
  const dispatch = useDispatch();
  const activeChat = useSelector(
    (state) => state.chatReducer.selectedChat?.id || null,
  );
  const { user, settings } = useAuth();
  const { chats, searchText, dateFlag, chatPage, filterData } = useSelector(
    (state) => state.chatReducer,
  );
  const [blockForm, setBlockForm] = useState<boolean>(false);
  const [contactData, setContactData] = useState<any>(undefined);
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const chatArea = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const { id, messageId, tagged }: any = router?.query;
    if (tagged === 'true') {
      dispatch(fetchChatById(id, messageId));
      window.history.replaceState({}, '', '/chats/conversation');
    } else {
      const chatNumber = JSON.parse(
        sessionStorage.getItem('chatNumber') || '{}',
      );
      const { phone, fromNumber } = chatNumber;
      if (phone && fromNumber) {
        dispatch(fetchChatByNumber(phone, fromNumber));
      } else {
        const payload = {
          searchText,
          dateFlag,
          filterData,
        };
        dispatch(getNewChats(payload));
      }
    }
  }, [router]);

  const handleLock = (id: any, lockedFlag: boolean) => {
    const payload = lockedFlag
      ? { locked: null }
      : {
          locked: {
            status: true,
            lockedBy: user?.uid,
            lockedName: user?.name,
          },
        };
    dispatch(lockConversation(payload, id));
  };

  const handleDelete = async (chat: any) => {
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
        dispatch(deleteConversation(chat.id));
      }
    }
  };

  const handleBlock = async (chat: any) => {
    const { Contact } = chat;
    if (!Boolean(Contact)) {
      const contact = {
        phone: processPhoneNumber(chat.to),
      };
      setContactData(contact);
      setBlockForm(true);
      return false;
    }
    dispatch(setLoading(true));
    const response = await axios.patch(`/contact/${Contact.id}`, {
      status: Contact?.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED',
    });
    if (response.status === 200) {
      dispatch(updateChatContact(response.data?.data?.data));
    }
  };

  const handleBlockSuccess = async (Contact: any) => {
    dispatch(updateChatContact(Contact));
  };

  const handleMarkAsUnread = (chat: any) => {
    dispatch(markConversationAsUnread({ unreadCount: 1 }, chat.id));
  };

  const handleScroll = () => {
    const node = chatArea.current as any;
    if (
      parseInt(node?.scrollHeight) -
        parseInt(node?.scrollTop + node?.clientHeight) <
      10
    ) {
      setBottomReached(true);
    }
  };

  useEffect(() => {
    const div = chatArea.current as any;
    div.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const chatPagination = async () => {
      const payload = {
        searchText,
        dateFlag,
        page: chatPage + 1,
      };
      const response = await dispatch(fetchChats(payload));
      if (response.length) {
        setBottomReached(false);
      }
    };
    if (bottomReached) {
      chatPagination();
    }
  }, [bottomReached]);

  return (
    <div style={{ height: '100%' }}>
      <SimpleBarReact
        style={{
          maxHeight: 'calc(100vh - 120px)',
        }}
        scrollableNodeProps={{ ref: chatArea }}
      >
        {chats && chats.length ? (
          chats.map((chat: any, index: number) => {
            const isLocked = chat?.locked?.status;
            const hideLock =
              user?.role.role === 'ADMIN'
                ? false
                : chat?.locked?.status && chat?.locked?.lockedBy !== user?.uid;
            const isBlocked = chat?.Contact?.status === 'BLOCKED';
            const inboundMessage = chat?.lastMessageDirection === 'INBOUND';
            const locationArr = [];
            const { city, state } = chat?.numberLookUp?.portability || {};
            if (city) locationArr.push(city);
            if (state) locationArr.push(state);

            return (
              <Box key={index}>
                <ListItemButton
                  onClick={() => {
                    if (chat.id !== activeChat) {
                      dispatch(selectChatById(chat));
                    }
                  }}
                  sx={{
                    py: 1,
                    px: 1,
                    pt: 1,
                    paddingRight: 0,
                    borderRadius: '10px',
                    color: activeChat === chat.id ? '#fff' : '',
                    background:
                      activeChat === chat.id
                        ? 'linear-gradient(90deg, rgba(74,21,140,1) 15%, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%) !important'
                        : '',
                    alignItems: 'start',
                    border:
                      activeChat === chat.id
                        ? '3px solid #c56dff'
                        : '3px solid transparent',
                    flexWrap: 'wrap',
                  }}
                  selected={activeChat === chat.id}
                >
                  <ListItemAvatar sx={{ minWidth: 'unset', mr: 0.5 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      badgeContent={
                        <>
                          {chat?.unreadCount > 0 && (
                            <div
                              style={{
                                backgroundColor: PRIMARY_COLOR,
                                color: 'white',
                                borderRadius: '50%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 20,
                                height: 20,
                                display: 'flex',
                                fontWeight: 700,
                              }}
                            >
                              {chat?.unreadCount}
                            </div>
                          )}
                        </>
                      }
                    >
                      <Avatar
                        alt="Profile Image"
                        src={
                          chat?.Contact?.image?.src ||
                          '/images/profile/thumb.png'
                        }
                        sx={{ width: 42, height: 42 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                        {getChatHead(chat)}
                      </Typography>
                    }
                    secondary={
                      settings?.textPreviewFlag ? getDetails(chat) : ''
                    }
                    secondaryTypographyProps={{
                      noWrap: true,
                      color: 'white',
                    }}
                    sx={{ my: 0 }}
                  />

                  <Box
                    sx={{ flexShrink: '0' }}
                    alignItems={'center'}
                    position={'absolute'}
                    right={10}
                    top={10}
                  >
                    <Typography variant="h6" sx={{ fontSize: '10px' }}>
                      {format(
                        new Date(chat?.lastMessageTime),
                        'MMM dd, hh:mm a',
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ flexShrink: '0' }}
                    alignItems={'center'}
                    position={'absolute'}
                    right={10}
                    top={35}
                  >
                    {!hideLock && (
                      <Tooltip
                        title={
                          isLocked ? 'Unlock Conversation' : 'Lock Conversation'
                        }
                      >
                        <IconLock
                          onClick={(event) => {
                            event.stopPropagation();
                            handleLock(chat.id, isLocked);
                          }}
                          size={16}
                          style={{
                            cursor: 'pointer',
                            stroke: isLocked ? PRIMARY_COLOR : 'currentColor',
                            strokeWidth: 1,
                          }}
                        />
                      </Tooltip>
                    )}

                    {(user?.role.role === 'ADMIN' ||
                      (user?.role.role === 'OPERATOR' &&
                        settings?.user_settings?.deletePermission)) && (
                      <Tooltip title={'Delete Conversation'}>
                        <IconTrash
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(chat);
                          }}
                          size={16}
                          style={{ cursor: 'pointer', strokeWidth: 1 }}
                        />
                      </Tooltip>
                    )}

                    <Tooltip
                      title={
                        isBlocked ? 'Unblock Number' : 'Block Conversation'
                      }
                    >
                      <IconBan
                        onClick={(event) => {
                          event.stopPropagation();
                          handleBlock(chat);
                        }}
                        size={16}
                        style={{
                          cursor: 'pointer',
                          stroke: isBlocked ? 'rgb(249 22 22)' : 'currentColor',
                          strokeWidth: 1,
                        }}
                      />
                    </Tooltip>

                    {inboundMessage && chat.unreadCount === 0 && (
                      <Tooltip title={'Mark as unread'}>
                        <IconMessageCircleOff
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMarkAsUnread(chat);
                          }}
                          size={16}
                          style={{
                            cursor: 'pointer',
                            stroke: 'currentColor',
                            strokeWidth: 1,
                          }}
                        />
                      </Tooltip>
                    )}

                    {locationArr.length > 0 && (
                      <Tooltip title={locationArr.join(', ')}>
                        <IconMapPin
                          size={16}
                          style={{
                            cursor: 'pointer',
                            stroke: 'currentColor',
                            strokeWidth: 1,
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>

                  {chatCollaps && (
                    <Box width={'100%'} mt={1}>
                      <Typography
                        variant="caption"
                        display={'flex'}
                        alignItems={'center'}
                      >
                        {chat?.Did?.title ? (
                          <Tooltip placement="right" title={chat.from}>
                            <span>{chat?.Did?.title}</span>
                          </Tooltip>
                        ) : (
                          <>{processPhoneNumber(chat?.from)}</>
                        )}
                        &nbsp;
                        {chat?.lastMessageDirection === 'OUTBOUND' ? (
                          <>→</>
                        ) : (
                          <>←</>
                        )}
                        &nbsp;{processPhoneNumber(chat?.to)}
                      </Typography>
                    </Box>
                  )}
                </ListItemButton>
              </Box>
            );
          })
        ) : (
          <Box m={2}>
            <Alert severity="error" variant="outlined" icon={false}>
              No Chats Found!
            </Alert>
          </Box>
        )}
      </SimpleBarReact>

      <SingleContactBlockForm
        open={blockForm}
        toggle={() => {
          setBlockForm(false);
        }}
        currentData={contactData}
        success={(value) => handleBlockSuccess(value)}
      />
    </div>
  );
};

export default ChatListing;
