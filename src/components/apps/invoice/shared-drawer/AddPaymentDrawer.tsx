// ** React Imports
import { Icon } from '@iconify/react';
import {
  Box,
  BoxProps,
  Button,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { ForwardedRef, forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import CustomDatePickerWrapper from '../../../custom/CustomDatePickerWrapper';

interface Props {
  open: boolean;
  toggle: () => void;
}

const CustomInput = forwardRef(
  ({ ...props }, ref: ForwardedRef<HTMLElement>) => {
    return <TextField inputRef={ref} label="Payment Date" {...props} />;
  },
);
CustomInput.displayName = 'CustomInput';

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const EditInvoiceDrawer = ({ open, toggle }: Props) => {
  // ** State
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={toggle}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
    >
      <Header>
        <Typography variant="h6">Add Payment</Typography>
        <IconButton size="small" onClick={toggle}>
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <Box sx={{ mb: 5 }}>
          <TextField
            fullWidth
            id="invoice-balance"
            label="Invoice Balance"
            InputProps={{ disabled: true }}
            defaultValue="5000.00"
          />
        </Box>
        <Box sx={{ mb: 5 }}>
          <TextField
            fullWidth
            type="number"
            label="Payment Amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: 5 }}>
          <CustomDatePickerWrapper
            sx={{ '& .MuiFormControl-root': { width: '100%' } }}
          >
            <DatePicker
              selected={date}
              id="invoice-payment-date"
              customInput={<CustomInput />}
              onChange={(date: Date) => setDate(date)}
            />
          </CustomDatePickerWrapper>
        </Box>
        <Box sx={{ mb: 5 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="payment-method">Payment Method</InputLabel>
            <Select
              label="Payment Method"
              labelId="payment-method"
              id="payment-method-select"
              defaultValue="select-method"
            >
              <MenuItem value="select-method" disabled>
                Select Payment Method
              </MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Debit">Debit</MenuItem>
              <MenuItem value="Paypal">Paypal</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 6 }}>
          <TextField
            rows={6}
            multiline
            fullWidth
            label="Internal Payment Note"
            placeholder="Internal Payment Note"
          />
        </Box>

        <div>
          <Button variant="contained" onClick={toggle} sx={{ mr: 4 }}>
            Send
          </Button>
          <Button variant="outlined" color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </div>
      </Box>
    </Drawer>
  );
};

export default EditInvoiceDrawer;
