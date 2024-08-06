import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import {
  Button,
  Dialog,
  DialogContent,
  Drawer,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid';
import { IconLetterT, IconMoodSmile, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import {
  BUTTON_ELEMENTS,
  ROW_PROPS,
  TIMEZONE_VALUES,
} from '../../../utils/constant';
import { formatTimeString } from '../../../utils/date';
import CustomCloseButton from '../../custom/CustomCloseButton';
import CustomDataGrid from '../../custom/CustomDataGrid';
import CustomEmojiPicker from '../../custom/CustomEmojiPicker';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormSelect from '../../custom/form/CustomFormSelect';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomFormTimePicker from '../../custom/form/CustomFormTimePicker';
import CustomHeader from '../../custom/form/CustomHeader';

dayjs.extend(utc);

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
}

interface TemplateProps {
  open: boolean;
  templateList: any[];
  select: (data: string) => void;
  close: () => void;
}

const DAY_VALUES = [
  {
    label: 'Monday',
    value: 'Monday',
  },
  {
    label: 'Tuesday',
    value: 'Tuesday',
  },
  {
    label: 'Wednesday',
    value: 'Wednesday',
  },
  {
    label: 'Thursday',
    value: 'Thursday',
  },
  {
    label: 'Friday',
    value: 'Friday',
  },
  {
    label: 'Saturday',
    value: 'Saturday',
  },
  {
    label: 'Sunday',
    value: 'Sunday',
  },
];

const TemplateListComponent = (props: TemplateProps) => {
  const { templateList, select, close, open } = props;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Title',
      field: 'title',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row.title}
          </Typography>
        );
      },
    },
    {
      flex: 0.6,
      minWidth: 220,
      headerName: 'Description',
      field: 'description',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.description}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return (
          <Button
            size="small"
            variant="contained"
            onClick={() => select(row?.description)}
          >
            Select
          </Button>
        );
      },
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={close}>
        <Icon icon={'tabler:x'} width={24} height={24} />
      </CustomCloseButton>
      <DialogContent>
        <CustomDataGrid
          sx={{ mt: 5 }}
          autoHeight
          rowHeight={38}
          rows={templateList}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 7, 10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </DialogContent>
    </Dialog>
  );
};

const GeneralAutoReplyForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [emojiContainer, setEmojiContainer] = useState<boolean>(false);
  const [templateModal, setTemplateModal] = useState<boolean>(false);
  const [specificTimeFlag, setSpecificTimeFlag] = useState<boolean>(false);

  const schema = yup.object().shape({
    message_type: yup.string().required('Title is required field'),
    message: yup.string().required('Message is required field'),
    reply_time_type: yup.string(),
    reply_days: yup.array().when('reply_time_type', {
      is: (val: string) => val === 'specific_time',
      then: () => yup.array().min(1, 'Please select a day'),
      otherwise: () => yup.array(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      type: 'generalautoreply',
      message_type: currentData?.message_type || '',
      message: currentData?.message || '',
      timezone: 'America/Los_Angeles',
      reply_time_type: currentData?.reply_time_type || 'all_time',
      reply_days: currentData?.reply_days || [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      reply_start_time: formatTimeString(currentData?.reply_start_time, true),
      reply_end_time: formatTimeString(currentData?.reply_end_time, false),
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
    setSpecificTimeFlag(false);
    if (open) {
      fetchTemplate();
    }
  }, [open]);

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

  useEffect(() => {
    setSpecificTimeFlag(watchForm?.reply_time_type === 'specific_time');
  }, [watchForm?.reply_time_type]);

  const onSubmit = async (data: any) => {
    try {
      const formData: any = {
        ...data,
        reply_start_time: dayjs.utc(data['reply_start_time']).format('HH:mm'),
        reply_end_time: dayjs.utc(data['reply_end_time']).format('HH:mm'),
      };
      console.log(formData);
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const fetchTemplate = async () => {
    const response = await axios.get(`/template?status=ACTIVE`);
    const data = response.status === 200 ? response.data.data : [];
    setTemplateList(data);
  };

  const handleSelectEmoji = (e: any) => {
    const emoji = e?.native;
    let description = getValues('message');
    description += emoji;
    setValue('message', description);
  };

  const handleOutsideContainerClick = (e: Event) => {
    const tagName: any = (e.target as HTMLElement)?.tagName;
    if (BUTTON_ELEMENTS.indexOf(tagName) === -1) {
      setEmojiContainer(false);
    }
  };

  const handleTemplateSelect = (text: string) => {
    setTemplateModal(false);
    let description = getValues('message');
    description += text;
    setValue('message', description);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <CustomHeader>
        <Box>
          <Typography variant="h6">
            {addFlag ? 'Add' : 'Edit'} General Auto Reply
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomFormText
            name={'message_type'}
            label={'Title'}
            errors={errors}
            control={control}
          />

          <CustomFormTextArea
            name={'message'}
            label={'Message'}
            errors={errors}
            control={control}
            rows={6}
          />

          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainer(!emojiContainer)}
          >
            <IconMoodSmile stroke={1.5} />
          </IconButton>

          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            disabled={templateList.length === 0}
            onClick={() => setTemplateModal(true)}
          >
            <IconLetterT stroke={1.5} />
          </IconButton>

          {emojiContainer && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 10000,
                '& em-emoji-picker': {
                  mt: '-16px',
                  minHeight: 'unset',
                  height: 300,
                },
              }}
            >
              <CustomEmojiPicker
                navPosition={'none'}
                previewPosition={'none'}
                searchPosition={'none'}
                maxFrequentRows={'0'}
                onEmojiSelect={(e: any) => handleSelectEmoji(e)}
                onClickOutside={(e: any) => handleOutsideContainerClick(e)}
              />
            </Box>
          )}

          <CustomFormSelect
            name={'timezone'}
            label={'Select Timezone'}
            options={TIMEZONE_VALUES}
            errors={errors}
            control={control}
          />

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="reply_time_type"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  name="reply_time_type"
                  value={value}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="all_time"
                    label="Send at all times"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="specific_time"
                    label="Send at Specific times"
                    control={<Radio />}
                    sx={{ mr: 2 }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          {specificTimeFlag && (
            <>
              <CustomFormSelect
                name={'reply_days'}
                label={'Select Days'}
                options={DAY_VALUES}
                errors={errors}
                control={control}
                multiple={true}
              />

              <CustomFormTimePicker
                label="Open Time"
                name={'reply_start_time'}
                control={control}
                errors={errors}
              />

              <CustomFormTimePicker
                label="Close Time"
                name={'reply_end_time'}
                control={control}
                errors={errors}
              />
            </>
          )}

          <TemplateListComponent
            open={templateModal}
            templateList={templateList}
            close={() => setTemplateModal(false)}
            select={handleTemplateSelect}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default GeneralAutoReplyForm;
