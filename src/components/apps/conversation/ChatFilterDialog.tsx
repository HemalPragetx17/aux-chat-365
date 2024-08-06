import { Icon } from '@iconify/react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import {
  fetchContactCategory,
  fetchContactService,
} from '../../../store/apps/contacts/ContactSlice';
import { AppState, dispatch, useSelector } from '../../../store/Store';
import CustomCloseButton from '../../custom/CustomCloseButton';
import { CONTACT_STAGES } from '../../forms/contact/SingleContactForm';

const ChatFilterDialog = (props: any) => {
  const { filterDialog, setFilterDialog, handleFilterApply } = props;
  const store = useSelector((state: AppState) => state.chatReducer);
  const { contactCategory, contactService } = useSelector(
    (state: AppState) => state.contactsReducer,
  );
  const [filter, setFilter] = useState<any>({ dateFlag: true });

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    if (filterDialog) {
      setFilter({
        dateFlag: store.dateFlag,
        filterData: store.filterData,
      });
    }
  }, [filterDialog]);

  const fetchFiltersData = async () => {
    await dispatch(fetchContactCategory());
    await dispatch(fetchContactService());
  };

  return (
    <Dialog
      open={filterDialog}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton
        onClick={() => {
          setFilterDialog(false);
        }}
      >
        <Icon icon={'tabler:x'} width={24} height={24} />
      </CustomCloseButton>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            Sort Conversations By -
            <RadioGroup
              row
              value={filter.dateFlag}
              onChange={() => {
                setFilter({
                  ...filter,
                  dateFlag: !filter.dateFlag,
                });
              }}
            >
              <FormControlLabel
                value="true"
                label="DATE"
                control={<Radio />}
                sx={{ mr: 2 }}
              />
              <FormControlLabel
                value="false"
                label="UNREAD"
                control={<Radio />}
                sx={{ mr: 2 }}
              />
            </RadioGroup>
          </FormControl>
          <FormControl size="small" fullWidth sx={{ mb: 1 }}>
            <InputLabel id="select-category">Contact Type</InputLabel>
            <Select
              id="select-category"
              label="Contact Type"
              labelId="select-category"
              value={filter.filterData?.category || ''}
              onChange={(event: any) =>
                setFilter({
                  dateFlag: filter.dateFlag,
                  filterData: {
                    ...filter.filterData,
                    category: event?.target?.value,
                  },
                })
              }
              inputProps={{ placeholder: 'Select Contact Type' }}
            >
              {contactCategory.map((option: any, index: number) => {
                return (
                  <MenuItem dense key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={{ mb: 1 }}>
            <InputLabel id="select-stage">Stage</InputLabel>
            <Select
              id="select-stage"
              label="Stage"
              labelId="select-stage"
              value={filter.filterData?.stage || ''}
              onChange={(event: any) =>
                setFilter({
                  dateFlag: filter.dateFlag,
                  filterData: {
                    ...filter.filterData,
                    stage: event?.target?.value,
                  },
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
          <FormControl size="small" fullWidth>
            <InputLabel id="select-services">Services</InputLabel>
            <Select
              id="select-services"
              label="Services"
              labelId="select-services"
              value={filter.filterData?.service || []}
              multiple
              onChange={(event: any) =>
                setFilter({
                  dateFlag: filter.dateFlag,
                  filterData: {
                    ...filter.filterData,
                    service: event?.target?.value,
                  },
                })
              }
              inputProps={{ placeholder: 'Select Services' }}
            >
              {contactService.map((option: any, index: number) => {
                return (
                  <MenuItem key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            setFilter({ dateFlag: true, filterData: null });
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleFilterApply(filter);
            setFilterDialog(false);
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatFilterDialog;
