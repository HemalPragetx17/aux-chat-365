import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useStopwatch } from 'react-timer-hook';
import { PBXOperator, PhoneOperator, Session, init } from 'ys-webrtc-sdk-core';

import store, { useDispatch, useSelector } from '../store/Store';
import {
  closeCallScreenModal,
  updateCallSliceState,
} from '../store/apps/calls/callsSlice';
import { sendMessage } from '../store/apps/chat/ChatSlice';
import { CallDirection, SessionState } from '../types/apps/calls';
import { removePlusSign } from '../utils/format';
import { pad } from '../utils/utils';

import { useAuth } from './useAuth';

type ArgType = {
  callId: string;
  session: Session;
};
type TimerActionType = 'stop' | 'pause' | 'reset' | 'start';

interface CallFeatureHookType {
  connectPBX: () => void;
  call: (number: string) => void;
  hangupCall: () => void;
  sessionCount: () => number;
  getSession: (callId: string) => Session | null;
  answerCall: () => void;
  rejectCall: () => void;
  terminateCall: () => void;
  activeSession: () => Session | null;
  dtmf: (tone: number | string, id?: string | undefined) => void;
  unhold: (id?: string | undefined) => void;
  hold: (id?: string | undefined) => void;
  unmute: (id?: string | undefined) => void;
  mute: (id?: string | undefined) => void;
  isMuted: (id?: string | undefined) => boolean;
  isHolded: (id?: string | undefined) => boolean;
  TimerAction: (action: TimerActionType) => any;
  callTimer: string;
  disconnectPbx: () => void;
  registerPBX: () => void;
  attendedTransfer: (number: string, id?: string | undefined) => boolean;
  blindTransfer: (number: string, id?: string | undefined) => boolean;
}

