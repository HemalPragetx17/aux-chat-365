'use client';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { useAuth } from '../../hooks/useAuth';
import useCallFeature from '../../hooks/useCallFeature';
import {
  getSigningToken,
  setYeasterToken,
  updateCallSliceState,
} from '../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../store/Store';
import { SessionState } from '../../types/apps/calls';
import DialerDialPad from './dialpad/DialerDialpad';
import CallScreen from './phone/CallScreen';
import CallTransferDialPad from './phone/CallTransferDialpad';
import DtmfDialPad from './phone/DtmfDialPad';

const CallFeature = () => {
  const { connectPBX, sessionCount } = useCallFeature();
  const [socket, setSocket] = useState<Socket | null>();
  const {
    sessionState,
    isInboundConnectingCall,
    toggleDialPad,
    from_number,
    signToken,
    ongoingSession,
    callOptionModal,
    isConnectingCall,
    yeasterAccessToken,
    yeasterRefreshToken,
    connected,
  } = useSelector((state) => state.callsReducer);

  const dispatch = useDispatch();
  const { user, settings } = useAuth();

  useEffect(() => {
    if (user && user?.role?.roleId !== 1) {
      dispatch(getSigningToken());
    }
  }, [user]);

  useEffect(() => {
    if (user?.role?.roleId !== 1 && !connected && signToken) {
      connectPBX();
    }
  }, [user, signToken, connected]);

  useEffect(() => {
    if (!from_number && settings) {
      dispatch(
        updateCallSliceState({
          key: 'from_number',
          value: settings?.defaultDid?.phoneNumber || '',
        }),
      );
    }
  }, [from_number, settings]);

  useEffect(() => {
    if (
      yeasterAccessToken !== localStorage.getItem('yeasterAccessToken') ||
      yeasterRefreshToken !== localStorage.getItem('yeasterRefreshToken')
    ) {
      const Tokens = {
        access_token: localStorage.getItem('yeasterAccessToken') || '',
        refresh_token: localStorage.getItem('yeasterRefreshToken') || '',
      };
      dispatch(setYeasterToken(Tokens));
    }
  }, [localStorage]);

  // useEffect(()=>{
  // const audio = new Audio('/sound/ringtone.mp3')
  // audio.loop = true
  // audio.play()
  // },[])

  const connectingCallRingtone = (option: string) => {
    const ringtone: HTMLAudioElement | any = document.getElementById(
      'connecting-ringtone',
    );

    if (option === 'play') {
      ringtone?.play();
    }
    if (option === 'pause') {
      ringtone?.pause();

      ringtone.currentTime = null;
    }
  };

  useEffect(() => {
    if (
      [SessionState.connecting, SessionState.ringing].includes(sessionState)
    ) {
      connectingCallRingtone('play');
    } else {
      connectingCallRingtone('pause');
    }
  }, [sessionState]);

  return (
    <>
      {isInboundConnectingCall || isConnectingCall || ongoingSession ? (
        <CallScreen />
      ) : null}
      <audio src="/sound/ringtone.mp3" loop id="connecting-ringtone" />

      {toggleDialPad && <DialerDialPad />}

      {/* DTMF DialPad */}
      {callOptionModal.dtmf && <DtmfDialPad />}

      {/* Call Transfer DialPad*/}
      {callOptionModal.callTransfer &&
        (callOptionModal.isAttendedTransfer ||
          callOptionModal.isBlindTransfer) && <CallTransferDialPad />}
    </>
  );
};

export default CallFeature;
