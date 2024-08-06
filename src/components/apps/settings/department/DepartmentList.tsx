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
  IconEdit,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import swal from 'sweetalert';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import DepartmentForm from '../../../forms/settings/DepartmentForm';

const DepartmentList = () => {
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
  const [currentData, setCurrentData] = useState<any>(null);
  let timer: any;
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    const response = await axios.get(
      `/department/user/${user?.uid}?status=ACTIVE,INACTIVE`,
    );
    const department = response.status === 200 ? response.data.data : [];
    setData(department);
    setFilterData(department);
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
      flex: 0.4,
      minWidth: 120,
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
      flex: 0.4,
      minWidth: 120,
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
      flex: 0.1,
      minWidth: 100,
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
              setAnchorEl(null), handleEdit(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEdit fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null), handleDelete(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconTrash fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleAdd = (row: any) => {
    setCurrentData(null);
    setOpenForm(true);
  };

  const handleEdit = async (row: any) => {
    const resposne = await axios.get(`/department/${row?.id}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
      setOpenForm(true);
    }
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
      await axios.delete(`/department/${row?.id}`);
      fetchData();
    }
  };

  const onRefresh = () => {
    setOpenForm(false);
    fetchData();
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
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleAdd}>
            Add New Department
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
      <DepartmentForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        addFlag={!Boolean(currentData)}
        success={onRefresh}
      />
    </>
  );
};

export default DepartmentList;
