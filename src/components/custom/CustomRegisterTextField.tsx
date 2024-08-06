import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomRegisterTextField = styled((props: any) => (
  <TextField {...props} autoComplete="off" />
))(({ theme }) => ({
  '& .MuiFormLabel-root': {
    color: 'rgba(228, 230, 244, 0.87)',
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: 'rgba(228, 230, 244, 0.87)',
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input': {
    color: 'rgba(228, 230, 244, 0.87)',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: 'rgba(228, 230, 244, 0.87)',
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

export default CustomRegisterTextField;
