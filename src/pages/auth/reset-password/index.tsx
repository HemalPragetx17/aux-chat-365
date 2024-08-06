import { Box, Grid, Typography } from '@mui/material';

import PageContainer from '../../../components/container/PageContainer';
import AuthResetPassword from '../authForms/AuthResetPassword';

const ResetPassword = () => (
  <PageContainer>
    <Grid
      container
      spacing={0}
      justifyContent="center"
      sx={{ height: '100vh' }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
        display={{ xs: 'none', sm: 'none', md: 'flex' }}
        sx={{
          overflowX: 'hidden',
          background:
            "url('https://login.auxchat.com/assets/img/layoutlogin.jpg')no-repeat",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
        }}
      />
      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box p={4}>
          <Typography variant="h4" fontWeight="700">
            Reset your password
          </Typography>

          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="400"
            mt={2}
          >
            An OTP has been sent to your email. Please check your Inbox or Spam
            folder and enter the OTP to verify your identity.
          </Typography>
          <AuthResetPassword />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

ResetPassword.layout = 'Blank';
export default ResetPassword;
