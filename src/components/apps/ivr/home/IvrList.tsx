import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { IconRefresh } from '@tabler/icons-react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import CustomPickerRange from '../../../custom/CustomPickerRange';
import CustomTextField from '../../../custom/CustomTextField';

const IvrList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [fromduedayfilter, setFromduedayfilter] = useState<any>(0);
  const [toduedayfilter, setToduedayfilter] = useState<any>(undefined);
  const [SearchIn, setSearchIn] = useState<any>(0);
  const [date, setDate] = useState<any>([
    moment.utc().format('YYYY-MM-DD'),
    moment.utc().add(1, 'month').format('YYYY-MM-DD'),
  ]);
  const [selectedActualAcct, setSelectedActualAcct] = useState<any>(0);
  const [EPSAutoPay, setEPSAutoPay] = useState<any>(0);
  const [LastPromiseStatus, setLastPromiseStatus] = useState<any>(undefined);

  useEffect(() => {
    fetchData();
  }, [
    fromduedayfilter,
    toduedayfilter,
    SearchIn,
    date,
    EPSAutoPay,
    selectedActualAcct,
  ]);

  const fetchData = useCallback(async () => {
    const payload = {
      fromduedayfilter,
      toduedayfilter,
      SearchIn,
      EPSAutoPay,
      selectedActualAcct,
      dateFrom: date[0],
      dateTo: date[1],
    };
    console.log(payload);
    setData([]);
  }, [
    fromduedayfilter,
    toduedayfilter,
    SearchIn,
    date,
    EPSAutoPay,
    selectedActualAcct,
  ]);

  // const columns: GridColDef[] = [
  //     {
  //         flex: 0.30,
  //         minWidth: 150,
  //         headerName: 'Title',
  //         field: 'title',
  //         filterable: false,
  //         sortable: false,
  //         renderCell: ({ row }: any) => {
  //             return (
  //                 <Typography noWrap sx={{ ...ROW_PROPS }}>
  //                     {row?.title}
  //                 </Typography>
  //             )
  //         }
  //     },
  //     {
  //         flex: 0.40,
  //         minWidth: 220,
  //         headerName: 'Description',
  //         field: 'description',
  //         filterable: false,
  //         sortable: false,
  //         renderCell: ({ row }: any) => {
  //             return (
  //                 <Typography noWrap sx={{ ...ROW_PROPS }}>
  //                     {row?.description}
  //                 </Typography>
  //             )
  //         }
  //     },
  //     {
  //         flex: 0.20,
  //         minWidth: 150,
  //         headerName: 'Status',
  //         field: 'status',
  //         renderCell: ({ row }: any) => {
  //             return (
  //                 <Chip
  //                     label={row.status == 0 ? 'IN-ACTIVE' : 'ACTIVE'}
  //                     color={row.status == 0 ? 'error' : 'success'}
  //                     size="small"
  //                 />
  //             )
  //         }
  //     },
  //     {
  //         flex: 0.10,
  //         minWidth: 140,
  //         headerName: 'Action',
  //         field: '',
  //         renderCell: ({ row }: any) => {
  //             return (
  //                 <RowOptions row={row} />
  //             )
  //         }
  //     }
  // ];

  // const RowOptions = (props: any) => {
  //     const { row } = props;
  //     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  //     const rowOptionsOpen = Boolean(anchorEl)

  //     return (
  //         <>
  //             <IconButton
  //                 size='small'
  //                 onClick={(event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
  //             >
  //                 <IconDotsVertical />
  //             </IconButton>
  //             <Menu
  //                 keepMounted
  //                 anchorEl={anchorEl}
  //                 open={rowOptionsOpen}
  //                 onClose={() => setAnchorEl(null)}
  //                 anchorOrigin={{
  //                     vertical: 'bottom',
  //                     horizontal: 'right'
  //                 }}
  //                 transformOrigin={{
  //                     vertical: 'top',
  //                     horizontal: 'right'
  //                 }}
  //                 PaperProps={{ style: { minWidth: '8rem' } }}
  //             >
  //                 <MenuItem onClick={() => { setAnchorEl(null); handleEdit(row) }} sx={{ '& svg': { mr: 2 } }}>
  //                     <IconEdit fontSize={20} />
  //                     Edit
  //                 </MenuItem>
  //                 <MenuItem onClick={() => { setAnchorEl(null); handleTrash(row) }} sx={{ '& svg': { mr: 2 } }}>
  //                     <IconTrash fontSize={20} />
  //                     Delete
  //                 </MenuItem>
  //             </Menu>
  //         </>
  //     )
  // }

  // const handleEdit = (row: any) => { }

  // const handleTrash = (row: any) => { }

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <CustomTextField
              type={'number'}
              value={fromduedayfilter}
              label="Enter from past due day"
              onChange={(event: any) =>
                setFromduedayfilter(event?.target?.value)
              }
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <CustomTextField
              type={'number'}
              value={toduedayfilter}
              label="Enter to past due day"
              onChange={(event: any) => setToduedayfilter(event?.target?.value)}
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-select" size="small">
              Search In
            </InputLabel>
            <Select
              id="select-type"
              label="Search In"
              labelId="type-select"
              value={SearchIn}
              size="small"
              onChange={(event: any) => setSearchIn(event?.target?.value)}
              inputProps={{ placeholder: 'Search In' }}
            >
              <MenuItem value={0}>ALL</MenuItem>
              <MenuItem value={1}>CurrentDueDate</MenuItem>
              <MenuItem value={2}>AcctLastPaidDate</MenuItem>
              <MenuItem value={3}>NextDueDate</MenuItem>
              <MenuItem value={4}>LastPromiseDueDate</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <FormControl size="small" fullWidth>
              <CustomPickerRange onChange={setDate} dates={date} />
            </FormControl>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-account" size="small">
              Account Status
            </InputLabel>
            <Select
              id="select-account"
              label="Account Status"
              labelId="type-account"
              value={selectedActualAcct}
              size="small"
              onChange={(event: any) =>
                setSelectedActualAcct(event?.target?.value)
              }
              inputProps={{ placeholder: 'Account Status' }}
            >
              <MenuItem value={0}>ALL</MenuItem>
              <MenuItem value={1}>Current</MenuItem>
              <MenuItem value={2}>Past Due</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-promise" size="small">
              Last Promise Status
            </InputLabel>
            <Select
              id="select-promise"
              label="Last Promise Status"
              labelId="type-promise"
              value={LastPromiseStatus}
              size="small"
              onChange={(event: any) =>
                setLastPromiseStatus(event?.target?.value)
              }
              inputProps={{ placeholder: 'Last Promise Status' }}
            >
              <MenuItem value={1}>Broken</MenuItem>
              <MenuItem value={2}>Kept</MenuItem>
              <MenuItem value={3}>Open</MenuItem>
              <MenuItem value={4}>Blank</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-autopay" size="small">
              EPS AutoPay
            </InputLabel>
            <Select
              id="select-autopay"
              label="EPS AutoPay"
              labelId="type-autopay"
              value={EPSAutoPay}
              size="small"
              onChange={(event: any) => setEPSAutoPay(event?.target?.value)}
              inputProps={{ placeholder: 'EPS AutoPay' }}
            >
              <MenuItem value={0}>ALL</MenuItem>
              <MenuItem value={1}>TRUE</MenuItem>
              <MenuItem value={2}>FALSE</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          sm={3}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <IconButton aria-label="refresh" size="small">
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      {/* <CustomDataGrid
                sx={{ mt: 5 }}
                autoHeight
                rowHeight={38}
                rows={data}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
            /> */}
    </>
  );
};

export default IvrList;
