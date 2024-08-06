import { useMemo } from 'react';

import { Icon } from '@iconify/react';
import {
  Avatar,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';

import useCallFeature from '../../../hooks/useCallFeature';
import { updateCallSliceState } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { CallDirection, SessionState } from '../../../types/apps/calls';
import { formatPhoneNumber } from '../../../utils/utils';

const AnswerCallButton = styled(IconButton)<any>(({ theme }) => ({
  backgroundColor: '#38BE51',
  color: '#fff',
  boxShadow: `0 0 0 2px #38BE51`,
  zIndex: 2,
  '&::after': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    animation: 'ripple 1.2s infinite ease-in-out',
    border: '10px solid #38BE51',
    content: '""',
    zIndex: -1,
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.5)',
      opacity: 0,
    },
  },
}));
const ConnectingScreen = () => {
  const {
    direction,
    dialNumber,
    selectedUser,
    display_name,
    selectedChat,
    callId,
  } = useSelector((state) => state.callsReducer);
  const { answerCall, terminateCall, rejectCall, sessionCount } =
    useCallFeature();
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
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ width: '100%' }}
        >
          <Typography
            sx={{
              color: 'white !important',
              textTransform: 'capitalize',
              fontSize: '16px',
            }}
          >
            {direction === CallDirection.inbound
              ? 'Incoming Call'
              : 'Connecting Call'}
          </Typography>
          {/* <IconButton sx={{ width: '32px', height: '32px', background: 'rgba(217,217,217,0.2)', }} onClick={closeHandler}
                        disabled={sessionCount() > 0 ? true : false}
                    >
                        <Icon icon={"fa:close"} />
                    </IconButton> */}
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
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ padding: '15px' }}
        >
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
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
                }}
              >
                {UserDisplayName}
              </Typography>
              <Typography sx={{ color: '#ffff !important' }}>
                {formatPhoneNumber(dialNumber)}
              </Typography>
            </Stack>
          </Stack>

          {/* <Stack>
                            <Stack direction={'column'}>
                                <Typography sx={{ color: '#FFFFFF' }}>
                                    In Pogress
                                 
                                </Typography>
                                <Typography sx={{ color: '#62626D', fontWeight: '600' }}>
                                    00:00:00
                                </Typography>
                            </Stack>
                        </Stack> */}
        </Stack>

        <Stack
          direction={'row'}
          sx={{ marginBottom: '28px' }}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={3}
        >
          {direction === CallDirection.inbound && (
            <AnswerCallButton
              sx={{
                width: '50px',
                height: '50px',
                background: '#38BE51',
                '&:disabled': {
                  background: '#38BE51',
                },
              }}
              onClick={answerCallHandler}
            >
              <Icon icon={'ic:baseline-call'} />
            </AnswerCallButton>
          )}
          <IconButton
            sx={{
              width: '50px',
              height: '50px',
              background: '#B12D2D',
              color: '#fff !important',
              '&:disabled': {
                background: '#B12D2D',
              },
              '&:hover': {
                border: '1px solid white !important',
                color: '#B12D2D !important',
                background: 'rgba(255, 255, 255, 0.9) !important',
              },
            }}
            onClick={
              direction === CallDirection.outbound
                ? terminateCallHandler
                : rejectCallHandler
            }
          >
            <Icon icon={'mdi:call-end'} />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConnectingScreen;
