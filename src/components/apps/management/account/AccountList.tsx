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
  Paper,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconLogin,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import moment from 'moment';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import swal from 'sweetalert';

import Link from 'next/link';
import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import AccountForm from '../../../forms/management/AccountForm';
import AccountPlanDetails from '../../../forms/management/AccountPlanDetails';
import AccountPlanForm from '../../../forms/management/AccountPlanForm';
import AccountSettingsForm from '../../../forms/management/AccountSettingsForm';
import PbxConfigForm from '../../../forms/management/PbxConfigForm';
import PbxRegForm from '../../../forms/management/PbxRegForm';
import UserIposDetailsForm from '../../../forms/settings/UserIposDetailsForm';
import UserMenuForm from '../../../forms/settings/UserMenuForm';
import UserPasswordForm from '../../../forms/settings/UserPasswordForm';

const PlanDetails = (props: any) => {
  const { planDetails, markPlanPaid } = props;
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography>
        Purchased: {moment(planDetails?.createdAt).format(`MM-DD-YYYY`)}
      </Typography>
      <Typography>
        Expires: {moment(planDetails?.expiredAt).format(`MM-DD-YYYY`)}
      </Typography>
      <Chip
        label={
          planDetails?.status === 'PENDING'
            ? 'PENDING PAYMENT'
            : planDetails?.status === 'EXPIRED'
            ? 'EXPIRED'
            : planDetails?.status === 'ACTIVE'
            ? 'ACTIVE'
            : 'UPCOMING'
        }
        color={
          planDetails?.status === 'PENDING'
            ? 'warning'
            : planDetails?.status === 'EXPIRED'
            ? 'error'
            : planDetails?.status === 'ACTIVE'
            ? 'success'
            : 'info'
        }
        size="small"
        sx={{ mt: 1 }}
      />
      <br />
      {planDetails?.status === 'PENDING' && (
        <Typography
          variant="body1"
          onClick={async (event: any) => {
            event.preventDefault();
            await markPlanPaid(planDetails.id);
          }}
          component={Link}
          href={''}
          sx={{
            color: '#5858ff',
          }}
        >
          Mark Plan as Paid
        </Typography>
      )}
    </Paper>
  );
};

