import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PBXOperator, PhoneOperator, Session } from 'ys-webrtc-sdk-core';

import { CallDirection, SessionState } from '../../../types/apps/calls';
import axios from '../../../utils/axios';
import { getApiAuthLoginToken } from '../../../utils/call-features/call-featuresApi';
import { AppDispatch } from '../../Store';

interface CallOptionModalOptions {
  toggle: boolean;
  dtmf: boolean;
  callTransfer: boolean;
  isBlindTransfer: boolean;
  isAttendedTransfer: boolean;
}

const InitialCallOptionModal = {
  toggle: false,
  dtmf: false,
  callTransfer: false,
  isBlindTransfer: false,
  isAttendedTransfer: false,
};
interface InitialStateType {
  phone: PhoneOperator | null;
  pbx: PBXOperator | null;
  sessionState: SessionState;
  direction: CallDirection | '';
  callId: string;
  connected: boolean;
  sessions: any[];
  ongoingSession: Session | null;
  dialNumber: string;
  selectedUser: any;
  selectedChat: any;
  isInboundCall: boolean;
  display_name: string;
  isInboundConnectingCall: boolean;
  callDetails: any;
  playRecordingCallId: string;
  isConnectingCall: boolean;
  from_number: string;
  signToken: string;
  username: string;
  yeasterRefreshToken: string;
  yeasterAccessToken: string;
  toggleDialPad: boolean;
  callOptionModal: CallOptionModalOptions;
}

const initialState: InitialStateType = {
  phone: null,
  pbx: null,
  sessionState: SessionState.ended,
  direction: '',
  callId: '',
  connected: false,
  sessions: [],
  ongoingSession: null,
  dialNumber: '',
  selectedUser: null,
  selectedChat: null,
  isInboundCall: false,
  display_name: '',
  isInboundConnectingCall: false,
  isConnectingCall: false,
  callDetails: null,
  playRecordingCallId: '',
  from_number: '',
  signToken: '',
  username: '',
  yeasterAccessToken: '',
  yeasterRefreshToken: '',
  toggleDialPad: false,
  callOptionModal: InitialCallOptionModal,
};

type Keys = keyof typeof initialState;
type CallOptionKeys = keyof typeof InitialCallOptionModal;

type UpdateStatePayloadType = {
  key: keyof InitialStateType;
  value: (typeof initialState)[Keys]; // You may want to replace 'any' with the actual type of your state properties
};

type UpdateCallOptionPayloadType = {
  key: keyof CallOptionModalOptions;
  value: (typeof InitialCallOptionModal)[CallOptionKeys]; // You may want to replace 'any' with the actual type of your state properties
};

export const CallSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    updateCallSliceState: (
      state,
      action: PayloadAction<UpdateStatePayloadType>,
    ) => {
      const key: string = action?.payload?.key;
      const value: any = action?.payload?.value;
      // @ts-ignore
      state[key] = value;
    },
    updateCallOptionModalState: (
      state,
      action: PayloadAction<UpdateCallOptionPayloadType>,
    ) => {
      const key: string = action?.payload?.key;
      const value: any = action?.payload?.value;
      // @ts-ignore
      state['callOptionModal'][key] = value;
    },
    getSuccessSignToken: (state, action) => {
      state.signToken = action.payload?.sign;
      state.username = action.payload?.username;
    },
    setYeasterToken: (
      state,
      action: PayloadAction<{ access_token: string; refresh_token: string }>,
    ) => {
      state.yeasterAccessToken = action.payload.access_token;
      state.yeasterRefreshToken = action.payload.refresh_token;
    },
    closeCallScreenModal: (state) => {
      state.isConnectingCall = false;
      state.isInboundConnectingCall = false;
      state.sessionState = SessionState.ended;
      state.display_name = '';
      state.callOptionModal = InitialCallOptionModal;
      state.ongoingSession = null;
    },
  },
});

export const {
  updateCallSliceState,
  getSuccessSignToken,
  setYeasterToken,
  closeCallScreenModal,
  updateCallOptionModalState,
} = CallSlice.actions;

export default CallSlice.reducer;

export const getRecordingDetails =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      const res: any = await axios.post('/call-features/record', data);
      if (res?.data && res?.data?.success) {
        return { token: res?.data?.token, data: res?.data?.data };
      }
    } catch (error: any) {
      console.debug('error', error);
    }
  };

export const getSigningToken =
  (access_token: string = '') =>
  async (dispatch: AppDispatch) => {
    let yeasterAccessToken = localStorage.getItem('yeasterAccessToken');
    if (access_token) {
      yeasterAccessToken = access_token;
    }
    try {
      const res: any = await axios.post('/call-features/signin', {
        access_token: yeasterAccessToken,
      });
      if (res?.data && res?.data?.success) {
        dispatch(getSuccessSignToken(res?.data));
      }
      if (!res?.data) {
        const tokenRes = await getApiAuthLoginToken();
        if (tokenRes && tokenRes?.errcode === 0) {
          dispatch(getSuccessSignToken(tokenRes?.access_token));
        }
      }

      return res?.data;
    } catch (error: any) {
      console.debug('error', error);
    }
  };
