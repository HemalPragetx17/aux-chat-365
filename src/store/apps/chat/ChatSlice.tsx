import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

const initialState = {
  loading: false,
  aiLoading: false,
  chats: [] as any[],
  selectedChat: null as any,
  isNewChat: false,
  sending: false,
  chatPage: 1,
  searchText: '',
  dateFlag: true,
  unreadFlag: false,
  selectedMessage: null as any,
  aiResponse: null as any,
  scrollNotes: false,
  scrollMessage: false as any,
  filterData: null as any,
};

const emptyPayload = {
  searchText: '',
  dateFlag: true,
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatList: (state) => {
      state.chats = [];
    },
    setChatList: (state, action) => {
      state.chats = [...state.chats, ...action.payload];
    },
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setNewChat: (state, action) => {
      state.isNewChat = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSending: (state, action) => {
      state.sending = action.payload;
    },
    updateBothPanel: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );

      const response = JSON.parse(JSON.stringify(action.payload));
      delete response['Message'];

      if (index > -1) {
        const updatedChat = [...state.chats];
        updatedChat[index] = { ...updatedChat[index], ...response };
        state.chats = updatedChat;
      }
      if (action.payload.id === state.selectedChat?.id) {
        state.selectedChat = { ...state.selectedChat, ...response };
      }
    },
    updateLeftPanelCloseRight: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );

      const response = JSON.parse(JSON.stringify(action.payload));
      delete response['Message'];

      if (index > -1) {
        const updatedChat = [...state.chats];
        updatedChat[index] = { ...updatedChat[index], ...response };
        state.chats = updatedChat;
      }
      if (action.payload.id === state.selectedChat?.id) {
        state.selectedChat = null;
      }
    },
    updateLeftPanel: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );

      const response = JSON.parse(JSON.stringify(action.payload));
      response.Message = response.Message.slice(0, 10);

      if (index > -1) {
        const updatedChat = [...state.chats];
        updatedChat[index] = { ...updatedChat[index], ...response };
        state.chats = updatedChat;
      }
    },
    updateDeletedMessage: (state, action) => {
      const index = state.selectedChat.Message.findIndex(
        (message: any) => message.id === action.payload,
      );
      if (index > -1) {
        const updatedMessages = [...state.selectedChat.Message];
        updatedMessages.splice(index, 1);
        state.selectedChat.Message = updatedMessages;
      }
    },
    markChatAsRead: (state, action) => {
      state.selectedChat = null;
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      const updatedChat = [...state.chats];
      updatedChat[index] = { ...updatedChat[index], unreadCount: 0 };
      state.chats = updatedChat;
      state.selectedChat = { ...action.payload, unreadCount: 0 };
    },
    appendChatMessage: (state, action) => {
      const selectedChat = JSON.parse(JSON.stringify(state.selectedChat));
      const { Message } = selectedChat;
      selectedChat.Message = [...action.payload.reverse(), ...Message];
      state.selectedChat = selectedChat;
    },
    updateChatContact: (state, action) => {
      const Contact = action.payload;
      const updatedChat = [...state.chats];
      const phoneNumber = `${Contact?.countryCode}${Contact?.phone}`;
      updatedChat.forEach((chat, index) => {
        if (chat.to === phoneNumber) {
          updatedChat[index] = { ...updatedChat[index], Contact };
        }
      });
      state.chats = updatedChat;
      if (
        action.payload.id === state.selectedChat?.Contact?.id ||
        state.selectedChat.to.indexOf(action.payload.phone) > -1
      ) {
        const _selectedChat = { ...state.selectedChat, Contact };
        state.selectedChat = _selectedChat;
      }
      state.loading = false;
    },
    reorderChats: (state, action) => {
      const response = JSON.parse(JSON.stringify(action.payload));
      response.Message = response.Message.slice(0, 10);

      let unreadCount = action.payload.unreadCount;
      const currentChatSelected = state.selectedChat?.id === action.payload.id;

      if (
        state.isNewChat &&
        action.payload.to.indexOf(state.selectedChat.to) > -1 &&
        action.payload.from.indexOf(state.selectedChat.from) > -1
      ) {
        unreadCount = 0;
        state.selectedChat = { ...action.payload, unreadCount };
        state.isNewChat = false;
      }

      if (currentChatSelected) {
        unreadCount = 0;
        const _newMessage = response.Message[0];
        const { Message } = state.selectedChat;
        const message_index = Message.findIndex(
          (msg: any) => msg.id === _newMessage.id,
        );
        if (message_index === -1) {
          Message.push(_newMessage);
          state.selectedChat = { ...action.payload, unreadCount, Message };
        } else {
          const messageList = [...Message];
          messageList[message_index] = { ..._newMessage };
          state.selectedChat = {
            ...action.payload,
            unreadCount,
            Message: messageList,
          };
        }
      }

      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      const chatList = [...state.chats];
      if (index > -1) {
        chatList.splice(index, 1)[0];
      }
      state.chats = [{ ...response, unreadCount }, ...chatList];
    },
    setMessageNote: (state, action) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === state.selectedChat.id,
      );
      const { id, notes } = action.payload;
      const updatedChat = [...state.chats];
      const message = updatedChat[index].Message.find(
        (message: any) => message.id === id,
      );
      message.notes = notes;
      updatedChat[index] = { ...updatedChat[index] };
      state.chats = updatedChat;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setDateFlag: (state, action) => {
      state.dateFlag = action.payload;
    },
    setChatPage: (state, action) => {
      state.chatPage = action.payload;
    },
    toggleUnreadFlag: (state, action) => {
      state.unreadFlag = action.payload;
    },
    handleAddMessageNotes: (state, action) => {
      const { conversationId, notes, id } = action.payload;
      state.selectedMessage = action.payload;
      const index = state.chats.findIndex((chat) => chat.id === conversationId);
      if (index > -1) {
        const chatList = [...state.chats];
        const { Message } = chatList[index];
        const message_index = Message.findIndex((msg: any) => msg.id === id);
        if (message_index > -1) {
          const messageList = [...Message];
          messageList[message_index] = { ...messageList[message_index], notes };
          chatList[index] = {
            ...chatList[index],
            Message: messageList,
          };
          state.chats = [...chatList];
        }
      }
    },
    clearSelectedMessage: (state) => {
      state.selectedMessage = null;
    },
    setAIResponse: (state, action) => {
      state.aiResponse = action.payload;
    },
    clearAIResponse: (state) => {
      state.aiResponse = null;
    },
    setAILoading: (state, action) => {
      state.aiLoading = action.payload;
    },
    setTextTranscribe: (state, action) => {
      const index = state.selectedChat.Message.findIndex(
        (message: any) => message.id === action?.payload?.message?.id,
      );
      if (index > -1) {
        const updatedMessages = [...state.selectedChat.Message];
        updatedMessages[index]['transcribeMessage'] = action?.payload?.response;
        updatedMessages[index]['notSave'] = action?.payload?.notSave;
        state.selectedChat.Message = updatedMessages;
      }
    },
    setMessageScroll: (state, action) => {
      state.scrollMessage = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
});

