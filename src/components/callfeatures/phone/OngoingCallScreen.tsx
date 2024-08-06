import { useEffect, useMemo } from 'react';

import { Avatar, Divider, Stack, Typography } from '@mui/material';

import useCallFeature from '../../../hooks/useCallFeature';
import { closeCallScreenModal } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { CallDirection } from '../../../types/apps/calls';
import { formatPhoneNumber } from '../../../utils/utils';
import CallActionButtonsList from './CallActionButtonsList';
import CallOptionActionModal from './CallOptionActionModal';

const OngoingCallScreen = () => {
  const { sessionCount, callTimer, TimerAction } = useCallFeature();
  const { selectedUser, dialNumber, display_name, direction, callOptionModal } =
    useSelector((state) => state.callsReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    TimerAction('start');
    return () => TimerAction('stop');
  }, []);

  const UserDisplayName: string = useMemo(() => {
    let username = 'Unknown';
    if (selectedUser?.lastName || selectedUser?.firstName) {
      username = `${selectedUser?.firstName} ${selectedUser?.lastName}`;
    }

    if (display_name && direction === CallDirection.inbound) {
      username = display_name;
    }
    return username;
  }, [selectedUser, display_name, direction]);

  const closeHandler = () => {
    dispatch(closeCallScreenModal());
  };

  return (
    <>
      <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
          }}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <Typography
              sx={{
                color: 'white !important',
                textTransform: 'capitalize',
                fontSize: '16px',
              }}
            >
              Call in Progress
            </Typography>
          </Stack>
          <Divider
            sx={{ background: '#4D4F5D', width: '100%', margin: '10px' }}
          />
        </Stack>
        <Stack
          sx={{ width: '100%', height: '100%', paddingBottom: '15px' }}
          justifyContent={'space-between'}
        >
          <Stack
            direction={'column'}
            alignItems={'center'}
            spacing={1}
            justifyContent={'center'}
            sx={{ marginTop: '10px' }}
          >
            <Avatar
              alt={'username'}
              sx={{ height: '40px', width: '40px' }}
              src={selectedUser?.image?.src}
            />
            <Stack direction={'column'}>
              <Typography
                sx={{
                  color: '#49A8FF !important',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {UserDisplayName}
              </Typography>
              <Typography
                sx={{
                  fontSize: '18px',
                  color: '#fff !important',
                  textAlign: 'center',
                }}
              >
                {formatPhoneNumber(dialNumber)}
              </Typography>
              <Typography
                sx={{
                  color: '#62626D !important',
                  fontWeight: '600',
                  fontSize: '16px',
                  textAlign: 'center',
                  marginTop: '10px',
                }}
              >
                {callTimer}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={3}
          >
            <CallActionButtonsList />
          </Stack>
        </Stack>
      </Stack>
      {callOptionModal.toggle && <CallOptionActionModal />}
      {/* <CallTransferModal /> */}
    </>
  );
};

export default OngoingCallScreen;
