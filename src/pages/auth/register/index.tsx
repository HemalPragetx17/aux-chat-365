import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import PageContainer from '../../../components/container/PageContainer';
import AuthRegister from '../authForms/AuthRegister';

const Register = () => {
  return (
    <PageContainer>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{
          overflowX: 'hidden',
          background:
            "url('https://login.auxchat.com/login-background.jpg')no-repeat",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={8}
          display={{ xs: 'none', sm: 'none', md: 'flex' }}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              background: '#000000ba',
              padding: 1.5,
              color: 'rgba(228, 230, 244, 0.87)',
              width: '80%',
              maxWidth: 400,
            }}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="space-between"
                mb={5}
              >
                <Typography fontWeight="700" variant="h3" component={'span'}>
                  Starter
                </Typography>
                <Typography fontWeight="700" variant="h3" component={'span'}>
                  $25/mo
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="700" variant="h6" mb={1}>
                  Plan Details
                </Typography>
                <Typography variant="body1" mb={2}>
                  500 Messages per Month
                  <br />
                  1 user
                  <br />
                  1 line
                  <br />
                  Essential features
                </Typography>
                <Typography
                  component={Link}
                  target="_blank"
                  href="https://auxchat.com/pricing/"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Upgrade Plan
                </Typography>
              </Grid>
              <Divider sx={{ width: '100%', mt: 2, mb: 2 }} />
              <Grid item xs={12}>
                <Typography fontWeight="700" variant="h6" mb={1}>
                  Payment details
                </Typography>
                <Typography
                  variant="body1"
                  mb={2}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>
                    Total due today
                    <br />
                    <span style={{ fontSize: 12 }}>
                      (Taxes & fees may apply)
                    </span>
                  </span>
                  <span>$25/mo</span>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  You saved 20% with an annual plan!<br></br>
                </Typography>
                <em>Prefer month-to-month? </em>
                <Typography
                  component={Link}
                  target="_blank"
                  href="https://auxchat.com/pricing/"
                  fontWeight="500"
                  sx={{
                    ml: 1,
                    textDecoration: 'none',
                    color: 'success.main',
                  }}
                >
                  Change Plan
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={'100vH'}
          sx={{
            background: '#000000ba',
          }}
        >
          <Box p={2} maxWidth={600}>
            <AuthRegister
              title="Let's get started"
              subtitle={
                <Stack direction="row" spacing={1} mt={3}>
                  <Typography color="#ffffff" variant="h6" fontWeight="400">
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/auth/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Sign In
                  </Typography>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

Register.layout = 'Blank';
export default Register;
