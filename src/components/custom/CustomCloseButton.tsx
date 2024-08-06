import { IconButton, IconButtonProps, styled } from '@mui/material';

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  cursor: 'pointer',
  transform: 'translate(10px, -10px)',
  boxShadow: theme.shadows[2],
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  zIndex: 200,
}));

export default CustomCloseButton;
