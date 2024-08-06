import { Grid } from '@mui/material';
import { IconMailOpened, IconMessage } from '@tabler/icons-react';
import React, { useCallback } from 'react';

import EmailHelpDeskForm from '../../components/apps/helpdesk/EmailForm';
import SmsHelpDeskForm from '../../components/apps/helpdesk/SmsForm';
import PageContainer from '../../components/container/PageContainer';
import CustomBanner from '../../components/custom/CustomBanner';

export default function Helpdesk() {
  const [route, setRoute] = React.useState<any>(null);

  const tabs = [
    {
      label: 'SMS',
      icon: <IconMessage />,
    },
    {
      label: 'Email',
      icon: <IconMailOpened />,
    },
  ];

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <SmsHelpDeskForm />;
      case 1:
        return <EmailHelpDeskForm />;
      default:
        return <></>;
    }
  }, [route]);

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <CustomBanner handleValueChanged={setRoute} routeTabs={tabs} />
        </Grid>
        <Grid item xs={12}>
          {renderView()}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
