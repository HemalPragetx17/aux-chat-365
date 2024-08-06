import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import { Button, Dialog, DialogContent, Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { GridColDef } from '@mui/x-data-grid';
import { IconLetterT, IconMoodSmile, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import { BUTTON_ELEMENTS, ROW_PROPS } from '../../../utils/constant';
import CustomCloseButton from '../../custom/CustomCloseButton';
import CustomDataGrid from '../../custom/CustomDataGrid';
import CustomEmojiPicker from '../../custom/CustomEmojiPicker';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomHeader from '../../custom/form/CustomHeader';

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
  attribute: 'afterOfficeHoursReply' | 'officeHoursReply';
  select: (
    data: string,
    key: 'afterOfficeHoursReply' | 'officeHoursReply',
  ) => void;
  close: () => void;
}

const TemplateListComponent = (props: TemplateProps) => {
  const { templateList, select, close, attribute, open } = props;

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
            onClick={() => select(row?.description, attribute)}
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

const OfficeAutoReplyForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [emojiContainerOne, setEmojiContainerOne] = useState<boolean>(false);
  const [emojiContainerTwo, setEmojiContainerTwo] = useState<boolean>(false);
  const [templateModal, setTemplateModal] = useState<boolean>(false);
  const [templateKey, setTemplateKey] = useState<
    'afterOfficeHoursReply' | 'officeHoursReply'
  >('afterOfficeHoursReply');

  const schema = yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      departmentId: currentData?.departmentId,
      mondaystatus: currentData?.monday?.status,
      mondaystartTime: currentData?.monday?.startTime,
      mondayendTime: currentData?.monday?.endTime,
      tuesdaystatus: currentData?.tuesday?.status,
      tuesdaystartTime: currentData?.tuesday?.startTime,
      tuesdayendTime: currentData?.tuesday?.endTime,
      wednesdaystatus: currentData?.wednesday?.status,
      wednesdaystartTime: currentData?.wednesday?.startTime,
      wednesdayendTime: currentData?.wednesday?.endTime,
      thursdaystatus: currentData?.thursday?.status,
      thursdaystartTime: currentData?.thursday?.startTime,
      thursdayendTime: currentData?.thursday?.endTime,
      fridaystatus: currentData?.friday?.status,
      fridaystartTime: currentData?.friday?.startTime,
      fridayendTime: currentData?.friday?.endTime,
      saturdaystatus: currentData?.saturday?.status,
      saturdaystartTime: currentData?.saturday?.startTime,
      saturdayendTime: currentData?.saturday?.endTime,
      sundaystatus: currentData?.sunday?.status,
      sundaystartTime: currentData?.sunday?.startTime,
      sundayendTime: currentData?.sunday?.endTime,
      timeZone: currentData?.timezone,
      status: currentData?.status,
      afterOfficeHoursReply: currentData?.afterOfficeHoursReply || '',
      officeHoursReply: currentData?.officeHoursReply || '',
    }),
    [currentData],
  );

  useEffect(() => {
    if (open) {
      fetchTemplate();
      reset(defaultValues);
    }
  }, [open]);

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
    try {
      setLoading(true);
      const response = await axios.patch(
        `/features/update-officehours/${currentData.id}`,
        data,
      );
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        success();
        reset();
      }
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

  const handleSelectEmoji = (
    e: any,
    key: 'officeHoursReply' | 'afterOfficeHoursReply',
  ) => {
    const emoji = e?.native;
    let description = getValues(key);
    description += emoji;
    setValue(key, description);
  };

  const handleOutsideContainerClick = (e: Event) => {
    const tagName: any = (e.target as HTMLElement)?.tagName;
    if (BUTTON_ELEMENTS.indexOf(tagName) === -1) {
      setEmojiContainerOne(false);
      setEmojiContainerTwo(false);
    }
  };

  const handleOpenTemplate = (
    key: 'afterOfficeHoursReply' | 'officeHoursReply',
  ) => {
    setTemplateKey(key);
    setTemplateModal(true);
  };

  const handleTemplateSelect = (
    text: string,
    key: 'afterOfficeHoursReply' | 'officeHoursReply',
  ) => {
    setTemplateModal(false);
    let description = getValues(key);
    description += text;
    setValue(key, description);
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
            {addFlag ? 'Add' : 'Edit'} Office Hours Auto Replies
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
          <CustomFormTextArea
            name={'afterOfficeHoursReply'}
            label={'After Office Hours Reply'}
            errors={errors}
            control={control}
            rows={6}
          />

          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainerOne(!emojiContainerOne)}
          >
            <IconMoodSmile stroke={1.5} />
          </IconButton>

          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            disabled={templateList.length === 0}
            onClick={() => handleOpenTemplate('afterOfficeHoursReply')}
          >
            <IconLetterT stroke={1.5} />
          </IconButton>

          {emojiContainerOne && (
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
                onEmojiSelect={(e: any) =>
                  handleSelectEmoji(e, 'afterOfficeHoursReply')
                }
                onClickOutside={(e: any) => handleOutsideContainerClick(e)}
              />
            </Box>
          )}

          <CustomFormTextArea
            name={'officeHoursReply'}
            label={'During Office Hours Reply'}
            errors={errors}
            control={control}
            rows={6}
          />
          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainerTwo(!emojiContainerTwo)}
          >
            <IconMoodSmile stroke={1.5} />
          </IconButton>

          <IconButton
            sx={{ mt: '-12px', mb: 2 }}
            size="small"
            disabled={templateList.length === 0}
            onClick={() => handleOpenTemplate('officeHoursReply')}
          >
            <IconLetterT stroke={1.5} />
          </IconButton>

          {emojiContainerTwo && (
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
                onEmojiSelect={(e: any) =>
                  handleSelectEmoji(e, 'officeHoursReply')
                }
                onClickOutside={(e: any) => handleOutsideContainerClick(e)}
              />
            </Box>
          )}

          <TemplateListComponent
            open={templateModal}
            templateList={templateList}
            close={() => setTemplateModal(false)}
            select={handleTemplateSelect}
            attribute={templateKey}
          />

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default OfficeAutoReplyForm;
