import { Icon } from '@iconify/react';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import {
  IconBell,
  IconCalendar,
  IconMenu2,
  IconMessageCircle2,
  IconMoon,
  IconNotes,
  IconPhoneCall,
  IconSun,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';

import NotificationDrawer from '../../../../components/apps/notifications/NotificationDrawer';
import PaymentForm from '../../../../components/common/PaymentForm';
import { useAuth } from '../../../../hooks/useAuth';
import useCallFeature from '../../../../hooks/useCallFeature';
import { AppState, useDispatch, useSelector } from '../../../../store/Store';
import {
  deleteEvent,
  updateEventList,
} from '../../../../store/apps/calendar/CalendarSlice';
import { updateCallSliceState } from '../../../../store/apps/calls/callsSlice';
import {
  handleAddMessageNotes,
  reorderChats,
  toggleUnreadFlag,
} from '../../../../store/apps/chat/ChatSlice';
import { fetchContacts } from '../../../../store/apps/contacts/ContactSlice';
import { fetchDids } from '../../../../store/apps/did/DidSlice';
import { getUserNotifications } from '../../../../store/apps/user/UserSlice';
import {
  setDarkMode,
  toggleMobileSidebar,
  toggleSidebar,
} from '../../../../store/customizer/CustomizerSlice';
import axios from '../../../../utils/axios';
import { CONTACT_BODY } from '../../../../utils/constant';
import {
  getFirebaseToken,
  onMessageListener,
} from '../../../../utils/firebase';

import Profile from './Profile';

dayjs.extend(utc);
dayjs.extend(timezone);

const Header = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const [open, setOpen] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch();
  const { pathname, replace } = useRouter();
  const [message, setMessage] = useState<number>(0);
  const { user, setUserDetails } = useAuth();
  const [profileData, setProfileData] = useState<any>({});
  const { connectPBX, sessionCount } = useCallFeature();
  const [expanded, setExpanded] = useState(true);
  const customizer = useSelector((state: AppState) => state.customizer);
  const { connected } = useSelector((state: AppState) => state.callsReducer);
  const didList = useSelector((state: AppState) => state.didReducer.did);
  const { selectedChat, unreadFlag } = useSelector(
    (state: AppState) => state.chatReducer,
  );
  const { notifications } = useSelector((state: AppState) => state.userReducer);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (Boolean(user)) {
      if (user?.role.role !== 'MASTER_ADMIN') {
        dispatch(fetchDids('ACTIVE', user?.uid as any));
        dispatch(fetchContacts(CONTACT_BODY));
        dispatch(getUserNotifications());
      }
      fetchUserData();
      fetchUeadCount();
      setTimeout(() => {
        setExpanded(false);
      }, 3000);
    }
  }, [user]);

  useEffect(() => {
    if (Boolean(user)) {
      const checkVariable = async () => {
        if (customizer.token !== null) {
          clearInterval(intervalId);
          await axios.post(`/users/web-token`, { webToken: customizer.token });
        } else {
          await getFirebaseToken();
        }
      };
      const intervalId = setInterval(checkVariable, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user, customizer.token]);

  useEffect(() => {
    onMessageListener()
      .then((payload: any) => {
        console.log('Push Notification', payload);
        if (payload) {
          const { notification } = payload;
          toast(`${notification.title}.\n\n${notification.body}`, {
            duration: 6000,
            position: 'bottom-right',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  useEffect(() => {
    if (unreadFlag) {
      fetchUeadCount();
      dispatch(toggleUnreadFlag(false));
    }
  }, [unreadFlag]);

  useEffect(() => {
    let theme = localStorage.getItem('theme');
    dispatch(setDarkMode(theme || 'light'));
    if (!socket) {
      const socket = io(process.env.HOST_API_URL as string, {
        transports: ['websocket', 'xhr-polling'],
      });
      setSocket(socket);
      return () => {
        socket.disconnect();
        setSocket(null);
      };
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        const { Did } = data;
        const didExists = didList.find((did: any) => did.id === Did?.id);
        if (didExists) {
          handleIncomingMsg(data);
        }
      });
      socket.on('notes', (data) => {
        handleMessageNotes(data);
      });
      socket.on('event', (data) => {
        handleCalendarEntry(data);
      });
      socket.on('notify', (data) => {
        handleNotification(data);
      });
      return () => {
        socket.off('message');
        socket.off('notes');
        socket.off('event');
        socket.off('notify');
      };
    }
  }, [socket, pathname, message, didList.length]);

  const handleIncomingMsg = async (data: any) => {
    if (pathname.includes('conversation')) {
      dispatch(reorderChats(data));
      console.log('Received message from server:', data);
    }

    if (data?.id !== selectedChat?.id) {
      fetchUeadCount();
    } else {
      await axios.put(`/conversation/mark-read/${data?.id}`);
    }
    const audio = new Audio('/static/message_notification.mp3');
    audio.volume = 1;
    audio.play();
  };

  const handleMessageNotes = async (data: any) => {
    if (pathname.includes('conversation')) {
      dispatch(handleAddMessageNotes(data));
      console.log('Received note from server:', data);
    }
  };

  const handleCalendarEntry = async (data: any) => {
    const { event, type } = data;
    const updateFlag = type === 'event.updated' || type === 'event.created';
    if (updateFlag) {
      dispatch(updateEventList(event));
    } else {
      dispatch(deleteEvent(event));
    }
  };

  const handleNotification = async (data: any) => {
    await dispatch(getUserNotifications());
    const { title, uid, heading, date, type } = data;
    const conversation = pathname.includes('conversation') && type === 'Chat';
    if (uid && uid.indexOf(user?.uid) > -1 && !conversation) {
      toast.custom(
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '400px',
            height: '120px',
            padding: '10px',
            color: '#fff',
            borderRadius: '10px',
            background: '#333',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
        >
          {getNotificationIcon(type)}
          <Box style={{ flex: '1 1 auto', overflow: 'hidden' }}>
            <h3
              style={{
                margin: '0 0 5px 0',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {heading}
            </h3>
            <div
              style={{
                margin: '0',
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '12px',
              }}
            >
              <Typography
                noWrap
                dangerouslySetInnerHTML={{
                  __html: title,
                }}
              />
              <br />
              {dayjs
                .unix(date)
                .tz(dayjs.tz.guess())
                .format('MM-DD-YYYY [at] hh:mm A')}
            </div>
          </Box>
          <Box
            onClick={() => toast.dismiss()}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'white',
            }}
          >
            ✕
          </Box>
        </Box>,
        {
          duration: 4000,
          position: 'bottom-right',
        },
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Calendar':
        return (
          <IconCalendar
            size={40}
            style={{
              flex: '0 0 auto',
              marginRight: '15px',
              color: '#fff',
            }}
          />
        );

      case 'Notes':
        return (
          <IconNotes
            size={40}
            style={{
              flex: '0 0 auto',
              marginRight: '15px',
              color: '#fff',
            }}
          />
        );

      default:
        return (
          <IconBell
            size={40}
            style={{
              flex: '0 0 auto',
              marginRight: '15px',
              color: '#fff',
            }}
          />
        );
    }
  };

  const fetchUserData = async () => {
    const response = await axios.get(`/users/${user?.uid}`);
    const profile = response.status === 200 ? response.data.data : {};
    setUserDetails(profile);
    setProfileData(profile);
  };

  const fetchUeadCount = async () => {
    const response = await axios.get(`/conversation/count/unread`);
    const { unreadCount } = response?.data;
    setMessage(unreadCount || 0);
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  const handleChatClicked = () => {
    replace('/chats/conversation');
  };

  const handleChangeTheam = (checked: any) => {
    const mode = checked ? 'light' : 'dark';
    dispatch(setDarkMode(mode));
    localStorage.setItem('theme', mode);
  };

  const handleOpenDialPad = () => {
    dispatch(updateCallSliceState({ key: 'toggleDialPad', value: true }));
  };

  const verticleMenusSx = {
    borderRadius: '50%',
    background: customizer?.activeMode === 'dark' ? '#383a47' : 'white',
    color: customizer?.activeMode === 'dark' ? 'white' : 'black',
    width: '34px',
    height: '34px',
    margin: '2px',
    display: expanded ? 'flex' : 'none',
  };

  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  const verticleMenus = (
    <div
      style={{
        width: '47px',
        zIndex: 999,
        position: 'absolute',
        right: 10,
        top: 0,
        background: `${
          customizer?.activeMode === 'light' ? '#D9D9D9' : '#323441'
        }`,
        borderBottomLeftRadius: '50px',
        borderBottomRightRadius: '50px',
        overflow: 'hidden',
        height: 'fit-content',
        transition: 'height 0.5s ease-in-out',
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {user?.role.role !== 'MASTER_ADMIN' && (
          <>
            <Profile />
            <IconButton
              aria-label="pay"
              onClick={() => setOpen(true)}
              sx={verticleMenusSx}
            >
              <Icon icon={'tabler:message-dollar'} />
            </IconButton>
            <IconButton
              aria-label="chat"
              onClick={handleChatClicked}
              sx={verticleMenusSx}
            >
              <Badge
                color="primary"
                invisible={message === 0}
                badgeContent={message}
              >
                <IconMessageCircle2 />
              </Badge>
            </IconButton>
            <IconButton
              sx={verticleMenusSx}
              aria-label="call"
              onClick={handleOpenDialPad}
              disabled={sessionCount() > 0 ? true : false}
            >
              <IconPhoneCall size={28} />
            </IconButton>
            <IconButton
              onClick={() => setNotificationOpen(true)}
              sx={verticleMenusSx}
            >
              <Badge
                color="primary"
                invisible={notifications === 0}
                badgeContent={notifications}
              >
                <IconBell />
              </Badge>
            </IconButton>
          </>
        )}

        {user?.role?.roleId !== 1 && !connected && (
          <IconButton
            color="inherit"
            sx={{ ...verticleMenusSx, mb: 1, padding: '5px' }}
            onClick={() => connectPBX()}
          >
            <Icon icon={'ion:reload-circle-sharp'} width={30} height={30} />
          </IconButton>
        )}
        <IconButton
          color="inherit"
          sx={{ ...verticleMenusSx, mb: 1 }}
          onClick={() => handleChangeTheam(customizer?.activeMode === 'dark')}
        >
          {customizer?.activeMode === 'dark' ? (
            <IconSun size={28} />
          ) : (
            <IconMoon size={28} />
          )}
        </IconButton>
      </Stack>
    </div>
  );

  interface ContentItem {
    title: string;
    icon: string;
    route: string;
  }

  const isDark = customizer?.activeMode === 'dark';

  const contentData: ContentItem[] = [
    {
      title: 'Dashboard',
      route: 'Dashboard',
      icon: isDark ? 'dashboard.png' : 'dashboard_light.png',
    },
    {
      title: 'Contacts',
      route: 'Contacts',
      icon: isDark ? 'user.png' : 'user_light.png',
    },
    {
      title: 'Group Conversation',
      route: 'Chats/Group',
      icon: isDark ? 'chat.png' : 'chat_light.png',
    },
    {
      title: 'Emails',
      route: 'Chats/Emails',
      icon: isDark ? 'chat.png' : 'chat_light.png',
    },
    {
      title: 'Payment',
      route: 'Payment',
      icon: isDark ? 'payment.png' : 'payment_light.png',
    },
    {
      title: 'Reviews',
      route: 'Reviews',
      icon: isDark ? 'rating.png' : 'rating_light.png',
    },
    {
      route: 'Features',
      title: 'Features',
      icon: isDark ? 'feature.png' : 'feature_light.png',
    },
    {
      route: 'Campaign',
      title: 'Campaign',
      icon: isDark ? 'campaign.png' : 'campaign_light.png',
    },
    {
      route: 'Settings',
      title: 'Settings',
      icon: isDark ? 'setting.png' : 'setting_light.png',
    },
    {
      title: 'Helpdesk',
      route: 'Helpdesk',
      icon: isDark ? 'help.png' : 'help_light.png',
    },
    {
      title: 'Product',
      route: 'Product',
      icon: isDark ? 'product.png' : 'product_light.png',
    },
    {
      title: 'Invoice',
      route: 'invoice/preview',
      icon: isDark ? 'invoice.png' : 'invoice_light.png',
    },
    {
      title: 'Phone',
      route: 'Phone',
      icon: isDark ? 'phone_dark.png' : 'phone_light.png',
    },
    {
      title: 'Management',
      route: 'management',
      icon: isDark ? 'user.png' : 'user_light.png',
    },
    {
      title: 'Billing',
      route: 'billing',
      icon: isDark ? 'billing.png' : 'billing_light.png',
    },
    {
      title: 'Calendar',
      route: 'calendar',
      icon: isDark ? 'Calender.png' : 'Calender1.png',
    },
    {
      title: 'Unread Notifications',
      route: 'notification',
      icon: isDark ? 'bell.png' : 'bell_light.png',
    },
    {
      title: 'History',
      route: 'history',
      icon: isDark ? 'history-menu.png' : 'history-menu_light.png',
    },
  ];

  const selectedItem = contentData.find((item) =>
    pathname.includes(item.route.toLowerCase()),
  );

  if (pathname === '/chats/conversation') {
    return (
      <>
        {verticleMenus}
        <NotificationDrawer
          open={notificationOpen}
          toggle={() => setNotificationOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <AppBarStyled
        position="sticky"
        color="default"
        sx={{
          backgroundColor: isDark ? 'default' : '#fff',
          borderBottom: isDark ? '2px solid #323441' : '2px solid #cccccc',
        }}
      >
        <ToolbarStyled>
          {!lgUp && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={
                lgUp
                  ? () => dispatch(toggleSidebar({}))
                  : () => dispatch(toggleMobileSidebar())
              }
            >
              <IconMenu2 size="20" />
            </IconButton>
          )}
          <Image
            src={`/images/menu/${
              selectedItem
                ? selectedItem.icon
                : isDark
                ? 'dashboard.png'
                : 'dashboard1.png'
            }`}
            alt={''}
            width={30}
            height={30}
          />
          <Typography sx={{ ml: 1, color: 'white' }} variant="h2">
            {selectedItem ? selectedItem.title : 'Dashboard'}
          </Typography>
          <Box flexGrow={1} />
        </ToolbarStyled>

        {user?.role.role !== 'MASTER_ADMIN' && (
          <PaymentForm open={open} toggle={() => setOpen(false)} />
        )}
        {verticleMenus}
      </AppBarStyled>
      <NotificationDrawer
        open={notificationOpen}
        toggle={() => setNotificationOpen(false)}
      />
    </>
  );
};

export default Header;
