import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import {
  IconChecks,
  IconDeviceFloppy,
  IconDots,
  IconExclamationCircle,
  IconMail,
  IconMessage,
  IconPhone,
  IconSend,
} from '@tabler/icons-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import 'simplebar/src/simplebar.css';
import { useAuth } from '../../../hooks/useAuth';
import { AppState, useDispatch } from '../../../store/Store';
import {
  addMessageNote,
  clearSelectedMessage,
} from '../../../store/apps/chat/ChatSlice';
import CallMessageType from '../../callfeatures/message/CallMessageType';
import CustomOptionsMenu from '../../custom/CustomOptionsMenu';
import CustomTextField from '../../custom/CustomTextField';
import CustomTaggingComponent from '../../custom/form/CustomTaggingComponent';

interface MessageContentProps {
  message: any;
  onDelete: (id: string) => void;
  onAudioFileTranscribe: (message: any) => void;
  onTextTranscribe: (message: any) => void;
  onSaveTranscribe: (message: any) => void;
}

const ChatMessageComponent = (props: MessageContentProps) => {
  const { message, onDelete } = props;
  const dispatch = useDispatch();
  const { user, settings } = useAuth();
  const { selectedChat, selectedMessage } = useSelector(
    (state: AppState) => state.chatReducer,
  );
  const [noteObj, setNoteObj] = useState<any>([]);
  const [toggleNote, setToogleNote] = useState<boolean>(
    message?.notes.length > 0,
  );
  const [note, setNote] = useState<any>('');
  const [tagged, setTagged] = useState<any>([]);

  useEffect(() => {
    const notes = message?.notes || [];
    setNoteObj(notes);
    setToogleNote(notes.length > 0);
    setNote('');
    setTagged([]);
  }, [message]);

  useEffect(() => {
    if (selectedMessage?.id && selectedMessage?.id === message?.id) {
      const notes = selectedMessage?.notes || [];
      setNoteObj(notes);
      setToogleNote(notes.length > 0);
      dispatch(clearSelectedMessage());
    }
  }, [selectedMessage]);

  const handleMessageDescription = (message: any) => {
    const { status, description, deliveredAt } = message;
    if (status === 'DELIVERED') {
      return (
        <Tooltip
          title={`Delivered at ${moment(deliveredAt).format(
            `MM-DD-YYYY, hh:mm:ss A`,
          )}`}
        >
          <IconChecks
            size={16}
            style={{
              marginLeft: 5,
              marginTop: 10,
            }}
          />
        </Tooltip>
      );
    } else if (status === 'FAILED') {
      return (
        <Tooltip title={description}>
          <IconExclamationCircle
            color="red"
            size={16}
            style={{
              marginLeft: 5,
              marginTop: 10,
            }}
          />
        </Tooltip>
      );
    } else {
      return <></>;
    }
  };

  const handleOnTagged = async (data: any) => {
    const { text } = data;
    let _note = note;
    _note += `${text} `;
    setNote(_note);
    setTagged([...tagged, data]);
  };

  const handleAddNote = async () => {
    const assignedId = tagged.map((tags: any) => tags.id);
    const response = await dispatch(
      addMessageNote(message?.id, { note, assignedId }),
    );
    if (response) {
      setNoteObj(response);
      setNote('');
      setTagged([]);
    }
  };

  const returnTaggedList = () => {
    const handleDelete = (id: string) => () => {
      let tags = [...tagged];
      tags = tags.filter((tag: any) => tag.id !== id);
      setTagged(tags);
    };

    return (
      <Stack direction="row" spacing={1} mt={tagged.length ? 1 : 0}>
        {tagged.map((tags: any, index: number) => (
          <Chip
            key={index}
            label={tags.text}
            onDelete={handleDelete(tags.id)}
          />
        ))}
      </Stack>
    );
  };

  let messageText = message.message?.replaceAll('\n', '<br>');
  if (message?.transcribeMessage)
    messageText += `<div>
        <div style="border-top: 1px solid lightgrey;  white-space: pre-line; margin-top:10px">
          ${message.transcribeMessage}
        </div>
  </div>`;

  let emailMedia = '';
  if (message.mediaType === 'pdf' && message.media) {
    const image = `<a href="${message.media}" target="_blank" style="text-align:center;display: flex;justify-content: center;"><img src='/images/products/pdf.png' alt="media" height=120 width=80 /></a>`;
    messageText += `<br>${image}`;
    emailMedia += `${image}`;
  }

  if (message.mediaType !== 'pdf' && message.media) {
    const hasMediaArray = Boolean(message?.mediaArr?.length > 0);
    if (hasMediaArray) {
      let text = message.message?.replaceAll('\n', '<br>');
      let imageText = '';
      for (let mediaObj of message?.mediaArr) {
        const { media, ContentType } = mediaObj;
        const source =
          ContentType?.indexOf('image') > -1 || ContentType?.indexOf('img') > -1
            ? media
            : ContentType?.indexOf('pdf') > -1
            ? '/images/products/pdf.png'
            : '/images/products/mms.png';
        const image = `<a href="${mediaObj.media}" target="_blank" style="text-align:center;display: flex;justify-content: center; margin-bottom: 10px;"><img src=${source} alt="media" height=200 width=160 onerror="this.onerror=null;this.src='/images/products/mms.png';this.height=120; this.width=80"/></a>`;
        imageText += `${image}`;
        emailMedia += `${image}`;
      }
      messageText = text?.length > 0 ? `${imageText}${text}` : `${imageText}`;
    } else {
      let text = message.message?.replaceAll('\n', '<br>');
      const image = `<a href="${message.media}" target="_blank" style="text-align:center;display: flex;justify-content: center;"><img src=${message.media} alt="media" height=200 width=160 onerror="this.onerror=null;this.src='/images/products/mms.png';this.height=120; this.width=80"/></a>`;
      messageText = text?.length > 0 ? `${image}<br>${text}` : `${image}`;
      emailMedia += `${image}`;
    }
  }

  emailMedia += '<br>';

  if (message.communicationType === 'EMAIL') {
    const { emailBody, emailSubject, fromEmail, toEmail } = message;
    const emailDetails = `<div id="divRplyFwdMsg" dir="ltr"><span  style="font-size:11pt font-family: Calibri, sans-serif; color: #000000; " ><b>From:</b> ${fromEmail} <br>
    <b>To:</b> ${toEmail}<br>
    <b>Subject:</b> ${emailSubject}</span>
    <div>&nbsp;</div>
    </div>`;
    const sanitizedHTML = DOMPurify.sanitize(emailBody);
    messageText = `<div style="background: rgb(255 255 255 / 70%); padding: 10px; border-radius: 5px; overflow: auto;">${
      emailDetails + sanitizedHTML + emailMedia
    }</div>`;
  }

  return (
    <Box
      id={message?.id}
      sx={{
        borderRightWidth:
          message?.messageDirection === 'OUTBOUND' && toggleNote ? 6 : 0,
        borderRightStyle: 'solid',
        borderRightColor: 'rgba(73,168,255,0.50)',
        borderRadius: 0,
        paddingRight:
          message?.messageDirection === 'OUTBOUND' && toggleNote ? 1 : 0,
        borderLeftWidth:
          message?.messageDirection !== 'OUTBOUND' && toggleNote ? 6 : 0,
        borderLeftStyle: 'solid',
        borderLeftColor: 'rgba(50,52,65,0.50)',
        paddingLeft:
          message?.messageDirection !== 'OUTBOUND' && toggleNote ? 1 : 0,
      }}
    >
      {message?.messageDirection === 'OUTBOUND' ? (
        <>
          <Box
            mb={2}
            display="flex"
            alignItems="flex-end"
            flexDirection="row-reverse"
          >
            <Box alignItems="flex-end" display="flex" flexDirection={'column'}>
              <Box display={'flex'} alignItems={'flex-end'}>
                <CustomOptionsMenu
                  icon={<IconDots stroke={1.5} />}
                  iconButtonProps={{
                    size: 'small',
                    sx: { color: 'text.secondary', mr: 1 },
                  }}
                  options={[
                    ...(user?.role.role === 'ADMIN' ||
                    (user?.role.role === 'OPERATOR' &&
                      settings?.user_settings?.deletePermission)
                      ? [
                          {
                            text: 'Delete Message',
                            menuItemProps: {
                              sx: {
                                py: 2,
                              },
                              onClick: () => {
                                onDelete(message.id);
                              },
                            },
                          },
                        ]
                      : []),
                    {
                      text: toggleNote ? 'Hide Notes' : 'Show Notes',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          setToogleNote(!toggleNote);
                        },
                      },
                    },
                    ...(settings?.configuration?.TranslateAI
                      ? [
                          {
                            text:
                              message?.mediaType === 'Call'
                                ? 'Transcribe'
                                : 'Translate',
                            menuItemProps: {
                              sx: { py: 2 },
                              onClick: () => {
                                message?.mediaType === 'Call'
                                  ? props.onAudioFileTranscribe(message)
                                  : props.onTextTranscribe(message);
                              },
                            },
                          },
                        ]
                      : []),
                  ]}
                />
                {message?.mediaType === 'Call' ? (
                  <>
                    {message?.transcribeMessage && message?.notSave && (
                      <IconDeviceFloppy
                        style={{
                          marginRight: 10,
                          marginBottom: 6,
                          cursor: 'pointer',
                        }}
                        strokeWidth={1}
                        height={24}
                        width={24}
                        onClick={() => props.onSaveTranscribe(message)}
                      />
                    )}
                    <CallMessageType
                      chat={{ ...message, to: selectedChat?.to }}
                    />
                  </>
                ) : (
                  <>
                    {message?.transcribeMessage && message?.notSave && (
                      <IconDeviceFloppy
                        style={{
                          marginRight: 10,
                          marginBottom: 6,
                          cursor: 'pointer',
                        }}
                        strokeWidth={1}
                        height={24}
                        width={24}
                        onClick={() => props.onSaveTranscribe(message)}
                      />
                    )}
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: messageText,
                      }}
                      sx={{
                        p: 3,
                        background: '#49A8FF',
                        ml: 'auto',
                        maxWidth: '320px',
                        borderRadius: '20px 20px 3px 20px',
                        color:
                          message.communicationType === 'EMAIL'
                            ? '#000000'
                            : '#fff',
                        wordWrap: 'break-word',
                      }}
                    />
                  </>
                )}
              </Box>
              {message.scheduleAt && (
                <Typography
                  variant="body2"
                  color="grey.400"
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  {message.communicationType === 'EMAIL' ? (
                    <IconMail size={16} style={{ marginRight: 5 }} />
                  ) : (
                    <IconMessage size={16} style={{ marginRight: 5 }} />
                  )}
                  Scheduled by {message.sender} for{' '}
                  {format(
                    new Date(+message.scheduleAt),
                    "EEE, MMM dd 'at' hh:mm a",
                  )}
                  <br />
                  Sent on{' '}
                  {format(
                    new Date(message.createdAt),
                    "EEE, MMM dd 'at' hh:mm a",
                  )}
                </Typography>
              )}
              <Box display={'flex'} alignItems={'center'}>
                {message.createdAt && !message.scheduleAt && (
                  <Typography
                    variant="body2"
                    color="grey.400"
                    mt={1}
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {message.communicationType === 'EMAIL' ? (
                      <IconMail size={16} style={{ marginRight: 5 }} />
                    ) : (
                      <>
                        {message?.mediaType === 'Call' ? (
                          <IconPhone size={16} style={{ marginRight: 5 }} />
                        ) : (
                          <IconMessage size={16} style={{ marginRight: 5 }} />
                        )}
                      </>
                    )}
                    {message.sender},&nbsp;
                    {format(
                      new Date(message.createdAt),
                      "EEE, MMM dd 'at' hh:mm a",
                    )}
                  </Typography>
                )}
                {handleMessageDescription(message)}
              </Box>
            </Box>
          </Box>
          {toggleNote && (
            <Box
              mb={3}
              display="flex"
              alignItems="flex-end"
              flexDirection="row-reverse"
            >
              <Box
                sx={{
                  marginTop: 0.5,
                  maxWidth: '320px',
                  width: 320,
                }}
              >
                {noteObj.map((obj: any, index: number) => {
                  const { note, createdBy, createdAt } = obj;
                  return (
                    <Box
                      key={index}
                      sx={{
                        padding: 1,
                        background: 'rgba(73,168,255,0.50)',
                        marginBottom: 1,
                      }}
                    >
                      <Typography variant="body1">{note}</Typography>
                      <Typography variant="caption">
                        {createdBy},{' '}
                        {formatDistanceToNowStrict(new Date(createdAt), {
                          addSuffix: false,
                        })}{' '}
                        ago
                      </Typography>
                    </Box>
                  );
                })}
                <Box display={'flex'} alignItems={'center'}>
                  <CustomTextField
                    size={'small'}
                    sx={{ width: '100%', mt: 0.5 }}
                    label="Enter internal note"
                    value={note}
                    onChange={(e: any) => setNote(e.target.value)}
                  />
                  <IconButton disabled={!Boolean(note)} onClick={handleAddNote}>
                    <IconSend size={16} />
                  </IconButton>
                  <CustomTaggingComponent
                    handleSelect={handleOnTagged}
                    text={note}
                  />
                </Box>
                {returnTaggedList()}
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <Box display="flex">
            <Box mb={2}>
              <Box display={'flex'} alignItems={'flex-end'}>
                {message?.mediaType === 'Call' ? (
                  <>
                    <CallMessageType
                      chat={{ ...message, to: selectedChat?.from }}
                    />
                    {message?.transcribeMessage && message?.notSave && (
                      <IconDeviceFloppy
                        style={{
                          marginLeft: 10,
                          marginBottom: 6,
                          cursor: 'pointer',
                        }}
                        strokeWidth={1}
                        height={24}
                        width={24}
                        onClick={() => props.onSaveTranscribe(message)}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: messageText,
                      }}
                      sx={{
                        p: 3,
                        backgroundColor: `#323441`,
                        ml: '0',
                        maxWidth: '320px',
                        borderRadius: '20px 20px 20px 3px',
                        color:
                          message.communicationType === 'EMAIL'
                            ? '#000000'
                            : '#fff',
                        wordWrap: 'break-word',
                      }}
                    />
                    {message?.transcribeMessage && message?.notSave && (
                      <IconDeviceFloppy
                        style={{
                          marginLeft: 10,
                          marginBottom: 6,
                          cursor: 'pointer',
                        }}
                        strokeWidth={1}
                        height={24}
                        width={24}
                        onClick={() => props.onSaveTranscribe(message)}
                      />
                    )}
                  </>
                )}
                <CustomOptionsMenu
                  icon={<IconDots stroke={1.5} />}
                  iconButtonProps={{
                    size: 'small',
                    sx: { color: 'text.secondary', ml: 1 },
                  }}
                  options={[
                    ...(user?.role.role === 'ADMIN' ||
                    (user?.role.role === 'OPERATOR' &&
                      settings?.user_settings?.deletePermission)
                      ? [
                          {
                            text: 'Delete Message',
                            menuItemProps: {
                              sx: {
                                py: 2,
                              },
                              onClick: () => {
                                onDelete(message.id);
                              },
                            },
                          },
                        ]
                      : []),
                    {
                      text: toggleNote ? 'Hide Notes' : 'Show Notes',
                      menuItemProps: {
                        sx: { py: 2 },
                        onClick: () => {
                          setToogleNote(!toggleNote);
                        },
                      },
                    },

                    ...(settings?.configuration?.TranslateAI
                      ? [
                          {
                            text:
                              message?.mediaType === 'Call'
                                ? 'Transcribe'
                                : 'Translate',
                            menuItemProps: {
                              sx: { py: 2 },
                              onClick: () => {
                                message?.mediaType === 'Call'
                                  ? props.onAudioFileTranscribe(message)
                                  : props.onTextTranscribe(message);
                              },
                            },
                          },
                        ]
                      : []),
                  ]}
                />
              </Box>
              {message.createdAt && (
                <Typography
                  variant="body2"
                  color="grey.400"
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  {message.communicationType === 'EMAIL' ? (
                    <IconMail size={16} style={{ marginRight: 5 }} />
                  ) : (
                    <>
                      {message?.mediaType === 'Call' ? (
                        <IconPhone size={16} style={{ marginRight: 5 }} />
                      ) : (
                        <IconMessage size={16} style={{ marginRight: 5 }} />
                      )}
                    </>
                  )}
                  {format(
                    new Date(message.createdAt),
                    "EEE, MMM dd 'at' hh:mm a",
                  )}
                </Typography>
              )}
            </Box>
          </Box>
          {toggleNote && (
            <Box mb={2}>
              <Box
                sx={{
                  marginTop: 0.5,
                  maxWidth: '320px',
                }}
              >
                {noteObj.map((obj: any, index: number) => {
                  const { note, createdBy, createdAt } = obj;
                  return (
                    <Box
                      key={index}
                      sx={{
                        padding: 1,
                        background: 'rgba(50,52,65,0.50)',
                        marginBottom: 1,
                      }}
                    >
                      <Typography variant="body1">{note}</Typography>
                      <Typography variant="caption">
                        {createdBy},{' '}
                        {formatDistanceToNowStrict(new Date(createdAt), {
                          addSuffix: false,
                        })}{' '}
                        ago
                      </Typography>
                    </Box>
                  );
                })}
                <Box display={'flex'} alignItems={'center'}>
                  <CustomTextField
                    size={'small'}
                    sx={{ width: '100%', marignRight: 5, mt: 0.5 }}
                    label="Enter internal note"
                    value={note}
                    onChange={(e: any) => setNote(e.target.value)}
                  />
                  <IconButton disabled={!Boolean(note)} onClick={handleAddNote}>
                    <IconSend size={16} style={{ cursor: 'pointer' }} />
                  </IconButton>
                  <CustomTaggingComponent
                    handleSelect={handleOnTagged}
                    text={note}
                  />
                </Box>
                {returnTaggedList()}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ChatMessageComponent;
