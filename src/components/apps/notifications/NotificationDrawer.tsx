import { Button, Drawer, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SimpleBarReact from 'simplebar-react';

import 'simplebar/src/simplebar.css';
import { AppState, dispatch } from '../../../store/Store';
import {
  getUserNotifications,
  setNotificationList,
} from '../../../store/apps/user/UserSlice';
import axios from '../../../utils/axios';
import { toLocalDate } from '../../../utils/date';
import CustomSpinner from '../../custom/CustomSpinner';
import CustomHeader from '../../custom/form/CustomHeader';
import ContractDialog from '../contract/ContractDialog';

import InvoiceNotificationDialog from './InvoiceNotificationDialog';
import PaymentNotificationDialog from './PaymentNotificationDialog';

interface FormType {
  open: boolean;
  toggle: () => void;
}

const NotificationDrawer = (props: FormType) => {
  const { open, toggle } = props;
  const { notificationList } = useSelector(
    (state: AppState) => state.userReducer,
  );
  const [page, setPage] = useState<any>(0);
  const [contractData, setContractData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const container = useRef(null);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    } else {
      dispatch(setNotificationList([]));
      setBottomReached(false);
      setPage(0);
    }
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    const response = await axios.post(`/conversation/notification/all/${page}`);
    const _data = [...notificationList, ...response?.data];
    setLoading(false);
    dispatch(setNotificationList(_data));
    setPage(page + 1);
  };

  const handleClose = () => {
    toggle();
  };

  const handleMarkAsRead = async (row: any) => {
    const { url, type } = row;
    if (type === 'Notes') {
      router.replace(url);
    }
    if (type === 'Contract') {
      const response = await axios.get(`/contracts/${url}`);
      if (response?.status === 200) {
        setContractData(response?.data?.data);
      }
    }
    if (type === 'Invoice') {
      const response = await axios.get(`/invoice/${url}`);
      if (response?.status === 200) {
        const invoice = response?.data?.data;
        if (invoice?.file) {
          setInvoiceData(`${invoice?.file}#toolbar=0&navpanes=0&scrollbar=0`);
        }
      }
    }
    if (type === 'Payment') {
      const response = await axios.post(`/payment/details/${url}`);
      if (response?.status === 201) {
        setPaymentData(response?.data);
      }
    }
    if (type === 'Calendar') {
      let redirectUrl = '/calendar';
      if (Boolean(url)) {
        redirectUrl += `?email=${url}`;
      }
      router.replace(redirectUrl);
    }
    if (type === 'Chat') {
      let redirectUrl = '/chats/conversation/';
      router.replace(redirectUrl);
    }
    axios.put(`/conversation/notification/${row?.id}`);
    dispatch(getUserNotifications());
    toggle();
  };

  const handleMarkAllAsRead = async () => {
    toggle();
    await axios.post(`/conversation/notification/mark-all`);
    dispatch(getUserNotifications());
  };

  const handleDeleteAll = async () => {
    toggle();
    await axios.post(`/conversation/notification/delete-all`);
    dispatch(getUserNotifications());
  };

  const handleScroll = () => {
    const node = container.current as any;
    if (
      parseInt(node?.scrollHeight) -
        parseInt(node?.scrollTop + node?.clientHeight) <
      10
    ) {
      setBottomReached(true);
    }
  };

  useEffect(() => {
    const div = container?.current as any;
    div?.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const pagination = async () => {
      setLoading(true);
      const response = await axios.post(
        `/conversation/notification/all/${page}`,
      );
      const _data = [...notificationList, ...response?.data];
      setLoading(false);
      dispatch(setNotificationList(_data));
      setPage(page + 1);
      if (response?.data.length === 10) {
        setBottomReached(false);
      }
    };
    if (bottomReached) {
      pagination();
    }
  }, [bottomReached]);

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: 300, sm: 400 },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 1000,
          },
        }}
      >
        {loading && (
          <Box
            sx={{
              opacity: 0.5,
              position: 'absolute',
              width: '100%',
              height: '100vH',
              background: 'white',
              zIndex: 1001,
            }}
          >
            <CustomSpinner />
          </Box>
        )}
        <CustomHeader
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderRadius: 0,
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Unread Notifications
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <IconX />
          </IconButton>
        </CustomHeader>

        <>
          <SimpleBarReact
            style={{
              maxHeight: 'calc(100vH - 190px)',
              padding: 10,
            }}
            scrollableNodeProps={{ ref: container }}
          >
            {notificationList.map((row: any, index: number) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  fontWeight: '700 !important',
                  opacity: row.status ? 1 : 0.5,
                }}
              >
                <ListItemButton
                  onClick={() => {
                    handleMarkAsRead(row);
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: row?.description,
                      }}
                      sx={{ mb: 1 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {toLocalDate(row.createdAt).format(
                        'MM-DD-YYYY, hh:mm:ss A',
                      )}
                    </Typography>
                  </Box>
                </ListItemButton>
              </Box>
            ))}
          </SimpleBarReact>
          <Box p={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleMarkAllAsRead}
              sx={{ mb: 1 }}
            >
              Mark All as Read
            </Button>
            <Button fullWidth variant="text" onClick={handleDeleteAll}>
              Delete All Notifcations
            </Button>
          </Box>
        </>
      </Drawer>
      <ContractDialog
        open={Boolean(contractData)}
        toggle={() => setContractData(null)}
        currentData={contractData}
      />
      <InvoiceNotificationDialog
        open={Boolean(invoiceData)}
        toggle={() => setInvoiceData(null)}
        currentData={invoiceData}
      />
      <PaymentNotificationDialog
        open={Boolean(paymentData)}
        toggle={() => setPaymentData(null)}
        currentData={paymentData}
      />
    </>
  );
};

export default NotificationDrawer;
