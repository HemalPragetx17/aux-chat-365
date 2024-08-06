import { Alert, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import VirtualTerminal from '../../../components/apps/payment/virtual-terminal/VirtualTerminal';
import PageContainer from '../../../components/container/PageContainer';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';

export default function VirtualTerminalHome() {
  const [data, setData] = useState<any>({});
  const { user, settings } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = useCallback(async () => {
    const response = await axios.get(`/auxvault/${user?.uid}`);
    setData(response?.data);
  }, [user]);

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          {data?.merchant_id && settings?.configuration?.AuxVault ? (
            <VirtualTerminal />
          ) : (
            <Alert severity="error" icon={false}>
              VT is not enabled for this merchant
            </Alert>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
