import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { Controller } from 'react-hook-form';

import CustomTextField from '../CustomTextField';

interface ComponentProps {
  type?: string;
  label: string;
  errors: any;
  name: string;
  control: any;
  disabled?: boolean;
  style?: any;
  handleBlur: () => void;
  loading?: boolean;
}

const CustomFormStandardText = (props: ComponentProps) => {
  const {
    type,
    label,
    errors,
    name,
    control,
    disabled,
    style,
    handleBlur,
    loading,
  } = props;
  const error = errors[name];

  const handleMouseScroll = (e: any) => {
    if (type === 'number') {
      e.target.blur();
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 0.5 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CustomTextField
            type={type}
            value={value}
            label={label}
            size="small"
            onChange={onChange}
            onWheel={(e: any) => handleMouseScroll(e)}
            onBlur={handleBlur}
            error={Boolean(error)}
            disabled={Boolean(disabled)}
            style={style}
            autoComplete="off"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loading && (
                    <CircularProgress
                      color="primary"
                      sx={{
                        height: '20px !important',
                        width: '20px !important',
                        marginRight: 1,
                      }}
                    />
                  )}
                </InputAdornment>
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

export default CustomFormStandardText;
