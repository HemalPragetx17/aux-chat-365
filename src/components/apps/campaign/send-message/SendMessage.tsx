import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { PRIMARY_COLOR } from '../../../../utils/constant';
import CustomCheckbox from '../../../custom/CustomCheckbox';
import CustomFileUploadSingle from '../../../custom/CustomFileUploadSingle';
import CustomTextField from '../../../custom/CustomTextField';

export default function SendMessageForm() {
  const [template, setTemplate] = useState<any>('');
  const [templateList, setTemplateList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [csvError, setCsvError] = useState<boolean>(false);

  useEffect(() => {
    reset();
  }, []);

  const schema = yup.object().shape({
    from: yup.string().required('From Number is required'),
    link: yup.string().required('Link is required'),
    message: yup.string().required('Message is required'),
    saveastemplate: yup.boolean(),
    templatename: yup.string().when('saveastemplate', {
      is: (val: boolean) => val === true,
      then: () => yup.string().required('Template Name is required'),
      otherwise: () => yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      from: '',
      csv_file: [] as any,
      link: '',
      message: '',
      saveastemplate: false,
      templatename: '',
    }),
    [],
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (data.csv_file.length === 0) {
        setCsvError(true);
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTemplateChange = async (template: any) => {
    setTemplate(template);
    setCsvError(false);
  };

  const handleFileUpload = (acceptedFile: File[] | []) => {
    setValue('csv_file', acceptedFile);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} maxWidth={'md'}>
        {csvError && (
          <Grid item xs={12}>
            <Alert icon={false} severity="error" sx={{ fontSize: 14 }}>
              Please upload Contact List!
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Alert icon={false} severity="info" sx={{ fontSize: 14 }}>
            Please use [link] in message for adding link
          </Alert>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="type-select" size="small">
              From
            </InputLabel>
            <Controller
              name="from"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size="small"
                  id="select-type"
                  label="From"
                  labelId="type-select"
                  value={value}
                  onChange={onChange}
                  inputProps={{ placeholder: 'From' }}
                ></Select>
              )}
            />
            {errors.from && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.from as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <Controller
              name="link"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label="Link"
                  size="small"
                  onChange={onChange}
                  error={Boolean(errors.link)}
                  fullWidth
                />
              )}
            />
            {errors.link && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.link as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="template-select" size="small">
              Template
            </InputLabel>
            <Select
              size="small"
              id="select-template"
              label="From"
              labelId="template-select"
              value={template}
              onChange={handleTemplateChange}
              inputProps={{ placeholder: 'Template' }}
            ></Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <Controller
              name="templatename"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label="Template Name"
                  size="small"
                  onChange={onChange}
                  error={Boolean(errors.templatename)}
                  fullWidth
                />
              )}
            />
            {errors.templatename && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.templatename as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="message"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  value={value}
                  label="Message"
                  size="small"
                  onChange={onChange}
                  multiline
                  rows={3}
                  error={Boolean(errors.message)}
                  fullWidth
                />
              )}
            />
            {errors.message && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {(errors.message as FieldError).message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="saveastemplate"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  label="This application is not intended for blast and marketing campaigns."
                  control={
                    <CustomCheckbox
                      checked={value}
                      onChange={onChange}
                      name="saveastemplate"
                    />
                  }
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption">
            Click&nbsp;
            <a
              href="/static/campaign_contact_list.csv"
              style={{ color: PRIMARY_COLOR }}
            >
              here
            </a>{' '}
            to download sample CSV.
          </Typography>
          <br />
          <CustomFileUploadSingle
            handleFileUpload={handleFileUpload}
            text="Upload Contact List"
          />
        </Grid>

        <Grid item md={12} xs={12}>
          <Button color="primary" type="submit" variant="contained">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
