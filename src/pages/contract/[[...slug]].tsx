import { Box } from '@mui/material';

import ContractForm from '../../components/apps/contract/ContractForm';

const Contract = () => (
  <Box display="flex" padding={1} justifyContent="center">
    <ContractForm />
  </Box>
);

Contract.layout = 'Blank';
export default Contract;
