import { Icon } from '@iconify/react';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import { useAuth } from '../../../hooks/useAuth';
import { fetchChatByNumber } from '../../../store/apps/chat/ChatGroupSlice';
import { fetchDids } from '../../../store/apps/did/DidSlice';
import { AppState, dispatch } from '../../../store/Store';
import axios from '../../../utils/axios';
import CustomCloseButton from '../../custom/CustomCloseButton';
import CustomTextField from '../../custom/CustomTextField';

interface ChatDialogProp {
  open: boolean;
  toggle: () => void;
  dest: any;
}

const GroupChatDialog = (props: ChatDialogProp) => {
  const { open, toggle, dest } = props;
  const { user, settings } = useAuth();
  const didList = useSelector((state: AppState) =>
    state.didReducer.did.map((did: any) => ({
      label: `${did?.countryCode}${did?.phoneNumber} (${did?.title})`,
      value: did?.id,
    })),
  );
  const [contactGroup, setContactGroup] = useState<any>([]);
  const [fromNumber, setFromNumber] = useState<any>(settings?.defaultDid?.id);
  const [destination, setDestination] = useState<any>('');
  const router = useRouter();

  useEffect(() => {
    if (Boolean(user) && didList.length === 0) {
      dispatch(fetchDids('ACTIVE', user?.uid as any));
    }
    fetchContactGroup();
  }, [user]);

  const fetchContactGroup = async () => {
    const response = await axios.get(`/contact-group`);
    const resp = response.status === 200 ? response.data.data : [];
    setContactGroup(resp);
  };

  useEffect(() => {
    setFromNumber(settings?.defaultDid?.id);
  }, [settings]);

  useEffect(() => {
    open ? setDestination(dest) : setDestination(undefined);
  }, [open]);

  const handleMessage = useCallback(async () => {
    if (!Boolean(destination) || !Boolean(fromNumber)) {
      toast.error('Please enter valid source and destination.');
      return false;
    }
    const { id } = destination;
    if (!id) {
      toast.error('Invalid Contact Group');
      return false;
    }
    const { route } = router;
    if (route.includes('chat')) {
      dispatch(fetchChatByNumber(id, fromNumber));
      toggle();
    } else {
      const chatNumber = JSON.stringify({ id, fromNumber });
      sessionStorage.setItem('groupNumber', chatNumber);
      router.replace(`/chats/group`);
    }
  }, [destination, fromNumber]);

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="type-select" size="small">
            Select From Number
          </InputLabel>
          <Select
            size="small"
            label={'Select From Number'}
            labelId="type-select"
            value={fromNumber}
            onChange={(e) => setFromNumber(e?.target?.value)}
          >
            {didList.map((did, index) => (
              <MenuItem key={index} value={did?.value}>
                {did?.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {destination !== undefined && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={contactGroup}
              freeSolo
              clearOnBlur
              getOptionLabel={(option: any) =>
                `${option.title} (${option.description})`
              }
              defaultValue={destination || null}
              onChange={(e, newValue: any) => setDestination(newValue)}
              disabled={Boolean(dest)}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  disabled={Boolean(dest)}
                  size="small"
                  label={'Select Contact Group'}
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
            />
          </FormControl>
        )}
        <Button fullWidth variant="contained" onClick={handleMessage}>
          NEXT
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatDialog;
