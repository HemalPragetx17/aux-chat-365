import { yupResolver } from '@hookform/resolvers/yup';
import {
  LoadingButton,
  TabContext,
  TabList,
  TabPanel,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline';
import {
  Box,
  Button,
  IconButton,
  ListItemButton,
  ListItemText,
  Paper,
  Tab,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';
import swal from 'sweetalert';
import * as yup from 'yup';

import { Icon } from '@iconify/react';
import { IconDotsVertical, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../hooks/useAuth';
import { AppState, useSelector } from '../../../../store/Store';
import axios from '../../../../utils/axios';
import {
  getChatHead,
  getDetails,
  processPhoneNumber,
} from '../../../../utils/conversation';
import { toLocalDate } from '../../../../utils/date';
import { CustomButton } from '../../../callfeatures/message/CallMessageType';
import CustomOptionsMenu from '../../../custom/CustomOptionsMenu';
import CustomFormTextArea from '../../../custom/form/CustomFormTextArea';
import ContactCustomFieldForm from './ContactCustomFieldForm';

interface pageProps {
  onUpdated: (data: any) => void;
  containerHeight: any;
}

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
});

const Divider = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${
    theme.palette.mode === 'light' ? '#cecece' : '#575757'
  }`,
  width: '100%',
  marginTop: 20,
  marginBottom: 20,
}));

const mockData = {
  callList: [],
  conversation: [],
  lastFiveUnpaidPaymentLinks: [],
  lastInvoiceStatus: null,
  totalPayments: 0,
};

const mockFlag = {
  callList: false,
  conversation: false,
  lastFiveUnpaidPaymentLinks: false,
};

const ContactSideBar = (props: pageProps) => {
  const { onUpdated, containerHeight } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [groupLoading, setGroupLoading] = useState<boolean>(false);
  const store = useSelector((state: AppState) => state.contactsReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const [tab, setTab] = useState<string>('general');
  const [contactGroupsWithId, setContactGroupsWithId] = useState<any>([]);
  const [contactGroupsWithoutId, setContactGroupsWithoutId] = useState<any>([]);
  const [historyData, setHistoryData] = useState<any>(mockData);
  const [splitFlag, setSplitFlag] = useState<any>(mockFlag);
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTab('general');
    reset(defaultValues);
    setContactGroupsWithId([]);
    setLoading(false);
    setGroupLoading(false);
    setContactGroupsWithoutId([]);
    setSplitFlag(mockFlag);
    setHistoryData(mockData);
    if (store?.currentData?.id) {
      fetchContactGroupDetails();
      findContactHistory();
    }
  }, [store?.currentData?.id]);

  useEffect(() => {
    reset(defaultValues);
  }, [tab]);

  const schema = yup.object().shape({
    note: yup.string().required('Notes is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
    }),
    [],
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/contact/note/${store?.currentData.id}/`,
        data,
      );
      if (response) {
        reset(defaultValues);
        onUpdated(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const fetchContactGroupDetails = async () => {
    try {
      setGroupLoading(true);
      const response = await axios.post(
        `/contact-group/fetch-group-list/${store?.currentData.id}`,
      );
      if (response?.status === 201) {
        const { contactGroupsWithId, contactGroupsWithoutId } = response?.data;
        setContactGroupsWithId(contactGroupsWithId);
        setContactGroupsWithoutId(contactGroupsWithoutId);
      }
      setGroupLoading(false);
    } catch (error) {
      console.error(error);
      setGroupLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleRemoveFromGroup = async (id: string) => {
    const willDelete = await swal({
      title: 'Remove contact from this group?',
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
        setGroupLoading(true);
        const response = await axios.post(
          `/contact-group/remove-contact/${id}/${store?.currentData.id}`,
        );
        if (response?.status === 201) {
          const { contactGroupsWithId, contactGroupsWithoutId } =
            response?.data;
          setContactGroupsWithId(contactGroupsWithId);
          setContactGroupsWithoutId(contactGroupsWithoutId);
          toast.success('Contact Removed Successfully');
        }
        setGroupLoading(false);
      } catch (error) {
        console.error(error);
        setGroupLoading(false);
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }
  };

  const handleAddToGroup = async (id: string) => {
    const willDelete = await swal({
      title: 'Add contact to this group?',
      closeOnClickOutside: false,
      closeOnEsc: false,
      icon: 'info',
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
        setGroupLoading(true);
        const response = await axios.post(
          `/contact-group/add-contact/${id}/${store?.currentData.id}`,
        );
        if (response?.status === 201) {
          const { contactGroupsWithId, contactGroupsWithoutId } =
            response?.data;
          setContactGroupsWithId(contactGroupsWithId);
          setContactGroupsWithoutId(contactGroupsWithoutId);
          toast.success('Contact Added Successfully');
        }
        setGroupLoading(false);
      } catch (error) {
        console.error(error);
        setGroupLoading(false);
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }
  };

  const findContactHistory = async () => {
    try {
      const response = await axios.post(
        `/contact/history/${store?.currentData.id}`,
      );
      if (response?.status === 201) {
        const {
          callList,
          conversation,
          lastFiveUnpaidPaymentLinks,
          lastInvoiceStatus,
          totalPayments,
        } = response?.data;
        setHistoryData({
          callList: callList || [],
          conversation: conversation || [],
          lastFiveUnpaidPaymentLinks: lastFiveUnpaidPaymentLinks || [],
          lastInvoiceStatus: lastInvoiceStatus || null,
          totalPayments: totalPayments || 0,
        });
      }
    } catch (error) {
      console.error(error);
      setGroupLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const displayCallHistory = () => {
    const data = splitFlag?.callList
      ? historyData?.callList
      : historyData?.callList?.slice(0, 3);
    if (data.length) {
      return (
        <Box>
          {data.map((callLog: any, index: number) => {
            const { callDetails, createdAt, messageDirection } = callLog;
            const { call_type, from_number, to_number } = callDetails;
            const number =
              messageDirection === 'OUTBOUND' ? from_number : to_number;

            return (
              <Paper
                sx={{
                  mb: 1,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                key={index}
              >
                <Box>
                  <Typography variant="body1">{number}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {toLocalDate(createdAt.$date).format(
                      `MM-DD-YYYY [at] hh:mm:ss A`,
                    )}
                  </Typography>
                </Box>
                <CustomButton disabled={true}>
                  {call_type === 'missed_calls' &&
                    messageDirection === 'INBOUND' && (
                      <Icon icon={'uil:missed-call'} color={'red'} />
                    )}
                  {messageDirection === 'OUTBOUND' && (
                    <Icon
                      icon={'fluent:call-outbound-24-filled'}
                      color={'rgb(8 115 192)'}
                    />
                  )}
                  {call_type !== 'missed_calls' &&
                    messageDirection === 'INBOUND' && (
                      <Icon
                        icon={'fluent:call-inbound-28-filled'}
                        color={'green'}
                      />
                    )}
                </CustomButton>
              </Paper>
            );
          })}
        </Box>
      );
    }
    return (
      <Typography
        variant="caption"
        display={'flex'}
        height={30}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          opacity: 0.5,
        }}
      >
        No Call Log for this contact
      </Typography>
    );
  };

  const cancelPayment = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/payment/cancel/${row?.id}`);
      if (response.status === 200 || response.status === 201) {
        findContactHistory();
      }
    } catch (error) {
      setLoading(true);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const sendReminder = async (row: any) => {
    try {
      setLoading(true);
      await axios.get(`/conversation/remind-payment-link/${row?.id}`);
    } catch (error) {
      setLoading(true);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleDownloadInvoice = async (row: any) => {
    const response = await fetch(row?.file);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let invoice_name = `${row?.customerName}-${row?.invoiceNumber}.pdf`;
    link.setAttribute('download', invoice_name);
    document.body.appendChild(link);
    link.click();
  };

  const handleCancelInvoice = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/invoice/${row?.id}`);
      if (response.status === 200 || response.status === 201) {
        toast.success('Invoice Cancelled Successfully');
        findContactHistory();
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleResendInvoice = async (row: any) => {
    try {
      setLoading(true);
      const payload = {
        ...row,
        to: row?.customerPhoneNumber,
        from: row?.companyPhoneNumber,
        sender: user?.name as string,
        isPaid: 'false',
      };
      const response = await axios.post(`/invoice/send-invoice-app`, payload);
      if (response.status === 200 || response.status === 201) {
        toast.success('Invoice Sent Successfully');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const displayChatHistory = () => {
    const data = splitFlag?.conversation
      ? historyData?.conversation
      : historyData?.conversation?.slice(0, 3);
    if (data.length) {
      return (
        <Box>
          {data.map((chat: any, index: number) => {
            return (
              <ListItemButton
                key={index}
                onClick={() => {
                  router.replace(
                    `/chats/conversation?tagged=true&id=${chat?.id}`,
                  );
                }}
                sx={{
                  py: 1,
                  px: 1,
                  pt: 1,
                  mb: 1,
                  paddingRight: 0,
                  borderRadius: '10px',
                  alignItems: 'start',
                  border: '3px solid transparent',
                  flexWrap: 'wrap',
                  background: theme.palette.background.paper,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" mb={0.5}>
                      {getChatHead(chat)}
                    </Typography>
                  }
                  secondary={getDetails(chat)}
                  secondaryTypographyProps={{
                    noWrap: true,
                    color: 'white',
                  }}
                  sx={{ my: 0 }}
                />

                <Box
                  sx={{ flexShrink: '0' }}
                  alignItems={'center'}
                  position={'absolute'}
                  right={10}
                  top={10}
                >
                  <Typography variant="h6" sx={{ fontSize: '10px' }}>
                    {format(new Date(chat?.lastMessageTime), 'MMM dd, hh:mm a')}
                  </Typography>
                </Box>
                <Box width={'100%'} mt={1}>
                  <Typography
                    variant="caption"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {chat?.Did?.title ? (
                      <Tooltip placement="right" title={chat.from}>
                        <span>{chat?.Did?.title}</span>
                      </Tooltip>
                    ) : (
                      <>{processPhoneNumber(chat?.from)}</>
                    )}
                    &nbsp;
                    {chat?.lastMessageDirection === 'OUTBOUND' ? (
                      <>→</>
                    ) : (
                      <>←</>
                    )}
                    &nbsp;{processPhoneNumber(chat?.to)}
                  </Typography>
                </Box>
              </ListItemButton>
            );
          })}
        </Box>
      );
    }
    return (
      <Typography
        variant="caption"
        display={'flex'}
        height={30}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          opacity: 0.5,
        }}
      >
        No Conversation for this contact
      </Typography>
    );
  };

  const displayPaymentHistory = () => {
    const data = splitFlag?.lastFiveUnpaidPaymentLinks
      ? historyData?.lastFiveUnpaidPaymentLinks
      : historyData?.lastFiveUnpaidPaymentLinks?.slice(0, 3);
    if (data.length) {
      return (
        <Box>
          {data.map((row: any, index: number) => {
            return (
              <Paper
                sx={{
                  mb: 1,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                key={index}
              >
                <Box>
                  <Typography variant="body1">
                    {row.amount == '' || row.amount == null
                      ? '-'
                      : '$ ' + parseFloat(row.amount).toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {toLocalDate(row.createdAt).format(
                      `MM-DD-YYYY [at] hh:mm:ss A`,
                    )}
                  </Typography>
                </Box>
                <CustomOptionsMenu
                  icon={<IconDotsVertical stroke={1.5} />}
                  iconButtonProps={{
                    size: 'small',
                    sx: { color: 'text.secondary', mr: 1 },
                  }}
                  options={[
                    {
                      text: 'Copy Payment URL',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          navigator.clipboard.writeText(row?.payment_url);
                        },
                      },
                    },
                    {
                      text: 'Send Reminder',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          sendReminder(row);
                        },
                      },
                    },
                    {
                      text: 'Cancel Payment',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          cancelPayment(row);
                        },
                      },
                    },
                  ]}
                />
              </Paper>
            );
          })}
        </Box>
      );
    }
    return (
      <Typography
        variant="caption"
        display={'flex'}
        height={30}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          opacity: 0.5,
        }}
      >
        No Due Payments
      </Typography>
    );
  };

  const displayLastInvoice = () => {
    return (
      <>
        {historyData?.lastInvoiceStatus ? (
          <Paper
            sx={{
              mb: 1,
              p: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography component="h6">
                {'$ ' +
                  parseFloat(historyData.lastInvoiceStatus.total).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {toLocalDate(historyData?.lastInvoiceStatus.createdAt).format(
                  `MM-DD-YYYY [at] hh:mm:ss A`,
                )}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto !important' }}>
              <CustomOptionsMenu
                icon={<IconDotsVertical stroke={1.5} />}
                iconButtonProps={{
                  size: 'small',
                  sx: { color: 'text.secondary', mr: 1 },
                }}
                options={[
                  {
                    text: 'Cancel Invoice',
                    menuItemProps: {
                      sx: { py: 2 },
                      onClick: () => {
                        handleCancelInvoice(historyData?.lastInvoiceStatus);
                      },
                    },
                  },
                  {
                    text: 'Resend Invoice',
                    menuItemProps: {
                      sx: { py: 2 },
                      onClick: () => {
                        handleResendInvoice(historyData?.lastInvoiceStatus);
                      },
                    },
                  },
                  {
                    text: 'Download',
                    menuItemProps: {
                      sx: { py: 2 },
                      onClick: () => {
                        handleDownloadInvoice(historyData?.lastInvoiceStatus);
                      },
                    },
                  },
                ]}
              />
            </Box>
          </Paper>
        ) : (
          <Typography
            variant="caption"
            display={'flex'}
            height={30}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{
              opacity: 0.5,
            }}
          >
            No Invoices Sent to this contact
          </Typography>
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        width: '30%',
        maxHeight: containerHeight,
        backgroundColor:
          customizer?.activeMode === 'dark' ? '#323441' : '#eeeeee',
      }}
      p={1}
    >
      <TabContext value={tab}>
        <TabList
          onChange={(event: SyntheticEvent, newValue: string) =>
            setTab(newValue)
          }
          variant="fullWidth"
        >
          <Tab value={'general'} label="General" />
          <Tab value={'history'} label="History" />
        </TabList>
        <SimpleBarReact
          style={{
            maxHeight: `${containerHeight - 78}px`,
          }}
        >
          <TabPanel value="general" sx={{ p: 0, mt: 2 }}>
            <Typography variant="caption" color={'secondary'}>
              Created By
            </Typography>
            <Typography variant="body1" mb={1}>
              {store?.currentData?.createdBy?.name}
            </Typography>
            <Typography variant="caption" color={'secondary'}>
              Created On
            </Typography>
            <Typography variant="body1" mb={1}>
              {toLocalDate(store?.currentData.createdAt).format(
                `MM-DD-YYYY, hh:mm:ss A`,
              )}
            </Typography>
            <Typography variant="caption" color={'secondary'}>
              Type
            </Typography>
            <Typography variant="body1" mb={1}>
              {store?.currentData?.isShared
                ? 'Shared Contact'
                : 'Private Contact'}
            </Typography>

            <ContactCustomFieldForm
              currentData={store?.currentData}
              success={onUpdated}
            />

            <Divider />
            {store?.currentData.notes?.length > 0 && (
              <Timeline>
                {store?.currentData.notes?.map((note: any, index: number) => {
                  return (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent
                        sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}
                      >
                        <Box
                          sx={{
                            mb: 0.5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: 'text.primary' }}
                          >
                            {note.createdBy}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled' }}
                          >
                            {toLocalDate(note.createdAt).format(
                              `MM-DD-YYYY, hh:mm:ss A`,
                            )}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ display: 'flex', flexWrap: 'wrap' }}
                        >
                          {note.note}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 30 }}>
              <CustomFormTextArea
                name={'note'}
                label={'Enter Notes'}
                errors={errors}
                control={control}
                rows={3}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  background:
                    'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                }}
                fullWidth
                loading={loading}
              >
                Add Note
              </LoadingButton>
            </form>

            <Divider />

            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              mb={2}
            >
              <Typography variant="body1">Groups</Typography>
            </Box>
            {contactGroupsWithId?.map((group: any, index: number) => {
              return (
                <Paper
                  sx={{
                    mb: 1,
                    p: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  key={index}
                >
                  <Box>
                    <Typography variant="body1">{group.title}</Typography>
                    <Typography variant="caption" color={'secondary'}>
                      {group.contactId?.length - 1} other contact
                    </Typography>
                  </Box>
                  <Tooltip title="Remove from group" arrow>
                    <IconButton
                      onClick={() => {
                        handleRemoveFromGroup(group.id);
                      }}
                      color="error"
                      disabled={groupLoading}
                    >
                      <IconTrash size={18} stroke={1} />
                    </IconButton>
                  </Tooltip>
                </Paper>
              );
            })}
            {contactGroupsWithoutId?.map((group: any, index: number) => {
              return (
                <Paper
                  sx={{
                    mb: 1,
                    p: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  key={index}
                >
                  <Box>
                    <Typography variant="body1">{group.title}</Typography>
                    <Typography variant="caption" color={'secondary'}>
                      {group.contactId?.length - 1} other contact
                    </Typography>
                  </Box>
                  <Tooltip title="Add to group" arrow>
                    <IconButton
                      onClick={() => {
                        handleAddToGroup(group.id);
                      }}
                      color="success"
                      disabled={groupLoading}
                    >
                      <IconUserPlus size={18} stroke={1} />
                    </IconButton>
                  </Tooltip>
                </Paper>
              );
            })}
          </TabPanel>
          <TabPanel value="history" sx={{ p: 0, mt: 2 }}>
            <>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={2}
              >
                <Typography variant="body1">Call History</Typography>
                <Button
                  onClick={() => {
                    setSplitFlag({
                      ...splitFlag,
                      callList: !splitFlag.callList,
                    });
                  }}
                  variant="text"
                  color="secondary"
                  sx={{ fontSize: 12 }}
                  disabled={historyData?.callList.length < 3}
                >
                  {splitFlag.callList ? 'View Less' : 'View All'}
                </Button>
              </Box>
              {displayCallHistory()}
            </>
            <Divider />
            <>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={2}
              >
                <Typography variant="body1">Chat History</Typography>
                <Button
                  onClick={() => {
                    setSplitFlag({
                      ...splitFlag,
                      conversation: !splitFlag.conversation,
                    });
                  }}
                  variant="text"
                  disabled={historyData?.conversation.length < 3}
                  color="secondary"
                  sx={{ fontSize: 12 }}
                >
                  {splitFlag.conversation ? 'View Less' : 'View All'}
                </Button>
              </Box>
              {displayChatHistory()}
            </>
            <Divider />
            <>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={2}
              >
                <Typography variant="body1">Unpaid Payment Links</Typography>
                <Button
                  onClick={() => {
                    setSplitFlag({
                      ...splitFlag,
                      lastFiveUnpaidPaymentLinks:
                        !splitFlag.lastFiveUnpaidPaymentLinks,
                    });
                  }}
                  variant="text"
                  disabled={historyData?.lastFiveUnpaidPaymentLinks.length < 3}
                  color="secondary"
                  sx={{ fontSize: 12 }}
                >
                  {splitFlag.lastFiveUnpaidPaymentLinks
                    ? 'View Less'
                    : 'View All'}
                </Button>
              </Box>
              {displayPaymentHistory()}
            </>
            <Divider />
            <>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={2}
              >
                <Typography variant="body1">Last Invoice</Typography>
              </Box>
              {displayLastInvoice()}
            </>
            <Divider />
            <>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={2}
              >
                <Typography variant="body1">Total Amount Collected</Typography>
              </Box>
              <Box>
                <Paper sx={{ p: 1 }}>
                  <Typography component="h6">
                    {'$ ' +
                      parseFloat(
                        historyData.totalPayments?._sum?.Amount || 0,
                      ).toFixed(2)}
                  </Typography>
                </Paper>
              </Box>
            </>
          </TabPanel>
        </SimpleBarReact>
      </TabContext>
    </Box>
  );
};

export default ContactSideBar;
