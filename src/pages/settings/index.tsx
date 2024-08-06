import { Grid } from '@mui/material';
import React, { useCallback } from 'react';

import SettingsBanner from '../../components/apps/settings/Banner';
import ApiForm from '../../components/apps/settings/api/ApiForm';
import ContactCategoryList from '../../components/apps/settings/contact-category/ContactCategoryList';
import ScriptList from '../../components/apps/settings/contact-us-scripts/ScriptList';
import ContractTemplateList from '../../components/apps/settings/contract/ContractTemplateList';
import DepartmentList from '../../components/apps/settings/department/DepartmentList';
import DidOrderList from '../../components/apps/settings/did-order/DidOrderList';
import DidList from '../../components/apps/settings/did/DidList';
import EmailList from '../../components/apps/settings/email-nylas/EmailList';
import EmailTemplateList from '../../components/apps/settings/email/EmailTemplateList';
import LocationList from '../../components/apps/settings/location/LocationList';
import PaymentSettingsPage from '../../components/apps/settings/payment-settings/PaymentSettingsPage';
import GoogleForm from '../../components/apps/settings/reviews-settings/GoogleForm';
import UserActivityList from '../../components/apps/settings/user-activity-log/UserActivityList';
import UserList from '../../components/apps/settings/user/UserList';
import PageContainer from '../../components/container/PageContainer';

export default function Settings() {
  const [route, setRoute] = React.useState<any>(null);

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <DidList />;
      case 1:
        return <EmailList />;
      case 2:
        return <DidOrderList />;
      case 3:
        return <UserList />;
      case 4:
        return <ApiForm />;
      case 5:
        return <DepartmentList />;
      case 6:
        return <EmailTemplateList />;
      case 7:
        return <ContractTemplateList />;
      case 8:
        return <LocationList />;
      case 9:
        return <ScriptList />;
      case 10:
        return <PaymentSettingsPage />;
      case 11:
        return <GoogleForm />;
      case 12:
        return <UserActivityList />;
      case 13:
        return <ContactCategoryList />;
      default:
        return <></>;
    }
  }, [route]);

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <SettingsBanner handleValueChanged={setRoute} />
        </Grid>
        <Grid item xs={12} mt={2}>
          {renderView()}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
