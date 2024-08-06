import { useCallback, useEffect, useState } from 'react';
import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconRefresh, IconX } from '@tabler/icons-react';
import moment from 'moment';
import debounce from 'lodash/debounce';

import axios from '../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../utils/constant';
import CustomDataGrid from '../custom/CustomDataGrid';
import CustomPickerRange from '../custom/CustomPickerRange';
import CustomTextField from '../custom/CustomTextField';

// import ProductForm from '../../forms/features/ProductForm';

const PhoneList = () => {
  const [data, setData] = useState<any>([]);
  const [extensionList, setExtensionList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [callFrom, setCallFrom] = useState<any>('');
  const [callTo, setCallTo] = useState<any>('');
  const [date, setDate] = useState<any>([
    moment().startOf('day').format('MM/DD/YYYY HH:mm:ss'),
    moment().endOf('day').format('MM/DD/YYYY HH:mm:ss'),
  ]);
  const [status, setStatus] = useState<any>('ALL');

  useEffect(() => {
    fetchExtensionList();
  }, []);

  useEffect(() => {
    const delayedDispatch = debounce(() => {
      fetchData();
    }, 1000); // Adjust the debounce delay as needed (e.g., 1000 milliseconds)

    // Call the delayedDispatch function whenever any of the dependencies change
    delayedDispatch();

    // Clean up the debounce function when the component unmounts
    return () => {
      delayedDispatch.cancel();
    };
  }, [callFrom, callTo, date, status]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        call_from: callFrom || '',
        call_to: callTo || '',
        status: status && status != 'ALL' ? status : '',
        start_time: moment(date[0]).format('MM/DD/YYYY HH:mm:ss')?.toString(),
        end_time: moment(date[1])
          .endOf('day')
          .format('MM/DD/YYYY HH:mm:ss')
          ?.toString(),
      };
      const response = await axios.post(`call-features/cdr-all`, filters);
      const resp = response.status === 201 ? response.data.data : [];
      setData(resp);
      setLoading(false);
    } catch (e) {
      setData([]);
      setLoading(false);
    }
  }, [callFrom, callTo, date, status]);

  const fetchExtensionList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`call-features/extension-all`);
      const resp = response.status === 200 ? response.data.data : [];
      setExtensionList(resp);
      setLoading(false);
    } catch (e) {
      setExtensionList([]);
      setLoading(false);
    }
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 230,
      headerName: 'Time',
      field: 'time',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.time}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 230,
      headerName: 'Call From',
      field: 'call_from',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.call_from}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 230,
      headerName: 'Call To',
      field: 'call_to',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.call_to}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      headerName: 'Call Duration',
      field: 'duration',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.duration} sec
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      headerName: 'Ring Duration',
      field: 'ring_duration',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.ring_duration} sec
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Call Type',
      field: 'call_type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.call_type}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 250,
      headerName: 'Reason',
      field: 'reason',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.reason}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: 'Dst Trunk',
      field: 'dst_trunk',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.dst_trunk}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      headerName: 'DOD Number',
      field: 'dod_number',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.dod_number}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'Status',
      field: 'disposition',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row?.disposition}
            color={
              (STATUS_COLOR[
                row?.disposition as keyof typeof STATUS_COLOR
              ] as any) || 'info'
            }
            size="small"
          />
        );
      },
    },
    // {
    //   flex: 0.1,
    //   minWidth: 140,
    //   headerName: 'Action',
    //   field: '',
    //   renderCell: ({ row }: any) => {
    //     return <RowOptions row={row} />;
    //   },
    // },
  ];

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item md={3} xs={12}>
          <FormControl size="small" fullWidth>
            <CustomPickerRange
              onChange={setDate}
              dates={date}
              disableClear={true}
            />
          </FormControl>
        </Grid>
        <Grid item md={3} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-select">Call From</InputLabel>
            <Select
              id="select-type"
              label="Call From"
              labelId="type-select"
              value={callFrom}
              onChange={(event: any) => setCallFrom(event?.target?.value)}
              inputProps={{ placeholder: 'Status' }}
            >
              {extensionList?.map((extension: any, index: number) => {
                return (
                  <MenuItem key={index} value={extension?.number}>
                    {extension?.caller_id_name}( {extension?.number} )
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3} xs={12}>
          <FormControl fullWidth>
            <CustomTextField
              value={callTo}
              label="Call To"
              onChange={(event: any) => setCallTo(event?.target?.value)}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="refresh"
                      size="small"
                      onClick={() => setCallTo('')}
                    >
                      <IconX />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item md={2.5} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-select">Status</InputLabel>
            <Select
              id="select-type"
              label="Status"
              labelId="type-select"
              value={status}
              onChange={(event: any) => setStatus(event?.target?.value)}
              inputProps={{ placeholder: 'Status' }}
            >
              <MenuItem value={'ALL'}>ALL</MenuItem>
              <MenuItem value={'ANSWERED'}>ANSWERED</MenuItem>
              <MenuItem value={'NO ANSWER'}>NO ANSWER</MenuItem>
              <MenuItem value={'BUSY'}>BUSY</MenuItem>
              <MenuItem value={'FAILED'}>FAILED</MenuItem>
              <MenuItem value={'VOICEMAIL'}>VOICEMAIL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          md={0.5}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <IconButton aria-label="refresh" size="small" onClick={fetchData}>
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>

      <CustomDataGrid
        sx={{ mt: 5 }}
        autoHeight
        rowHeight={38}
        rows={data || []}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </>
  );
};

export default PhoneList;
