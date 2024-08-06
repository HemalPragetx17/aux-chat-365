import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import 'simplebar/src/simplebar.css';

import { IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import { useAuth } from '../../../../hooks/useAuth';
import { AppState } from '../../../../store/Store';
import axios from '../../../../utils/axios';
import ContactImportDialog from './ContactImportDialog';

const CONTACT_STAGES = [
  { label: 'New', value: 'NEW' },
  { label: 'Engaged', value: 'ENGAGED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Proposal Sent', value: 'PROPOSALSENT' },
  { label: 'Negotations', value: 'NEGOTIATIONS' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
  { label: 'Nurturing', value: 'NURTURING' },
];

interface ContactSideFilterProp {
  handleAdd: () => void;
  handleFilterChanged: (data: any) => void;
  contactSearchBody: any;
  setContactSearchBody: (data: any) => void;
  onRefresh: () => void;
  filterString: string;
  setFilterString: (data: any) => void;
}

const ContactSideFilter = (props: ContactSideFilterProp) => {
  const {
    contactSearchBody,
    handleAdd,
    handleFilterChanged,
    setContactSearchBody,
    onRefresh,
    filterString,
    setFilterString,
  } = props;
  const store = useSelector((state: AppState) => state.contactsReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const { user } = useAuth();
  const roleId = user?.role?.roleId;
  const [importContactDialog, setImportContactDialog] = useState(false);

  const handleDownload = async () => {
    const toastId = toast.loading(
      'Please wait while we are generating your list',
    );
    const response = await axios.post(
      '/contact/download',
      {},
      {
        responseType: 'blob',
      },
    );
    if (response.status !== 201) {
      throw new Error('Network response was not ok');
    }

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.dismiss(toastId);
  };

  return (
    <Box
      sx={{
        width: '18%',
        marginRight: '1%',
      }}
    >
      <List
        sx={{
          borderRadius: 1,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor:
            customizer?.activeMode === 'light' ? '#cecece' : '#575757',
        }}
      >
        <Box sx={{ width: '100%', padding: 1 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Filter By
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel id="select-services">Contact Filter</InputLabel>
            <Select
              id="select-services"
              label="Contact Filter"
              labelId="select-services"
              value={filterString}
              onChange={(event: any) => {
                setFilterString(event.target.value);
                handleFilterChanged(event.target.value);
              }}
              inputProps={{
                placeholder: 'Contact Filter',
              }}
            >
              <MenuItem value={'FAVOURITE'}>FAVOURITE</MenuItem>
              <MenuItem value={'PERSONAL'}>PERSONAL</MenuItem>
              <MenuItem value={'BLOCKED'}>BLOCKED</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '100%', padding: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="select-category">Contact Type</InputLabel>
            <Select
              id="select-category"
              label="Contact Type"
              labelId="select-category"
              value={contactSearchBody.category}
              onChange={(event: any) =>
                setContactSearchBody({
                  ...contactSearchBody,
                  category: event?.target?.value,
                })
              }
              inputProps={{ placeholder: 'Select Contact Type' }}
            >
              {store.contactCategory.map((option: any, index: number) => {
                return (
                  <MenuItem dense key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '100%', padding: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="select-stage">Stage</InputLabel>
            <Select
              id="select-stage"
              label="Stage"
              labelId="select-stage"
              value={contactSearchBody.stage || ''}
              onChange={(event: any) =>
                setContactSearchBody({
                  ...contactSearchBody,
                  stage: event?.target?.value,
                })
              }
              inputProps={{ placeholder: 'Select Stage' }}
            >
              {CONTACT_STAGES.map((option: any, index: number) => {
                return (
                  <MenuItem key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '100%', padding: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="select-services">Services</InputLabel>
            <Select
              id="select-services"
              label="Services"
              labelId="select-services"
              multiple={true}
              value={contactSearchBody.service}
              onChange={(event: any) =>
                setContactSearchBody({
                  ...contactSearchBody,
                  service: event?.target?.value,
                })
              }
              inputProps={{ placeholder: 'Select Services' }}
            >
              {store.contactService.map((option: any, index: number) => {
                return (
                  <MenuItem key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '100%', padding: 1 }}>
          <Button variant="contained" fullWidth onClick={onRefresh}>
            Reset
          </Button>
        </Box>
      </List>

      <Box padding={1}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleAdd}
          sx={{ mb: 2 }}
        >
          <IconPlus style={{ marginRight: 5 }} size={16} />
          Add Contact
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setImportContactDialog(true)}
          sx={{ mb: 2 }}
        >
          <IconUpload style={{ marginRight: 5 }} size={16} />
          Import Contact
        </Button>
        {roleId === 2 && (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleDownload}
            disabled={store.contacts.length === 0}
            color="secondary"
          >
            <IconDownload style={{ marginRight: 5 }} size={16} /> Export Contact
          </Button>
        )}
      </Box>

      <ContactImportDialog
        open={importContactDialog}
        toggle={() => setImportContactDialog(false)}
        success={onRefresh}
      />
    </Box>
  );
};

export default ContactSideFilter;
