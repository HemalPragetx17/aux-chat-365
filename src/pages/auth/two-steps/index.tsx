import { Box, Grid, Typography } from '@mui/material';

import PageContainer from '../../../components/container/PageContainer';
import AuthTwoSteps from '../authForms/AuthTwoSteps';

const TwoSteps = () => (
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
        md={9}
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
        md={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box p={4}>
          <Typography variant="h4" fontWeight="700">
            Two Step Verification
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
            We sent a verification code to your mobile. Enter the code from the
            mobile in the field below.
          </Typography>
          <AuthTwoSteps />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

TwoSteps.layout = 'Blank';
export default TwoSteps;
