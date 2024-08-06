import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { IconCopy, IconRefresh } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../../utils/axios';
import { toLocalDate } from '../../../../utils/date';
import CustomTextField from '../../../custom/CustomTextField';

export default function ApiForm() {
  const [keyGenerated, setKeyGenerated] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<any>('');

  useEffect(() => {
    setKeyGenerated(false);
    fetchUserKey();
    setValue('secret_key', '');
    setValue('webhookurlforsms', '');
    setValue('webhookurlforpayment', '');
  }, []);

  const fetchUserKey = async () => {
    const response = await axios.get(`/api-key`);
    if (response.status === 200 && response.data?.data) {
      const apiKey = response.data.data;
      const { key } = apiKey;
      apiKey.key =
        key.slice(0, 4) +
        key.slice(4, key.length - 4).replace(/[a-zA-Z-\d]/gi, '*') +
        key.slice(key.length - 4);
      setUserKey(response.data.data);
    }
  };

  const schema = yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      secret_key: '',
      webhookurlforsms: '',
      webhookurlforpayment: '',
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyText = (text: string) => {
    if (Boolean(text)) {
      navigator.clipboard.writeText(text);
      toast.success('Copied!');
    }
  };

  const handleRefresh = async () => {
    const response = await axios.post(`/api-key`);
    if (response.status === 201 && response.data?.data) {
      setUserKey(response.data?.data);
      setKeyGenerated(true);
      toast.success('API key generated successfully');
    }
  };

  return (
    <Box>
      <Alert icon={false} severity={'info'} sx={{ mb: 5, fontSize: 14 }}>
        If you update your old API key, all functionality related to this API
        key will stop.
      </Alert>
      <Grid container spacing={3} maxWidth={'md'} mb={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <CustomTextField
              value={userKey?.key || ''}
              label="API Key"
              size="small"
              autoComplete={false}
              disabled={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <>
                      {keyGenerated && (
                        <Tooltip title="Generate New key">
                          <IconButton
                            aria-label="copy"
                            size="small"
                            onClick={() => handleCopyText(userKey?.key)}
                          >
                            <IconCopy />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Generate New key">
                        <IconButton
                          aria-label="refresh"
                          size="small"
                          onClick={handleRefresh}
                        >
                          <IconRefresh />
                        </IconButton>
                      </Tooltip>
                    </>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </FormControl>
          {userKey?.key && (
            <Alert
              icon={false}
              severity={'success'}
              sx={{ mt: 2, fontSize: 14 }}
            >
              Key generated on{' '}
              {toLocalDate(userKey?.createdAt).format(`MM-DD-YYYY, hh:mm:ss A`)}
            </Alert>
          )}
          {keyGenerated && userKey?.key && (
            <Alert icon={false} severity={'info'} sx={{ mt: 2, fontSize: 14 }}>
              Your API Key will be visible only once. Please copy and store it
              in a secure place.
            </Alert>
          )}
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} maxWidth={'md'}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="webhookurlforsms"
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Webhook URL for SMS"
                    size="small"
                    onChange={onChange}
                    fullWidth
                  />
                )}
              />
              <FormHelperText>https://www.xyz.uk/webhook</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="webhookurlforpayment"
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label="Webhook URL for Payment"
                    size="small"
                    onChange={onChange}
                    fullWidth
                  />
                )}
              />
              <FormHelperText>https://www.abc.co/webhook</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item md={12} xs={12}>
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
