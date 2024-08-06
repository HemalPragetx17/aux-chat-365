import { Icon } from '@iconify/react';
import { IconButton, Stack } from '@mui/material';
import { styled } from '@mui/system';

import useCallFeature from '../../../hooks/useCallFeature';
import {
  closeCallScreenModal,
  updateCallOptionModalState,
  updateCallSliceState,
} from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { SessionState } from '../../../types/apps/calls';

export const CustomButton = styled(IconButton)(({ theme }) => ({
  background: '#e5eaef8c',
  color: 'rgba(39,39,67,255)',
  width: '36px',
  height: '36px',
  '&:hover': {
    color: 'white !important',
    background: 'rgba(255, 255, 255, 0.1) !important',
  },
  '&:disabled': {
    background: '#e5eaef8c',
  },
}));
const CallActionButtonsList = () => {
  const { hangupCall, isHolded, isMuted, unhold, unmute, hold, mute } =
    useCallFeature();
  const { callOptionModal } = useSelector((state) => state.callsReducer);

  const dispatch = useDispatch();

  const closeConnectingModal = () => {
    dispatch(updateCallSliceState({ key: 'ongoingSession', value: null }));
    dispatch(updateCallSliceState({ key: 'selectedChat', value: null }));
    dispatch(updateCallSliceState({ key: 'isConnectingCall', value: false }));
    dispatch(updateCallSliceState({ key: 'display_name', value: '' }));
    dispatch(
      updateCallSliceState({ key: 'sessionState', value: SessionState.ended }),
    );
    dispatch(closeCallScreenModal());
  };

  const hangupHandler = () => {
    hangupCall();
    closeConnectingModal();
    // handleSendMessage()
  };

  const toggleCallOptionModal = () => {
    dispatch(updateCallOptionModalState({ key: 'toggle', value: true }));
  };

  const toggleDtmfModal = () => {
    dispatch(updateCallOptionModalState({ key: 'dtmf', value: true }));
  };

  const toggleCallTransfer = () => {
    dispatch(updateCallOptionModalState({ key: 'callTransfer', value: true }));
    dispatch(updateCallOptionModalState({ key: 'toggle', value: true }));
  };

  const blindTransferHandle = () => {
    dispatch(updateCallOptionModalState({ key: 'callTransfer', value: true }));
    dispatch(updateCallOptionModalState({ key: 'toggle', value: false }));
    dispatch(
      updateCallOptionModalState({ key: 'isAttendedTransfer', value: false }),
    );

    dispatch(
      updateCallOptionModalState({ key: 'isBlindTransfer', value: true }),
    );
  };

  return (
    <>
      <Stack
        direction={'row'}
        justifyContent={'center'}
        alignContent={'center'}
        spacing={1}
        sx={{ marginBottom: '15px !important' }}
      >
        {/* Call Mute / Call Unmute Button */}
        <CustomButton
          onClick={() => {
            isMuted() ? unmute() : mute();
          }}
        >
          <Icon
            icon={
              !isMuted() ? 'vaadin:microphone' : 'clarity:microphone-mute-solid'
            }
          />
        </CustomButton>

        {/* DTMF */}
        <CustomButton onClick={toggleDtmfModal}>
          <Icon icon={'ic:round-dialpad'} />
        </CustomButton>

        {/* Call Transfer Option */}
        {/* <CustomButton  onClick={toggleCallTransfer} disabled={callOptionModal.callTransfer}>
                    <Icon icon={"fluent:call-transfer-16-regular"} />
                </CustomButton> */}

        <CustomButton onClick={blindTransferHandle}>
          <Icon icon={'fluent:call-transfer-16-regular'} />
        </CustomButton>

        {/* <CustomButton onClick={toggleCallOptionModal}>
                    <Icon icon={"pepicons-pop:dots-x"} />
                </CustomButton>  */}

        {/* Call Hold UnHold Button */}
        <CustomButton onClick={() => (isHolded() ? unhold() : hold())}>
          <Icon
            icon={
              isHolded()
                ? 'icon-park-solid:phone-call'
                : 'fluent:call-pause-24-filled'
            }
          />
        </CustomButton>
        <CustomButton
          onClick={hangupHandler}
          sx={{
            background: '#ef3b14',
            border: 'none',
            color: 'white !important',
            '&:hover': {
              border: '1px solid white !important',
              color: '#ef3b14 !important',
              background: 'rgba(255, 255, 255, 0.9) !important',
            },
          }}
        >
          <Icon icon={'fluent:call-end-16-filled'} />
        </CustomButton>
      </Stack>
    </>
  );
};

export default CallActionButtonsList;
