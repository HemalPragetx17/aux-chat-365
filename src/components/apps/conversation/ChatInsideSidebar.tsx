import { yupResolver } from '@hookform/resolvers/yup';
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline';
import {
  Alert,
  Box,
  Chip,
  Stack,
  Tab,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import {
  LoadingButton,
  TabContext,
  TabList,
  TabPanel,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { IconHistory, IconNotes, IconUserPlus } from '@tabler/icons-react';
import { SyntheticEvent } from 'react-draft-wysiwyg';

import { AppState, useDispatch, useSelector } from '../../../store/Store';
import { addNote } from '../../../store/apps/chat/ChatSlice';
import { toLocalDate } from '../../../utils/date';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomTaggingComponent from '../../custom/form/CustomTaggingComponent';

import ChatContactArea from './ChatContactArea';
import ChatContactPaymentHistory from './ChatContactPaymentHistory';

interface chatType {
  selectedChat?: any;
  handleAddContact: () => void;
}

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
});

const ChatInsideSidebar = (props: chatType) => {
  const { selectedChat } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const [loading, setLoading] = useState<boolean>(false);
  const { id, notes } = selectedChat;
  const customizer = useSelector((state: AppState) => state.customizer);
  const [tagged, setTagged] = useState<any>([]);
  const dispatch = useDispatch();
  const [tab, setTab] = useState<string>('contact');

  useEffect(() => {
    setTab('contact');
    reset(defaultValues);
  }, [selectedChat?.id]);

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
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchForm = watch();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const assignedId = tagged.map((tags: any) => tags.id);
      const response = await dispatch(addNote(id, { ...data, assignedId }));
      if (response) {
        reset(defaultValues);
        setTagged([]);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleOnTagged = async (data: any) => {
    const { text } = data;
    let _note = getValues('note');
    _note += `${text} `;
    setValue('note', _note);
    setTagged([...tagged, data]);
  };

  const returnTaggedList = () => {
    const handleDelete = (id: string) => () => {
      let tags = [...tagged];
      tags = tags.filter((tag: any) => tag.id !== id);
      setTagged(tags);
    };

    return (
      <Stack direction="row" spacing={1} sx={{ display: 'block' }}>
        {tagged.map((tags: any, index: number) => (
          <Chip
            key={index}
            sx={{ mt: '4px !important' }}
            label={tags.text}
            onDelete={handleDelete(tags.id)}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        flexShrink: 0,
        border: '0',
        right: '0',
        height: '100%',
        background:
          customizer?.activeMode === 'dark'
            ? '#323441 !important'
            : '#000000 !important',
        boxShadow: lgUp ? null : (theme) => theme.shadows[9],
        position: lgUp ? 'relative' : 'absolute',
        borderRadius: 0,
      }}
      p={1}
    >
      <TabContext value={tab}>
        <TabList
          onChange={(event: SyntheticEvent, newValue: string) =>
            setTab(newValue)
          }
          aria-label="simple tabs example"
        >
          <Tab value={'contact'} icon={<IconUserPlus stroke={1} />} />
          <Tab value={'pay'} icon={<IconHistory stroke={1} />} />
          <Tab value={'note'} icon={<IconNotes stroke={1} />} />
        </TabList>
        <TabPanel value="contact" sx={{ p: 0, mt: 2 }}>
          <ChatContactArea selectedChat={selectedChat} />
        </TabPanel>
        <TabPanel value="pay" sx={{ p: 0, mt: 2 }}>
          <ChatContactPaymentHistory selectedChat={selectedChat} />
        </TabPanel>
        <TabPanel value="note" sx={{ p: 0, mt: 2 }}>
          <Alert severity="info" icon={false}>
            Enter Conversation Notes here
          </Alert>
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
            <CustomTaggingComponent
              handleSelect={handleOnTagged}
              text={watchForm?.note}
            />
            {returnTaggedList()}
            <LoadingButton
              id="note_button"
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                background:
                  'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
              }}
              fullWidth
              loading={loading}
            >
              Add Note
            </LoadingButton>
          </form>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ChatInsideSidebar;
