import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// VTCustomTextField
const VTCustomTextField = styled((props: any) => {
  const { fontColor, ...other } = props;

  return (
    <TextField
      {...other}
      style={{ ...other.style, color: fontColor || 'inherit' }}
      autoComplete="off"
    />
  );
})(({ theme }) => ({
  '& .MuiFormLabel-root': {
    color: 'inherit',
    opacity: '0.8',
  },
  '& .MuiInputBase-root': {
    background: 'white',
  },
  '& .MuiOutlinedInput-root': {
    color: 'black',
    '& fieldset': {
      borderColor: 'inherit',
      border: 'none !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      '& fieldset': {
        borderColor: theme.palette.text.secondary,
      },
    },
  },
  '& .MuiOutlinedInput-input': {
    color: 'inherit',
    opacity: '1',
    boxShadow: 'none !important',
    WebkitTextFillColor: 'black !important',
    caretColor: 'black !important',
    borderRadius: 'inherit !important',
  },
  '& .MuiInputBase-input:-webkit-autofill': {
    transition: 'background-color 5000s ease-in-out 0s',
  },
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: 'inherit',
    opacity: '0.7',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'inherit',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
    backgroundColor: 'inherit',
  },
  '& .Mui-disabled .MuiOutlinedInput-input': {
    color: theme.palette.text.secondary,
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
  '& textarea': {
    padding: '0 !important',
  },
}));

export default VTCustomTextField;
