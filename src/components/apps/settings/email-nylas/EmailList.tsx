import {
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Radio,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useNylas } from '@nylas/nylas-react';
import { IconDotsVertical, IconRefresh, IconX } from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../../../hooks/useAuth';
import { dispatch } from '../../../../store/Store';
import { getOperatorList } from '../../../../store/apps/user/UserSlice';
import axios from '../../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import EmailAddEditForm from '../../../forms/settings/EmailAddEditForm';

const EmailList = () => {
  const nylas = useNylas();
  const { user } = useAuth();

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
  const [userId, setUserId] = useState('');
  let timer: any;

  useEffect(() => {
    if (!nylas) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);

  useEffect(() => {
    const userIdString = sessionStorage.getItem('userId');
    if (userIdString) {
      setUserId(userIdString);
    }
  }, []);

  useEffect(() => {
    const param = userId?.length ? `/?userId=${userId}` : '/';
    window.history.replaceState({}, '', param);
  }, [userId]);

  useEffect(() => {
    handleResetPage();
    fetchDepartment();
    dispatch(getOperatorList());
  }, []);

  const fetchDepartment = useCallback(async () => {
    const response = await axios.get(
      `/department/user/${user?.uid}?status=ACTIVE,INACTIVE`,
    );
    let department = response.status === 200 ? response.data.data : [];
    department = department.map((dept: any) => {
      return {
        label: dept.name,
        value: dept.id,
      };
    });
    setDepartmentList([...department]);
  }, []);

  const fetchEmail = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setDepartmentList([]);
    setData([]);
    setFilterData([]);
    setLoading(true);
    const response = await axios.get(`/email-nylas`);
    const emailList = response.status === 200 ? response.data.data : [];
    setData(emailList);
    setFilterData(emailList);
    setLoading(false);
  }, []);

  const handleResetPage = () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setDepartmentList([]);
    setData([]);
    setFilterData([]);
    fetchEmail();
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
          obj.title.toLowerCase().indexOf(search.trim().toLowerCase()) > -1 ||
          obj.email.toLowerCase().indexOf(search.trim().toLowerCase()) > -1,
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
    const { title, status, id, departmentId, email } = row;
    const formData = {
      title,
      departmentId: departmentId || null,
      email,
      isDefault: true,
      status,
      ownerId: user?.id,
    };
    const response = await axios.patch(`/email-nylas/${id}`, formData);
    if (response.status === 200) {
      fetchEmail();
    }
  }, []);

  const RowOptions = (props: any) => {
    const { row } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const rowOptionsOpen = Boolean(anchorEl);

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
            onClick={() => {
              setAnchorEl(null);
              handleEdit(row);
            }}
            dense
            sx={{ '& svg': { mr: 2 } }}
          >
            Edit
          </MenuItem>
          {!Boolean(row?.accessTokenNylas) ? (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleConnectEmail(row?.email);
              }}
              dense
              sx={{ '& svg': { mr: 2 } }}
            >
              Authenticate your Email
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleSyncEmail(row);
              }}
              dense
              sx={{ '& svg': { mr: 2 } }}
            >
              Sync Email with Contacts
            </MenuItem>
          )}
        </Menu>
      </>
    );
  };

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
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
      minWidth: 220,
      headerName: 'Email',
      field: 'email',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.email}>
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.email}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Department',
      field: 'Department',
      filterable: false,
      sortable: false,
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
      flex: 0.15,
      minWidth: 120,
      headerName: 'Status',
      field: 'status',
      filterable: false,
      sortable: false,
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
      flex: 0.15,
      minWidth: 120,
      headerName: 'Default',
      field: 'isDefault',
      filterable: false,
      sortable: false,
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
      flex: 0.15,
      minWidth: 100,
      headerName: 'Action',
      filterable: false,
      sortable: false,
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions row={row} />;
      },
    },
  ];

  const handleConnectEmail = (email: string) => {
    sessionStorage.setItem('userEmail', email);
    nylas.authWithRedirect({
      emailAddress: email,
      successRedirectUrl: '/emailAccounts',
    });
  };

  const handleAdd = useCallback(async () => {
    setCurrentData(null);
    setEditForm(true);
  }, []);

  const handleEdit = useCallback(async (row: any) => {
    setLoading(true);
    const resposne = await axios.get(`/email-nylas/${row?.id}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
      setEditForm(true);
    }
    setLoading(false);
  }, []);

  const handleSyncEmail = async (row: any) => {
    const { accessTokenNylas } = row;
    if (!Boolean(accessTokenNylas)) {
      toast.error('This is not a Nylas Email!');
      return false;
    }
    setLoading(true);
    try {
      const contacts = await axios.post(
        `/email-nylas/nylas/contact/${accessTokenNylas}/sync`,
      );
      if (contacts.data.length) {
        toast.success('Contacts Synched successfully');
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const onRefresh = () => {
    setEditForm(false);
    fetchEmail();
  };

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Grid container direction="row" alignItems="center" spacing={3}>
          <Grid item md={3} xs={12}>
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
          <Grid item md={3} xs={12}>
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
            md={6}
            xs={12}
            justifyContent={{ xs: 'left', sm: 'right' }}
            display={'flex'}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
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
      </Grid>
      <EmailAddEditForm
        open={editForm}
        toggle={() => setEditForm(false)}
        currentData={currentData}
        addFlag={!Boolean(currentData)}
        success={onRefresh}
        departmentList={departmentList}
        uid={user?.uid || ''}
      />
    </Grid>
  );
};

export default EmailList;
