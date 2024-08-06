import { useEffect, useState } from 'react';

import {
  CircularProgress,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';

import { getRecordingDetails } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';

const AudioTag = styled('audio')(({ theme }) => ({
  '&::-webkit-media-controls-panel': {
    background:
      theme.palette.mode === 'dark' ? '#ffffff21 !important' : 'white',
  },
}));
const PlayRecording = () => {
  const theme = useTheme();
  const [audioSrc, setAudioSrc] = useState<string>('');
  const { playRecordingCallId, yeasterAccessToken } = useSelector(
    (state) => state.callsReducer,
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const recording = async () => {
    const res = await dispatch(getRecordingDetails(playRecordingCallId));
    if (res) {
      console.debug('res', res);
      // setToken(res?.token || "")
      // setCallData(res?.data || null)
      // setRecordingId(res?.data?.id || null)
      // const downloadUrl = await getDownloadRecording(playRecordingCallId, yeasterAccessToken)
      // if (downloadUrl) {
      //     console.debug('dddd', downloadUrl)
      //     const access_token = localStorage.getItem('yeasterAccessToken')
      //     setSrcUrl(downloadUrl?.download_resource_url)
      //     setAudioSrc(`${process.env.YEASTER_API_URL}${downloadUrl?.download_resource_url}?access_token=${access_token}`)
      //     getAudioSrc()
      // }
    }
  };

  const FetchCallrecording = async () => {
    if (playRecordingCallId) {
      setIsLoading(true);
      const res = await dispatch(getRecordingDetails(playRecordingCallId));
      if (res && res?.data) {
        setIsLoading(false);
        setAudioSrc(res?.data?.file);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    FetchCallrecording();
  }, [playRecordingCallId]);

  return (
    <Stack
      sx={{
        background: theme.palette.mode === 'dark' ? '#ffffff21' : 'white',
        maxWidth: '200px',
      }}
    >
      {isLoading && (
        <Stack direction={'row'} alignItems={'center'}>
          <CircularProgress size={20} sx={{ margin: '10px' }} />
          <Typography
            sx={{
              color:
                theme.palette.mode === 'dark'
                  ? '#DFE5EF !important'
                  : '#6e6262 !important',
              padding: '10px',
              fontWeight: '600',
            }}
          >
            Loading..
          </Typography>
        </Stack>
      )}
      {!isLoading && audioSrc && (
        <AudioTag controls src={audioSrc} style={{ width: '100%' }} />
      )}
      {!isLoading && !audioSrc && (
        <Stack direction={'row'} alignItems={'center'}>
          <Typography
            sx={{
              color:
                theme.palette.mode === 'dark'
                  ? '#DFE5EF !important'
                  : '#6e6262 !important',
              padding: '10px',
              fontWeight: '600',
            }}
          >
            No recording
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PlayRecording;
