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
import { useCallback, useEffect, useState } from 'react';
import { IconRefresh, IconX } from '@tabler/icons-react';
import { debounce } from 'lodash';

import axios from '../../../../utils/axios';
import { ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';

const STATUS_OPTIONS: { [key: string]: string } = {
  '0': 'Pending',
  '1': 'Approved',
  '2': 'Failed',
  '3': 'Captured',
  '4': 'Settled',
  '5': 'Returned',
  INITIATED: 'Initiated',
  '9': 'Declined',
};
const VtTransactionHistory = () => {
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<any>('');
  const [paymentType, setPaymentType] = useState<any>('ALL');
  const [payload, setPayload] = useState<any>({ page: 0, pageSize: 10 });

  useEffect(() => {
    fetchData();
  }, [payload]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/payment/find-all-transaction`,
        payload,
      );
      if (response.status === 200) {
        const { data, count } = response?.data;
        setData(data);
        setTotal(count);
      }
      setLoading(false);
    } catch (e) {
      setData([]);
      setTotal(0);
      setLoading(false);
    }
  }, [payload]);

  useEffect(() => {
    const _payload = { ...payload };
    delete _payload['type'];
    if (paymentType !== 'ALL') {
      _payload.type = paymentType;
    }
    setPayload(_payload);
  }, [paymentType]);

  useEffect(() => {
    if (Boolean(search)) {
      const delayedDispatch = debounce(() => {
        setPayload({ ...payload, searchText: search });
      }, 1000);
      delayedDispatch();
      return () => {
        delayedDispatch.cancel();
      };
    } else {
      setPayload({ ...payload, searchText: '' });
    }
  }, [search]);

  const columns: GridColDef[] = [
    {
      minWidth: 200,
      headerName: 'Created By',
      field: 'createdBy',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.createdBy) ? row.createdBy : '-'}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'From',
      field: 'from_number',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return <Typography sx={{ ...ROW_PROPS }}>{row.from_number}</Typography>;
      },
    },
    {
      minWidth: 140,
      headerName: 'To',
      field: 'to_number',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return <Typography sx={{ ...ROW_PROPS }}>{row.to_number}</Typography>;
      },
    },
    {
      minWidth: 200,
      headerName: 'Customer Name',
      field: 'BillingCustomerName',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.BillingCustomerName}
          </Typography>
        );
      },
    },
    {
      minWidth: 120,
      headerName: 'Amount',
      field: 'Amount',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.Amount == '' || row.Amount == null ? '-' : '$ ' + row.Amount}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: 'Auth Code',
      field: 'AuthCode',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return <Typography sx={{ ...ROW_PROPS }}>{row.AuthCode}</Typography>;
      },
    },
    {
      minWidth: 160,
      headerName: 'Status',
      field: 'status',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={STATUS_OPTIONS[row?.Status]}
            color={
              ((Number(row?.Status) === 0 || Number(row?.Status) === 2) &&
                'warning') ||
              'success'
            }
            size="small"
          />
        );
      },
    },
    {
      minWidth: 180,
      headerName: 'Payment Type',
      field: 'RequestOrigin',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS, textTransform: 'uppercase' }}>
            {row.RequestOrigin}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'Send Date',
      field: 'createdAt',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.createdAt).format(`MM-DD-YYYY`)}
            <br />
            {toLocalDate(row.createdAt).format(`hh:mm:ss A`)}
          </Typography>
        );
      },
    },
  ];

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <CustomTextField
              value={search}
              label="Search"
              onChange={(event: any) => setSearch(event?.target?.value)}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="refresh"
                      size="small"
                      onClick={() => setSearch('')}
                    >
                      <IconX />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-select">PaymentType</InputLabel>
            <Select
              id="select-type"
              label="PaymentType"
              labelId="type-select"
              value={paymentType}
              onChange={(event: any) => setPaymentType(event?.target?.value)}
              inputProps={{ placeholder: 'PaymentType' }}
            >
              <MenuItem value={'ALL'}>ALL</MenuItem>
              <MenuItem value={'PG-SMS'}>PG-SMS</MenuItem>
              <MenuItem value={'VT'}>VT</MenuItem>
              <MenuItem value={'AUX365-IPOS'}>AUX365-IPOS</MenuItem>
              <MenuItem value={'AUX365-CASH'}>AUX365-CASH</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          sm={6}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <IconButton
            aria-label="refresh"
            size="small"
            onClick={() => {
              setPaymentType('ALL');
              setSearch('');
              setPayload({ page: 0, pageSize: 10 });
            }}
          >
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      <CustomDataGrid
        sx={{ mt: 5 }}
        autoHeight
        rows={data}
        rowCount={total}
        paginationMode="server"
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={{ page: payload.page, pageSize: payload.pageSize }}
        onPaginationModelChange={(event: any) => {
          setPayload({ ...payload, ...event });
        }}
      />
    </>
  );
};

export default VtTransactionHistory;
