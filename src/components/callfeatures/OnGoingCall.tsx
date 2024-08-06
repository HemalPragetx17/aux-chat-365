import { useEffect, useMemo } from 'react';
import Draggable from 'react-draggable';

import { Icon } from '@iconify/react';
import { Avatar, Card, Divider, Stack, Typography } from '@mui/material';

import useCallFeature from '../../hooks/useCallFeature';
import { useSelector } from '../../store/Store';
import { CallDirection } from '../../types/apps/calls';
import { formatPhoneNumber } from '../../utils/utils';
import CallActionButtonsList from './phone/CallActionButtonsList';

const OnGoingCall = () => {
  const { sessionCount, callTimer, TimerAction } = useCallFeature();
  const { selectedUser, dialNumber, display_name, direction } = useSelector(
    (state) => state.callsReducer,
  );

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

  return (
    <Draggable>
      <Card
        sx={{
          // background: "rgba(31,29,42,255)",
          background:
            'linear-gradient(90deg, rgba(74,21,140,1) 15%, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)!important',
          maxWidth: '400px',
          maxHeight: '200px',
          padding: '0px',
          // border: '2px solid rgba(112,88,161,255)',
          border: '3px solid #c56dff',
          zIndex: '99999 !important',
          position: 'absolute',
          bottom: '20px',
          right: '20px',
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography sx={{ color: 'white !important', padding: '10px' }}>
            {formatPhoneNumber(dialNumber)}
          </Typography>
          <Typography sx={{ color: 'white !important', padding: '10px' }}>
            <Icon icon={'mingcute:dots-fill'} width={20} />
          </Typography>
        </Stack>
        <Divider
          sx={{
            width: '100%',
            border: '1px solid #c56dff',
            //  border: '1px solid #52535a'
          }}
        />
        <Stack direction="column" spacing={2}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={1}
            sx={{ padding: '15px' }}
          >
            <Avatar
              alt="{selectedUser?.firstName} {selectedUser?.firstName}"
              src={selectedUser?.image?.src}
              sx={{ height: '40px', width: '40px' }}
            />
            <Stack direction={'column'}>
              <Typography sx={{ color: '#fff', fontSize: '1.2rem' }}>
                {UserDisplayName}
                {/* {selectedUser?.firstName} {selectedUser?.lastName}
                                {direction === CallDirection.inbound && display_name} */}
              </Typography>
              <Typography sx={{ color: '#dadbe3 !important' }}>
                {callTimer}
              </Typography>
            </Stack>
          </Stack>

          <CallActionButtonsList />
        </Stack>
      </Card>
    </Draggable>
  );
};

export default OnGoingCall;
