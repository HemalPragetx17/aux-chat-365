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
  Select,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconLogin,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import swal from 'sweetalert';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { ROLE_COLOR, ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import PbxConfigForm from '../../../forms/management/PbxConfigForm';
import UserForm from '../../../forms/settings/UserForm';
import UserIposDetailsForm from '../../../forms/settings/UserIposDetailsForm';
import UserMenuForm from '../../../forms/settings/UserMenuForm';
import UserPasswordForm from '../../../forms/settings/UserPasswordForm';

const UserList = () => {
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [userForm, setUserForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [userPasswordForm, setUserPasswordForm] = useState<boolean>(false);
  const [userMenuForm, setUserMenuForm] = useState<boolean>(false);
  const [userActiveId, setUserActiveId] = useState<any>([]);
  const [userMenuOption, setUserMenuOption] = useState<any>([]);
  const [openPbxConfigForm, setOpenPbxConfigForm] = useState<boolean>(false);
  const [iPosForm, setIPosForm] = useState<any>(false);
  let timer: any;
  const auth = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    const response = await axios.get('/users?type=OPERATOR');
    const users = response.status === 200 ? response.data.data : [];
    setData(users);
    setFilterData(users);
    setLoading(false);
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
          obj.name.toLowerCase().indexOf(search.trim().toLowerCase()) > -1,
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
      minWidth: 200,
      headerName: 'Name',
      field: 'name',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'Email',
      field: 'email',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS, textTransform: 'none' }}>
            {row?.email}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 200,
      headerName: 'Phone',
      field: 'phone',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS, textTransform: 'none' }}>
            {row?.phone}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Role',
      field: 'role_id',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row.Roles?.role}
            color={
              ROLE_COLOR[row.Roles?.role as keyof typeof ROLE_COLOR] as any
            }
            size="small"
          />
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Status',
      field: 'status',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row.status === 'Active' ? 'ACTIVE' : 'IN-ACTIVE'}
            color={row.status === 'Active' ? 'success' : 'error'}
            size="small"
          />
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return (
          <>
            <IconButton
              size="small"
              onClick={(event: MouseEvent<HTMLElement>) => handleLoginUser(row)}
              title="Login To Account"
            >
              <IconLogin fontSize={20} />
            </IconButton>

            <RowOptions row={row} />
          </>
        );
      },
    },
  ];

  const RowOptions = (props: any) => {
    const { row } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const { Profile } = row;
    const twoFA = Profile?.twoFA;

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
            Edit
          </MenuItem>
          {auth?.user?.role?.roleId !== 3 && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleEditPbxConfig(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              {row?.Profile?.pbxConfig?.extensionId
                ? 'Edit Pbx Extension'
                : 'Add Pbx Extension'}
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleEditIposDetail(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            IPOS Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleTwoFactorChange(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            {twoFA ? <>Disable 2FA</> : <>Enable 2FA</>}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleChangeMenu(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Change Menu
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleResetPassword(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Reset Password
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleDelete(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleEdit = async (row: any) => {
    const resposne = await axios.get(`/users/${row?.id}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
      setUserForm(true);
    }
  };

  const handleChangeMenu = async (row: any) => {
    setLoading(true);
    const response = await axios.get(`/users/menu/${row?.id}`);
    const active =
      response.status === 200 ? response.data.map((menu: any) => menu.id) : [];
    setUserActiveId(active);

    const _response = await axios.get(`/menu-item?role=${row?.Roles?.role}`);
    const menu = _response.status === 200 ? _response.data : [];
    const structured = menu.reduce((acc: any[], data: any) => {
      if (data.parentId === null) {
        const children = menu.filter(
          (child: any) => child.parentId === data.id,
        );
        acc.push({ ...data, children });
      }
      return acc;
    }, []);

    setLoading(false);
    setUserMenuOption(structured);
    setCurrentData(row);
    setUserMenuForm(true);
  };

  const handleResetPassword = (row: any) => {
    setCurrentData(row);
    setUserPasswordForm(true);
  };

  const handleDelete = async (row: any) => {
    const willDelete = await swal({
      title: 'Are you sure?',
      closeOnClickOutside: false,
      closeOnEsc: false,
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'MuiButton-root',
          closeModal: true,
        },
      },
      dangerMode: true,
    });
    if (willDelete) {
      await axios.delete(`/users/${row?.id}`);
      fetchData();
    }
  };

  const handleAddUser = () => {
    setCurrentData(null);
    setUserForm(true);
  };

  const handleTwoFactorChange = async (row: any) => {
    setLoading(true);
    const { Profile } = row;
    const twoFA = Profile?.twoFA;
    const response = await axios.patch(`/users/change-auth/${row.id}`, {
      twoFA: !twoFA,
    });
    if (response.status === 200) {
      toast.success(`2-Factor updated successfully.`);
      fetchData();
    } else {
      toast.error('API Error! Please try again.');
    }
  };

  const handleLoginUser = async (row: any) => {
    setLoading(true);
    auth.loginToAccount(row.email, handleLoginError);
  };

  const handleLoginError = (error: any) => {
    toast.error(error?.message || 'Something wrong happened.');
    setLoading(false);
  };

  const onRefresh = () => {
    setUserForm(false);
    setIPosForm(false);
    setCurrentData(null);
    toast.success(`Account updated successfully.`);
    fetchData();
  };

  const handleEditPbxConfig = async (row: any) => {
    setCurrentData(row);
    setOpenPbxConfigForm(true);
  };

  const handleEditIposDetail = async (row: any) => {
    setCurrentData(row);
    setIPosForm(true);
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
              <MenuItem value={'Inactive'}>In-Active</MenuItem>
              <MenuItem value={'Active'}>Active</MenuItem>
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
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleAddUser}>
            Add New User
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
      <UserForm
        open={userForm}
        currentData={currentData}
        addFlag={!Boolean(currentData)}
        toggle={() => setUserForm(false)}
        success={onRefresh}
      />
      <UserPasswordForm
        open={userPasswordForm}
        currentData={currentData}
        toggle={() => setUserPasswordForm(false)}
      />
      <UserMenuForm
        open={userMenuForm}
        currentData={currentData}
        toggle={() => setUserMenuForm(false)}
        selectedId={userActiveId}
        menuData={userMenuOption}
      />
      <PbxConfigForm
        open={openPbxConfigForm}
        currentData={currentData}
        addFlag={!currentData?.Profile?.pbxConfig?.extensionId ? true : false}
        toggle={() => setOpenPbxConfigForm(false)}
        success={onRefresh}
      />
      <UserIposDetailsForm
        open={iPosForm}
        currentData={currentData}
        toggle={() => setIPosForm(false)}
        success={onRefresh}
        operatorFlag={true}
      />
    </>
  );
};

export default UserList;
