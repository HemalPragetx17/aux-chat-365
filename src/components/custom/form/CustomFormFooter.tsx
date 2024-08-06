import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface ComponentProps {
  loading?: boolean;
  disabled?: boolean;
  onCancelClick: () => void;
}

const CustomFormFooter = (props: ComponentProps) => {
  const { onCancelClick, loading, disabled } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
      <LoadingButton
        type="submit"
        variant="contained"
        sx={{ mr: 1,background:'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)' }}
        loading={loading}
        disabled={disabled}
      >
        Submit
      </LoadingButton>
      <Button variant="text" color="primary" onClick={onCancelClick}>
        Cancel
      </Button>
    </Box>
  );
};

export default CustomFormFooter;