const AccountList = () => {
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openPbxConfigForm, setOpenPbxConfigForm] = useState<boolean>(false);
  const [openPbxRegForm, setOpenPbxRegForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [passwordForm, setPasswordForm] = useState<boolean>(false);
  const [userMenuForm, setUserMenuForm] = useState<boolean>(false);
  const [userActiveId, setUserActiveId] = useState<any>([]);
  const [userMenuOption, setUserMenuOption] = useState<any>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [planData, setPlanData] = useState<any>(null);
  const [iPosForm, setIPosForm] = useState<any>(false);
  const [planDetails, setPlanDetails] = useState<any>(null);
  let timer: any;
  const auth = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setSearch('');
      setStatus('ALL');
      setPaginationModel({ page: 0, pageSize: 10 });
      setLoading(true);
      const response = await axios.get('/users?type=ADMIN');
      const users = response.status === 200 ? response.data.data : [];
      setData(users);
      setFilterData(users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
      headerName: 'Plan',
      field: 'plan',
      renderCell: ({ row }: any) => {
        return (
          <>
            {row?.Profile?.planDetails && (
              <Tooltip
                title={
                  <PlanDetails
                    planDetails={row?.Profile?.planDetails}
                    markPlanPaid={markPlanPaid}
                  />
                }
                placement={'right'}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'transparent',
                    },
                  },
                }}
              >
                <Chip
                  label={row?.Profile?.planDetails?.plan?.title}
                  color={'primary'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    console.log(row?.Profile);
                    // setPlanDetails(row?.Profile?.planDetails);
                  }}
                />
              </Tooltip>
            )}
          </>
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
          <>
            {row.isSuspended ? (
              <Chip label={'SUSPENDED'} color={'error'} size="small" />
            ) : (
              <Chip
                label={row.status === 'Active' ? 'ACTIVE' : 'IN-ACTIVE'}
                color={row.status === 'Active' ? 'success' : 'error'}
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
      headerName: 'Virtual Calendar',
      field: 'virtualCalendarGrant',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={Boolean(row.virtualCalendarGrant) ? 'YES' : 'NO'}
            color={Boolean(row.virtualCalendarGrant) ? 'success' : 'error'}
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
    const { Profile, isSuspended } = row;
    const twoFA = Profile?.twoFA;
    const auxVault = Profile.configuration?.AuxVault;

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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleChangePlan(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Plan Settings
          </MenuItem>
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleEditPbxReg(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            {row?.pbxDetails?.pbxUrl ? 'Edit Pbx Account' : 'Add Pbx Account'}
          </MenuItem>
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
              handleManageConfig(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Configurations
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
          {!auxVault && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleCreateMerchant(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              Create Merchant
            </MenuItem>
          )}
          {!row?.virtualCalendarGrant && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleCreateVirtualCalendar(row?.id);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              Create Virtual Calendar
            </MenuItem>
          )}

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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              suspendUser(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            {isSuspended ? <>Resume Service</> : <>Suspend Service</>}
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleEdit = async (row: any) => {
    const resposne = await axios.get(`/users/${row?.id}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
      setOpenForm(true);
    }
  };

  const handleEditPbxConfig = async (row: any) => {
    setCurrentData(row);
    setOpenPbxConfigForm(true);
  };

  const handleEditPbxReg = async (row: any) => {
    setCurrentData(row);
    setOpenPbxRegForm(true);
  };

  const handleResetPassword = (row: any) => {
    setCurrentData(row);
    setPasswordForm(true);
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
    setOpenForm(true);
  };

  const handleLoginUser = async (row: any) => {
    if (row?.isSuspended) {
      toast.error('Suspended account cannot be logged in to!');
      return false;
    }
    setLoading(true);
    auth.loginToAccount(row.email, handleLoginError);
  };

  const handleLoginError = (error: any) => {
    toast.error(error?.message || 'Something wrong happened.');
    setLoading(false);
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

  const suspendUser = async (row: any) => {
    setLoading(true);
    const { Profile } = row;
    const twoFA = Profile?.twoFA;
    const response = await axios.post(`/users/suspend/${row.id}`);
    if (response.status === 201) {
      toast.success(`Successfully Updated!`);
      fetchData();
    } else {
      toast.error('API Error! Please try again.');
    }
  };

  const handleManageConfig = async (row: any) => {
    const { Profile, id } = row;
    const payload = {
      ...Profile,
      id,
    };
    setProfileData(payload);
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

  const handleCreateMerchant = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`/users/av-merchant/create`, {
        uid: row?.id,
      });
      if (response.status === 200) {
        toast.success(`Merchant Created Successfully.`);
        fetchData();
      } else {
        toast.error('API Error! Please try again.');
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleChangePlan = async (row: any) => {
    const { Profile, id } = row;
    const payload = {
      ...Profile,
      id,
    };
    setPlanData(payload);
  };

  const onRefresh = () => {
    setOpenForm(false);
    setProfileData(null);
    setPlanData(null);
    setIPosForm(false);
    setCurrentData(null);
    toast.success(`Account updated successfully.`);
    fetchData();
  };

  const handleEditIposDetail = async (row: any) => {
    setCurrentData(row);
    setIPosForm(true);
  };

  const handleCreateVirtualCalendar = async (id: string) => {
    setLoading(true);
    const response = await axios.post(
      `/email-nylas/create-virtual-calendar/${id}`,
    );
    if (response.status === 201) {
      toast.success(`Successfully Created Calendar`);
      fetchData();
    } else {
      setLoading(false);
      toast.error('API Error! Please try again.');
    }
  };

  const markPlanPaid = async (planId: string) => {
    setLoading(true);
    const response = await axios.post(`/plan/clear-payment/${planId}`);
    if (response.status === 201) {
      toast.success(`Plan Updated`);
      fetchData();
    } else {
      setLoading(false);
      toast.error('API Error! Please try again.');
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
            Add New Admin
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
      <AccountForm
        open={openForm}
        currentData={currentData}
        addFlag={!Boolean(currentData)}
        toggle={() => setOpenForm(false)}
        success={onRefresh}
      />
      <PbxConfigForm
        open={openPbxConfigForm}
        currentData={currentData}
        addFlag={!currentData?.Profile?.pbxConfig?.extensionId ? true : false}
        toggle={() => setOpenPbxConfigForm(false)}
        success={onRefresh}
      />
      <PbxRegForm
        open={openPbxRegForm}
        currentData={currentData}
        addFlag={!currentData?.pbxDetails || currentData?.pbxDetails?.username}
        toggle={() => setOpenPbxRegForm(false)}
        success={onRefresh}
      />
      <UserPasswordForm
        open={passwordForm}
        currentData={currentData}
        toggle={() => setPasswordForm(false)}
      />
      <UserMenuForm
        open={userMenuForm}
        currentData={currentData}
        toggle={() => setUserMenuForm(false)}
        selectedId={userActiveId}
        menuData={userMenuOption}
      />
      <AccountSettingsForm
        open={Boolean(profileData)}
        currentData={profileData}
        toggle={() => setProfileData(null)}
        success={onRefresh}
      />
      <AccountPlanForm
        open={Boolean(planData)}
        currentData={planData}
        toggle={() => setPlanData(null)}
        success={onRefresh}
      />
      <UserIposDetailsForm
        open={iPosForm}
        currentData={currentData}
        toggle={() => setIPosForm(false)}
        success={onRefresh}
        operatorFlag={false}
      />
      <AccountPlanDetails
        open={Boolean(planDetails)}
        currentData={planDetails}
        toggle={() => setPlanDetails(null)}
      />
    </>
  );
};

export default AccountList;
