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
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import swal from 'sweetalert';

import axios from '../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../utils/constant';
import { formatPayment } from '../../utils/format';
import CustomDataGrid from '../custom/CustomDataGrid';
import CustomTextField from '../custom/CustomTextField';
import ProductForm from '../forms/features/ProductFrom';

// import ProductForm from '../../forms/features/ProductForm';

const ProductList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [filterData, setFilterData] = useState<any>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel[]>([]);
  let timer: any;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    try {
      const response = await axios.get(`/products`);
      const resp = response.status === 200 ? response.data.data : [];
      setData(resp);
      setFilterData(resp);
      setLoading(false);
    } catch (e) {
      setData([]);
      setFilterData([]);
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
      flex: 0.15,
      minWidth: 120,
      headerName: 'Name',
      field: 'name',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.name} placement="top">
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Description',
      field: 'description',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.description} placement="top">
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.description}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Type',
      field: 'type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.type}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Price',
      field: 'price',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            ${formatPayment(row?.price)}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Quantity',
      field: 'quantity',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.quantity}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Discount',
      field: 'discount',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            ${formatPayment(row?.discount)}
          </Typography>
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
            label={row.status}
            color={STATUS_COLOR[row.status as keyof typeof STATUS_COLOR] as any}
            size="small"
          />
        );
      },
    },
    {
      flex: 0.1,
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleDelete(row);
            }}
            dense
            sx={{ '& svg': { mr: 2 } }}
          >
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleAdd = () => {
    setCurrentData(null);
    setOpenForm(true);
  };

  const handleEdit = async (row: any) => {
    setLoading(true);
    const resposne = await axios.get(`/products/${row?.id}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
      setOpenForm(true);
    }
    setLoading(false);
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
      try {
        setLoading(true);
        const response = await axios.delete(`/products/${row?.id}`);
        if (response.status === 200) {
          fetchData();
        }
      } catch (error) {
        setLoading(false);
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }
  };

  const onRefresh = () => {
    setOpenForm(false);
    fetchData();
  };

  const handleMultipleDelete = async () => {
    if (selectedRows.length > 0) {
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
        try {
          setLoading(true);
          const response = await axios.delete(`/products/remove/bulk`, {
            data: { ids: selectedRows },
          });
          if (response.status === 200) {
            fetchData();
          }
        } catch (error) {
          setLoading(false);
          toast.error(
            (error as any)?.message || 'API Error! Please try again.',
          );
        }
      }
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
              <MenuItem value={'ACTIVE'}>Active</MenuItem>
              <MenuItem value={'INACTIVE'}>In-Active</MenuItem>
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
          {selectedRows.length !== 0 && (
            <IconButton
              aria-label="refresh"
              size="small"
              onClick={handleMultipleDelete}
              sx={{ margin: '0px 10px' }}
            >
              <IconTrash />
            </IconButton>
          )}

          <Button variant="contained" sx={{ mr: 2 }} onClick={handleAdd}>
            Add New Product
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
        checkboxSelection
        onRowSelectionModelChange={(
          newRowSelectionModel: GridRowSelectionModel[],
        ) => {
          setSelectedRows(newRowSelectionModel);
        }}
        rowSelectionModel={selectedRows}
      />
      <ProductForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        success={onRefresh}
        addFlag={!Boolean(currentData?.id)}
      />
    </>
  );
};

export default ProductList;
