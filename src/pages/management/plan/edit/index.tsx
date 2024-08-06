import React from 'react';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PlanForm from '../../../../components/apps/management/plan/PlanForm';
import PageContainer from '../../../../components/container/PageContainer';
import CustomSpinner from '../../../../components/custom/CustomSpinner';
import axios from '../../../../utils/axios';

export default function EmailListPage() {
  const [currentData, setCurrentData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.id) {
      fetchData(router?.query?.id as string);
    }
  }, [router]);

  const fetchData = async (id: string) => {
    const plan = await axios.get(`/plan/${id}`);
    setCurrentData(plan?.data?.data);
  };

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {currentData?.id ? (
            <PlanForm currentData={currentData} />
          ) : (
            <CustomSpinner />
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
