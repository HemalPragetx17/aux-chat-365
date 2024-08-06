import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Controller } from 'react-hook-form';

import { AppState, useSelector } from '../../../store/Store';

interface ComponentProps {
  label: string;
  errors: any;
  name: string;
  control: any;
  options: any[];
  multiple?: any;
  disabled?: boolean;
}

const CustomFormSelect = (props: ComponentProps) => {
  const { label, errors, name, control, options, multiple, disabled } = props;
  const customizer = useSelector((state: AppState) => state.customizer);
  const error = errors[name];

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="type-select" size="small">
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            size="small"
            label={label}
            labelId="type-select"
            value={value}
            onChange={onChange}
            multiple={multiple}
            error={Boolean(error)}
            disabled={disabled}
            sx={{
              background:
                customizer?.activeMode === 'dark' ? '#323441' : '#fff',
            }}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))}
          </Select>
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

export default CustomFormSelect;
