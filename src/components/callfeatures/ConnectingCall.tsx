import { useMemo } from 'react';
import Draggable from 'react-draggable';

import { Icon } from '@iconify/react';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import useCallFeature from '../../hooks/useCallFeature';
import { updateCallSliceState } from '../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../store/Store';
import { CallDirection, SessionState } from '../../types/apps/calls';
import { formatPhoneNumber } from '../../utils/utils';

const ConnectingCall = () => {
  const {
    direction,
    dialNumber,
    selectedUser,
    display_name,
    selectedChat,
    callId,
  } = useSelector((state) => state.callsReducer);
  const { answerCall, terminateCall, rejectCall } = useCallFeature();
  const dispatch = useDispatch();

  const answerCallHandler = () => {
    answerCall();
    dispatch(
      updateCallSliceState({
        key: 'sessionState',
        value: SessionState.talking,
      }),
    );
    dispatch(
      updateCallSliceState({ key: 'isInboundConnectingCall', value: false }),
    );
  };

  const closeConnectingModal = () => {
    dispatch(updateCallSliceState({ key: 'ongoingSession', value: null }));
    dispatch(updateCallSliceState({ key: 'selectedChat', value: null }));
    dispatch(updateCallSliceState({ key: 'isConnectingCall', value: false }));
    dispatch(updateCallSliceState({ key: 'display_name', value: '' }));
    dispatch(
      updateCallSliceState({ key: 'sessionState', value: SessionState.ended }),
    );
  };

  const terminateCallHandler = () => {
    closeConnectingModal();
    terminateCall();
  };
  const rejectCallHandler = () => {
    dispatch(
      updateCallSliceState({ key: 'sessionState', value: SessionState.ended }),
    );

    rejectCall();
    closeConnectingModal();
  };

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
            {direction === CallDirection.inbound
              ? 'Incoming Call'
              : ' Connecting...'}
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
              alt={'username'}
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
                {formatPhoneNumber(dialNumber)}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
            sx={{ marginBottom: '15px !important' }}
          >
            {direction === CallDirection.inbound && (
              <Button
                onClick={answerCallHandler}
                variant="outlined"
                startIcon={<Icon icon={'material-symbols:call-sharp'} />}
                sx={{
                  background: '#00ba4d',

                  color: 'white !important',
                  fontWeight: '600',
                  padding: '6px 20px',
                  border: '1px solid #00ba4d !important',
                  '&:hover': {
                    border: '1px solid white !important',
                    color: '#00ba4d !important',
                    background: '#fff !important',
                  },
                }}
              >
                Accept
              </Button>
            )}

            <Button
              onClick={
                direction === CallDirection.outbound
                  ? terminateCallHandler
                  : rejectCallHandler
              }
              variant="outlined"
              startIcon={<Icon icon={'mdi:call-end'} />}
              sx={{
                background: '#ef3b14',
                border: '1px solid #ef3b14 !important',
                color: 'white !important',
                fontWeight: '600',
                padding: '6px 20px',
                '&:hover': {
                  border: '1px solid white !important',
                  color: '#ef3b14 !important',
                  background: '#fff !important',
                },
              }}
            >
              {direction === CallDirection.outbound ? 'Cancel' : 'Reject'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Draggable>
  );
};

export default ConnectingCall;
