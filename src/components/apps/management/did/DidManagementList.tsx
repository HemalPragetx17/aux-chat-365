import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDownload,
  IconEdit,
  IconFileImport,
  IconPlus,
  IconRefresh,
  IconShoppingBag,
  IconX,
} from '@tabler/icons-react';
import csvDownload from 'json-to-csv-export';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import axios from '../../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import DidAddForm from '../../../forms/settings/DidAddForm';
import DidEditForm from '../../../forms/settings/DidEditForm';

import DidImportDialog from './DidImportDialog';

const DidManagementList = () => {
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
  const [userId, setUserId] = useState<any>('');
  const [userList, setUserList] = useState<any>([]);
  const [didImportFlag, setDidImportFlag] = useState<boolean>(false);
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
    setLocationList([]);
    setDepartmentList([]);
    setData([]);
    setFilterData([]);

    if (Boolean(userId)) {
      fetchDid();
      fetchDepartment();
      fetchLocation();
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

  const fetchLocation = useCallback(async () => {
    const response = await axios.get(
      `/did-location/user/${userId}?status=ACTIVE,INACTIVE`,
    );
    let resp = response.status === 200 ? response.data.data : [];
    resp = resp.map((obj: any) => {
      return {
        label: obj.title,
        value: obj.id,
      };
    });
    setLocationList([...resp]);
  }, [userId]);

  const fetchDid = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    const response = await axios.get(
      `/did/user/${userId}?status=ACTIVE,INACTIVE`,
    );
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
      const resposne = await axios.get(`/did/${row?.id}`);
      if (resposne.status === 200) {
        setCurrentData(resposne?.data.data);
        setEditForm(true);
      }
      setLoading(false);
    },
    [userId],
  );

  const handleDownload = () => {
    const formatData = data.map((did: any) => {
      const { title, phoneNumber } = did;
      return {
        TITLE: title,
        'PHONE NUMBER': phoneNumber,
      };
    });
    const dataToConvert = {
      data: formatData,
      filename: `did_list_${moment().format('MM-DD-YYYY, HH-mm-ss')}`,
      delimiter: ',',
      headers: ['TITLE', 'PHONE NUMBER'],
    };
    csvDownload(dataToConvert);
  };

  const onRefresh = () => {
    setEditForm(false);
    setDidImportFlag(false);
    fetchDid();
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
            <Tooltip title={'Add DID'} arrow>
              <span>
                <IconButton
                  aria-label="refresh"
                  size="small"
                  sx={{ mr: 2 }}
                  onClick={handleAdd}
                  disabled={!Boolean(userId)}
                >
                  <IconPlus />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={'Order New DID'} arrow>
              <span>
                <IconButton
                  aria-label="order"
                  size="small"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    setAddForm(true);
                  }}
                  disabled={!Boolean(userId)}
                >
                  <IconShoppingBag />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={'Import DID'} arrow>
              <span>
                <IconButton
                  aria-label="import"
                  size="small"
                  sx={{ mr: 2 }}
                  disabled={!Boolean(userId)}
                  onClick={() => setDidImportFlag(true)}
                >
                  <IconFileImport />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={'Download DID'} arrow>
              <span>
                <IconButton
                  aria-label="download"
                  size="small"
                  sx={{ mr: 2 }}
                  onClick={handleDownload}
                  disabled={data.length === 0 || !Boolean(userId)}
                >
                  <IconDownload />
                </IconButton>
              </span>
            </Tooltip>
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
      <DidAddForm
        uid={userId}
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
      <DidImportDialog
        uid={userId}
        open={didImportFlag}
        toggle={() => setDidImportFlag(false)}
        success={onRefresh}
      />
    </Grid>
  );
};

export default DidManagementList;
