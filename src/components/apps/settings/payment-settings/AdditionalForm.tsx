import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomTextField from '../../../custom/CustomTextField';
import ChildCard from '../../../shared/ChildCard';

const AdditionalForm = () => {
  const schema = yup.object().shape({
    virtual_terminal: yup.string().required('Enter a Valid URL'),
    back_office: yup.string().required('Enter a Valid URL'),
  });

  const defaultValues = useMemo(
    () => ({
      virtual_terminal: '',
      back_office: '',
      defaultpayment_type: '1',
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
    <ChildCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="virtual_terminal"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Virtual Terminal"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.virtual_terminal)}
                    fullWidth
                  />
                )}
              />
              {errors.virtual_terminal && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.virtual_terminal.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="back_office"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Back Office"
                    size="small"
                    onChange={onChange}
                    error={Boolean(errors.back_office)}
                    fullWidth
                  />
                )}
              />
              {errors.back_office && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.back_office.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-select" size="small">
                Default Payment Type
              </InputLabel>
              <Controller
                name="defaultpayment_type"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    id="select-type"
                    label="Default Payment Type"
                    labelId="type-select"
                    value={value}
                    size="small"
                    onChange={onChange}
                    inputProps={{ placeholder: 'Default Payment Type' }}
                  >
                    <MenuItem value={'1'}>Sale</MenuItem>
                    <MenuItem value={'2'}>Auth Only</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} mt={2}>
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </ChildCard>
  );
};

export default AdditionalForm;