export const {
  setChatList,
  selectChat,
  setNewChat,
  setLoading,
  reorderChats,
  updateBothPanel,
  updateChatContact,
  updateLeftPanelCloseRight,
  setSending,
  setSearchText,
  setDateFlag,
  setChatPage,
  clearChatList,
  appendChatMessage,
  setMessageNote,
  markChatAsRead,
  toggleUnreadFlag,
  updateLeftPanel,
  updateDeletedMessage,
  handleAddMessageNotes,
  clearSelectedMessage,
  setAIResponse,
  clearAIResponse,
  setAILoading,
  setTextTranscribe,
  setMessageScroll,
  setFilterData,
} = ChatSlice.actions;

export const getNewChats = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setNewChat(false));
    dispatch(selectChat(null));
    dispatch(setSearchText(payload.searchText));
    dispatch(setDateFlag(payload.dateFlag));
    dispatch(setChatPage(1));
    dispatch(setFilterData(payload.filterData || null));

    let queryString = `searchText=${payload?.searchText}&dateFlag=${payload?.dateFlag}&pageSize=15&page=1`;
    if (payload.filterData?.category) {
      queryString += `&category=${payload.filterData?.category}`;
    }
    if (payload.filterData?.stage) {
      queryString += `&stage=${payload.filterData?.stage}`;
    }
    if (payload.filterData?.service) {
      queryString += `&service=${payload.filterData?.service}`;
    }

    const response = await axios.get(`/conversation/list?${queryString}`);
    if (response.status === 200) {
      dispatch(setLoading(false));
      dispatch(clearChatList());
      dispatch(setChatList(response.data));
      return response.data;
    }
  } catch (err: any) {
    dispatch(setLoading(false));
    console.log(err);
  }
};

