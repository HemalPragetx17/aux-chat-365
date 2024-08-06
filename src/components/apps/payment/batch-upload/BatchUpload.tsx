import { Button, Grid, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import * as XLSX from 'xlsx';

import { PRIMARY_COLOR, ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomFileUploadSingle from '../../../custom/CustomFileUploadSingle';

const BatchUpload = () => {
  const [file, setFile] = useState<File[] | []>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const columns: GridColDef[] = [
    {
      flex: 0.15,
      headerName: 'Amount',
      field: 'amount',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            ${row?.amount}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      headerName: 'From',
      field: 'from',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.from}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      headerName: 'To',
      field: 'to',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.to}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      headerName: 'Customer',
      field: 'customer',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.customer}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      headerName: 'Description',
      field: 'description',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.description}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      headerName: 'Reference',
      field: 'reference',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.reference}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      headerName: 'Transaction type',
      field: 'Transaction type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.['Transaction type']}
          </Typography>
        );
      },
    },
  ];

  const parseExcel = async (file: any) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = (e) => {
      const bstr = e?.target?.result;
      const workbook = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const sheet_name_list = workbook.SheetNames;
      const fileData: any = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]],
      );
      console.log(fileData);
      setFile(fileData);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (acceptedFile: File[] | []) => {
    acceptedFile.length ? parseExcel(acceptedFile[0]) : setFile([]);
  };

  return (
    <>
      <Typography variant="caption">
        Batch Upload filter and send payment request.
        <a
          href="/static/sample-batch-auxvault.csv"
          style={{ color: PRIMARY_COLOR }}
        >
          &nbsp;Download sample CSV
        </a>
      </Typography>
      <br />
      <CustomFileUploadSingle
        handleFileUpload={handleFileUpload}
        text="Drag Files Here or Click to Open"
      />

      {file?.length > 0 && (
        <Grid item xs={12}>
          <CustomDataGrid
            sx={{ mt: 5 }}
            autoHeight
            rowHeight={38}
            rows={file}
            columns={columns}
            getRowId={(row: any) => row.reference}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
          <Button color="primary" variant="contained" type="submit">
            Upload
          </Button>
        </Grid>
      )}
    </>
  );
};

export default BatchUpload;
