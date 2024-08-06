import { FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller } from 'react-hook-form';

interface ComponentProps {
  label: string;
  name: string;
  control: any;
  errors: any;
}

const CustomFormTimePicker = (props: ComponentProps) => {
  const { label, name, control, errors } = props;
  const error = errors[name];

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              ampm={false}
              label={label}
              value={value}
              onChange={(newValue) => {
                onChange(newValue);
              }}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>
        )}
      />
      {error && (
        <FormHelperText sx={{ color: 'error.main' }}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomFormTimePicker;
