import { Backdrop, Box, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import 'simplebar/src/simplebar.css';
import swal from 'sweetalert';

import {
  deleteContact,
  fetchContactByPage,
  fetchContactCategory,
  fetchContacts,
  fetchContactService,
  setCurrentData,
  setLoading,
  setPage,
  updateContacts,
} from '../../../../store/apps/contacts/ContactSlice';
import { AppState, dispatch } from '../../../../store/Store';
import axios from '../../../../utils/axios';

import SingleContactForm from '../../../forms/contact/SingleContactForm';
import ContactDetails from './ContactDetails';
import ContactEmailComponent from './ContactEmailComponent';
import ContactList from './ContactList';
import ContactMessageDialog from './ContactMessageDialog';
import ContactSideFilter from './ContactSideFilter';

const CONTACT_STAGES = [
  { label: 'New', value: 'NEW' },
  { label: 'Engaged', value: 'ENGAGED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Proposal Sent', value: 'PROPOSALSENT' },
  { label: 'Negotations', value: 'NEGOTIATIONS' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
  { label: 'Nurturing', value: 'NURTURING' },
];

const SingleContactList = () => {
  const [search, setSearch] = useState<any>('');
  const [openForm, setOpenForm] = useState<boolean>(false);
  const parentContainer = useRef(null);
  const contactContainer = useRef(null);
  const [containerHeight, setContainerHeight] = useState<any>(0);
  const [didDialog, setDidDialog] = useState<any>(null);
  const [emailDialog, setEmailDialog] = useState<boolean>(false);
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const store = useSelector((state: AppState) => state.contactsReducer);
  const { currentData } = useSelector(
    (state: AppState) => state.contactsReducer,
  );
  const [contactSearchBody, setContactSearchBody] = useState<any>({
    status: ['ACTIVE'],
    searchText: '',
    starred: false,
    isPersonal: false,
    category: '',
    service: [],
    stage: '',
  });
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [filterString, setFilterString] = useState<string>('');

  useEffect(() => {
    const parentHeight = (parentContainer?.current as any)?.offsetHeight;
    setContainerHeight(parentHeight - 62);
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [contactSearchBody]);

  const handleFilterChanged = (filter: string) => {
    switch (filter) {
      case '':
        setContactSearchBody({
          ...contactSearchBody,
          isPersonal: false,
          status: ['ACTIVE', 'BLOCKED'],
          starred: false,
        });
        break;
      case 'BLOCKED':
        setContactSearchBody({
          ...contactSearchBody,
          isPersonal: false,
          status: ['BLOCKED'],
          starred: false,
        });
        break;
      case 'PERSONAL':
        setContactSearchBody({
          ...contactSearchBody,
          isPersonal: true,
          status: [],
          starred: false,
        });
        break;
      case 'FAVOURITE':
        setContactSearchBody({
          ...contactSearchBody,
          starred: true,
          status: [],
          isPersonal: false,
        });
        break;
      default:
        setContactSearchBody({
          ...contactSearchBody,
          isPersonal: false,
          status: ['ACTIVE', 'BLOCKED'],
          starred: false,
        });
        break;
    }
  };

  const fetchData = async () => {
    await dispatch(setPage(1));
    await dispatch(fetchContacts(contactSearchBody));
    dispatch(setCurrentData(null));
  };

  const fetchFiltersData = async () => {
    await dispatch(fetchContactCategory());
    await dispatch(fetchContactService());
  };

  const refreshData = async () => {
    dispatch(setCurrentData(null));
    setSearch('');
    setContactSearchBody({
      searchText: '',
      starred: null,
      isPersonal: false,
      status: ['ACTIVE', 'BLOCKED'],
      category: '',
      service: [],
      stage: '',
    });
  };

  const onRefresh = () => {
    setOpenForm(false);
    refreshData();
    setFilterString('');
  };

  const onUpdated = (contact: any) => {
    setOpenForm(false);
    dispatch(updateContacts(contact?.data));
    setEditLoading(false);
  };

  useEffect(() => {
    if (Boolean(search)) {
      const delayedDispatch = debounce(() => {
        setContactSearchBody({ ...contactSearchBody, searchText: search });
      }, 1000);

      delayedDispatch();

      return () => {
        delayedDispatch.cancel();
      };
    } else {
      setContactSearchBody({ ...contactSearchBody, searchText: '' });
    }
  }, [search]);

  const handleMessage = (row: any) => {
    setDidDialog(row);
  };

  const handleMail = () => {
    setEmailDialog(true);
  };

  const handleAdd = () => {
    dispatch(setCurrentData(null));
    setOpenForm(true);
  };

  const handleClick = async (row: any) => {
    await dispatch(setCurrentData(null));
    dispatch(setCurrentData(row));
  };

  const handleDelete = async (row: any) => {
    const willDelete = await swal({
      title: 'Are you sure?',
      closeOnClickOutside: false,
      closeOnEsc: false,
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'MuiButton-root',
          closeModal: true,
        },
      },
      dangerMode: true,
    });
    if (willDelete) {
      try {
        dispatch(setLoading(true));
        const response = await axios.delete(`/contact/${row?.id}`);
        if (response.status === 200) {
          toast.success('Contact deleted successfully');
          dispatch(setCurrentData(null));
          await dispatch(deleteContact(row?.id));
          dispatch(setLoading(false));
        }
      } catch (error) {
        dispatch(setLoading(false));
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }
  };

  const handleStar = async (row: any) => {
    dispatch(setLoading(true));
    const response = await axios.patch(`/contact/star/${row?.id}`);
    if (response.status === 200) {
      dispatch(updateContacts(response?.data?.data));
    }
    dispatch(setLoading(false));
  };

  const handleScroll = () => {
    const node = contactContainer.current as any;
    if (
      parseInt(node?.scrollHeight) -
        parseInt(node?.scrollTop + node?.clientHeight) <
      10
    ) {
      setBottomReached(true);
    }
  };

  useEffect(() => {
    const div = contactContainer.current as any;
    div?.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const contactPagination = async () => {
      const response = await dispatch(
        fetchContactByPage({ ...contactSearchBody, page: store.page + 1 }),
      );
      if (response.length >= 10) {
        setBottomReached(false);
      }
    };
    if (bottomReached) {
      contactPagination();
    }
  }, [bottomReached]);

  const handleFilePreview = (data: any) => {
    if (!Boolean(data)) {
      return '/images/profile/thumb.png';
    }
    if (data.src) {
      return data.src;
    }
    return URL.createObjectURL(data as any);
  };

  return (
    <Box ref={parentContainer} display={'flex'} width={'100%'} height={'100%'}>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={store.loading}
      >
        <CircularProgress color="error" />
      </Backdrop>

      <ContactSideFilter
        contactSearchBody={contactSearchBody}
        handleAdd={handleAdd}
        handleFilterChanged={handleFilterChanged}
        setContactSearchBody={setContactSearchBody}
        onRefresh={onRefresh}
        filterString={filterString}
        setFilterString={setFilterString}
      />

      <ContactList
        search={search}
        setSearch={setSearch}
        onRefresh={onRefresh}
        contactContainer={contactContainer}
        containerHeight={containerHeight}
        handleClick={handleClick}
        handleMessage={handleMessage}
        handleStar={handleStar}
        handleDelete={handleDelete}
      />

      <ContactDetails
        handleFilePreview={handleFilePreview}
        onUpdated={onUpdated}
        handleMessage={handleMessage}
        handleMail={handleMail}
        editLoading={editLoading}
        setEditLoading={setEditLoading}
        containerHeight={containerHeight}
      />

      <ContactMessageDialog
        open={Boolean(didDialog?.id)}
        toggle={() => setDidDialog(null)}
        dest={didDialog}
      />

      <ContactEmailComponent
        open={Boolean(emailDialog)}
        toggle={() => setEmailDialog(false)}
      />

      <SingleContactForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        success={onUpdated}
        addFlag={!Boolean(currentData?.id)}
      />
    </Box>
  );
};

export default SingleContactList;
