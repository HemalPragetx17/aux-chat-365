import { useState } from 'react';
import Draggable from 'react-draggable';

import { Icon } from '@iconify/react';
import { IconButton, Stack } from '@mui/material';

import { useAuth } from '../../../hooks/useAuth';
import useCallFeature from '../../../hooks/useCallFeature';
import { updateCallSliceState } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { SessionState } from '../../../types/apps/calls';
import DialPad from './Dialpad';

const DialerDialPad = () => {
  const [number, setNumber] = useState('');
  const { connected } = useSelector((state) => state.callsReducer);
  const { settings } = useAuth();
  const { call } = useCallFeature();

  const dispatch = useDispatch();
  const clearNumber = () => {
    setNumber((prv: any) => prv.substring(0, prv.length - 1));
  };
  const changeHandler = (e: any) => {
    setNumber(e.target.value);
  };
  const typeNumber = (num: any) => {
    setNumber(number.concat(num));
  };

  const dialHandler = () => {
    if (number) {
      dispatch(updateCallSliceState({ key: 'isConnectingCall', value: true }));
      dispatch(
        updateCallSliceState({
          key: 'sessionState',
          value: SessionState.ringing,
        }),
      );
      dispatch(updateCallSliceState({ key: 'dialNumber', value: number }));
      dispatch(updateCallSliceState({ key: 'selectedUser', value: null }));
      dispatch(
        updateCallSliceState({
          key: 'from_number',
          value: settings?.defaultDid.phoneNumber || '',
        }),
      );
      call(number);

      // call('6463498787')
    }
  };

  const closeDialPadHandle = () => {
    dispatch(updateCallSliceState({ key: 'toggleDialPad', value: false }));
  };

  return (
    <Draggable>
      <Stack
        sx={{
          width: '320px',
          height: '520px',
          border: '4px solid #49A8FF',
          zIndex: 99999,
          position: 'absolute',
          top: '30px',
          right: '61px',
          borderRadius: '20px 20px 20px 129px',
          background: '#323441',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '0px',
            width: '15px',
            height: '15px',
            marginBottom: '5px',
            color: '#d9d9d98c',
          }}
          onClick={closeDialPadHandle}
        >
          <Icon icon={'fa:close'} />
        </IconButton>
        <DialPad
          number={number}
          clearNumber={clearNumber}
          typeNumber={typeNumber}
          changeHandler={changeHandler}
        >
          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={3}
          >
            <IconButton
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '40% 10% 40% 40%',
                background: 'rgba(217,217,217,0.2)',
              }}
            >
              <Icon icon={'material-symbols:voicemail'} />
            </IconButton>
            <IconButton
              sx={{
                width: '60px',
                height: '60px',
                background: '#49A8FF',
                '&:disabled': {
                  background: '#49A8FF',
                },
              }}
              onClick={dialHandler}
              disabled={!connected || !number ? true : false}
            >
              <Icon icon={'ic:baseline-call'} />
            </IconButton>
            <IconButton
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '10% 40% 40% 40%',
                background: 'rgba(217,217,217,0.2)',
              }}
              onClick={clearNumber}
            >
              <Icon icon={'iconamoon:close-bold'} />
            </IconButton>
          </Stack>
        </DialPad>
      </Stack>
    </Draggable>
  );
};

export default DialerDialPad;
