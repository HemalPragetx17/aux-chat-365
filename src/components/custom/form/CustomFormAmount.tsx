import { FormControl, FormHelperText, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomTextField from '../CustomTextField';

interface ComponentProps {
  errors: any;
  name: string;
  control: any;
  disabled?: boolean;
  symbol: string;
  hint?: string;
  label?: string;
}

const CustomFormAmount = (props: ComponentProps) => {
  const { errors, name, control, disabled, symbol, hint, label } = props;
  const error = errors;

  const handleBlur = (e: any, onChange: any) => {
    if (symbol === '$') {
      let value = e?.target?.value;
      onChange(value);
    } else {
      let value = e?.target?.value;
      if (value !== '0') {
        onChange(value.replace(/^0+/, ''));
      }
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomTextField
            type="number"
            label={label}
            value={value}
            size="small"
            onChange={onChange}
            onBlur={(e: any) => handleBlur(e, onChange)}
            onWheel={(e: any) => e.target.blur()}
            error={Boolean(error)}
            disabled={Boolean(disabled)}
            helperText={hint}
            InputProps={{
              startAdornment: (
                <>
                  {Boolean(symbol) && (
                    <InputAdornment position="start">{symbol}</InputAdornment>
                  )}
                </>
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

export default CustomFormAmount;
