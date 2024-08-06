// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const CleaveWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  '& input': {
    fontSize: 16,
    width: '100%',
    borderWidth: 1,
    background: 'none',
    borderStyle: 'solid',
    padding: '8.5px 14px',
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.body1.fontFamily,
    // borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus, &:focus-visible': {
      outline: 0,
      borderWidth: 2,
      padding: '8.5px 14px',
      borderColor: `${theme.palette.primary.main} !important`,
      // boxShadow: `0 2px 3px 0 rgba(${theme.palette.customColors.main}, 0.1)`
    },
    '&::-webkit-input-placeholder': {
      color: theme.palette.text.secondary,
    },
  },
}));

export default CleaveWrapper;