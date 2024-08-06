import { useState } from 'react';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast';

import { Icon } from '@iconify/react';
import { IconButton, Stack } from '@mui/material';

import useCallFeature from '../../../hooks/useCallFeature';
import { updateCallOptionModalState } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import DialPad from '../dialpad/Dialpad';

const CallTransferDialPad = () => {
  const [number, setNumber] = useState<string>('');
  const { callOptionModal } = useSelector((state) => state.callsReducer);
  const { attendedTransfer, blindTransfer } = useCallFeature();
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

  const closeDialPadHandle = () => {
    dispatch(updateCallOptionModalState({ key: 'callTransfer', value: false }));
    dispatch(
      updateCallOptionModalState({ key: 'isAttendedTransfer', value: false }),
    );
    dispatch(
      updateCallOptionModalState({ key: 'isBlindTransfer', value: false }),
    );
  };

  const attendedCallTransferHandler = () => {
    if (number) {
      const res = attendedTransfer(number);
      if (res) {
        toast.success('Call Transferred Successfully');
      } else {
        toast.error('Call Transferred Failed');
      }
    } else {
      toast.error('Enter Number To Transfer Call');
    }
  };

  const blindCallTransferHandler = () => {
    if (number) {
      const res = blindTransfer(number);
      if (res) {
        toast.success('Call Transferred Successfully');
      } else {
        toast.error('Call Transferred Failed');
      }
      closeDialPadHandle();
    } else {
      toast.error('Enter Number To Transfer Call');
    }
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
        <Stack>
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
              {/* Attendant Call Transfer  */}
              {callOptionModal.callTransfer &&
                callOptionModal.isAttendedTransfer && (
                  <IconButton
                    sx={{
                      width: '60px',
                      height: '60px',
                      background: '#49A8FF',
                      '&:disabled': {
                        background: '#49A8FF',
                      },
                    }}
                    onClick={attendedCallTransferHandler}
                  >
                    <Icon icon={'fluent-mdl2:transfer-call'} />
                  </IconButton>
                )}

              {/* Blind Call Transfer Button */}
              {callOptionModal.callTransfer &&
                callOptionModal.isBlindTransfer && (
                  <IconButton
                    sx={{
                      width: '60px',
                      height: '60px',
                      background: '#49A8FF',
                      '&:disabled': {
                        background: '#49A8FF',
                      },
                    }}
                    onClick={blindCallTransferHandler}
                  >
                    <Icon icon={'wpf:call-transfer'} />
                  </IconButton>
                )}
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
      </Stack>
    </Draggable>
  );
};

export default CallTransferDialPad;
