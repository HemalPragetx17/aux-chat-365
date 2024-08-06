import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import MessageForm from '../../../components/apps/userprofile/profile/MessageForm';
import ProfileBanner from '../../../components/apps/userprofile/profile/ProfileBanner';
import ProfileForm from '../../../components/apps/userprofile/profile/ProfileForm';
import PageContainer from '../../../components/container/PageContainer';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../utils/axios';

export default function UserProfile() {
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

        <Grid item sm={12} xs={12} md={8}>
          <ProfileForm profile={profileData} success={fetchUserData} />
        </Grid>
        <Grid item sm={12} xs={12} md={4}>
          <MessageForm profile={profileData} success={fetchUserData} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
