import { yupResolver } from '@hookform/resolvers/yup';
import {
  LoadingButton,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline';
import {
  Avatar,
  Box,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { addNote } from '../../../store/apps/chat/ChatGroupSlice';
import { useDispatch } from '../../../store/Store';
import { toLocalDate } from '../../../utils/date';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';

interface chatType {
  selectedChat?: any;
  handleAddNote: () => void;
}

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
});

const GroupChatInsideSidebar = (props: chatType) => {
  const { selectedChat, handleAddNote } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const [loading, setLoading] = useState<boolean>(false);
  const { id, ContactGroup, notes } = selectedChat;
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    note: yup.string().required('Notes is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
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

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await dispatch(addNote(id, data));
      if (response) {
        reset(defaultValues);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        flexShrink: 0,
        border: '0',
        right: '0',
        height: '100%',
        background: (theme) => theme.palette.background.paper,
        boxShadow: lgUp ? null : (theme) => theme.shadows[9],
        position: lgUp ? 'relative' : 'absolute',
      }}
      p={1}
    >
      <Box mb={2} />

      {ContactGroup?.contacts?.map((contact: any, index: number) => (
        <Box display={'flex'} alignItems={'center'} key={index} mb={1}>
          <Avatar
            alt={'profile'}
            variant="square"
            src={contact.image?.src || '/images/profile/thumb.png'}
            sx={{ width: '30px', height: '30px', borderRadius: 1, mr: 1 }}
          />
          {contact?.firstName} {contact?.lastName} ({contact?.countryCode}
          {contact?.phone})
        </Box>
      ))}

      <Box mb={4} />

      {notes?.length > 0 && (
        <Timeline>
          {notes?.map((note: any, index: number) => {
            return (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}
                >
                  <Box
                    sx={{
                      mb: 0.5,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: 'text.primary' }}
                    >
                      {note.createdBy}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled' }}
                    >
                      {toLocalDate(note.createdAt).format(
                        `MM-DD-YYYY, hh:mm:ss A`,
                      )}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', flexWrap: 'wrap' }}
                  >
                    {note.note}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 30 }}>
        <CustomFormTextArea
          name={'note'}
          label={'Enter Notes'}
          errors={errors}
          control={control}
          rows={3}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          sx={{background:'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)'}}
          loading={loading}
        >
          Add Note
        </LoadingButton>
      </form>
    </Box>
  );
};

export default GroupChatInsideSidebar;
