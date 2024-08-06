import { FormControl, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomTextField from '../CustomTextField';

interface ComponentProps {
  type?: string;
  label: string;
  errors: any;
  name: string;
  control: any;
  disabled?: boolean;
}

const CustomFormLine = (props: ComponentProps) => {
  const { type, label, errors, name, control, disabled } = props;
  const error = errors[name];

  const handleMouseScroll = (e: any) => {
    if (type === 'number') {
      e.target.blur();
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomTextField
            variant="standard"
            type={type}
            value={value}
            label={label}
            size="small"
            onChange={onChange}
            onWheel={(e: any) => handleMouseScroll(e)}
            error={Boolean(error)}
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

export default CustomFormLine;
