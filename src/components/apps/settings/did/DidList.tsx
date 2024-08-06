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
import {
  IconDotsVertical,
  IconEdit,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../../../hooks/useAuth';
import { fetchDids } from '../../../../store/apps/did/DidSlice';
import { dispatch } from '../../../../store/Store';
import axios from '../../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import DidAddForm from '../../../forms/settings/DidAddForm';
import DidEditForm from '../../../forms/settings/DidEditForm';

const DidList = () => {
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<any>('ALL');
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [locationList, setLocationList] = useState<any>([]);
  const [userId, setUserId] = useState<any>(null);
  let timer: any;
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    fetchDepartment();
    fetchLocation();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    const response = await axios.get(
      `/did/user/${user?.uid}?status=ACTIVE,INACTIVE`,
    );
    const users = response.status === 200 ? response.data.data : [];
    setData(users);
    setFilterData(users);
    setLoading(false);
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

  const fetchLocation = useCallback(async () => {
    const response = await axios.get(`/did-location?status=ACTIVE,INACTIVE`);
    let resp = response.status === 200 ? response.data.data : [];
    resp = resp.map((obj: any) => {
      return {
        label: obj.title,
        value: obj.id,
      };
    });
    setLocationList([...resp]);
  }, []);

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
          obj.phoneNumber.toLowerCase().indexOf(search.trim().toLowerCase()) >
            -1,
      );
    }
    if (status !== 'ALL') {
      filtered = filtered.filter((obj: any) => obj.status === status);
    }
    setFilterData(filtered);
    setLoading(false);
  }, [search, status]);

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
          <Tooltip title={row?.title} placement="top">
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Phone Number',
      field: 'phoneNumber',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.countryCode}
            {row?.phoneNumber}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Department',
      field: 'department',
      renderCell: ({ row }: any) => {
        return (
          <>
            {row.Department && (
              <Chip label={row.Department?.name} color="primary" size="small" />
            )}
          </>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Default Number',
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
      headerName: 'Did Provider',
      field: 'didProvider',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.didProvider}
          </Typography>
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
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions row={row} />;
      },
    },
  ];

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
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEdit fontSize={20} />
            Edit
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleSetDefault = useCallback(async (row: any) => {
    setLoading(true);
    const { title, phoneNumber, countryCode, status, id, departmentId } = row;
    const formData = {
      title,
      phoneNumber,
      countryCode,
      status,
      uid: user?.uid,
      isDefault: true,
      departmentId: departmentId || null,
    };
    const response = await axios.patch(`/did/${id}`, formData);
    if (response.status === 200) {
      fetchData();
    }
  }, []);

  const handleAdd = useCallback(async () => {
    if (user?.uid) {
      setUserId(user?.uid);
      setCurrentData(null);
      setEditForm(true);
    }
  }, [user]);

  const handleEdit = useCallback(
    async (row: any) => {
      setLoading(true);
      const resposne = await axios.get(`/did/${row?.id}`);
      if (resposne.status === 200 && user?.uid) {
        setUserId(user?.uid);
        setCurrentData(resposne?.data.data);
        setEditForm(true);
      }
      setLoading(false);
    },
    [user],
  );

  const onRefresh = () => {
    setEditForm(false);
    setUserId(null);
    fetchData();
    dispatch(fetchDids('ACTIVE', user?.uid as any));
  };

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
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
                <MenuItem value={'INACTIVE'}>In-Active</MenuItem>
                <MenuItem value={'ACTIVE'}>Active</MenuItem>
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
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => {
                setCurrentData(null);
                setAddForm(true);
              }}
            >
              Order New DID
            </Button>
            <IconButton aria-label="refresh" size="small" onClick={fetchData}>
              <IconRefresh />
            </IconButton>
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
      <DidAddForm
        uid={user?.uid as any}
        open={addForm}
        toggle={() => setAddForm(false)}
      />
      <DidEditForm
        open={editForm}
        toggle={() => setEditForm(false)}
        currentData={currentData}
        addFlag={!Boolean(currentData)}
        success={onRefresh}
        departmentList={departmentList}
        locationList={locationList}
        uid={userId}
      />
    </Grid>
  );
};

export default DidList;
