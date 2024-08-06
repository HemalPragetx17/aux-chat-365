import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { PASSWORD_REGEX } from '../../../utils/constant';
import CustomTextField from '../../custom/CustomTextField';
import ChildCard from '../../shared/ChildCard';

const OtherForm = () => {
  const [togglePassword, setTogglePassword] = useState<boolean>(true);

  const schema = yup.object().shape({
    master_password: yup
      .string()
      .required('Please enter your password')
      .matches(
        PASSWORD_REGEX,
        'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
    master_otp: yup.string().required('Please enter master otp'),
    maintenance_message: yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: null,
      master_password: 'Aux@123',
      master_otp: '123456',
      maintenance_message: '',
    }),
    [],
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const onSubmit = async (data: any) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChildCard title="Other Settings">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="master_password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Master Password"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.master_password)}
                    fullWidth
                    type={togglePassword ? 'password' : 'text'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setTogglePassword(!togglePassword)}
                            edge="end"
                          >
                            {togglePassword ? (
                              <IconEyeOff fontSize={12} stroke={'#DFE5EF'} />
                            ) : (
                              <IconEye fontSize={12} stroke={'#DFE5EF'} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              {errors.master_password && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.master_password.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="master_otp"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Master OTP"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.master_otp)}
                    fullWidth
                    type={'number'}
                  />
                )}
              />
              {errors.master_otp && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.master_otp.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="maintenance_message"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Maintenance Mode Message"
                    size="small"
                    onChange={onChange}
                    fullWidth
                    type={'text'}
                    helperText="Save as empty for hide maintenance mode message"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} mt={2}>
            <Button color="primary" type="submit" variant="contained">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </ChildCard>
  );
};

export default OtherForm;
