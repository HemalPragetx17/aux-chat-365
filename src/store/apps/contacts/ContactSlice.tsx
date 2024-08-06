import { createSlice } from '@reduxjs/toolkit';

import axios from '../../../utils/axios';
import { AppDispatch } from '../../Store';

interface StateType {
  contacts: any[];
  currentData: any;
  page: number;
  loading: boolean;
  contactCategory: any[];
  contactService: any[];
}

const initialState = {
  contacts: [],
  page: 1,
  loading: false,
  currentData: null as any,
  contactCategory: [],
  contactService: [],
};

export const ContactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    getContacts: (state: StateType, action) => {
      const contacts = action.payload;
      const uniqueObjectsMap = new Map();
      for (const obj of contacts) {
        if (!uniqueObjectsMap.has(obj.id)) {
          uniqueObjectsMap.set(obj.id, obj);
        }
      }
      state.contacts = Array.from(uniqueObjectsMap.values());
      state.loading = false;
    },
    setPage: (state: StateType, action) => {
      state.page = action.payload;
    },
    setContacts: (state: StateType, action) => {
      const contacts = [...state.contacts, ...action.payload];
      const uniqueObjectsMap = new Map();
      for (const obj of contacts) {
        if (!uniqueObjectsMap.has(obj.id)) {
          uniqueObjectsMap.set(obj.id, obj);
        }
      }
      state.contacts = Array.from(uniqueObjectsMap.values());
      state.loading = false;
    },
    setLoading: (state: StateType, action) => {
      state.loading = action.payload;
    },
    deleteContact: (state: StateType, action) => {
      state.contacts = state.contacts.filter((contact) => {
        return contact.id !== action.payload;
      });
    },
    updateContact: (state: StateType, action) => {
      const index = state.contacts.findIndex(
        (contact) => contact.id === action.payload.id,
      );
      if (index > -1) {
        const updatedContact = [...state.contacts];
        updatedContact[index] = { ...updatedContact[index], ...action.payload };
        state.contacts = updatedContact;
      }
    },
    setCurrentData: (state: StateType, action) => {
      state.currentData = action.payload;
    },
    updateContacts: (state: StateType, action) => {
      const index = state.contacts.findIndex(
        (contact) => contact.id === action.payload.id,
      );

      if (index > -1) {
        const updatedList = [...state.contacts];
        updatedList[index] = { ...updatedList[index], ...action.payload };
        state.contacts = updatedList;
      }
      if (action.payload.id === state.currentData?.id) {
        state.currentData = { ...state.currentData, ...action.payload };
      }
    },
    setContactCategory: (state: StateType, action) => {
      state.contactCategory = action.payload;
    },
    setContactService: (state: StateType, action) => {
      state.contactService = action.payload;
    },
  },
});

export const {
  getContacts,
  setPage,
  setContacts,
  setLoading,
  deleteContact,
  setCurrentData,
  updateContacts,
  setContactService,
  setContactCategory,
} = ContactSlice.actions;

export const fetchContacts = (body: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`/contact/find-all`, body);
    const _contacts = response.status === 201 ? response?.data?.data : [];
    dispatch(getContacts(_contacts));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const fetchContactByPage =
  (body: any) => async (dispatch: AppDispatch) => {
    dispatch(setPage(body.page || 1));
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`/contact/find-all`, body);
      const contacts = response.status === 201 ? response.data.data : [];
      dispatch(setContacts(contacts));
      return contacts;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchContactCategory = () => async (dispatch: AppDispatch) => {
  try {
    const _response = await axios.get(`/contact-category`);
    let categories = _response.status === 200 ? _response.data.data : [];
    categories = [{ name: 'None', id: false }, ...categories];
    categories = categories.map((category: any) => {
      return { label: category.name, value: category.id };
    });
    dispatch(setContactCategory(categories));
    return categories;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const fetchContactService = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`/products/services`);
    let services = response.status === 200 ? response.data.data : [];
    services = services.map((service: any) => {
      return { label: service.name, value: service.id };
    });
    dispatch(setContactService(services));
    return services;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default ContactSlice.reducer;
