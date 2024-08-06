import { Icon } from '@iconify/react';
import { DialogContent, Grid, Paper, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';

import CustomCloseButton from '../../custom/CustomCloseButton';

interface DialogProp {
  open: boolean;
  toggle: () => void;
  currentData: any;
}

const PaymentNotificationDialog = (props: DialogProp) => {
  const { open, toggle, currentData } = props;

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="xs"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent sx={{ position: 'relative' }}>
        <Paper elevation={3} sx={{ padding: 3, margin: 2, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Payment Receipt
          </Typography>
          <Grid container mt={4}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Customer Name
                </Typography>
                <Typography variant="body1">
                  {currentData?.BillingCustomerName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Email
                </Typography>
                <Typography variant="body1">
                  {currentData?.BillingEmail || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {currentData?.BillingPhoneNumber}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Amount
                </Typography>
                <Typography variant="body1">${currentData?.Amount}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Description
                </Typography>
                <Typography variant="body1">
                  {currentData?.Description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentNotificationDialog;
