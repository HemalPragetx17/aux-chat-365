import {
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconEdit, IconRefresh, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import axios from '../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../utils/constant';
import CustomDataGrid from '../../custom/CustomDataGrid';
import CustomTextField from '../../custom/CustomTextField';
import EmailAddEditForm from '../../forms/settings/EmailAddEditForm';

const EmailManagementList = () => {
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<any>('ALL');
  const [editForm, setEditForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [userId, setUserId] = useState<any>('');
  const [userList, setUserList] = useState<any>([]);
  let timer: any;

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = useCallback(async () => {
    const response = await axios.get('/users?type=ADMIN');
    const users = response.status === 200 ? response.data.data : [];
    setUserList(users);
  }, []);

  useEffect(() => {
    setDepartmentList([]);
    setData([]);
    setFilterData([]);

    if (Boolean(userId)) {
      fetchEmailList();
      fetchDepartment();
    }
  }, [userId]);

  const fetchDepartment = useCallback(async () => {
    const response = await axios.get(
      `/department/user/${userId}?status=ACTIVE,INACTIVE`,
    );
    let department = response.status === 200 ? response.data.data : [];
    department = department.map((dept: any) => {
      return {
        label: dept.name,
        value: dept.id,
      };
    });
    setDepartmentList([...department]);
  }, [userId]);

  const fetchEmailList = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    const response = await axios.get(`/email-nylas/user/${userId}`);
    const users = response.status === 200 ? response.data.data : [];
    setData(users);
    setFilterData(users);
    setLoading(false);
  }, [userId]);

  const handleResetPage = () => {
    setUserId('');
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  useEffect(() => {
    if (data?.length) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        searchData();
      }, 1000);
    }
  }, [search, status]);

  const searchData = useCallback(async () => {
    setLoading(true);
    let filtered: any = [...data];
    if (Boolean(search.trim())) {
      filtered = filtered.filter(
        (obj: any) =>
          obj.title.toLowerCase().indexOf(search.trim().toLowerCase()) > -1,
      );
    }
    if (status !== 'ALL') {
      filtered = filtered.filter((obj: any) => obj.status === status);
    }
    setFilterData(filtered);
    setLoading(false);
  }, [search, status]);

  const handleSetDefault = useCallback(async (row: any) => {
    setLoading(true);
    const { title, status, id, departmentId, email, ownerId } = row;

    const formData = {
      title,
      departmentId: departmentId || null,
      email,
      isDefault: true,
      status,
      ownerId,
    };
    const response = await axios.patch(`/email-nylas/${id}`, formData);
    if (response.status === 200) {
      fetchEmailList();
    }
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Title',
      field: 'title',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.title}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Email',
      field: 'email',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.email}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Department',
      field: 'departmentId',
      renderCell: ({ row }: any) => {
        return (
          <>
            {row.Department && (
              <Chip
                label={row?.Department?.name}
                color="primary"
                size="small"
              />
            )}
          </>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Status',
      field: 'status',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row.status}
            color={STATUS_COLOR[row.status as keyof typeof STATUS_COLOR] as any}
            size="small"
          />
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Default',
      field: 'isDefault',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            <Radio
              checked={Boolean(row.isDefault)}
              onChange={() => handleSetDefault(row)}
              color="primary"
            />
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            <IconButton
              aria-label="edit"
              size="small"
              onClick={() => handleEdit(row)}
            >
              <IconEdit />
            </IconButton>
          </Typography>
        );
      },
    },
  ];

  const handleAdd = useCallback(async () => {
    setCurrentData(null);
    setEditForm(true);
  }, [userId]);

  const handleEdit = useCallback(
    async (row: any) => {
      setLoading(true);
      const resposne = await axios.get(`/email-nylas/${row?.id}`);
      if (resposne.status === 200) {
        setCurrentData(resposne?.data.data);
        setEditForm(true);
      }
      setLoading(false);
    },
    [userId],
  );

  const onRefresh = () => {
    setEditForm(false);
    fetchEmailList();
  };

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Grid container direction="row" alignItems="center" spacing={3}>
          <Grid item sm={3} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="user-select">Select Account</InputLabel>
              <Select
                id="select-user"
                label="Select Account"
                labelId="user-select"
                value={userId}
                onChange={(event: any) => setUserId(event?.target?.value)}
                inputProps={{ placeholder: 'Select Account' }}
              >
                {userList.map((option: any, index: number) => {
                  return (
                    <MenuItem key={index} value={option?.id}>
                      {option?.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
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
                <MenuItem value={'INACTIVE'}>In-Active</MenuItem>
                <MenuItem value={'ACTIVE'}>Active</MenuItem>
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
            <Button
              variant="contained"
              color="primary"
              sx={{
                mr: 2,
                background:
                  'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
              }}
              onClick={handleAdd}
            >
              Add Email
            </Button>
            <Tooltip title={'Refresh'} arrow>
              <IconButton
                aria-label="refresh"
                size="small"
                onClick={handleResetPage}
              >
                <IconRefresh />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <CustomDataGrid
          sx={{ mt: 5 }}
          autoHeight
          rowHeight={38}
          rows={filterData}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
        <EmailAddEditForm
          open={editForm}
          toggle={() => setEditForm(false)}
          currentData={currentData}
          addFlag={!Boolean(currentData)}
          success={onRefresh}
          departmentList={departmentList}
          uid={userId || ''}
        />
      </Grid>
    </Grid>
  );
};

export default EmailManagementList;
