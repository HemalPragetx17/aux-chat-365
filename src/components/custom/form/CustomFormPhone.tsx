import { FormControl, FormHelperText, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomTextField from '../CustomTextField';

interface ComponentProps {
  label: string;
  errors: any;
  name: string;
  control: any;
  disabled?: boolean;
}

const CustomFormPhone = (props: ComponentProps) => {
  const { label, errors, name, control, disabled } = props;
  const error = errors[name];

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomTextField
            autoComplete="off"
            type="number"
            value={value}
            label={label}
            size="small"
            onChange={onChange}
            onWheel={(e: any) => e.target.blur()}
            error={Boolean(error)}
            disabled={Boolean(disabled)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+1</InputAdornment>
              ),
            }}
          />
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

export default CustomFormPhone;
