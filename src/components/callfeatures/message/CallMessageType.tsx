import { useEffect, useState } from 'react';

import { Icon } from '@iconify/react';
import {
  Card,
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';

import {
  getRecordingDetails,
  updateCallSliceState,
} from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import { formatPhoneNumber } from '../../../utils/utils';

const AudioTag = styled('audio')(({ theme }) => ({
  '&::-webkit-media-controls-panel': {
    background:
      theme.palette.mode === 'dark' ? '#ffffff21 !important' : 'white',
  },
}));

export const CustomButton = styled(IconButton)(({ theme }) => ({
  background: '#e5eaef8c',
  color: 'rgba(39,39,67,255)',
  width: '40px',
  height: '40px',
  '&:hover': {
    color: 'white !important',
    background: 'rgba(255, 255, 255, 0.1) !important',
  },
}));

const CallMessageType = ({ chat }: { chat: any }) => {
  const theme = useTheme();
  const [audioSrc, setAudioSrc] = useState('');
  const { playRecordingCallId } = useSelector((state) => state.callsReducer);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const recording = async () => {
    if (chat?.callDetails?.id && [undefined, null, ''].includes(chat.media)) {
      setIsLoading(true);
      const res = await dispatch(
        getRecordingDetails({
          callId: chat.callDetails.id,
          messageId: chat.id,
          talk_duration: +chat.callDetails.talk_duration || 0,
        }),
      );
      if (res && res?.data) {
        setIsLoading(false);
        setAudioSrc(res?.data?.file);
      } else {
        setIsLoading(false);
      }
    } else {
      if (![undefined, null, ''].includes(chat.media)) {
        setAudioSrc(chat.media);
      }
    }
  };

  useEffect(() => {
    if (
      chat &&
      chat?.media &&
      ['No record', 'NO', 'No', 'no'].includes(chat?.media)
    ) {
      setAudioSrc('');
    } else {
      recording();
    }
  }, []);

  const audioPlayingHandler = (e: any) => {
    if (playRecordingCallId && playRecordingCallId !== chat.callDetails.id) {
      const AudioElement: any = document.getElementById(
        'recording-' + playRecordingCallId,
      );
      if (AudioElement) {
        AudioElement?.pause();
        dispatch(
          updateCallSliceState({
            key: 'playRecordingCallId',
            value: chat.callDetails.id,
          }),
        );
      }
    } else {
      dispatch(
        updateCallSliceState({
          key: 'playRecordingCallId',
          value: chat.callDetails.id,
        }),
      );
    }
  };

  return (
    <Card
      sx={{
        background: theme.palette.mode === 'dark' ? '#393b48' : 'white',
        padding: 0,
        display: 'inline-block',
        minWidth: '300px',
        boxShadow: '0px 0px 10px rgb(0 0 0 / 48%)',
      }}
    >
      <Stack
        direction={'row'}
        sx={{
          background:
            theme.palette.mode === 'dark' ? 'rgb(79 69 69 / 5%)' : '#d5c8c836',
          padding: '5px',
        }}
      >
        {/* {chat.id}{chat.media} */}
        <CustomButton disabled={true}>
          {chat?.callDetails &&
            chat?.callDetails?.call_type === 'missed_calls' &&
            chat?.messageDirection === 'INBOUND' && (
              <Icon icon={'uil:missed-call'} color={'red'} />
            )}
          {chat?.callDetails && chat?.messageDirection === 'OUTBOUND' && (
            <Icon
              icon={'fluent:call-outbound-24-filled'}
              color={'rgb(8 115 192)'}
            />
          )}
          {chat?.callDetails &&
            chat?.callDetails?.call_type !== 'missed_calls' &&
            chat?.callDetails &&
            chat?.messageDirection === 'INBOUND' && (
              <Icon icon={'fluent:call-inbound-28-filled'} color={'green'} />
            )}
        </CustomButton>
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
            {formatPhoneNumber(chat?.callDetails?.to_number)}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{
          background: theme.palette.mode === 'dark' ? '#ffffff21' : 'white',
          minWidth: '300px',
          padding: '10px',
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
          <>
            <AudioTag
              controls
              src={audioSrc}
              style={{ width: '100%' }}
              onPlay={audioPlayingHandler}
              id={`recording-${chat?.callDetails?.id}`}
            />
          </>
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
        {chat?.transcribeMessage && (
          <div
            style={{
              borderTop: '1px solid lightgrey',
              padding: 5,
              whiteSpace: 'pre-line',
              marginTop: 10,
            }}
          >
            {chat?.transcribeMessage}
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default CallMessageType;
