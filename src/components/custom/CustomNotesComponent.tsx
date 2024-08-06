import { yupResolver } from '@hookform/resolvers/yup';
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box, { BoxProps } from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { addNote } from '../../store/apps/chat/ChatSlice';
import { useDispatch } from '../../store/Store';

import CustomFormFooter from './form/CustomFormFooter';
import CustomFormTextArea from './form/CustomFormTextArea';
import CustomHeader from './form/CustomHeader';

dayjs.extend(utc);

interface FormProps {
  open: boolean;
  currentData?: any;
  toggle: () => void;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
}));

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
});

const CustomNotesComponent = (props: FormProps) => {
  const { open, toggle, currentData } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    note: yup.string().required('Notes is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
    }),
    [currentData],
  );

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setLoading(false);
    }
  }, [open]);

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
      const response = await dispatch(addNote(currentData?.id, data));
      if (response) {
        toggle();
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={toggle}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <CustomHeader>
        <Typography variant="h6">Notes</Typography>
        <IconButton
          size="small"
          onClick={toggle}
          sx={{
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
          }}
        >
          <IconX />
        </IconButton>
      </CustomHeader>

      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2) }}>
        <Timeline>
          {(currentData as any)?.notes?.map((note: any, index: number) => {
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
                      mb: 2,
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
                      {dayjs(note.createdAt).format(`MM-DD-YYYY, hh:mm:ss A`)}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormTextArea
            name={'note'}
            label={'Add Notes'}
            errors={errors}
            control={control}
            rows={3}
          />
          <CustomFormFooter onCancelClick={toggle} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default CustomNotesComponent;
