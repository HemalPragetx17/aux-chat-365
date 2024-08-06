import { Alert, Button, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import axios from '../../../../utils/axios';
import { STATUS_COLOR } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import { formatPayment } from '../../../../utils/format';
import BillingInvoiceList from '../invoice/BillingInvoiceList';

export default function BillingPlan() {
  const [planDetails, setPlanDetails] = useState<any>(null);

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await axios.post(`/users/plan`);
      const { Profile } = response?.data;
      setPlanDetails(Profile?.planDetails);
    } catch (error) {
      setPlanDetails(null);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!Boolean(planDetails?.id) ? (
          <Alert severity="error">
            You are currently not subscribed to any plan. Please contact system
            administrator to set up a plan for you!
          </Alert>
        ) : (
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h2">
                  Current Plan :{' '}
                  <Typography
                    variant="h2"
                    component="span"
                    color={'rgb(19, 222, 185)'}
                  >
                    {planDetails?.plan?.title}
                  </Typography>
                </Typography>
                <Typography variant="caption">
                  Thanks for being a member and supporting our development.
                </Typography>
                <Box display={'flex'} mt={3} alignItems={'center'}>
                  <Image
                    src={'/images/products/plan.png'}
                    width={100}
                    height={120}
                    alt="plan-icon"
                  />
                  <Box>
                    <Typography variant="body1">
                      Plan Start Date :{' '}
                      <Typography
                        variant="inherit"
                        component={'span'}
                        sx={{ fontWeight: 700 }}
                      >
                        {moment(planDetails?.createdAt).format(
                          `MM-DD-YYYY, hh:mm A`,
                        )}
                      </Typography>
                    </Typography>
                    {planDetails?.expiredAt && (
                      <Typography variant="body1">
                        Plan Expiry Date :{' '}
                        <Typography
                          variant="inherit"
                          component={'span'}
                          sx={{ fontWeight: 700 }}
                        >
                          {moment(planDetails?.expiredAt).format(
                            `MM-DD-YYYY, hh:mm A`,
                          )}
                        </Typography>
                      </Typography>
                    )}
                    <Typography variant="body1">
                      Status :{' '}
                      <Typography
                        variant="inherit"
                        component={'span'}
                        color={STATUS_COLOR[planDetails?.status]}
                        sx={{
                          fontWeight: 700,
                          color:
                            planDetails?.status === 'PENDING'
                              ? '#FF8C26'
                              : '#E45D5D',
                        }}
                      >
                        {planDetails?.status}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography variant="h2">Current Invoice</Typography>
                <Typography variant="caption">
                  Invoice was generated on{' '}
                  {toLocalDate(planDetails.invoice.createdAt).format(
                    `MMM DD, YYYY`,
                  )}
                </Typography>
                <Box
                  width={'100%'}
                  display={'flex'}
                  justifyContent={'space-between'}
                >
                  <Box mt={3}>
                    <Typography variant="body1">
                      Total Amount :{' '}
                      <Typography
                        variant="inherit"
                        component={'span'}
                        sx={{ fontWeight: 700 }}
                      >
                        ${formatPayment(planDetails.invoice.total)}
                      </Typography>
                    </Typography>
                    <Typography variant="body1">
                      {planDetails.invoice.status === 'SUCCESS'
                        ? 'Payment Made On'
                        : 'Due Date'}
                      :{' '}
                      <Typography
                        variant="inherit"
                        component={'span'}
                        sx={{ fontWeight: 700 }}
                      >
                        {toLocalDate(planDetails.invoice.dueDate).format(
                          `MMM DD, YYYY`,
                        )}
                      </Typography>
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          window.open(planDetails.invoice?.file, '_blank');
                        }}
                      >
                        View Invoice
                      </Button>
                      {planDetails.invoice.status === 'PENDING' && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            window.open(
                              planDetails.invoice?.payment_url,
                              '_blank',
                            );
                          }}
                        >
                          MAKE PAYMENT
                        </Button>
                      )}
                    </Box>
                  </Box>
                  {planDetails.invoice.status === 'PENDING' && (
                    <Image
                      src={'/images/products/pending.png'}
                      width={120}
                      height={120}
                      style={{ opacity: 0.5 }}
                      alt="pending-icon"
                    />
                  )}
                  {planDetails.invoice.status === 'SUCCESS' && (
                    <Image
                      src={'/images/products/paid.png'}
                      width={120}
                      height={120}
                      alt="paid-icon"
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" icon={false}>
                Please contact system administrator if you wish to change your
                plan!
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <BillingInvoiceList />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
