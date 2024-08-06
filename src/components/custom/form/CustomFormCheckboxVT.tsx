import { FormControl, FormControlLabel, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomCheckboxVT from '../CustomCheckboxVT';

interface ComponentProps {
  label: string;
  name: string;
  control: any;
}

const CustomFormCheckboxVT = (props: ComponentProps) => {
  const { label, name, control } = props;

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        rules={{ required: false }}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            label={
              <Typography
                variant="h6"
                component="h6"
                style={{ color: 'white' }}
              >
                {label}
              </Typography>
            }
            control={
              <CustomCheckboxVT
                checked={Boolean(value)}
                onChange={onChange}
                name={name}
              />
            }
          />
        )}
      />
    </FormControl>
  );
};

export default CustomFormCheckboxVT;
