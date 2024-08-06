import { FormControl, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomTextField from '../CustomTextField';

interface ComponentProps {
  type?: string;
  label: string;
  errors: any;
  name: string;
  control: any;
  rows: number;
  disabled?: boolean;
}

const CustomFormTextArea = (props: ComponentProps) => {
  const { type, label, errors, name, control, rows, disabled } = props;
  const error = errors[name];

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomTextField
            type={type}
            value={value}
            label={label}
            size="small"
            multiline
            rows={rows}
            onChange={onChange}
            error={Boolean(error)}
            autoComplete="off"
            disabled={Boolean(disabled)}
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

export default CustomFormTextArea;
