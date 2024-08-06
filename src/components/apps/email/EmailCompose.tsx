import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import CustomFormLabel from '../../custom/CustomFormLabel';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  emailDetails: any;
  userId: any;
  selectedEmail: any;
  refresh: any;
  data: any;
}

const SERVER_URI = process.env.NYLAS_API_URL;

const EmailCompose = ({
  emailDetails,
  userId,
  selectedEmail,
  refresh,
  data,
}: Props) => {
  const [isSending, setIsSending] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          replyToMessageId,
          body,
          last_message_timestamp,
          accessToken: selectedEmail,
          isOpen: true,
          object: 'draft',
        }),
      });

      if (!res.ok) {
        toast.error('Error');
        throw new Error(res.statusText);
      }

      const Data = await res.json();

      return Data;
    } catch (error) {
      console.warn(`Error sending emails:`, error);
      toast.error('Error');

      return false;
    }
  };

  const send = async (e: any) => {
    e.preventDefault();

    setIsSending(true);
    const message = await sendEmail({
      userId,
      to: to,
      subject: subject,
      body,
      last_message_timestamp: emailDetails?.last_message_timestamp,
    });
    console.log('message sent', message);
    setBody('');
    setIsSending(false);
    onEmailSent();
  };

  const onEmailSent = () => {
    refresh();
    toast.success('Success');
  };

  return (
    <Box>
      <Box p={1}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleClickOpen}
          disabled={!selectedEmail}
        >
          {/* Compose */}+
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" variant="h5">
          Compose Mail
        </DialogTitle>
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
            <CustomFormLabel htmlFor="subject-text">Subject</CustomFormLabel>
            <TextField
              id="subject-text"
              fullWidth
              size="small"
              variant="outlined"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
            />
            <CustomFormLabel htmlFor="body-text">Body</CustomFormLabel>
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
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailCompose;
