import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Slide,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import dynamic from 'next/dynamic';
import { forwardRef, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AppState, useDispatch, useSelector } from '../../../store/Store';
import {
  setMessages,
  showParticipants,
  toggleMessage,
} from '../../../store/apps/email/EmailSlice';
import Scrollbar from '../../custom-scroll/Scrollbar';
import CustomFormLabel from '../../custom/CustomFormLabel';
import CustomLoader from '../../custom/CustomLoader';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ReactQuill = dynamic(import('react-quill'), { ssr: false });
interface Props {
  emailDetails: any;
  userEmail: any;
  userId: any;
  selectedEmail: any;
  refresh: any;
  data: any;
}

const SERVER_URI = process.env.NYLAS_API_URL;

const EmailContent = ({
  emailDetails,
  userEmail,
  userId,
  selectedEmail,
  refresh,
  data,
}: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const emailStore = useSelector((state: AppState) => state.emailReducer);

  const warningColor = theme.palette.warning.main;
  const errorColor = theme.palette.error.light;
  const [collapsedCount, setCollapsedCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [draftEmail, setDraftEmail] = useState<any>(null);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const setupMessages = async () => {
      let showingMessages = emailDetails.messages || [];
      if (emailDetails.messages.length > 4) {
        showingMessages = [showingMessages[0], ...showingMessages.slice(-2)];
        setCollapsedCount(emailDetails.messages.length - 3);
      }

      dispatch(setMessages(showingMessages));

      const latestMessage = await getMessage(
        showingMessages[showingMessages.length - 1],
      );
      dispatch(toggleMessage(latestMessage));
    };

    if (emailDetails?.messages?.length) {
      setupMessages();
    }
  }, [emailDetails]);

  const toggleEditor = () => {
    setShow(!show);
  };

  const getMessage = async (message: any) => {
    if (message.body) return message;

    setLoadingMessage(message.id);
    try {
      const url = `${SERVER_URI}/nylas/message`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message.id,
          accessToken: selectedEmail,
        }),
      });
      const messageData = await res.json();
      setLoadingMessage('');
      return messageData;
    } catch (e) {
      console.warn(`Error retrieving message:`, e);
      setLoadingMessage('');
      return false;
    }
  };

  const getMessageReceivers = (message: any) => {
    const receiverList = [];

    if (message?.to?.length) {
      for (let i = 0; i < message.to.length; i++) {
        if (i === 3) {
          receiverList.push(`+${(message.to.length - 3).toString()}`);
          break;
        }

        const to = message.to[i];
        receiverList.push(to.email === userEmail ? 'Me' : to.name || to.email);
      }
    }
    return receiverList.join(', ');
  };

  const downloadAttachment = async (event: any, file: any) => {
    event.stopPropagation();
    try {
      const queryParams = new URLSearchParams({ id: file.id });
      const url = `${SERVER_URI}/nylas/file?${queryParams.toString()}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
      });
      const fileBuffer = await res.text();
      if (fileBuffer) downloadAttachedFile(fileBuffer, file);
    } catch (e) {
      console.warn(`Error retrieving emails:`, e);
      return false;
    }
  };

  function downloadAttachedFile(fileBuffer: any, file: any) {
    const blob = new Blob([fileBuffer], { type: file.content_type });
    const blobFile = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobFile;
    a.download = file.filename ?? file.id;
    a.target = '_blank';
    a.click();
    a.remove();
  }

  const handleToggleMessage = async (message: any) => {
    if (emailStore?.messages.length > 1) {
      let newMsg = message;
      if (!newMsg.expanded) {
        newMsg = await getMessage(message);
      }
      if (newMsg) {
        dispatch(toggleMessage(newMsg));
      }
    }
  };

  const handleToggleParticipants = (event: any, messageId: string) => {
    event.stopPropagation();
    dispatch(showParticipants({ message: { id: messageId } }));
  };

  const handleFocusComposer = (event: any) => {
    event.stopPropagation();
  };

  const handleShowCollapsedMessages = (event: any) => {
    event.stopPropagation();
    if (emailStore?.messages.length === 3) {
      dispatch(
        setMessages([
          emailStore?.messages[0],
          ...selectedEmail.messages.slice(1, -2),
          ...emailStore?.messages.slice(-2),
        ]),
      );
      setCollapsedCount(0);
    }
  };

  const sendEmail = async ({
    userId,
    to,
    subject,
    replyToMessageId,
    body,
    last_message_timestamp,
  }: any) => {
    try {
      const url = SERVER_URI + '/nylas/send-email';
      let fromEmail = '';
      data?.map((email: any) => {
        if (email.accessTokenNylas === selectedEmail) fromEmail = email?.email;
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
        body: draftEmail
          ? JSON.stringify({
              ...draftEmail,
              from: fromEmail,
              to,
              subject,
              replyToMessageId,
              body,
              last_message_timestamp,
              accessToken: selectedEmail,
            })
          : JSON.stringify({
              from: fromEmail,
              to,
              subject,
              replyToMessageId,
              body,
              last_message_timestamp,
              accessToken: selectedEmail,
            }),
      });

      if (!res.ok) {
        toast.error('Error');
        throw new Error(res.statusText);
      }

      const Data = await res.json();
      toggleEditor();
      return Data;
    } catch (error) {
      console.warn(`Error sending emails:`, error);

      toast.error('Error');
      toggleEditor();
      return false;
    }
  };

  const send = async (e: any) => {
    e.preventDefault();
    setIsSending(true);
    const message = await sendEmail({
      userId,
      to: isReplying ? emailDetails?.messages[0]?.from[0]?.email : to,
      subject: subject,
      replyToMessageId: emailDetails?.messages[0]?.id,
      body,
      last_message_timestamp: emailDetails?.last_message_timestamp,
    });
    console.log('message sent', message);
    setBody('');
    setIsSending(false);
    onEmailSent();
  };

  const onEmailSent = () => {
    setDraftEmail(null);
    refresh();
    toast.success('Success');
  };

  return (
    <Scrollbar
      sx={{
        height: 'calc(100vh - 80px)',
        maxHeight: '800px',
      }}
    >
      {/* <Stack p={2} gap={0} direction="row">
        <Tooltip title={emailDetails.starred ? 'Unstar' : 'Star'}>
          <IconButton
          //  onClick={() => dispatch(starEmail(emailDetails.id))}
          >
            <IconStar
              stroke={1.3}
              size="18"
              style={{
                fill: emailDetails.starred ? warningColor : '',
                stroke: emailDetails.starred ? warningColor : '',
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={emailDetails ? 'Important' : 'Not Important'}>
          <IconButton
          // onClick={() => dispatch(importantEmail(emailDetails.id))}
          >
            <IconAlertCircle
              size="18"
              stroke={1.3}
              style={{
                fill: emailDetails.important ? errorColor : '',
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
          //  onClick={() => dispatch(deleteEmail(emailDetails.id))}
          >
            <IconTrash size="18" stroke={1.3} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider /> */}
      <Box p={3}>
        <Box display="flex" alignItems="center" sx={{ pb: 3 }}>
          <Avatar
            alt={
              (emailDetails?.messages &&
                emailDetails?.messages[0]?.from?.[0]?.name) ||
              'Unknown'
            }
            src={emailDetails.thumbnail}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">
              {(emailDetails?.messages &&
                emailDetails.messages[0].from?.[0]?.email) ||
                'Unknown'}
            </Typography>
            <Typography variant="body2">
              {' '}
              {(emailDetails?.messages &&
                emailDetails.messages[0].to?.[0]?.email) ||
                'Unknown'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ py: 2 }}>
          <Typography variant="h4">{emailDetails.subject}</Typography>
        </Box>

        <Box sx={{ py: 2 }}>
          {emailStore?.messages?.map((message, index) => {
            const isLoading = loadingMessage === message.id;
            return (
              <div
                key={message.id}
                className={`message-container`}
                onClick={() => handleToggleMessage(message)}
              >
                {message.expanded ? (
                  <div className="email-body">
                    <div
                      className="email-body-html"
                      dangerouslySetInnerHTML={{
                        __html: message.body,
                      }}
                    />

                    {!!message.files?.length && (
                      <>
                        <Divider />
                        <Box p={3}>
                          <Typography variant="h6">
                            Attachments ({message.files?.length})
                          </Typography>

                          <Grid container spacing={3}>
                            {message.files
                              .filter(
                                (file: any) =>
                                  file.content_disposition === 'attachment' &&
                                  !file.content_type.includes('calendar'),
                              )
                              ?.map((attach: any) => {
                                return (
                                  <Grid
                                    item
                                    lg={4}
                                    key={attach.id}
                                    onClick={(event) =>
                                      downloadAttachment(event, attach)
                                    }
                                  >
                                    <Stack direction="row" gap={2} mt={2}>
                                      <Avatar
                                        variant="rounded"
                                        sx={{
                                          width: '48px',
                                          height: '48px',
                                          bgcolor: (theme: any) =>
                                            theme.palette.grey[100],
                                        }}
                                      >
                                        <Avatar
                                          src={attach.image}
                                          alt="av"
                                          variant="rounded"
                                          sx={{ width: '24px', height: '24px' }}
                                        ></Avatar>
                                      </Avatar>
                                      <Box mr={'auto'}>
                                        <Typography
                                          variant="subtitle2"
                                          fontWeight={600}
                                          mb={1}
                                        >
                                          {attach.filename}
                                        </Typography>
                                        <Typography variant="body2">
                                          {attach.fileSize}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </Box>
                        <Divider />
                      </>
                    )}
                  </div>
                ) : (
                  <p className="snippet">{message.snippet}</p>
                )}

                {isLoading && (
                  <CustomLoader
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      background: 'rgba(255,255,255,0.8)',
                      zIndex: 200,
                    }}
                  />
                )}

                {index !== emailStore?.messages.length - 1 && (
                  <div
                    className="message-border"
                    onClick={handleShowCollapsedMessages}
                  >
                    {index === 0 && collapsedCount > 0 && (
                      <span>Show {collapsedCount} messages</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </Box>
      </Box>

      <Divider />

      <Box p={3}>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => {
              setIsReplying(true);
              toggleEditor();
            }}
          >
            Reply
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setIsReplying(false);
              toggleEditor();
            }}
          >
            Forward
          </Button>
        </Stack>

        <Dialog
          open={show && isReplying}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShow(false)}
          fullWidth
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              component="div"
            >
              <ReactQuill
                style={{
                  minHeight: '200px',
                }}
                id="body-text"
                value={body}
                onChange={(value) => {
                  setBody(value);
                }}
                placeholder="Type here..."
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={send} color="primary" variant="contained">
              Send
            </Button>
            <Button onClick={() => setShow(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={show && !isReplying}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShow(false)}
          fullWidth
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              component="div"
            >
              <CustomFormLabel htmlFor="to-email">To</CustomFormLabel>
              <TextField
                id="to-email"
                fullWidth
                size="small"
                variant="outlined"
                value={to}
                type="email"
                onChange={(e) => {
                  setTo(e.target.value);
                }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={send} color="primary" variant="contained">
              Send
            </Button>
            <Button onClick={() => setShow(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Scrollbar>
  );
};

export default EmailContent;
