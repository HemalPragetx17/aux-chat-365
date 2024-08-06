import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';
import { combineReducers } from 'redux';

import CalendarReducer from './apps/calendar/CalendarSlice';
import CallsReducer from './apps/calls/callsSlice';
import ChatGroupReducer from './apps/chat/ChatGroupSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import DidReducer from './apps/did/DidSlice';
import EmailReducer from './apps/email/EmailSlice';
import InvoiceReducer from './apps/invoice/InvoiceSlice';
import UserReducer from './apps/user/UserSlice';
import CustomizerReducer from './customizer/CustomizerSlice';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    chatReducer: ChatsReducer,
    chatGroupReducer: ChatGroupReducer,
    didReducer: DidReducer,
    invoiceReducer: InvoiceReducer,
    contactsReducer: ContactsReducer,
    emailReducer: EmailReducer,
    callsReducer: CallsReducer,
    userReducer: UserReducer,
    calendarReducer: CalendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const rootReducer = combineReducers({
  customizer: CustomizerReducer,
  chatReducer: ChatsReducer,
  chatGroupReducer: ChatGroupReducer,
  didReducer: DidReducer,
  invoiceReducer: InvoiceReducer,
  contactsReducer: ContactsReducer,
  emailReducer: EmailReducer,
  callsReducer: CallsReducer,
  userReducer: UserReducer,
  calendarReducer: CalendarReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;
