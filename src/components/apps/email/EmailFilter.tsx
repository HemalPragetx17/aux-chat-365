import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { IconMail } from '@tabler/icons-react';

import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import { useSelector } from '../../../store/Store';
import { GeneralIcon } from '../../../types/apps/icon';

import EmailCompose from './EmailCompose';

interface fitlerType {
  id?: number;
  filterbyTitle?: string;
  icon?: GeneralIcon | any;
  name?: string;
  divider?: boolean;
  color?: string;
}
interface Props {
  emailDetails: any;
  userId: any;
  selectedEmail: any;
  refresh: any;
  data: any;
}

const EmailFilter = ({
  emailDetails,
  userId,
  selectedEmail,
  refresh,
  data,
}: Props) => {
  const active = {};
  const customizer = useSelector((state) => state.customizer);
  const br = `${customizer.borderRadius}px`;

  const filterData: fitlerType[] = [
    {
      id: 2,
      name: 'inbox',
      icon: IconMail,
      color: 'inherit',
    },
    // {
    //   id: 3,
    //   name: 'sent',
    //   icon: IconSend,
    //   color: 'inherit',
    // },
    // {
    //   id: 4,
    //   name: 'draft',
    //   icon: IconNote,
    //   color: 'inherit',
    // },
    // {
    //   id: 4,
    //   name: 'spam',
    //   icon: IconFlag,
    //   color: 'inherit',
    // },
    // {
    //   id: 5,
    //   name: 'trash',
    //   icon: IconTrash,
    //   color: 'inherit',
    // },
    // {
    //   id: 6,
    //   divider: true,
    // },
    // {
    //   id: 1,
    //   filterbyTitle: 'Sort By',
    // },
    // {
    //   id: 7,
    //   name: 'starred',
    //   icon: IconStar,
    //   color: 'inherit',
    // },
    // {
    //   id: 8,
    //   name: 'important',
    //   icon: IconAlertCircle,
    //   color: 'inherit',
    // },
    // {
    //   id: 9,
    //   divider: true,
    // },
    // {
    //   id: 13,
    //   filterbyTitle: 'Labels',
    // },
    // {
    //   id: 10,
    //   name: 'Promotional',
    //   icon: IconFolder,
    //   color: 'primary.main',
    // },
    // {
    //   id: 11,
    //   name: 'Social',
    //   icon: IconFolder,
    //   color: 'error.main',
    // },
    // {
    //   id: 12,
    //   name: 'Health',
    //   icon: IconFolder,
    //   color: 'success.main',
    // },
  ];

  return (
    <>
      <Box>
        <EmailCompose
          emailDetails={emailDetails}
          selectedEmail={selectedEmail}
          userId={userId}
          refresh={refresh}
          data={data}
        />
      </Box>
      <List>
        <Scrollbar
          sx={{
            height: 'calc(100vh - 200px)',
            maxHeight: '800px',
            p: 1,
          }}
        >
          {filterData.map((filter) => {
            if (filter.filterbyTitle) {
              return (
                <Typography
                  variant="subtitle2"
                  p={1}
                  fontWeight={600}
                  key={filter.id}
                >
                  {filter.filterbyTitle}
                </Typography>
              );
            } else if (filter.divider) {
              return <Divider key={filter.id} />;
            }

            return (
              <ListItemButton
                sx={{
                  p: 1,
                  borderRadius: br,
                }}
                selected={active === `${filter.name}`}
                // onClick={() => dispatch(setVisibilityFilter(`${filter.name}`))}
                key={`${filter.id}${filter.name}`}
              >
                <ListItemIcon sx={{ minWidth: '30px', color: filter.color }}>
                  <filter.icon stroke="1.5" size={19} />
                </ListItemIcon>
                <ListItemText sx={{ textTransform: 'capitalize' }}>
                  {filter.name}
                </ListItemText>
              </ListItemButton>
            );
          })}
        </Scrollbar>
      </List>
    </>
  );
};

export default EmailFilter;
