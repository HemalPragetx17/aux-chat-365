import { FormControl, FormHelperText, TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';

import VTCustomTextField from '../VTCustomTextField';

type Props = TextFieldProps & {
  type?: string;
  label: string;
  errors: any;
  name: string;
  control: any;
  disabled?: boolean;
  hasRequired?: boolean;
  style?: any;
  fontColor?: string;
};

const CustomFormTextVT = (props: Props) => {
  const {
    type,
    label,
    errors,
    name,
    control,
    disabled,
    style,
    hasRequired,
    fontColor,
    ...other
  } = { ...props };
  const error = errors[name];

  const handleMouseScroll = (e: any) => {
    if (type === 'number') {
      e.target.blur();
    }
  };

  return (
    <FormControl fullWidth sx={style ? { mb: 2, ...style } : { mb: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <VTCustomTextField
            autoComplete="off"
            type={type}
            value={value}
            placeholder={label}
            size="small"
            onChange={onChange}
            onWheel={(e: any) => handleMouseScroll(e)}
            error={Boolean(error)}
            disabled={Boolean(disabled)}
            style={{ color: fontColor }}
            {...other}
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

export default CustomFormTextVT;
