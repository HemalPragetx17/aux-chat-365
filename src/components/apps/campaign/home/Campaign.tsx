import {
  Button,
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
  IconEdit,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import CampaignForm from '../../../forms/campaign/CampaignForm';

const CampaignList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterData, setFilterData] = useState<any>([]);
  const [search, setSearch] = useState<any>('');
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  let timer: any;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    const resp = [
      {
        replacements: null,
        gtm_id: null,
        cta_btn_text: null,
        name: null,
        clicks_thirty_days: 0,
        block_bots: false,
        sparkline: [],
        expiry_destination: null,
        utm_source: null,
        body_tags: null,
        referer_mode: null,
        og_image: null,
        custom_referer: null,
        clicks_today: 0,
        full_url: 'https://p.auxout.net/XzU',
        utm_medium: null,
        slug: '/XzU',
        utm_term: null,
        conversions: 0,
        cta_btn_text_color: null,
        cta_text_color: null,
        expiry_datetime: null,
        utm_content: null,
        clicks_previous_day: 0,
        spam: false,
        enabled: true,
        note: 'Payment Link',
        fb_pixel_id: null,
        forward_params: false,
        clicks_total: 0,
        cta_message: null,
        head_tags: null,
        cta_image: null,
        deleted: false,
        og_title: null,
        id: 28114645,
        utm_campaign: null,
        ga4_tag_id: null,
        cta_name: null,
        cloaking: false,
        domain: 'p.auxout.net',
        cta_logo: true,
        linkify_words: null,
        rules: [],
        workspace_id: 79717,
        cta_url: null,
        url: 'https://payment.auxout.net/7a971e6b-1ebd-4b14-a05e-aeb5190d3b28',
        inserted_at: '2023-09-29T12:52:50',
        cta_bg_color: null,
        click_fraud_mode: null,
        og_description: null,
      },
      {
        replacements: null,
        gtm_id: null,
        cta_btn_text: null,
        name: null,
        clicks_thirty_days: 0,
        block_bots: false,
        sparkline: [],
        expiry_destination: null,
        utm_source: null,
        body_tags: null,
        referer_mode: null,
        og_image: null,
        custom_referer: null,
        clicks_today: 0,
        full_url: 'https://p.auxout.net/dSM',
        utm_medium: null,
        slug: '/dSM',
        utm_term: null,
        conversions: 0,
        cta_btn_text_color: null,
        cta_text_color: null,
        expiry_datetime: null,
        utm_content: null,
        clicks_previous_day: 0,
        spam: false,
        enabled: true,
        note: 'Payment Link',
        fb_pixel_id: null,
        forward_params: false,
        clicks_total: 0,
        cta_message: null,
        head_tags: null,
        cta_image: null,
        deleted: false,
        og_title: null,
        id: 28114665,
        utm_campaign: null,
        ga4_tag_id: null,
        cta_name: null,
        cloaking: false,
        domain: 'p.auxout.net',
        cta_logo: true,
        linkify_words: null,
        rules: [],
        workspace_id: 79717,
        cta_url: null,
        url: 'https://payment.auxout.net/8f7eb004-eb9c-4ee3-b7ef-64d2d7cf8d0e',
        inserted_at: '2023-09-29T12:54:48',
        cta_bg_color: null,
        click_fraud_mode: null,
        og_description: null,
      },
    ];
    setData(resp);
    setFilterData(resp);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (data?.length) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        searchData();
      }, 1000);
    }
  }, [search]);

  const searchData = useCallback(async () => {
    setLoading(true);
    let filtered: any = [...data];
    if (Boolean(search.trim())) {
      filtered = filtered.filter(
        (obj: any) =>
          obj.name.toLowerCase().indexOf(search.trim().toLowerCase()) > -1,
      );
    }
    setFilterData(filtered);
    setLoading(false);
  }, [search]);

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
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.65,
      minWidth: 300,
      headerName: 'URL',
      field: 'url',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.url}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 10,
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleTrash(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconTrash fontSize={20} />
            Trash
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
    // setLoading(true);
    // setLoading(true);
    // const resposne = await axios.get(`/keyword/${row?.id}`);
    // if (resposne.status === 200) {
    //   setCurrentData(resposne?.data.data);
    //   setOpenForm(true);
    // }
    // setLoading(false);
    setCurrentData(row);
    setOpenForm(true);
  };

  const handleTrash = async (row: any) => {};

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
        <Grid
          item
          sm={9}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <Button variant="contained" sx={{ mr: 2,background:'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)' }} onClick={handleAdd}>
            Add New Campaign
          </Button>
          <IconButton aria-label="refresh" size="small" onClick={fetchData}>
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      <CustomDataGrid
        sx={{ mt: 5 }}
        autoHeight
        rows={filterData}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <CampaignForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        success={onRefresh}
        addFlag={!Boolean(currentData?.id)}
      />
    </>
  );
};

export default CampaignList;
