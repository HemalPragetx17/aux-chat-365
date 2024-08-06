import {
  Alert,
  Badge,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { useNylas } from '@nylas/nylas-react';
import {
  IconAdjustmentsHorizontal,
  IconShare,
  IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import { useAuth } from '../../../hooks/useAuth';
import { AppState, dispatch, useSelector } from '../../../store/Store';
import {
  selectEmail,
  setEvent,
  setFilterType,
  setLoading,
} from '../../../store/apps/calendar/CalendarSlice';
import axios from '../../../utils/axios';
import CustomDatePickerWrapper from '../../custom/CustomDatePickerWrapper';
import CustomTextField from '../../custom/CustomTextField';

import FilterDialog from './FilterDialog';

const SidebarLeft = (props: any) => {
  const nylas = useNylas();
  const { calendarApi, handleOnAdd } = props;
  const store = useSelector((state: AppState) => state.calendarReducer);
  const [emailList, setEmailList] = useState<any>([]);
  const [filterDialog, setFilterDialog] = useState<boolean>(false);
  const [emailSyncOption, setEmailSyncOption] = useState<boolean>(false);
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserEmails();
    setEmailSyncOption(false);
    setFilterType({ type: 'ALL', owner: 'ALL', assigned: false });
  }, [router]);

  const fetchUserEmails = async () => {
    dispatch(selectEmail(null));
    dispatch(setEvent([]));
    dispatch(setLoading(true));
    const response = await axios.post('/email-nylas/get-user-calendars');
    const { virtualCalendarGrant } = response?.data;
    const _response = await axios.post('/users/assigned-email');
    const data = _response?.status === 200 ? _response?.data : [];
    const calendar: any = [];
    let defaultEmail: any = null;

    if (virtualCalendarGrant) {
      calendar.push({
        name: 'Internal Organization Calendar',
        virtual: true,
        grantId: virtualCalendarGrant.grantId,
        calendarId: virtualCalendarGrant.calendarId,
      });
      defaultEmail = calendar[0];
    }
    if (data?.length) {
      for (let email of data) {
        const _email = {
          id: email?.id,
          name: email?.email,
          virtual: false,
          grantId: email.accessTokenNylas,
          calendarId: email.calendarId,
          email: email?.email,
          isDefault: email.isDefault,
        };
        calendar.push(_email);
        if (email.isDefault) {
          defaultEmail = _email;
        }
      }
    }
    setEmailList(calendar);
    if (Boolean(router?.query?.email)) {
      const selectedEmail = calendar.find(
        (data: any) => data.email === router?.query?.email,
      );
      dispatch(selectEmail(selectedEmail));
      window.history.replaceState({}, '', '/calendar');
    } else {
      dispatch(selectEmail(defaultEmail));
    }
    dispatch(setLoading(false));
  };

  const handleEmailDefaultChange = async (flag: boolean, emailId: string) => {
    dispatch(setLoading(true));
    const postUrl = flag
      ? `/email-nylas/set-default-email/${emailId}`
      : '/email-nylas/remove-default-email';
    dispatch(setLoading(true));
    await axios.post(postUrl);
    const list = [...emailList];
    const selectedEmail = list.find((email: any) => email.id === emailId);
    selectedEmail.isDefault = flag;
    setEmailList(list);
    dispatch(setLoading(false));
  };

  const handleSidebarToggleSidebar = () => {
    handleOnAdd(null);
  };

  const handleSyncEmail = () => {
    nylas.authWithRedirect({
      emailAddress: '',
      successRedirectUrl: `&state=${user?.uid}`,
    });
  };

  return (
    <Drawer
      open={true}
      variant={'permanent'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true, // Better open performance on mobile.
        BackdropProps: {
          invisible: true, // Disable the backdrop which triggers the closing behavior
        },
      }}
      sx={{
        zIndex: 2,
        display: 'block',
        position: 'static',
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          boxShadow: 'none',
          width: 320,
          borderTopRightRadius: 0,
          alignItems: 'flex-start',
          borderBottomRightRadius: 0,
          zIndex: 2,
          position: 'static',
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute',
        },
      }}
    >
      <Box sx={{ p: 2, width: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <FormControl fullWidth>
            <InputLabel id="type-select" size="small">
              Select Calendar
            </InputLabel>
            <Select
              size="small"
              label={'Select Calendar'}
              labelId="type-select"
              value={store.selectedCalendar || ''}
              renderValue={(selected) => {
                const selectedEmail = emailList.find(
                  (email: any) => email === selected,
                );
                return selectedEmail ? selectedEmail.name : '';
              }}
            >
              {emailList.map((email: any, index: number) => (
                <MenuItem dense key={index} value={email}>
                  {!email.virtual && (
                    <Checkbox
                      checked={email.isDefault}
                      onChange={async (event: any) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const flag = event?.target?.checked;
                        await handleEmailDefaultChange(flag, email.id);
                      }}
                      sx={{ padding: 0, marginRight: 2 }}
                    />
                  )}
                  <ListItemText
                    primary={email?.name}
                    onClick={() => {
                      dispatch(selectEmail(email));
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            disabled={!store.selectedCalendar}
            onClick={() => setFilterDialog(true)}
          >
            <Badge
              badgeContent={
                store.filter.type !== 'ALL' ||
                store.filter.owner !== 'ALL' ||
                store.filter.assigned !== false
                  ? ' '
                  : 0
              }
              variant="dot"
              color="primary"
            >
              <IconAdjustmentsHorizontal stroke={1.5} size={24} />
            </Badge>
          </IconButton>
        </Box>
        <Alert severity="info" icon={false} sx={{ mt: 1 }}>
          Don't see your email on this list?{' '}
          <span
            style={{
              textDecoration: 'underline',
              fontWeight: '700',
              cursor: 'pointer',
            }}
            onClick={handleSyncEmail}
          >
            Click here
          </span>{' '}
          to sync your email with our calendar!
        </Alert>

        {emailSyncOption && (
          <Box sx={{ display: 'flex', mt: 2 }}>
            <FormControl fullWidth sx={{ display: 'flex' }}>
              <CustomTextField
                value={personalEmail}
                label="Enter Your Email"
                onChange={(event: any) =>
                  setPersonalEmail(event?.target?.value)
                }
                size="small"
              />
            </FormControl>
            <IconButton
              disabled={!Boolean(personalEmail)}
              onClick={handleSyncEmail}
            >
              <IconShare stroke={1.5} size={24} />
            </IconButton>
            <IconButton onClick={() => setEmailSyncOption(false)}>
              <IconX stroke={1.5} size={24} />
            </IconButton>
          </Box>
        )}

        {emailList?.length === 0 && (
          <Alert severity="error" icon={false} sx={{ mt: 1 }}>
            You dont have any calendar added to your account. Please ask your
            admin to add a email to view calendar features.
          </Alert>
        )}
      </Box>

      <Divider sx={{ width: '100%', m: '0 !important' }} />

      <Box sx={{ p: 2, width: '100%' }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleSidebarToggleSidebar}
          disabled={!Boolean(store?.selectedCalendar)}
        >
          Add Event
        </Button>
      </Box>

      <Divider sx={{ width: '100%', m: '0 !important' }} />

      <CustomDatePickerWrapper
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          '& .react-datepicker': {
            boxShadow: 'none !important',
            border: 'none !important',
          },
        }}
      >
        <DatePicker inline onChange={(date) => calendarApi.gotoDate(date)} />
      </CustomDatePickerWrapper>

      <Divider sx={{ width: '100%', m: '0 !important' }} />

      <FilterDialog
        filterDialog={filterDialog}
        setFilterDialog={setFilterDialog}
      />
    </Drawer>
  );
};

export default SidebarLeft;
