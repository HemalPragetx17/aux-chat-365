import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconCopy, IconDotsVertical, IconRefresh } from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Box } from '@mui/system';
import toast from 'react-hot-toast';

import axios from '../../../../utils/axios';
import { ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import ContactScriptForm from '../../../forms/settings/ContactScriptForm';

const ScriptList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [script, setScript] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setCurrentData(null);
    setOpenForm(false);
    const response = await axios.get(`/contact-script`);
    setData(response?.data || []);
    setLoading(false);
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Website Name',
      field: 'website_name',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.website_name}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'Website URL',
      field: 'website_url',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.website_url}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      headerName: 'Color',
      field: 'color',
      renderCell: ({ row }: any) => {
        return (
          <Chip label={row.color} sx={{ bgcolor: row?.color }} size="small" />
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Type',
      field: 'department',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS, textTransform: 'uppercase' }}>
            {row?.department}
          </Typography>
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
            dense
            onClick={() => {
              setAnchorEl(null);
              handleDownload(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            View Script
          </MenuItem>
          <MenuItem
            dense
            onClick={() => {
              setAnchorEl(null);
              handleEdit(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Edit
          </MenuItem>
          <MenuItem
            dense
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

  const handleAdd = () => {
    setCurrentData(null);
    setOpenForm(true);
  };

  const handleDownload = async (row: any) => {
    setOpen(true);
    setScript(row?.script);
  };

  const handleEdit = (row: any) => {
    setCurrentData(row);
    setOpenForm(true);
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
        await axios.delete(`/contact-script/${row?.id}`);
        fetchData();
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error('API Error! Please try again');
      }
    }
  };

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid
          item
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleAdd}>
            Create New Script
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
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={() => {
          setOpen(false);
          setScript('');
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Copy this script and embed in your website
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: '100%',
              background: '#5a5a5a',
              fontFamily: 'monospace',
              color: '#00ff00',
              borderRadius: 0,
              padding: 2,
              position: 'relative',
            }}
          >
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => {
                (navigator as any).clipboard.writeText(script);
                toast.success('Text copied to clipboard!');
              }}
            >
              <IconCopy color="white" />
            </IconButton>
            <span>{script}</span>
          </Box>
          <Button
            variant="contained"
            sx={{ mt: 2, float: 'right' }}
            onClick={() => {
              setOpen(false);
              setScript('');
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <ContactScriptForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        addFlag={!Boolean(currentData)}
        success={fetchData}
      />
    </>
  );
};

export default ScriptList;
