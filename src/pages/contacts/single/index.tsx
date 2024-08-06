import { Card, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

import SingleContactList from '../../../components/apps/contacts/single/SingleContactList';
import { AppState } from '../../../store/Store';

export default function Settings() {
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Card
      sx={{
        display: 'flex',
        p: '10px 10px 10px 0px',
        height: '100%',
        borderRadius: 0,
        backgroundColor:
          customizer?.activeMode === 'light' ? '#e5e5e5' : '#323441',
      }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <Paper
        sx={{
          width: '100%',
          padding: 2,
        }}
      >
        <SingleContactList />
      </Paper>
    </Card>
  );
}
