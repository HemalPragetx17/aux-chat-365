import {
  Alert,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  IconClock,
  IconEdit,
  IconPhoneOutgoing,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import swal from 'sweetalert';

import { useAuth } from '../../../hooks/useAuth';
import {
  deleteConversation,
  fetchChatByNumber,
  fetchChats,
  selectChatById,
} from '../../../store/apps/chat/ChatGroupSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { getDetails } from '../../../utils/conversation';
import { getInitials } from '../../../utils/get-initials';
import CustomTextField from '../../custom/CustomTextField';

import GroupChatDialog from './GroupChatDidDialog';

const GroupChatListing = () => {
  const dispatch = useDispatch();
  const activeChat = useSelector(
    (state) => state.chatGroupReducer.selectedChat?.id || null,
  );
  const { user, settings } = useAuth();
  const chatArea = useRef(null);
  const parentContainer = useRef(null);
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [didDialog, setDidDialog] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<any>(null);
  const chats = useSelector((state) => state.chatGroupReducer.chats);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    const chatNumber = JSON.parse(
      sessionStorage.getItem('groupNumber') || '{}',
    );
    const { id, fromNumber } = chatNumber;
    if (id && fromNumber) {
      dispatch(fetchChatByNumber(id, fromNumber));
    } else {
      const payload = {
        searchText,
      };
      dispatch(fetchChats(payload));
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchText !== null) {
      let timeoutId: NodeJS.Timeout;
      const debounce = (func: () => void, delay: number) => {
        return () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(func, delay);
        };
      };

      const handleSearch = debounce(() => {
        console.log('Performing search for:', searchText);
        const payload = {
          searchText,
        };
        dispatch(fetchChats(payload));
      }, 1000);
      handleSearch();

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [searchText]);

  useEffect(() => {
    const parentHeight = (parentContainer?.current as any)?.offsetHeight;
    setContainerHeight(parentHeight - 146);
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = (chatArea?.current as any)?.scrollTop + containerHeight;
    const height = (chatArea?.current as any)?.scrollHeight;
    if (height - scrollTop < 10) {
      // Call Chat Pagination API
    }
  }, [containerHeight]);

  useEffect(() => {
    const div = chatArea.current as any;
    div.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleMessage = () => {
    setDidDialog(true);
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

  return (
    <div style={{ height: '100%' }} ref={parentContainer}>
      <Box
        display={'flex'}
        alignItems="center"
        gap="10px"
        paddingX={1}
        height={80}
        sx={{
          visibility: lgUp ? 'visible' : 'hidden',
        }}
      >
        <Avatar sx={{ width: 54, height: 54, bgcolor: '#a953df' }}>
          {user?.name ? getInitials(user?.name) : ''}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="body2">{user?.role?.name}</Typography>
        </Box>
      </Box>
      <Box px={1} height={50} display={'flex'} alignItems="center" mb={2}>
        <CustomTextField
          fullWidth
          value={searchText || ''}
          label="Search"
          onChange={(event: any) => setSearchText(event?.target?.value)}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="refresh"
                  size="small"
                  onClick={() => setSearchText('')}
                >
                  <IconX />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title={'New Message'}>
          <IconButton onClick={handleMessage}>
            <IconEdit />
          </IconButton>
        </Tooltip>
      </Box>

      <SimpleBarReact
        style={{
          maxHeight: containerHeight,
        }}
        scrollableNodeProps={{ ref: chatArea }}
      >
        {chats && chats.length ? (
          chats.map((chat: any) => {
            return (
              <Box key={chat.id}>
                <ListItemButton
                  onClick={() => dispatch(selectChatById(chat.id))}
                  sx={{
                    mb: 0.5,
                    py: 2,
                    px: 1,
                    pt: 1,
                    color:activeChat === chat.id?'#fff':'',
                    background:activeChat === chat.id?'linear-gradient(90deg, rgba(74,21,140,1) 15%, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%) !important':'',
                    alignItems: 'start',
                    flexWrap: 'wrap',
                  }}
                  selected={activeChat === chat.id}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 42, height: 42, bgcolor: '#ff96bb' }}>
                      {getInitials(chat?.ContactGroup?.title || '')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                        {chat?.ContactGroup?.title || ''}
                      </Typography>
                    }
                    secondary={
                      settings?.textPreviewFlag ? getDetails(chat) : ''
                    }
                    secondaryTypographyProps={{
                      noWrap: true,
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
                    <Tooltip title={'Delete Conversation'}>
                      <IconTrash
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(chat);
                        }}
                        size={16}
                        style={{ cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </Box>
                  <Box width={'100%'} mt={1}>
                    <Typography
                      variant="caption"
                      display={'flex'}
                      alignItems={'center'}
                    >
                      <IconPhoneOutgoing size={14} style={{ marginRight: 8 }} />
                      {`${chat?.Did?.countryCode}${chat?.Did?.phoneNumber}`}
                      <IconClock
                        size={14}
                        style={{ marginRight: 8, marginLeft: 8 }}
                      />
                      {format(
                        new Date(chat?.lastMessageTime),
                        'MMM dd, HH:mm:ss',
                      )}
                    </Typography>
                  </Box>
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

      <GroupChatDialog
        open={didDialog}
        toggle={() => setDidDialog(false)}
        dest={''}
      />
    </div>
  );
};

export default GroupChatListing;
