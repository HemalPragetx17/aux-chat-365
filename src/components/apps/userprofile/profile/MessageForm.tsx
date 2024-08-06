import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../../hooks/useAuth';
import { AppState, useSelector } from '../../../../store/Store';
import axios from '../../../../utils/axios';
import CustomLoader from '../../../custom/CustomLoader';
import CustomTextField from '../../../custom/CustomTextField';

const MessageForm = (props: any) => {
  const { profile, success } = props;
  const [edit, setEdit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, setSettings } = useAuth();
  const customizer = useSelector((state: AppState) => state.customizer);

  const schema = yup.object().shape({
    signature: yup.string().required('Signature is required'),
  });

  const defaultValues = useMemo(
    () => ({
      signatureFlag: profile?.signatureFlag || false,
      signature: profile?.signature || '',
      textPreviewFlag: profile?.textPreviewFlag === false ? false : true,
      notificationVolume:
        profile?.notificationVolume !== undefined
          ? profile?.notificationVolume
          : 1,
      active_browser_notification: true,
    }),
    [profile],
  );

  const {
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [profile]);

  const handleSignatureToggle = (
    event: any,
    onChange: (...event: any[]) => void,
    field: string,
  ) => {
    const { signature } = profile;
    if (event?.target?.checked && !signature) {
      toast.error('Please set a signature first');
      return false;
    }
    onChange(event);
    const formData: any = {};
    formData[field] = event?.target?.checked;
    handleUpdateProfile(formData);
  };

  const handleSwitchChange = (
    event: any,
    onChange: (...event: any[]) => void,
    field: string,
  ) => {
    const { signature } = profile;
    if (event?.target?.checked && !signature) {
      toast.error('Please set a signature first');
      return false;
    }
    onChange(event);
    const formData: any = {};
    formData[field] = event?.target?.checked;
    handleUpdateProfile(formData);
  };

  const handleSignatureUpdate = () => {
    const formData = {
      signature: watchForm?.signature,
    };
    handleUpdateProfile(formData);
  };

  const handleVolumeChange = (
    event: any,
    onChange: (...event: any[]) => void,
  ) => {
    const volume = event?.target?.value;
    if (volume !== watchForm?.notificationVolume) {
      onChange(event);
      const formData = {
        notificationVolume: volume,
      };
      handleUpdateProfile(formData);
    }
  };

  const handleUpdateProfile = async (data: any) => {
    setEdit(true);
    setLoading(true);
    try {
      const response = await axios.patch(
        `/users/partial-update/${user?.uid}`,
        data,
      );
      if (response.status === 200) {
        toast.success('Profile Updated Successfully');
        success();
        setLoading(false);
        setSettings(undefined);
      }
    } catch (error) {
      toast.error((error as any)?.message || 'API Error! Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        padding: 0,
        borderColor: (theme: any) => theme.palette.divider,
        position: 'relative',
      }}
      variant="outlined"
    >
      {loading && (
        <CustomLoader
          sx={{
            position: 'absolute',
            width: '100%',
            background:
              customizer?.activeMode === 'light'
                ? 'rgba(255,255,255,0.8)'
                : 'rgba(0,0,0,0.8)',
            zIndex: 200,
          }}
        />
      )}

      <CardContent>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="h5">Custom Signature</Typography>
                <Controller
                  name="signatureFlag"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={(event: ChangeEvent) =>
                        handleSignatureToggle(event, onChange, 'signatureFlag')
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="signature"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      label="Signature"
                      size="small"
                      disabled={edit}
                      onChange={onChange}
                      error={Boolean(errors.signature)}
                      fullWidth
                    />
                  )}
                />
                {errors.signature && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {(errors.signature as any).message}
                  </FormHelperText>
                )}
              </FormControl>
              {!edit ? (
                <>
                  <Button
                    variant="text"
                    onClick={() => setEdit(true)}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSignatureUpdate}>
                    Update
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setEdit(false)}>
                  Edit
                </Button>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="h5">Text Preview</Typography>
                <Typography>
                  Preview the last message sent in the conversation.
                </Typography>
                <Controller
                  name="textPreviewFlag"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={(event: ChangeEvent) =>
                        handleSwitchChange(event, onChange, 'textPreviewFlag')
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="h5">Message Alert Volume</Typography>
                <Typography>
                  When a new message is received you will receive an audio
                  alert. You can control the volume here.
                </Typography>
                <Controller
                  name="notificationVolume"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Slider
                      aria-label="Volume"
                      value={value}
                      getAriaValueText={(value: any) => `${value}`}
                      valueLabelDisplay="auto"
                      onChange={(event: any) =>
                        handleVolumeChange(event, onChange)
                      }
                      step={0.1}
                      marks
                      min={0}
                      max={1}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="h5">Browser Notifications</Typography>
                <Typography>
                  Pop-up notifications appear when you're away from the app.
                  Your web browser must be running for this feature to work.
                  Available for Chrome, Firefox, Opera, and the Mac version of
                  Safari.
                </Typography>
                <Controller
                  name="active_browser_notification"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={(event: ChangeEvent) =>
                        handleSwitchChange(
                          event,
                          onChange,
                          'active_browser_notification',
                        )
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageForm;