export const fetchChats = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setNewChat(false));
    dispatch(setSearchText(payload.searchText));
    dispatch(setDateFlag(payload.dateFlag));
    dispatch(setChatPage(payload.page));
    dispatch(setFilterData(payload.filterData || null));

    let queryString = `searchText=${payload?.searchText}&dateFlag=${payload?.dateFlag}&pageSize=15&page=${payload.page}`;
    if (payload.filterData?.category) {
      queryString += `&category=${payload.filterData?.category}`;
    }
    if (payload.filterData?.stage) {
      queryString += `&stage=${payload.filterData?.stage}`;
    }
    if (payload.filterData?.service) {
      queryString += `&service=${payload.filterData?.service}`;
    }

    const response = await axios.get(`/conversation/list?${queryString}`);
    if (response.status === 200) {
      dispatch(setLoading(false));
      dispatch(setChatList(response.data));
      return response.data;
    }
  } catch (err: any) {
    dispatch(setLoading(false));
    console.log(err);
  }
};

export const selectChatById = (chat: any) => async (dispatch: AppDispatch) => {
  if (chat) {
    dispatch(setNewChat(false));
    const _chat = JSON.parse(JSON.stringify(chat));
    _chat?.Message?.reverse();
    dispatch(markChatAsRead(_chat));
    await axios.put(`/conversation/mark-read/${chat?.id}`);
    dispatch(toggleUnreadFlag(true));
  }
};

export const fetchRemainingMessages =
  (id: string, skip: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `/conversation/${id}/remaining-messages/${skip}`,
      );
      if (response.status === 200) {
        await dispatch(appendChatMessage(response?.data));
        return response.data;
      }
      dispatch(setLoading(false));
      return [];
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const fetchChatByNumber =
  (to: string, from: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`/conversation/find/${to}/${from}`);
      if (response.status === 200) {
        const { conversation, isNewChat } = response?.data;
        await dispatch(setNewChat(Boolean(isNewChat)));
        if (!isNewChat) {
          await dispatch(clearChatList());
          await dispatch(setChatList(conversation));
        }
        await dispatch(selectChat(conversation[0]));
        dispatch(setLoading(false));
        sessionStorage.removeItem('chatNumber');
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      throw new Error(err);
    }
  };

