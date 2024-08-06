import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  Popover,
  styled,
  useTheme,
} from '@mui/material';
import { IconMoodSmile, IconPaperclip, IconSend } from '@tabler/icons-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import 'simplebar/src/simplebar.css';
import { useAuth } from '../../../../hooks/useAuth';
import { AppState, useSelector } from '../../../../store/Store';
import { PRIMARY_COLOR } from '../../../../utils/constant';
import CustomTextField from '../../../custom/CustomTextField';

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

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  paddingLeft: 20,
  minHeight: 'unset',
  '& .Mui-selected': {
    color: theme.palette.primary.main,
  },
  '& .MuiTab-root': {
    minHeight: 'unset',
    borderRadius: theme.shape.borderRadius,
  },
}));

const ContactChatComponent = (props: any) => {
  const { open, handleSend } = props;
  const theme = useTheme();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const { sending } = useSelector((state) => state.chatReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const popoverRef1 = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState<any>(null);
  const [disabledText, setDisabledText] = useState(false);

  useEffect(() => {
    if (open) {
      resetChatMsg();
      setFile(null);
    }
  }, [open]);

  const resetChatMsg = () => {
    const element = document.getElementById('msg_container');
    if (element) {
      (element as any).value = '';
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const element = document.getElementById('msg_container');
    const message = (element as any)?.value;
    (element as any).value = message + emojiData.emoji;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !sending) {
      event.preventDefault();
      const element = document.getElementById('msg_container');
      if (Boolean((element as any)?.value) || Boolean(file)) {
        onChatMsgSubmit();
      }
    }
  };

  const onChatMsgSubmit = () => {
    if (!disabledText && !file) {
      return false;
    }
    const element = document.getElementById('msg_container');
    const payload = {
      sender: user?.name as string,
      message: (element as any)?.value,
      file,
      mediaType: Boolean(file)
        ? file.type.startsWith('image/')
          ? 'image'
          : 'pdf'
        : '',
    };
    handleSend(payload);
  };

  const handleMessageChange = () => {
    const element = document.getElementById('msg_container');
    const flag = Boolean((element as any)?.value?.trim());
    if (flag !== disabledText) {
      setDisabledText(!disabledText);
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isValid =
        file.type.startsWith('image/') ||
        file.type.startsWith('application/pdf');
      if (isValid) {
        setFile(file);
      } else {
        toast.error('Only Image or PDF Files allowed');
        (fileInputRef as any).current.value = '';
      }
    }
  };

  return (
    <Box
      position={'relative'}
      sx={{
        background: theme.palette.mode === 'dark' ? '#373945' : '#fff',
      }}
    >
      <Box
        height={150}
        p={'10px'}
        sx={{
          background:
            customizer?.activeMode === 'dark'
              ? 'inherit'
              : '#f5f5f5 !important',
        }}
      >
        <form onSubmit={onChatMsgSubmit}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              variant="outlined"
              placeholder="Type a Message"
              autoComplete="off"
              type="text"
              multiline
              rows={3}
              id="msg_container"
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
            />
          </FormControl>

          <Box display={'flex'} justifyContent={'space-between'}>
            <Box display={'flex'}>
              {/* Emoji Button */}
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls="long-menu"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setAnchorEl(e.currentTarget)
                }
                sx={{ padding: '4px' }}
              >
                <IconMoodSmile strokeWidth={'1.5'} />
              </IconButton>
              <Popover
                id="long-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                keepMounted
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                transformOrigin={{
                  horizontal: 'center',
                  vertical: 'bottom',
                }}
                ref={popoverRef1}
              >
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </Popover>

              {/* File Button*/}

              <Button
                component="label"
                variant="text"
                sx={{
                  padding: 0,
                  minWidth: 36,
                  color: 'rgba(0,0,0,0.55)',
                }}
              >
                <IconPaperclip
                  strokeWidth={'1.5'}
                  color={
                    Boolean(file)
                      ? PRIMARY_COLOR
                      : customizer?.activeMode === 'light'
                      ? 'currentColor'
                      : '#fff'
                  }
                />
                <VisuallyHiddenInput
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                />
              </Button>

              {Boolean(file) && (
                <Chip
                  sx={{ marginTop: '10px' }}
                  label={`${file.name} (${
                    Math.round(file.size / 100) / 10 > 1000
                      ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                      : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`
                  })`}
                  onDelete={() => setFile(null)}
                />
              )}

              {/* Send Message Button */}
              {sending ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress
                    color="primary"
                    sx={{
                      height: '20px !important',
                      width: '20px !important',
                      marginRight: 1,
                      marginTop: 0.5,
                    }}
                  />
                </Box>
              ) : (
                <IconButton
                  aria-label="send"
                  onClick={onChatMsgSubmit}
                  disabled={!disabledText && !file}
                >
                  <IconSend strokeWidth={'1.5'} />
                </IconButton>
              )}
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ContactChatComponent;
