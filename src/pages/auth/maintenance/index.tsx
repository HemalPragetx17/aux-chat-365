import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Maintenance = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <Image
        width={0}
        height={0}
        src={'/images/backgrounds/maintenance2.svg'}
        alt="404"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '500px',
          maxHeight: '500px',
        }}
      />
      <Typography align="center" variant="h1" mb={4}>
        Maintenance Mode!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        Website is Under Construction. Check back later!
      </Typography>
      <Button
        color="primary"
        variant="contained"
        component={Link}
        href="/"
        disableElevation
      >
        Go Back to Home
      </Button>
    </Container>
  </Box>
);

Maintenance.layout = 'Blank';
export default Maintenance;
