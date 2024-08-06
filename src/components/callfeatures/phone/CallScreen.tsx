import { useEffect } from 'react';
import Draggable from 'react-draggable';

import { Icon } from '@iconify/react';
import { IconButton, Stack } from '@mui/material';

import useCallFeature from '../../../hooks/useCallFeature';
import { closeCallScreenModal } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { SessionState } from '../../../types/apps/calls';
import ConnectingScreen from './ConnectingScreen';
import OngoingCallScreen from './OngoingCallScreen';

const CallScreen = () => {
  const {
    sessionState,
    isInboundConnectingCall,
    isConnectingCall,
    ongoingSession,
    phone,
  } = useSelector((state) => state.callsReducer);
  const { sessionCount } = useCallFeature();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ongoingSession && !isInboundConnectingCall && !isConnectingCall) {
      dispatch(closeCallScreenModal());
    }
  }, [isInboundConnectingCall, isConnectingCall, ongoingSession]);
  const closeHandler = () => {
    dispatch(closeCallScreenModal());
  };

  return (
    <Draggable>
      <Stack
        sx={{
          width: '320px',
          height: '296px',
          border: '4px solid #38BE51',
          background: '#323441',
          position: 'absolute',
          bottom: '30px',
          right: '61px',
          zIndex: 99999,
          borderRadius: '5% 5% 5% 30%',
          overflow: 'hidden',
        }}
      >
        <IconButton
          sx={{
            width: '32px',
            height: '32px',
            background: 'rgba(217,217,217,0.2)',
            position: 'absolute',
            top: '5px',
            right: '10px',
            borderRadius: '30%',
          }}
          disabled={sessionCount() > 0 ? true : false}
          onClick={closeHandler}
        >
          <Icon icon={'fa:close'} />
        </IconButton>
        {/* <OngoingCallScreen /> */}

        {[SessionState.connecting, SessionState.ringing].includes(
          sessionState,
        ) &&
          (isInboundConnectingCall || isConnectingCall) && <ConnectingScreen />}

        {ongoingSession &&
          ![SessionState.connecting, SessionState.ringing].includes(
            sessionState,
          ) &&
          !isInboundConnectingCall &&
          !isConnectingCall && <OngoingCallScreen />}
      </Stack>
    </Draggable>
  );
};

export default CallScreen;
