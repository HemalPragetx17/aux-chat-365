import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconBell,
  IconCopy,
  IconDotsVertical,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { debounce } from 'lodash';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import axios from '../../../../utils/axios';
import { PAYMENT_STATUS, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';

const TransactionHistory = () => {
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [payload, setPayload] = useState<any>({ page: 0, pageSize: 10 });

  useEffect(() => {
    fetchData();
  }, [payload]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/payment/find-payment-links`, payload);
      if (response.status === 200) {
        const { data, total } = response?.data;
        setData(data);
        setTotal(total);
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
    delete _payload['status'];
    if (status !== 'ALL') {
      _payload.status = status;
    }
    setPayload(_payload);
  }, [status]);

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
      minWidth: 120,
      headerName: 'Type',
      field: 'type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row.type == '0' ? '-' : row.type == '1' ? 'Sale' : 'Auth Only'}
          </Typography>
        );
      },
    },
    {
      minWidth: 240,
      headerName: 'PO/Invoice/ Trans No.',
      field: 'po',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.ref) ? row.ref : '-'}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: 'Customer Name',
      field: 'customername',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>{row.customername}</Typography>
        );
      },
    },
    {
      minWidth: 120,
      headerName: 'Amount',
      field: 'amount',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.amount == '' || row.amount == null
              ? '-'
              : '$ ' + parseFloat(row.amount).toFixed(2)}
          </Typography>
        );
      },
    },
    {
      minWidth: 120,
      headerName: 'Total',
      field: 'total',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const value =
          parseFloat(row.amount) +
          parseFloat(row.convenienceFee) +
          parseFloat(row.tip_amount);
        return (
          <Typography sx={{ ...ROW_PROPS }}>$ {value.toFixed(2)}</Typography>
        );
      },
    },
    {
      minWidth: 160,
      headerName: 'Status',
      field: 'status',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const index: keyof typeof PAYMENT_STATUS = row.status;
        const { name, color } = PAYMENT_STATUS[index];
        return <Chip label={name} color={color as any} size="small" />;
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
    {
      minWidth: 200,
      headerName: 'Reminder Date',
      field: 'reminder',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.reminder) && (
              <>
                {toLocalDate(row.reminder).format(`MM-DD-YYYY`)}
                <br />
                {toLocalDate(row.reminder).format(`hh:mm:ss A`)}
              </>
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: 'Payment Date',
      field: 'payment',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.payment) && (
              <>
                {toLocalDate(row.payment).format(`MM-DD-YYYY`)}
                <br />
                {toLocalDate(row.payment).format(`hh:mm:ss A`)}
              </>
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions row={row} />;
      },
    },
  ];

  const RowOptions = (props: any) => {
    const { row } = props;
    const { status } = row;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const rowOptionsOpen = Boolean(anchorEl);

    const handleCopyUrl = (url: string) => {
      navigator.clipboard.writeText(url);
      toast.success('URL Copied Successfully');
    };

    return (
      <>
        <IconButton
          size="small"
          onClick={(event: MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
        >
          <IconDotsVertical />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          {status === 'PENDING' && [
            <MenuItem
              key={1}
              onClick={() => {
                setAnchorEl(null);
                handleCopyUrl(row?.payment_url);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconCopy fontSize={20} />
              Copy Payment URL
            </MenuItem>,
            <MenuItem
              key={2}
              onClick={() => {
                setAnchorEl(null);
                sendReminder(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconBell fontSize={20} />
              Send Reminder
            </MenuItem>,
            <MenuItem
              key={3}
              onClick={() => {
                setAnchorEl(null);
                cancelPayment(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconX fontSize={20} />
              Cancel Request Payment
            </MenuItem>,
          ]}
          {status !== 'PENDING' && status !== 'SUCCESS' && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                deletePaymentLink(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconTrash fontSize={20} />
              Delete Payment Request
            </MenuItem>
          )}
        </Menu>
      </>
    );
  };

  const sendReminder = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/conversation/remind-payment-link/${row?.id}`,
      );
      if (response.status === 200 || response.status === 201) {
        fetchData();
      }
    } catch (error) {
      setLoading(true);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const cancelPayment = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/payment/cancel/${row?.id}`);
      if (response.status === 200 || response.status === 201) {
        fetchData();
      }
    } catch (error) {
      setLoading(true);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const deletePaymentLink = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/payment/${row?.id}`);
      if (response.status === 200 || response.status === 201) {
        fetchData();
      }
    } catch (error) {
      setLoading(true);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

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
              <MenuItem value={'PENDING'}>Pending</MenuItem>
              <MenuItem value={'SUCCESS'}>Received</MenuItem>
              <MenuItem value={'CANCELLED'}>Cancelled</MenuItem>
              <MenuItem value={'FAILED'}>Failed</MenuItem>
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
              setStatus('ALL');
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

export default TransactionHistory;
