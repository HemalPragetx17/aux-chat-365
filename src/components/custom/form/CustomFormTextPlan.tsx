import { FormControl, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomTextField from '../CustomTextField';

interface ComponentProps {
  errors: any;
  name: string;
  control: any;
  disabled?: boolean;
  hint?: string;
  label?: string;
}

const CustomFormTextPlan = (props: ComponentProps) => {
  const { errors, name, control, disabled, hint, label } = props;
  const error = errors;

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomTextField
            label={label}
            value={value}
            size="small"
            onChange={onChange}
            error={Boolean(error)}
            disabled={Boolean(disabled)}
            helperText={hint}
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

export default CustomFormTextPlan;
