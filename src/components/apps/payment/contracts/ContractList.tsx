import { Chip, Grid, IconButton, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconEye, IconRefresh } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import axios from '../../../../utils/axios';
import { CONTRACT_STATUS, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import ContractDialog from '../../contract/ContractDialog';

const ContractList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [currentData, setCurrentData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    try {
      const response = await axios.get(`/contracts`);
      const resp = response.status === 200 ? response.data.data : [];
      setData(resp);
      setLoading(false);
    } catch (e) {
      setData([]);
      setLoading(false);
    }
  }, []);

  const columns: GridColDef[] = [
    {
      minWidth: 200,
      headerName: 'Contract Date',
      field: 'createdAt',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.createdAt).format(`MM-DD-YYYY`)}
            <br />
            {toLocalDate(row.createdAt).format(`hh:mm:ss A`)}
          </Typography>
        );
      },
    },
    {
      minWidth: 180,
      headerName: 'Contract To',
      field: 'name',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.contact?.firstName}
            {''}
            {row.contact?.lastName}
          </Typography>
        );
      },
    },
    {
      minWidth: 180,
      headerName: 'Amount',
      field: 'amount',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row?.payment?.amount ? `${row.payment.amount}` : ''}
          </Typography>
        );
      },
    },
    {
      minWidth: 220,
      headerName: 'Customer Opened',
      field: 'openedAt',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const { lifecycleAttributesForCustomer } = row;
        if (!lifecycleAttributesForCustomer?.openedAt) {
          return <Typography sx={{ ...ROW_PROPS }}>-</Typography>;
        }
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(lifecycleAttributesForCustomer?.openedAt).format(
              `MM-DD-YYYY`,
            )}
            <br />
            {toLocalDate(lifecycleAttributesForCustomer?.openedAt).format(
              `hh:mm:ss A`,
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 220,
      headerName: 'Customer Signed',
      field: 'signedAt',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const { lifecycleAttributesForCustomer } = row;
        if (!lifecycleAttributesForCustomer?.signedAt) {
          return <Typography sx={{ ...ROW_PROPS }}>-</Typography>;
        }
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(lifecycleAttributesForCustomer?.signedAt).format(
              `MM-DD-YYYY`,
            )}
            <br />
            {toLocalDate(lifecycleAttributesForCustomer?.signedAt).format(
              `hh:mm:ss A`,
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 160,
      headerName: 'Status',
      field: 'status',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const index: keyof typeof CONTRACT_STATUS = row.status;
        const { name, color } = CONTRACT_STATUS[index];
        return <Chip label={name} color={color as any} size="small" />;
      },
    },
    {
      minWidth: 220,
      headerName: 'Merchant Opened',
      field: 'openedAt_',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const { lifecycleAttributesForMerchant } = row;
        if (!lifecycleAttributesForMerchant?.openedAt) {
          return <Typography sx={{ ...ROW_PROPS }}>-</Typography>;
        }
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(lifecycleAttributesForMerchant?.openedAt).format(
              `MM-DD-YYYY`,
            )}
            <br />
            {toLocalDate(lifecycleAttributesForMerchant?.openedAt).format(
              `hh:mm:ss A`,
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 220,
      headerName: 'Merchant Signed',
      field: 'signedAt_',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const { lifecycleAttributesForMerchant } = row;
        if (!lifecycleAttributesForMerchant?.signedAt) {
          return <Typography sx={{ ...ROW_PROPS }}>-</Typography>;
        }
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(lifecycleAttributesForMerchant?.signedAt).format(
              `MM-DD-YYYY`,
            )}
            <br />
            {toLocalDate(lifecycleAttributesForMerchant?.signedAt).format(
              `hh:mm:ss A`,
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'Action',
      field: 'view',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const {
          lifecycleAttributesForMerchant,
          rawContract,
          contractTemplate,
          status,
          id,
        } = row;

        return (
          <IconButton
            onClick={() => {
              if (status !== 'SIGNED') {
                const payload = {
                  rawContract: contractTemplate?.contractHtml,
                };
                setCurrentData(payload);
              } else {
                if (!lifecycleAttributesForMerchant?.signedAt) {
                  const url: string = `${
                    (window as any).origin
                  }/contract/${id}/`;
                  (window as any).open(url, '_blank').focus();
                } else {
                  const payload = {
                    rawContract,
                  };
                  setCurrentData(payload);
                }
              }
            }}
          >
            <IconEye fontSize={16} />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item xs={12} justifyContent={'right'} display={'flex'}>
          <IconButton aria-label="refresh" size="small" onClick={fetchData}>
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      <CustomDataGrid
        sx={{ mt: 5 }}
        autoHeight
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <ContractDialog
        open={Boolean(currentData)}
        toggle={() => setCurrentData(null)}
        currentData={currentData}
      />
    </>
  );
};

export default ContractList;
