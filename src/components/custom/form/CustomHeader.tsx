import { Box, BoxProps, styled } from '@mui/material';

const CustomHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  justifyContent: 'space-between',
}));

export default CustomHeader;