const useCallFeature = (): CallFeatureHookType => {
  const [callTimer, setCallTimer] = useState<string>('00:00:00');
  const {
    phone,
    ongoingSession,
    sessionState,
    connected,
    selectedChat,
    signToken,
    username,
    yeasterAccessToken,
    pbx,
    callId,
  } = useSelector((state) => state.callsReducer);
  const dispatch = useDispatch();
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const { user, settings } = useAuth();
  const [recordingFile, setRecordingFile] = useState('');

  const sessionCount = (): number => {
    let count = 0;
    if (phone) {
      count = phone.sessions.size;
    }
    return count;
  };

  useEffect(() => {
    if (!pbx) return;
    const runtimeErrorHanlder = (reason: any) => {
      const { code, message } = reason;
      console.error(
        `pbx runtime erroe, code: ${code} message: ${message}.`,
        reason,
      );
      // Sdk inside will destroy.
      // You should do something， Like re-init the sdk.
      // Your logic...
    };
    pbx.on('runtimeError', runtimeErrorHanlder);

    return () => {
      pbx.removeListener('runtimeError', runtimeErrorHanlder);
    };
  }, [pbx]);

  const ongoingSessionCount = sessionCount();
  const TimerAction = (action: TimerActionType) => {
    switch (action) {
      case 'start':
        start();
        break;
      case 'reset':
        reset();
        break;
      case 'pause':
        pause();
        break;
      case 'stop':
        reset();
        pause();
        break;
    }
  };

  useEffect(() => {
    if (sessionState === SessionState.talking && ongoingSessionCount > 0) {
      TimerAction('start');
    } else {
      TimerAction('stop');
    }
  }, [ongoingSessionCount, sessionState]);

  useEffect(() => {
    setCallTimer(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
  }, [seconds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendMessage = (
    callId: string,
    callType: string = 'outbound',
    cdrDetails: any,
  ) => {
    const { selectedChat, dialNumber, direction, from_number } =
      store.getState().callsReducer;
    let callDetails = {
      callId: callId,
      from_number: from_number,
      call_type: callType,
      to_number: dialNumber,
      id: cdrDetails?.id || '',
      uniqueid: cdrDetails?.uniqueid || '',
      timestamp: cdrDetails?.timestamp || '',
      talk_duration: cdrDetails?.talk_duration || 0,
      recordingFile: recordingFile || '',
    };
    let payload: any = {
      to: dialNumber,
      from: from_number,
      sender: user?.name,
      message: 'Call',
      mediaType: 'Call',
      messageType: 'call',
      callDetails: callDetails,
    };
    if (direction === CallDirection.inbound) {
      callDetails = {
        ...callDetails,
        call_type: callType,
      };
      payload = {
        ...payload,
        messageDirection: 'INBOUND',
        messageType: 'call',
        callDetails: callDetails,
      };
    }
    dispatch(sendMessage(payload));
    dispatch(
      updateCallSliceState({ key: 'direction', value: CallDirection.outbound }),
    );
  };

  const playRemote = (stream: MediaStream) => {
    const remoteAudio = new Audio();
    remoteAudio.srcObject = stream;
    remoteAudio.play();
  };

  const connectPBX = async () => {
    const { pbx_details } = settings as any;
    if (signToken && username && Boolean(pbx_details?.pbxUrl)) {
      init({
        username: username, //"moodi@auxout.net", // your extension
        secret: signToken, //"eyJleHBpcmUiOjAsInNpZ24iOiJ3RTZxZXJRMUI3UmFBYmxRSVhJSlMxT0FEVlV4YjMrZHNERXFrVkRoZkNZPSIsInVzZXJuYW1lIjoibW9vZGlAYXV4b3V0Lm5ldCIsInZlcnNpb24iOiIxLjAifQ__",//"eyJleHBpcmUiOjAsInNpZ24iOiJ3RTZxZXJRMUI3UmFBYmxRSVhJSlMxT0FEVlV4YjMrZHNERXFrVkRoZkNZPSIsInVzZXJuYW1lIjoibW9vZGlAYXV4b3V0Lm5ldCIsInZlcnNpb24iOiIxLjAifQ__",
        pbxURL: `https://${pbx_details?.pbxUrl}:443`, // your pbx URL
        disableCallWaiting: true, // disabled call waiting,only handle one call.
      })
        .then(
          ({
            phone,
            pbx,
            destroy,
          }: {
            phone: PhoneOperator;
            pbx: PBXOperator;
            destroy: any;
          }) => {
            dispatch(updateCallSliceState({ key: 'phone', value: phone }));
            dispatch(updateCallSliceState({ key: 'pbx', value: pbx }));

            phone.on('connected', () => {
              dispatch(updateCallSliceState({ key: 'connected', value: true }));
            });

            phone.on('disconnected', () => {
              dispatch(
                updateCallSliceState({ key: 'connected', value: false }),
              );
            });

            // phone.on('recordPermissionsChange', (arag: any) => {
            //     console.debug(' node-sass', arag)
            // })

            phone.on('isRegisteredChange', (arag: any) => {
              dispatch(updateCallSliceState({ key: 'connected', value: arag }));
            });

            phone.on('newRTCSession', ({ callId, session }: ArgType) => {
              dispatch(
                updateCallSliceState({ key: 'ongoingSession', value: session }),
              );
              dispatch(updateCallSliceState({ key: 'callId', value: callId }));
              if (session) {
                session?.on('statusChange', (status) => {
                  // pbx.socket?.send({ "topic_list": [30011, 30012] })
                  // socket?.send({ "topic_list": [30011, 30012] })
                });

                session?.on(
                  'streamAdded',
                  ({
                    callId,
                    communicationType,
                    stream,
                  }: {
                    callId: string;
                    communicationType: 'outbound' | 'inbound';
                    stream: MediaStream;
                  }) => {
                    playRemote(stream);
                  },
                );

                session?.on('accepted', () => {
                  dispatch(
                    updateCallSliceState({
                      key: 'sessionState',
                      value: SessionState.accepted,
                    }),
                  );
                  dispatch(
                    updateCallSliceState({
                      key: 'isInboundConnectingCall',
                      value: false,
                    }),
                  );
                });

                session?.on('progress', () => {
                  dispatch(
                    updateCallSliceState({
                      key: 'sessionState',
                      value: SessionState.ringing,
                    }),
                  );
                  startRecord(callId);
                });
                session?.on('confirmed', () => {
                  TimerAction('start');
                  dispatch(
                    updateCallSliceState({
                      key: 'sessionState',
                      value: SessionState.talking,
                    }),
                  );
                  dispatch(
                    updateCallSliceState({
                      key: 'isConnectingCall',
                      value: false,
                    }),
                  );
                });
                session?.on('ended', async () => {
                  const callDetails = await pbx.cdrQuery({
                    size: 1,
                    orderBy: 'desc',
                    page: 1,
                  });

                  let cdrDetails: any;
                  if (callDetails?.errcode === 0) {
                    cdrDetails = callDetails?.personal_cdr_list[0];
                  }

                  handleSendMessage(callId, 'inbound', cdrDetails);

                  dispatch(
                    updateCallSliceState({
                      key: 'ongoingSession',
                      value: null,
                    }),
                  );
                  dispatch(
                    updateCallSliceState({ key: 'selectedChat', value: null }),
                  );
                  dispatch(
                    updateCallSliceState({
                      key: 'sessionState',
                      value: SessionState.ended,
                    }),
                  );
                  dispatch(
                    updateCallSliceState({
                      key: 'isConnectingCall',
                      value: false,
                    }),
                  );
                  if (sessionCount() > 0) {
                    TimerAction('stop');
                  }
                  dispatch(closeCallScreenModal());
                });

                session?.on('failed', async (arg: any) => {
                  const callDetails = await pbx.cdrQuery({
                    size: 1,
                    orderBy: 'desc',
                    page: 1,
                  });
                  // console.debug('callDetails',callDetails)

                  let cdrDetails: any;
                  if (callDetails?.errcode === 0) {
                    cdrDetails = callDetails?.personal_cdr_list[0];
                  }

                  let call_type = 'missed_calls';
                  if (arg && arg?.cause === 'Rejected') {
                    call_type = 'inbound';
                  }
                  handleSendMessage(callId, call_type, cdrDetails);
                  dispatch(
                    updateCallSliceState({
                      key: 'ongoingSession',
                      value: null,
                    }),
                  );
                  dispatch(
                    updateCallSliceState({ key: 'selectedChat', value: null }),
                  );
                  dispatch(
                    updateCallSliceState({
                      key: 'sessionState',
                      value: SessionState.ended,
                    }),
                  );
                  dispatch(
                    updateCallSliceState({
                      key: 'isConnectingCall',
                      value: false,
                    }),
                  );
                  if (sessionCount() > 0) {
                    TimerAction('stop');
                  }
                  dispatch(closeCallScreenModal());
                });
              }
              if (
                session &&
                session.status?.communicationType === CallDirection.outbound
              ) {
                dispatch(
                  updateCallSliceState({
                    key: 'direction',
                    value: CallDirection.outbound,
                  }),
                );
              } else {
                const number = session.status.number;
                const displayName = session.status.name;
                dispatch(
                  updateCallSliceState({ key: 'dialNumber', value: number }),
                );
                dispatch(
                  updateCallSliceState({
                    key: 'display_name',
                    value: displayName,
                  }),
                );
                dispatch(
                  updateCallSliceState({
                    key: 'direction',
                    value: CallDirection.inbound,
                  }),
                );
                dispatch(
                  updateCallSliceState({
                    key: 'sessionState',
                    value: SessionState.ringing,
                  }),
                );

                dispatch(
                  updateCallSliceState({
                    key: 'isInboundConnectingCall',
                    value: true,
                  }),
                );
                dispatch(
                  updateCallSliceState({ key: 'selectedChat', value: null }),
                );
                dispatch(
                  updateCallSliceState({ key: 'selectedUser', value: null }),
                );
              }
              startSession({ callId, session });
              session.status;
            });

            pbx.on('runtimeError', (err) => {
              console.debug('Pbx Error', err);
            });

            phone.on('registrationFailed', (error: any) => {
              console.debug('registrationFailed ', error);
              dispatch(
                updateCallSliceState({ key: 'connected', value: false }),
              );
            });

            phone.start();
          },
        )
        .catch((err) => {
          dispatch(updateCallSliceState({ key: 'connected', value: false }));
          dispatch(updateCallSliceState({ key: 'phone', value: null }));
          dispatch(updateCallSliceState({ key: 'pbx', value: null }));
          console.debug('PBX Error', err);
        });
    }
  };

  const call = async (number: string) => {
    if (connected) {
      if (phone && number) {
        const _number = removePlusSign(number);
        phone.call(_number);
        dispatch(updateCallSliceState({ key: 'dialNumber', value: number }));
        dispatch(
          updateCallSliceState({ key: 'isConnectingCall', value: true }),
        );
        dispatch(updateCallSliceState({ key: 'toggleDialPad', value: false }));
      } else {
        toast.error('Enter Number');
      }
    } else {
      toast.error('Disconnected');
    }
  };

  const startSession = ({ callId, session }: { callId: any; session: any }) => {
    if (phone && phone.sessions) {
      dispatch(updateCallSliceState({ key: 'ongoingSession', value: session }));
      dispatch(
        updateCallSliceState({
          key: 'sessions',
          value: Array.from(phone.sessions.values()),
        }),
      );
    }
  };

  const deleteSession = ({
    callId,
    session,
  }: {
    callId: any;
    session: any;
  }) => {
    const phone = store.getState().callsReducer.phone;
    if (phone && phone?.sessions) {
      dispatch(updateCallSliceState({ key: 'ongoingSession', value: session }));
      dispatch(
        updateCallSliceState({
          key: 'sessions',
          value: Array.from(phone.sessions.values()),
        }),
      );
    }
  };
  const hangupCall = () => {
    if (ongoingSession) {
      ongoingSession?.terminate('hangup');
    }
  };

  const answerCall = () => {
    if (ongoingSession) {
      ongoingSession?.answer();
    }
  };

  const rejectCall = () => {
    if (ongoingSession) {
      ongoingSession?.terminate('reject');
    }
  };
  const terminateCall = () => {
    if (ongoingSession) {
      ongoingSession?.terminate('terminate');
    }
  };

  const getSession = (callId: string): Session | null => {
    let session = null;
    if (phone) {
      session = phone?.sessions?.get(callId) || null;
    }

    return session;
  };

  const activeSession = (): Session | null => {
    return ongoingSession ? ongoingSession : null;
  };
  const isMuted = (id: string | undefined): boolean => {
    if (id) {
      const session = getSession(id);
      return (session && session?.status?.isMute) || false;
    } else {
      return (ongoingSession && ongoingSession?.status?.isMute) || false;
    }
  };

  const mute = (id: string | undefined): void => {
    if (id) {
      const session = getSession(id);
      session && session.mute();
    } else {
      ongoingSession && ongoingSession?.mute();
    }
  };

  const unmute = (id: string | undefined): void => {
    if (id) {
      const session = getSession(id);
      session && session?.unmute();
    } else {
      ongoingSession && ongoingSession?.unmute();
    }
  };

  const isHolded = (id: string | undefined): boolean => {
    if (id) {
      const session = getSession(id);
      return (session && session?.status?.isHold) || false;
    } else {
      return (ongoingSession && ongoingSession?.status?.isHold) || false;
    }
  };

  const hold = (id: string | undefined): void => {
    if (id) {
      const session = getSession(id);
      session && session.hold();
    } else {
      ongoingSession && ongoingSession?.hold();
    }
  };

  const unhold = (id: string | undefined): void => {
    if (id) {
      const session = getSession(id);
      session && session?.unhold();
    } else {
      ongoingSession && ongoingSession?.unhold();
    }
  };

  const dtmf = (tone: number | string, id: string | undefined): void => {
    if (id) {
      const session = getSession(id);
      session && session?.dtmf(tone as string);
    } else {
      ongoingSession && ongoingSession?.dtmf(tone as string);
    }
  };

  const attendedTransfer = (number: string, id: string | undefined): any => {
    if (phone) {
      if (id) {
        const session = getSession(id);
        return (session && session?.attendedTransfer(number)) || false;
      } else {
        if (ongoingSession && callId && phone) {
          const SessionCallId = ongoingSession?.status?.callId;
          const RTCID = ongoingSession?.RTCSession._id;

          return phone.attendedTransfer(callId, number) || false;
        }
        return false;
      }
    } else {
      return false;
    }
  };

  const blindTransfer = (number: string, id: string | undefined): boolean => {
    if (phone) {
      if (id) {
        const session = getSession(id);
        return (session && session?.blindTransfer(number)) || false;
      } else {
        if (ongoingSession && callId && phone) {
          const SessionCallId = ongoingSession?.status?.callId;
          return phone.blindTransfer(SessionCallId, number) || false;
        }
        return false;
      }
    } else {
      return false;
    }
  };

  const startRecord = (id: string | undefined): void => {
    if (id && phone) {
      const session = getSession(id);
      const res = phone?.startRecord(id);
    } else {
      const res = ongoingSession && ongoingSession?.startRecord();
    }
  };

  const pauseRecording = (id: string | undefined): void => {
    if (id) {
      const session = getSession(id);
      session?.pauseRecord();
    } else {
      ongoingSession?.pauseRecord();
    }
  };

  const disconnectPbx = () => {
    if (phone) {
      phone?.disconnect();
      phone?.destroy();
    }
    dispatch(updateCallSliceState({ key: 'phone', value: null }));
    dispatch(updateCallSliceState({ key: 'pbx', value: null }));
    dispatch(updateCallSliceState({ key: 'connected', value: false }));
    dispatch(updateCallSliceState({ key: 'signToken', value: '' }));
    dispatch(updateCallSliceState({ key: 'username', value: '' }));
  };
  const registerPBX = async () => {
    if (phone && username && signToken) {
      phone.reRegister(username, signToken);
    }
  };

  return {
    connectPBX,
    call,
    getSession,
    sessionCount,
    hangupCall,
    answerCall,
    rejectCall,
    terminateCall,
    callTimer,
    activeSession,
    dtmf,
    unhold,
    hold,
    mute,
    unmute,
    isMuted,
    isHolded,
    TimerAction,
    disconnectPbx,
    registerPBX,
    blindTransfer,
    attendedTransfer,
  };
};

export default useCallFeature;
