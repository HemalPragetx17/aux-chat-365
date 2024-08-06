import { FormControl, FormHelperText, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';

import VTCustomTextField from '../VTCustomTextField';

interface ComponentProps {
  label: string;
  errors: any;
  name: string;
  control: any;
  options: any[];
  multiple?: any;
  disabled?: boolean;
}
const CustomFormSelectVT = (props: ComponentProps) => {
  const { label, errors, name, control, options, multiple, disabled } = props;
  const error = errors[name];

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <VTCustomTextField
            select
            size="small"
            value={value}
            onChange={onChange}
            multiline={multiple}
            error={Boolean(error)}
            disabled={disabled}
            autoComplete="off"
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))}
          </VTCustomTextField>
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

export default CustomFormSelectVT;
