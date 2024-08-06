import { Icon } from '@iconify/react';
import { CircularProgress, InputAdornment } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../hooks/useAuth';
import { AppState, dispatch } from '../../../../store/Store';
import { sendMessage } from '../../../../store/apps/chat/ChatSlice';
import { fetchDids } from '../../../../store/apps/did/DidSlice';
import axios from '../../../../utils/axios';
import CustomCloseButton from '../../../custom/CustomCloseButton';
import CustomTextField from '../../../custom/CustomTextField';
import ContactChatComponent from './ContactChatComponent';

const filter = createFilterOptions();

interface ContactMessageDialogProp {
  open: boolean;
  toggle: () => void;
  dest: any;
}

const ContactMessageDialog = (props: ContactMessageDialogProp) => {
  const { open, toggle, dest } = props;
  const { user, settings } = useAuth();
  const didList = useSelector((state: AppState) =>
    state.didReducer.did.map((did: any) => ({
      label: `${did?.phoneNumber} (${did?.title})`,
      value: did.phoneNumber,
    })),
  );
  const [fromNumber, setFromNumber] = useState<any>(
    settings?.defaultDid?.phoneNumber,
  );
  const [destination, setDestination] = useState<any>('');
  const [options, setOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (Boolean(user) && didList?.length === 0) {
      dispatch(fetchDids('ACTIVE', user?.uid as any));
    }
  }, [user]);

  useEffect(() => {
    setFromNumber(settings?.defaultDid?.phoneNumber);
  }, [settings]);

  useEffect(() => {
    if (!open) {
      setDestination('');
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (dest) {
      setDestination(dest?.phone || dest);
    }
  }, [dest]);

  const handleMessage = useCallback(
    async (body: any) => {
      if (!Boolean(destination) || !Boolean(fromNumber)) {
        toast.error('Please enter To and From number.');
        return false;
      }
      if (isNaN(destination)) {
        toast.error('Invalid To Number');
        return false;
      }
      const payload = {
        ...body,
        to: destination,
        from: fromNumber,
      };
      await dispatch(sendMessage(payload));
      toggle();
    },
    [destination, fromNumber],
  );

  const handleInputChange = (event: any, newInputValue: any) => {
    if (!active) {
      setDestination(newInputValue);
    } else {
      setActive(false);
    }
  };

  const fetchSuggestions = async (input: any) => {
    try {
      setOptions([{ phone: input, firstName: '' }]);
      setLoading(true);
      const response = await axios.post(`/contact/search?text=${input}`);
      const data = response?.data?.data || [];
      if (data.length > 0) {
        setOptions(data);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setOptions([]);
    }
  };

  useEffect(() => {
    if (Boolean(destination)) {
      const delayedDispatch = debounce(() => {
        fetchSuggestions(destination);
      }, 1000);
      delayedDispatch();
      return () => {
        delayedDispatch.cancel();
      };
    } else {
      setOptions([]);
    }
  }, [destination]);

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', maxHeight: 800 } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={didList}
            clearOnBlur
            getOptionLabel={(option: any) => option.label}
            defaultValue={
              didList.find((did) => did.value === fromNumber) || null
            }
            autoHighlight={true}
            onChange={(e, newValue: any) => setFromNumber(newValue?.value)}
            filterOptions={(options: any[], params: any) => {
              const filtered = filter(options, params);
              return filtered;
            }}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                size="small"
                label={'Select From Number'}
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        </FormControl>
        {destination !== undefined && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={options}
              freeSolo
              getOptionLabel={(option: any) => {
                const firstName = Boolean(option.firstName)
                  ? ` (${option.firstName})`
                  : '';
                return `${option.phone}${firstName}`;
              }}
              autoHighlight={true}
              blurOnSelect={true}
              onChange={(event, newValue) => {
                if (!loading) {
                  setActive(true);
                  setDestination(newValue?.phone);
                }
              }}
              inputValue={destination || ''}
              onInputChange={handleInputChange}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  size="small"
                  label={'To Number'}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">+1</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading && (
                          <CircularProgress
                            color="primary"
                            sx={{
                              height: '20px !important',
                              width: '20px !important',
                              marginRight: 1,
                            }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </FormControl>
        )}
        <ContactChatComponent open={open} handleSend={handleMessage} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactMessageDialog;
