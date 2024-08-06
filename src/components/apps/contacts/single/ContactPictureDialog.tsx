import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AppState, useSelector } from '../../../../store/Store';
import axios from '../../../../utils/axios';

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    maxWidth: 320,
    width: '100%',
  },
}));

interface ContactPictureDialogProps {
  open: boolean;
  onClose: () => void;
  handleFilePreview: (data: any) => string | undefined;
  onUpdated: (data: any) => void;
}

const ContactPictureDialog = (props: ContactPictureDialogProps) => {
  const { open, onClose, handleFilePreview, onUpdated } = props;
  const store = useSelector((state: AppState) => state.contactsReducer);
  const [preview, setPreview] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (open) {
      setPreview(store.currentData.image);
    }
  }, [open]);

  const handleFileChange = (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setPreview(event.target.files[0]);
        setHasChanges(true);
      } else {
        toast.error('Only File Type Image Format Allowed!');
      }
    }
  };

  const handleRemove = async () => {
    setPreview(null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (hasChanges) {
      setHasChanges(false);
      handleImageUpload();
    }
  };

  const handleImageUpload = async () => {
    try {
      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          bodyParser: false,
        },
      };
      const upload = await axios.put(
        `/contact/upload/${store.currentData?.id}`,
        { file: preview },
        header,
      );
      toast.success(`Contact updated successfully.`);
      onUpdated(upload);
      onClose();
    } catch (error) {
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleClose = () => {
    setHasChanges(false);
    onClose();
  };

  return (
    <DialogWrapper open={open} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Avatar
          alt="Profile Picture"
          src={handleFilePreview(preview)}
          sx={{ width: 120, height: 120, margin: '0 auto 16px auto' }}
        />
        <Button variant="contained" component="label" fullWidth>
          Upload
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleRemove}
          disabled={!Boolean(preview)}
        >
          Remove
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!hasChanges}>
          Save
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
};

export default ContactPictureDialog;
