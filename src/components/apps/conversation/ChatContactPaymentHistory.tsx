import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Skeleton,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { IconChevronDown, IconDotsVertical } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';
import { toLocalDate } from '../../../utils/date';
import CustomOptionsMenu from '../../custom/CustomOptionsMenu';

interface chatType {
  selectedChat?: any;
}

const ChatContactPaymentHistory = (props: chatType) => {
  const { selectedChat } = props;
  const { Contact } = selectedChat;
  const [loading, setLoading] = useState<boolean>(true);
  const [resposneData, setResponseData] = useState<any>({
    lastFiveUnpaidPaymentLinks: [],
    lastInvoiceStatus: null,
    totalAmount: 0,
  });
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const phone = Contact?.phone || selectedChat?.to;
      const response = await axios.post(`/payment/call-details/${phone}`);
      if (response.status === 201) {
        const { lastFiveUnpaidPaymentLinks, lastInvoiceStatus, totalPayments } =
          response?.data;
        setResponseData({
          lastFiveUnpaidPaymentLinks,
          lastInvoiceStatus,
          totalAmount: totalPayments?._sum?.Amount || 0,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelPayment = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/payment/cancel/${row?.id}`);
      if (response.status === 200 || response.status === 201) {
        fetchPaymentHistory();
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
        fetchPaymentHistory();
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

  return (
    <>
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <Box>
          <Accordion>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Box>
                <Typography variant="h6" mt={2}>
                  Payment Links
                </Typography>
                <Typography variant="caption" mb={2} display={'inline-block'}>
                  Last 5 Unpaid Payment Requests
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {resposneData?.lastFiveUnpaidPaymentLinks?.length ? (
                <>
                  {resposneData?.lastFiveUnpaidPaymentLinks.map((row: any) => {
                    return (
                      <Box
                        display={'flex'}
                        key={row?.id}
                        sx={{
                          borderTop: `1px solid ${theme.palette.divider}`,
                          padding: '10px 0px',
                          borderRadius: 0,
                        }}
                      >
                        <Box>
                          <Typography variant="h6">
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
                        <Box sx={{ ml: 'auto !important' }}>
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
                                    navigator.clipboard.writeText(
                                      row?.payment_url,
                                    );
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
                        </Box>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Alert severity="info" icon={false}>
                  User has no due payments.
                </Alert>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ mt: 2 }}
            >
              <Box>
                <Typography variant="h6" mt={2}>
                  Invoice
                </Typography>
                <Typography variant="caption" mb={2} display={'inline-block'}>
                  Last Invoice generated for this user
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {resposneData?.lastInvoiceStatus ? (
                <Box
                  display={'flex'}
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    padding: '10px 0px',
                    borderRadius: 0,
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {'$ ' +
                        parseFloat(
                          resposneData.lastInvoiceStatus.total,
                        ).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {toLocalDate(
                        resposneData?.lastInvoiceStatus.createdAt,
                      ).format(`MM-DD-YYYY [at] hh:mm:ss A`)}
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
                              handleCancelInvoice(
                                resposneData?.lastInvoiceStatus,
                              );
                            },
                          },
                        },
                        {
                          text: 'Resend Invoice',
                          menuItemProps: {
                            sx: { py: 2 },
                            onClick: () => {
                              handleResendInvoice(
                                resposneData?.lastInvoiceStatus,
                              );
                            },
                          },
                        },
                        {
                          text: 'Download',
                          menuItemProps: {
                            sx: { py: 2 },
                            onClick: () => {
                              handleDownloadInvoice(
                                resposneData?.lastInvoiceStatus,
                              );
                            },
                          },
                        },
                      ]}
                    />
                  </Box>
                </Box>
              ) : (
                <Alert severity="info" icon={false}>
                  User has no unpaid invoice
                </Alert>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ mt: 2 }}
            >
              <Box>
                <Typography variant="h6" mt={2}>
                  Total Payment
                </Typography>
                <Typography variant="caption" mb={2} display={'inline-block'}>
                  Sum of total payment collected from this user
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display={'flex'}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  padding: '10px 0px',
                  borderRadius: 0,
                }}
              >
                <Box>
                  <Typography variant="h6">
                    {'$ ' + parseFloat(resposneData.totalAmount).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </>
  );
};

export default ChatContactPaymentHistory;