export const fetchChatById =
  (id: string, messageId: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/conversation/conversation-tagging/${id}/${messageId}`,
      );
      if (response.status === 201) {
        const conversation = response?.data;
        await dispatch(clearChatList());
        await dispatch(setChatList([conversation]));
        const _chat = JSON.parse(JSON.stringify(conversation));
        _chat?.Message?.reverse();
        await dispatch(markChatAsRead(_chat));
        dispatch(setLoading(false));
        if (Boolean(messageId)) {
          await dispatch(setMessageScroll(messageId));
        }
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      throw new Error(err);
    }
  };

export const lockConversation =
  (data: any, id: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.patch(`/conversation/${id}`, data);
      if (response.status === 200) {
        await dispatch(updateBothPanel(response?.data));
        dispatch(setLoading(false));
        toast.success(
          `Conversation ${Boolean(data.locked) ? 'Locked' : 'Unlocked'}`,
        );
        return true;
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
      const response = await axios.put(`/conversation/note/${id}`, data);
      if (response.status === 200) {
        await dispatch(updateBothPanel(response?.data));
        dispatch(setLoading(false));
        return true;
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const deleteMessage = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(`/conversation/message/${id}`);
    if (response.status === 200) {
      toast.success('Message Deleted');
      if (response?.data?.data) {
        dispatch(updateLeftPanel(response?.data?.data));
        dispatch(updateDeletedMessage(id));
        dispatch(setLoading(false));
      } else {
        await dispatch(getNewChats(emptyPayload));
      }
    }
  } catch (err: any) {
    dispatch(setLoading(false));
    console.log(err);
  }
};

export const deleteConversation =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.delete(`/conversation/${id}`);
      if (response.status === 200) {
        toast.success('Conversation Deleted');
        await dispatch(getNewChats(emptyPayload));
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const markConversationAsUnread =
  (data: any, id: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.patch(`/conversation/${id}`, data);
      if (response.status === 200) {
        await dispatch(updateLeftPanelCloseRight(response?.data));
        dispatch(setLoading(false));
        toast.success(
          `Conversation ${Boolean(data.locked) ? 'Locked' : 'Unlocked'}`,
        );
        return true;
      }
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };

export const checkCardType = (cardNo: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.get(
        `/conversation/check/vt-card/${cardNo}`,
      );

      dispatch(setLoading(false));

      return response.data;
    } catch (error: any) {
      dispatch(setLoading(false));
      throw new Error(error);
    }
  };
};

export const vtPaymentInvoice = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const response: any = await axios.post(
        `/conversation/vt-paynow`,
        payload,
      );
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
      }

      dispatch(setLoading(false));

      return response.data;
    } catch (error: any) {
      dispatch(setLoading(false));
      throw new Error(error);
    }
  };
};

export const addProduct = (
  payload: any,
  callBack: any,
  setAddProductLoading: any,
) => {
  return async () => {
    try {
      const response: any = await axios.post(`/products`, payload);
      if (callBack) callBack(response.data.data);
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
      }
      return response.data;
    } catch (error: any) {
      setAddProductLoading(false);
    }
  };
};

export const createInvoice = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.post(
        `/invoice/create-invoice-app`,
        payload,
      );
      dispatch(setLoading(false));
      return response.data;
    } catch (error: any) {
      dispatch(setLoading(false));
      throw new Error(error);
    }
  };
};

export const removeIsDraftInvoice = (id: any, payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.patch(
        `/invoice/remove-draft-invoice/${id}`,
        payload,
      );
      dispatch(setLoading(false));
      return response.data;
    } catch (error: any) {
      dispatch(setLoading(false));
      throw new Error(error);
    }
  };
};

export const invoiceRecurring = (id: any, payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.patch(
        `/invoice/reccuring/${id}`,
        payload,
      );
      dispatch(setLoading(false));
      return response.data;
    } catch (error: any) {
      dispatch(setLoading(false));
      throw new Error(error);
    }
  };
};

export const addMessageNote =
  (id: string, payload: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.put(
        `/conversation/note/message/${id}`,
        payload,
      );
      if (response.status === 200) {
        toast.success('Message Note Added Successfully');
        dispatch(setLoading(false));
        dispatch(setMessageNote({ notes: response?.data, id }));
        return response?.data;
      }
      return false;
    } catch (err: any) {
      dispatch(setLoading(false));
      console.log(err);
      return false;
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
      `/conversation/send-message`,
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

export const sendPaymentLink =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/conversation/send-payment-link`,
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

export const sendPaymentLinkWithInvoice =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const response = await axios.post(
        `/conversation/send-payment-link-with-invoice`,
        payload,
        header,
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

export const sendEmail = (payload: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setSending(true));
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
        bodyParser: false,
      },
    };
    const response = await axios.post(
      `/conversation/email/send-message`,
      payload,
      header,
    );
    if (response.status === 201) {
      if (response?.data?.id) {
        await dispatch(reorderChats(response?.data));
      }
      dispatch(setSending(false));
    }
  } catch (err: any) {
    dispatch(setSending(false));
    throw new Error(err);
  }
};

