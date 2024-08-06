import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <span>
        <Image
          width={0}
          height={0}
          src={'/images/backgrounds/errorimg.svg'}
          alt="404"
          style={{
            height: 'auto',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '500px',
          }}
        />
      </span>
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        This page you are looking for could not be found.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        component={Link}
        href="/auth/login"
        disableElevation
      >
        Go Back to Home
      </Button>
    </Container>
  </Box>
);

Error.layout = 'Blank';
export default Error;
