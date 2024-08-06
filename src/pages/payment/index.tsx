import { Alert, Grid } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import ContractList from '../../components/apps/payment/contracts/ContractList';
import InvoiceList from '../../components/apps/payment/invoice/InvoiceList';
import TransactionHistory from '../../components/apps/payment/transaction-history/TransactionHistory';
import VirtualTerminal from '../../components/apps/payment/virtual-terminal/VirtualTerminal';
import VtTransactionHistory from '../../components/apps/payment/vtTransactionHistory/VtTransactionHistory';
import PageContainer from '../../components/container/PageContainer';
import CustomBanner from '../../components/custom/CustomBanner';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../utils/axios';

import BatchUploadHome from './bulk-upload';

export default function Payment() {
  const [route, setRoute] = React.useState<any>(null);
  const { user, settings } = useAuth();
  const [data, setData] = useState<any>({});

  const tabs = [
    {
      label: 'PaymentLink History',
    },
    {
      label: 'Invoice',
    },
    {
      label: 'Batch Upload',
    },
    {
      label: 'Virtual Terminal',
    },
    {
      label: 'Transaction History',
    },
    {
      label: 'Contracts',
    },
  ];

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <TransactionHistory />;
      case 1:
        return <InvoiceList />;
      case 2:
        return <BatchUploadHome />;
      case 3:
        return handleVTRedirect();
      case 4:
        return <VtTransactionHistory />;
      case 5:
        return <ContractList />;
      default:
        return <></>;
    }
  }, [route]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = useCallback(async () => {
    const response = await axios.get(`/auxvault/${user?.uid}`);
    setData(response?.data);
  }, [user]);

  const handleVTRedirect = () => {
    if (data?.merchant_id && settings?.configuration?.AuxVault) {
      return <VirtualTerminal />;
    } else {
      return (
        <Alert severity="error" icon={false}>
          VT is not enabled for this merchant
        </Alert>
      );
    }
  };

  return (
    <PageContainer>
      <Grid container>
        <Grid item xs={12}>
          <CustomBanner handleValueChanged={setRoute} routeTabs={tabs} />
        </Grid>
        <Grid item xs={12} paddingY={3}>
          {renderView()}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
