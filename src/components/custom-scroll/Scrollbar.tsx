import { Box, styled, useMediaQuery } from '@mui/material';
import SimpleBar from 'simplebar-react';
import 'simplebar/src/simplebar.css';

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    display: 'none !important', // Hide the scrollbar
  },
}));

const Scrollbar = (props: any) => {
  const { children, sx, ...other } = props;
  const lgDown = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  if (lgDown) {
    return <Box sx={{ overflowX: 'auto' }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle sx={sx} {...other}>
      {children}
    </SimpleBarStyle>
  );
};

export default Scrollbar;
