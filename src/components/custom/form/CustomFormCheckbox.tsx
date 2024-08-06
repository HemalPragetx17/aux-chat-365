import { FormControl, FormControlLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomCheckbox from '../CustomCheckbox';

interface ComponentProps {
  label: string;
  name: string;
  control: any;
  disabled?: boolean;
}

const CustomFormCheckbox = (props: ComponentProps) => {
  const { label, name, control, disabled } = props;

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Controller
        name={name}
        control={control}
        rules={{ required: false }}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            label={label}
            control={
              <CustomCheckbox
                checked={Boolean(value)}
                onChange={onChange}
                name={name}
                disabled={disabled}
              />
            }
          />
        )}
      />
    </FormControl>
  );
};

export default CustomFormCheckbox;
