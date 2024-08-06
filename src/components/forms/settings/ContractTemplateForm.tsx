import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { IconMoodSmile, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import axios from '../../../utils/axios';
import { BUTTON_ELEMENTS } from '../../../utils/constant';
import CustomEmojiPicker from '../../custom/CustomEmojiPicker';
import CustomFormFooter from '../../custom/form/CustomFormFooter';
import CustomFormText from '../../custom/form/CustomFormText';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  currentData: any;
  toggle: () => void;
  addFlag: boolean;
  success: () => void;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ContractTemplateForm = (props: FormType) => {
  const { open, toggle, currentData, addFlag, success } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [emojiContainer, setEmojiContainer] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [hasFile, setHasFile] = useState<boolean>(false);

  const schema = yup.object().shape({
    title: yup.string().required('Title is required field'),
    description: yup.string().required('Description is required field'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentData?.title || '',
      description: currentData?.description || '',
      status: currentData?.status || 'INACTIVE',
    }),
    [currentData],
  );

  useEffect(() => {
    reset(defaultValues);
    setHasFile(Boolean(currentData?.contractFile));
  }, [open, currentData]);

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (!hasFile) {
        toast.error('Missing Contract File');
        return false;
      }
      setLoading(true);
      let payload = data;
      if (Boolean(file)) {
        payload = {
          ...payload,
          file,
        };
      }

      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };

      const response = addFlag
        ? await axios.post(`/contract-template/`, payload, header)
        : await axios.patch(
            `/contract-template/${currentData.id}`,
            payload,
            header,
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

  const handleSelectEmoji = (e: any) => {
    const emoji = e?.native;
    let description = getValues('description');
    description += emoji;
    setValue('description', description);
  };

  const handleOutsideContainerClick = (e: Event) => {
    const tagName: any = (e.target as HTMLElement)?.tagName;
    if (BUTTON_ELEMENTS.indexOf(tagName) === -1) {
      setEmojiContainer(false);
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isValid = file.type.startsWith('application/pdf');
      if (isValid) {
        setFile(file);
        setHasFile(true);
      } else {
        toast.error('Only File Type PDF Format Allowed!');
      }
    }
  };

  const handleRemoveFile = async () => {
    setFile(null);
    setHasFile(false);
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
        <Typography variant="h6">
          {addFlag ? 'Add' : 'Edit'} Contract Template
        </Typography>
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
            name={'title'}
            label={'Title'}
            errors={errors}
            control={control}
          />

          <CustomFormTextArea
            name={'description'}
            label={'Description'}
            rows={6}
            errors={errors}
            control={control}
          />

          <IconButton
            sx={{ mt: '-16px', mb: 2 }}
            size="small"
            onClick={() => setEmojiContainer(!emojiContainer)}
          >
            <IconMoodSmile stroke={1.5} />
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

          <Button
            fullWidth
            variant="outlined"
            component="label"
            onChange={handleFileChange}
          >
            Upload {hasFile && ' (1 File Attached) '}
            <input type="file" accept="application/pdf" hidden />
          </Button>
          {hasFile && (
            <Button
              sx={{ height: 24, mt: 1 }}
              component="label"
              variant="text"
              onClick={handleRemoveFile}
            >
              Remove File
            </Button>
          )}

          <CustomFormFooter onCancelClick={handleClose} loading={loading} />
        </form>
      </Box>
    </Drawer>
  );
};

export default ContractTemplateForm;