export const sendTextInvoice = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const response: any = await axios.post(
        `/invoice/send-invoice`,
        payload,
        header,
      );

      dispatch(setLoading(false));
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
        return false;
      }
      await dispatch(reorderChats(response?.data));
      toast.success('SMS Sent Successfully');
      return response.data;
    } catch (error: any) {
      const message = `Request faild with status code ${error?.status}`;
      toast.error(message);
      dispatch(setLoading(false));
      // throw new Error(error);
    }
  };
};

export const sendEmailInvoice = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.post(
        `/invoice/send-invoice-email-app`,
        payload,
      );
      dispatch(setLoading(false));
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
        return false;
      }
      await dispatch(reorderChats(response?.data));
      toast.success('Email Sent Successfully');
      return response.data;
    } catch (error: any) {
      const message = `Request faild with status code ${error?.status}`;
      toast.error(message);
      dispatch(setLoading(false));
    }
  };
};

export const fetchAIResponse = (payload: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setAILoading(true));
    try {
      const response: any = await axios.post(`/open-ai`, payload);
      dispatch(setAILoading(false));
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
        return false;
      }
      await dispatch(setAIResponse(response?.data?.data));
      return response?.data?.data;
    } catch (error: any) {
      const message = `Request faild with status code ${error?.status}`;
      toast.error(message);
      dispatch(setAILoading(false));
    }
  };
};

export const fetchAudioFileTranscribe = (
  payload: any,
  selectedChat: any,
  message: any,
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.post(`/open-ai/transcibe`, payload);
      dispatch(setLoading(false));
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
        return false;
      }
      dispatch(
        setTextTranscribe({
          response: response?.data?.data?.text?.value,
          selectedChat,
          message,
          notSave: true,
        }),
      );
      return response?.data?.data;
    } catch (error: any) {
      const message = `Request faild with status code ${error?.status}`;
      toast.error(message);
      dispatch(setLoading(false));
    }
  };
};

export const fetchTextTranscribe = (
  payload: any,
  selectedChat: any,
  message: any,
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.post(`/open-ai`, payload);
      dispatch(setLoading(false));
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
        return false;
      }
      dispatch(
        setTextTranscribe({
          response: response?.data?.data?.text?.value,
          selectedChat,
          message,
          notSave: true,
        }),
      );
      return response?.data?.data;
    } catch (error: any) {
      const message = `Request faild with status code ${error?.status}`;
      toast.error(message);
      dispatch(setLoading(false));
    }
  };
};

export const saveTranscribe = (
  payload: any,
  selectedChat: any,
  message: any,
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response: any = await axios.put(
        `/conversation/transcribe/message/${message?.id}`,
        payload,
      );
      dispatch(setLoading(false));
      if (response?.data?.status === 'error') {
        toast.error(response?.data?.message);
        return false;
      }
      dispatch(
        setTextTranscribe({
          response: response?.data?.transcribeMessage,
          selectedChat,
          message,
          notSave: false,
        }),
      );
      return response?.data?.data;
    } catch (error: any) {
      const message = `Request faild with status code ${error?.status}`;
      toast.error(message);
      dispatch(setLoading(false));
    }
  };
};

export const sendMeetingRequest =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `/conversation/send-meeting-request`,
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

export default ChatSlice.reducer;
