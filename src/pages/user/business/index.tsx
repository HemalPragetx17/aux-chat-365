import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import BusinessCardForm from '../../../components/apps/userprofile/business-card/BusinessCardForm';
import ProfileBanner from '../../../components/apps/userprofile/profile/ProfileBanner';
import PageContainer from '../../../components/container/PageContainer';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';

export default function BusinessCard() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>({});

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    const response = await axios.get(`/users/${user?.uid}`);
    const profile = response.status === 200 ? response.data.data : {};
    setProfileData(profile);
  };

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>

        <Grid item sm={12} xs={12}>
          <BusinessCardForm profile={profileData} success={fetchUserData} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
