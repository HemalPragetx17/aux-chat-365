import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

interface StateType {
  chats: any[];
  selectedChat: any;
  isNewChat: boolean;
  loading: boolean;
  sending: boolean;
}

const initialState = {
  loading: false,
  sending: false,
  chats: [] as any[],
  selectedChat: null as any,
  isNewChat: false,
};

const emptyPayload = {
  searchText: '',
};

export const ChatGroupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    getChats: (state, action) => {
      state.chats = action.payload;
    },
    updateChat: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      if (index > -1) {
        const updatedChat = [...state.chats];
        updatedChat[index] = { ...updatedChat[index], ...action.payload };
        state.chats = updatedChat;
      } else {
        state.chats = [action.payload, ...state.chats];
      }
      state.selectedChat = action.payload;
    },
    selectChat: (state: StateType, action) => {
      state.selectedChat = action.payload;
    },
    setNewChat: (state: StateType, action) => {
      state.isNewChat = action.payload;
    },
    setLoading: (state: StateType, action) => {
      state.loading = action.payload;
    },
    reorderChats: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      const currentChatSelected = state.selectedChat?.id === action.payload.id;
      if (currentChatSelected || state.isNewChat) {
        state.selectedChat = action.payload;
      }
      const chatList = [...state.chats];
      if (index > -1) {
        chatList.splice(index, 1)[0];
      }
      state.chats = [action.payload, ...chatList];
      state.isNewChat = false;
    },
    setSending: (state: StateType, action) => {
      state.sending = action.payload;
    },
  },
});

export const {
  getChats,
  selectChat,
  setNewChat,
  setLoading,
  updateChat,
  reorderChats,
  setSending,
} = ChatGroupSlice.actions;

export const fetchChatByNumber =
  (to: string, from: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `/conversation-group/find/${to}/${from}`,
      );
      if (response.status === 200) {
        const { conversation, isNewChat } = response?.data;
        await dispatch(setNewChat(Boolean(isNewChat)));
        if (!isNewChat) {
          await dispatch(getChats(conversation));
        }
        await dispatch(selectChat(conversation[0]));
        dispatch(setLoading(false));
        sessionStorage.removeItem('groupNumber');
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      throw new Error(err);
    }
  };

export const fetchChats = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setNewChat(false));
    await dispatch(selectChat(null));
    const response = await axios.post(`/conversation-group/`, payload);
    if (response.status === 200) {
      dispatch(setLoading(false));
      dispatch(getChats(response.data));
    }
  } catch (err: any) {
    dispatch(setLoading(false));
    console.log(err);
  }
};

export const selectChatById = (id: string) => async (dispatch: AppDispatch) => {
  if (id) {
    try {
      dispatch(setLoading(true));
      dispatch(setNewChat(false));
      const response = await axios.get(`/conversation-group/${id}`);
      if (response.status === 200) {
        await dispatch(updateChat(response?.data));
        dispatch(setLoading(false));
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  }
};

export const sendMessage = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setSending(true));
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
        bodyParser: false,
      },
    };
    const response = await axios.post(
      `/conversation-group/send-message`,
      payload,
      header,
    );
    if (response.status === 201) {
      await dispatch(reorderChats(response?.data));
      dispatch(setSending(false));
    }
  } catch (err: any) {
    dispatch(setSending(false));
    throw new Error(err);
  }
};

export const deleteConversation =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.delete(`/conversation-group/${id}`);
      if (response.status === 200) {
        toast.success('Conversation Deleted');
        await dispatch(fetchChats(emptyPayload));
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const deleteMessage = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(`/conversation-group/message/${id}`);
    if (response.status === 200) {
      toast.success('Message Deleted');
      if (response?.data?.data) {
        await dispatch(updateChat(response?.data?.data));
        dispatch(setLoading(false));
      } else {
        await dispatch(fetchChats(emptyPayload));
      }
    }
  } catch (err: any) {
    dispatch(setLoading(false));
    console.log(err);
  }
};

export const addNote =
  (id: string, data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.put(`/conversation-group/note/${id}`, data);
      if (response.status === 200) {
        await dispatch(updateChat(response?.data));
        dispatch(setLoading(false));
        return true;
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const sendPaymentLink =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/conversation-group/send-payment-link`,
        payload,
      );
      if (response.status === 201) {
        await dispatch(reorderChats(response?.data));
        dispatch(setLoading(false));
        return true;
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      throw new Error(err);
    }
  };

export default ChatGroupSlice.reducer;
