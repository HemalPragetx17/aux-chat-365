import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Popover,
  Typography,
  styled,
} from '@mui/material';
import {
  IconCurrencyDollar,
  IconLetterT,
  IconMoodSmile,
  IconPhoto,
  IconSend,
} from '@tabler/icons-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

import { useAuth } from '../../../hooks/useAuth';
import { sendMessage } from '../../../store/apps/chat/ChatGroupSlice';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import axios from '../../../utils/axios';
import { PRIMARY_COLOR } from '../../../utils/constant';
import CustomCloseButton from '../../custom/CustomCloseButton';

import GroupChatPaymentForm from './GroupChatPaymentForm';

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

const GroupChatMsgSent = () => {
  const [msg, setMsg] = useState<any>('');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const chatState = useSelector((state) => state.chatGroupReducer);
  const { selectedChat, sending } = chatState;
  const customizer = useSelector((state: AppState) => state.customizer);
  const { user } = useAuth();
  const [anchorTemplate, setAnchorTemplate] = useState<any>(null);
  const [template, setTemplate] = useState<any>([]);
  const wrapperRef = useRef(null);
  const [file, setFile] = useState<any>(null);
  const [anchorPaymentForm, setAnchorPaymentForm] = useState<any>(null);

  useEffect(() => {
    fetchTemplateList();
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMsg(msg + emojiData.emoji);
  };

  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const fetchTemplateList = useCallback(async () => {
    try {
      const response = await axios.get(`/template?status=ACTIVE,INACTIVE`);
      const resp = response.status === 200 ? response.data.data : [];
      setTemplate(resp);
    } catch (e) {
      setTemplate([]);
    }
  }, []);

  const onChatMsgSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleSendMessage();
  };

  const handleSendMessage = () => {
    const payload = {
      id: selectedChat?.id,
      contactGroupId: selectedChat.ContactGroup?.id,
      didId: selectedChat?.Did?.id,
      sender: user?.name as string,
      message: msg,
      file,
    };
    dispatch(sendMessage(payload));
    setMsg('');
    setFile(null);
  };

  const handleTemplateSelect = (text: string) => {
    setAnchorTemplate(null);
    setMsg(msg + text);
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setFile(file);
      } else {
        toast.error('Only File Type Image Format Allowed!');
      }
    }
  };

  return (
    <Box height={70} ref={wrapperRef} position={'relative'}>
      <>
        {Boolean(file) && (
          <Box
            sx={{
              position: 'absolute',
              top: -110,
              left: 10,
              height: 100,
              width: 80,
              backgroundImage: `url(${URL.createObjectURL(file as any)})`,
              backgroundSize: `100% 100%`,
            }}
          >
            <CustomCloseButton onClick={() => setFile(null)}>
              <Icon icon={'tabler:x'} width={18} height={18} />
            </CustomCloseButton>
          </Box>
        )}
        <form
          onSubmit={onChatMsgSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
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
            <IconMoodSmile />
          </IconButton>
          <Popover
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            keepMounted
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Popover>

          {/* Template Button */}
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls="long-menu"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              setAnchorTemplate(e.currentTarget)
            }
            sx={{ padding: '4px' }}
          >
            <IconLetterT />
          </IconButton>
          <Popover
            id="long-menu"
            anchorEl={anchorTemplate}
            open={Boolean(anchorTemplate)}
            keepMounted
            onClose={() => setAnchorTemplate(null)}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <>
              <SimpleBarReact
                style={{
                  maxHeight: 400,
                  width: 350,
                  padding: '10px',
                }}
              >
                {template.map((data: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: '#feeef4',
                      padding: 1,
                      marginBottom: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleTemplateSelect(data.description)}
                  >
                    <Typography variant="caption">{data.title}</Typography>
                    <Typography>{data.description}</Typography>
                  </Box>
                ))}
              </SimpleBarReact>
              <Typography
                component={Link}
                href={'/features/templates'}
                paddingX={1}
                color={'text.primary'}
              >
                Go to Templates Settings
              </Typography>
            </>
          </Popover>

          {/* Payment Form Button */}
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls="long-menu"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              setAnchorPaymentForm(e.currentTarget)
            }
            sx={{ padding: '4px' }}
          >
            <IconCurrencyDollar strokeWidth={'1.5'} />
          </IconButton>
          <Popover
            id="long-menu"
            anchorEl={anchorPaymentForm}
            open={Boolean(anchorPaymentForm)}
            keepMounted
            onClose={() => setAnchorPaymentForm(null)}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <SimpleBarReact
              style={{
                maxHeight: 400,
                width: 350,
              }}
            >
              <GroupChatPaymentForm
                success={() => setAnchorPaymentForm(null)}
                selectedChat={selectedChat}
                sender={user?.name as string}
              />
            </SimpleBarReact>
          </Popover>

          {/* Image Button*/}
          <Button
            aria-label="delete"
            component="label"
            variant="text"
            sx={{
              padding: 0,
              minWidth: 36,
              color: 'rgba(0,0,0,0.55)',
            }}
          >
            <IconPhoto
              style={{
                color: customizer?.activeMode === 'light' ? '' : 'white',
              }}
            />
            <VisuallyHiddenInput
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              hidden
            />
          </Button>

          <InputBase
            id="msg-sent"
            fullWidth
            value={msg}
            placeholder="Type a Message"
            size="small"
            autoComplete="off"
            type="text"
            inputProps={{ 'aria-label': 'Type a Message' }}
            onChange={handleChatMsgChange.bind(null)}
          />

          {/* Send Message Button */}
          {sending ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress
                color="primary"
                sx={{
                  height: '30px !important',
                  width: '30px !important',
                  marginRight: 1,
                }}
              />
            </Box>
          ) : (
            <IconButton
              aria-label="send"
              onClick={handleSendMessage}
              disabled={!msg && !file}
              color="primary"
            >
              <IconSend stroke={PRIMARY_COLOR} strokeWidth={'1.5'} />
            </IconButton>
          )}
        </form>
      </>
    </Box>
  );
};

export default GroupChatMsgSent;
