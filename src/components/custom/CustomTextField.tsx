import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTextField = styled((props: any) => (
  <TextField {...props} autoComplete="off" />
))(({ theme }) => ({
  '& .MuiFormLabel-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(228, 230, 244, 0.87)' : '',
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'dark' ? '#323441' : '#fff',
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.mode === 'dark' ? 'rgba(228, 230, 244, 0.87)' : '',
    opacity: '1',
    boxShadow: 'inherit !important',
    WebkitTextFillColor: 'inherit !important',
    caretColor: 'inherit !important',
    borderRadius: 'inherit !important',
  },
  '& .MuiInputBase-input:-webkit-autofill': {
    transition: 'background-color 5000s ease-in-out 0s',
  },
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
  '& textarea': {
    padding: '0 !important',
  },
}));

export default CustomTextField;
