import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [] as any[],
};

export const EmailSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    toggleMessage: (state, action) => {
      const { id, expanded, body } = action.payload;

      state.messages = state.messages?.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              showParticipants: false,
              expanded: !expanded,
              body: body,
            }
          : msg,
      );
    },
    showParticipants: (state, action) => {
      const { id } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              showParticipants: !msg.showParticipants,
            }
          : msg,
      );
    },
    replyForwardMessage: (state, action) => {
      const { id, type } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              draft: {
                replyToMessageId: id,
                subject: msg.subject,
                to:
                  type === 'REPLY' && msg?.from?.length
                    ? msg.from[0].email || ''
                    : '',
                body: null,
              },
            }
          : msg,
      );
    },
    updateDraft: (state, action) => {
      const { id, draft } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              draft: { ...msg.draft, ...draft },
            }
          : msg,
      );
    },
    discardDraft: (state, action) => {
      const { id } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              draft: null,
            }
          : msg,
      );
    },
  },
});

export const {
  setMessages,
  toggleMessage,
  showParticipants,
  replyForwardMessage,
  updateDraft,
  discardDraft,
} = EmailSlice.actions;

export default EmailSlice.reducer;
