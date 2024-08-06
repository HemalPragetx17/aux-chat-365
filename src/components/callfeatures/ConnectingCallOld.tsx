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
import { useSelector } from '../../store/Store';
import { CallDirection } from '../../types/apps/calls';

const ConnectingCall = () => {
  const { direction } = useSelector((state) => state.callsReducer);
  const { answerCall, terminateCall, rejectCall } = useCallFeature();
  const answerCallHandler = () => {
    answerCall();
  };

  const terminateCallHandler = () => {
    terminateCall();
  };
  const rejectCallHandler = () => {
    rejectCall();
  };
  return (
    <Draggable>
      <Card
        sx={{
          maxWidth: '300px',
          maxHeight: '300px',
          // background: "rgba(31,29,42,255)",
          background:
            'linear-gradient(90deg, rgba(74,21,140,1) 15%, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)!important',
          padding: '5px',
          zIndex: '99999 !important',
          border: '3px solid #c56dff',
          position: 'absolute',
          bottom: '20px',
          right: '20px',
        }}
      >
        <Typography sx={{ color: 'white !important', padding: '10px' }}>
          Connecting...
        </Typography>
        <Divider
          sx={{
            width: '100%',
            border: '1px solid #c56dff',
            //  border: '1px solid #52535a'
          }}
        />
        <Stack
          direction="column"
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ marginTop: '15px' }}
          spacing={4}
        >
          <Avatar sx={{ height: '70px', width: '70px' }}>N</Avatar>
          <Stack
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={1}
          >
            <Typography sx={{ color: '#fff', fontSize: '1.3rem' }}>
              Jhone Done
            </Typography>
            <Typography sx={{ color: '#dadbe3 !important', fontWeight: '600' }}>
              +91 99999999
            </Typography>
          </Stack>

          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
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
