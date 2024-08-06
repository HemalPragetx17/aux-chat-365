import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTextFieldLogin = styled((props: any) => (
  <TextField {...props} autoComplete="off" />
))(({ theme }) => ({
  '& .MuiFormLabel-root': {
    color:'#fff',
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input': {
    color:'#fff', // Change this to the color you desire
    opacity: '1',
  },
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: '#fff',
    opacity: '0.7',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: '#fff',
    opacity: '0.7',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
  '& textarea': {
    padding: '0 !important',
  },
}));

export default CustomTextFieldLogin;
