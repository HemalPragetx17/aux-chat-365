import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { fetchAIResponse } from '../../../store/apps/chat/ChatSlice';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import { AI_OPTION_ELEMENTS } from '../../../utils/constant';
import CustomTextField from '../../custom/CustomTextField';
dayjs.extend(utc);

interface FormType {
  onSuccess: () => void;
  setAITextSearch: any;
  aiTextSearch: any;
  open: boolean;
}

const ChatAIForm = (props: FormType) => {
  const { onSuccess, setAITextSearch, aiTextSearch, open } = props;
  const dispatch = useDispatch();
  const { aiLoading } = useSelector((state: AppState) => state.chatReducer);
  const schema = yup.object().shape({
    original: yup.string().required('Please enter original text'),
    voiceType: yup.string().required('Please select Tone '),
  });

  const defaultValues = useMemo(
    () => ({
      original: '',
      voiceType: '',
      preview: '',
    }),
    [aiTextSearch],
  );

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    reset(defaultValues);
    onSuccess();
  };

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open]);

  const handlePreview = async () => {
    const values = getValues();
    let obj = {
      message: `${
        values?.original + ' make it in ' + values?.voiceType + ' tone '
      } `,
    };
    try {
      var res: any = await dispatch(fetchAIResponse(obj));
      setValue('preview', res?.text?.value, { shouldValidate: true });
      setAITextSearch(res?.text?.value);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: (theme) => theme.spacing(2, 2, 2), mt: 1 }}>
      <Typography variant="h6" mb={3}>
        Change the tone of this message
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name={'original'}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Ask AI to write a response"
                value={value}
                multiline
                rows={4}
                error={Boolean(errors.original)}
                onChange={onChange}
                variant="outlined"
              />
            )}
          />
          {errors.original && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.original?.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name={'voiceType'}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                select
                sx={{ mb: 2 }}
                label={'Select Tone'}
                size="small"
                error={Boolean(errors.voiceType)}
                onChange={(e: any) => {
                  onChange(e);
                  handlePreview();
                }}
              >
                {AI_OPTION_ELEMENTS.map((option, index) => (
                  <MenuItem key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          {errors.voiceType && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.voiceType?.message}
            </FormHelperText>
          )}
        </FormControl>

        {aiLoading ? (
          <div style={{ height: 137, marginLeft: 5 }}>
            <div className=" ai-loader"></div>
          </div>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name={'preview'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label="Preview"
                    value={value}
                    multiline
                    rows={4}
                    InputLabelProps={{ shrink: true }}
                    onChange={onChange}
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <LoadingButton
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={aiLoading}
            sx={{
              borderRadius: '30px',
              mr: 1,
              background:
                'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
            }}
          >
            Update Message
          </LoadingButton>
          <Button
            style={{ borderRadius: '30px' }}
            variant="outlined"
            onClick={() => {
              reset(defaultValues);
              onSuccess();
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ChatAIForm;
