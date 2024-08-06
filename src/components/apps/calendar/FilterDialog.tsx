import { Icon } from '@iconify/react';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import { AppState, dispatch, useSelector } from '../../../store/Store';
import { setFilterType } from '../../../store/apps/calendar/CalendarSlice';
import { TASK_TYPE } from '../../../utils/constant';
import CustomCloseButton from '../../custom/CustomCloseButton';

const FilterDialog = (props: any) => {
  const { filterDialog, setFilterDialog } = props;
  const store = useSelector((state: AppState) => state.calendarReducer);
  const [filter, setFilter] = useState<any>(store.filter);

  useEffect(() => {
    setFilter(store.filter);
  }, [store.filter]);

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
        <Box sx={{ p: 2, width: '100%' }}>
          {store.selectedCalendar?.virtual && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormControlLabel
                label="Show events assigned to me"
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={filter.assigned}
                    onChange={(event: any) => {
                      setFilter({
                        ...filter,
                        assigned: !filter.assigned,
                      });
                    }}
                    sx={{ padding: 0, marginRight: 2 }}
                  />
                }
              />
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel id="type-select" size="small">
              Select Type
            </InputLabel>
            <Select
              size="small"
              label={'Select Type'}
              labelId="type-select"
              value={filter.type || 'ALL'}
              onChange={(e: any) =>
                setFilter({
                  ...filter,
                  type: e.target.value,
                })
              }
            >
              <MenuItem dense value={'ALL'}>
                ALL
              </MenuItem>
              {TASK_TYPE.map((task: any, index: number) => (
                <MenuItem dense key={index} value={task.value}>
                  {task.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="type-select" size="small">
              Created By
            </InputLabel>
            <Select
              size="small"
              label={'Created By'}
              labelId="type-select"
              value={filter.owner || 'ALL'}
              onChange={(e: any) =>
                setFilter({
                  ...filter,
                  owner: e.target.value,
                })
              }
            >
              <MenuItem dense value={'ALL'}>
                ALL
              </MenuItem>
              <MenuItem dense value={'SELF'}>
                SELF
              </MenuItem>
              <MenuItem dense value={'OTHER'}>
                OTHER
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            setFilterDialog(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(setFilterType(filter));
            setFilterDialog(false);
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
