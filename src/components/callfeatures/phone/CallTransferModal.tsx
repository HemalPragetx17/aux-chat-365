import { Button, Divider, Stack, TextField, Typography } from '@mui/material';

const CallTransferModal = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.9)',
        position: 'absolute',
      }}
    >
      <Typography sx={{ color: '#fff !important', margin: '10px' }}>
        Call Transfer
      </Typography>
      <Divider />
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ width: '100%', height: '100%', padding: '20px' }}
      >
        <TextField
          fullWidth
          size={'small'}
          placeholder="Enter phone number"
          inputProps={{
            sx: {
              color: '#fff',
            },
          }}
        />
        <Stack direction={'row'} sx={{ marginTop: '30px' }} spacing={2}>
          <Button
            sx={{ background: '#49A8FF', color: '#fff', fontWeight: '500' }}
          >
            Blind Transfer
          </Button>
          <Button
            sx={{ background: '#49A8FF', color: '#fff', fontWeight: '500' }}
          >
            Attendant Transfer
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CallTransferModal;
