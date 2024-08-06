import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconEye,
  IconLogout,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';

import ActivityDialog from './ActivityDialog';

const UserActivityList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>('');
  const [userLogData, setUserLogData] = useState<any>('');
  const [open, setOpen] = useState<boolean>(false);

  // Row Options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = useCallback(async () => {
    console.log('INIT');
    setData([
      {
        firstname: 'temp',
        lastname: 'user',
        is_logged_in: 0,
        id: 716,
        user_id: '202',
        ip: '172.31.22.169',
        info: null,
        status: 0,
        created_at: '2023-09-01T14:26:23.000000Z',
        updated_at: '2023-09-01T14:26:23.000000Z',
      },
      {
        firstname: 'Viren',
        lastname: 'Kush',
        is_logged_in: 0,
        id: 658,
        user_id: '32',
        ip: '172.31.63.26',
        info: null,
        status: 0,
        created_at: '2023-08-09T14:29:15.000000Z',
        updated_at: '2023-08-09T14:29:15.000000Z',
      },
    ]);
  }, [search]);

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 120,
      headerName: 'User Name',
      field: 'firstname',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.firstname} {row?.lastname}
          </Typography>
        );
      },
    },
    {
      flex: 0.25,
      minWidth: 120,
      headerName: 'Login IP',
      field: 'ip',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.ip}
          </Typography>
        );
      },
    },
    {
      flex: 0.25,
      minWidth: 120,
      headerName: 'Created At',
      field: 'created_at',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {toLocalDate(row?.created_at).format(`MM-DD-YYYY, hh:mm:ss A`)}
          </Typography>
        );
      },
    },
    {
      flex: 0.25,
      minWidth: 120,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
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
              <MenuItem
                onClick={() => handleCheckLog(row)}
                sx={{ '& svg': { mr: 2 } }}
              >
                <IconEye fontSize={20} />
                Check Login Log
              </MenuItem>
              <MenuItem
                onClick={() => handleLogoutUser(row)}
                sx={{ '& svg': { mr: 2 } }}
              >
                <IconLogout fontSize={20} />
                Logout User
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  const handleCheckLog = (row: any) => {
    setAnchorEl(null);
    setLoading(true);
    // Call API Here
    setUserLogData([
      {
        id: 716,
        user_id: '202',
        ip: '172.31.22.169',
        info: null,
        status: 0,
        created_at: '2023-09-01T14:26:23.000000Z',
        updated_at: '2023-09-01T14:26:23.000000Z',
      },
      {
        id: 696,
        user_id: '202',
        ip: '172.31.26.48',
        info: null,
        status: 0,
        created_at: '2023-08-22T09:54:46.000000Z',
        updated_at: '2023-08-22T09:54:46.000000Z',
      },
      {
        id: 692,
        user_id: '202',
        ip: '172.31.63.26',
        info: null,
        status: 0,
        created_at: '2023-08-18T15:15:28.000000Z',
        updated_at: '2023-08-18T15:15:28.000000Z',
      },
      {
        id: 690,
        user_id: '202',
        ip: '172.31.42.244',
        info: null,
        status: 0,
        created_at: '2023-08-17T12:27:59.000000Z',
        updated_at: '2023-08-17T12:27:59.000000Z',
      },
      {
        id: 685,
        user_id: '202',
        ip: '172.31.63.26',
        info: null,
        status: 0,
        created_at: '2023-08-16T07:58:50.000000Z',
        updated_at: '2023-08-16T07:58:50.000000Z',
      },
    ]);
    setLoading(false);
    setOpen(true);
  };

  const handleLogoutUser = (row: any) => {
    setAnchorEl(null);
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
        <Grid
          item
          sm={9}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <IconButton aria-label="refresh" size="small">
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      <CustomDataGrid
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
      />
      <ActivityDialog
        open={open}
        data={userLogData}
        toggle={() => setOpen(false)}
      />
    </>
  );
};

export default UserActivityList;
