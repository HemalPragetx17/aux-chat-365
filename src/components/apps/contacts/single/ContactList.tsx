import {
  Alert,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  IconMessageCircle,
  IconRefresh,
  IconStar,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

import { AppState } from '../../../../store/Store';
import CustomTextField from '../../../custom/CustomTextField';

interface ContactListProp {
  search: string;
  setSearch: (data: any) => void;
  onRefresh: () => void;
  contactContainer: any;
  containerHeight: any;
  handleClick: (data: any) => void;
  handleMessage: (data: any) => void;
  handleStar: (data: any) => void;
  handleDelete: (data: any) => void;
}

const ContactList = (props: ContactListProp) => {
  const {
    search,
    setSearch,
    onRefresh,
    contactContainer,
    containerHeight,
    handleClick,
    handleMessage,
    handleStar,
    handleDelete,
  } = props;
  const store = useSelector((state: AppState) => state.contactsReducer);
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Box
      sx={{
        width: '20%',
        marginRight: '1%',
        height: '100%',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: customizer?.activeMode === 'light' ? '#cecece' : '#575757',
      }}
    >
      <Box
        display="flex"
        sx={{ paddingX: 1, alignItems: 'center', height: 60 }}
        justifyContent={'space-between'}
      >
        <CustomTextField
          value={search}
          fullWidth
          label="Search"
          onChange={(event: any) => setSearch(event?.target?.value)}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="refresh"
                  size="small"
                  onClick={() => setSearch('')}
                >
                  <IconX />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title={'Refresh'} arrow>
          <IconButton
            aria-label="refresh"
            size="small"
            sx={{ ml: 1 }}
            onClick={onRefresh}
          >
            <IconRefresh />
          </IconButton>
        </Tooltip>
      </Box>
      <SimpleBarReact
        style={{
          maxHeight: containerHeight,
        }}
        scrollableNodeProps={{ ref: contactContainer }}
      >
        {store.contacts.length > 0 ? (
          store.contacts.map((contact: any) => (
            <ListItemButton
              key={contact.id}
              id={contact.id}
              selected={contact.id === store.currentData?.id}
              onClick={(e: any) => handleClick(contact)}
              sx={{ padding: 1 }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={'profile'}
                  src={contact.image?.src || '/images/profile/thumb.png'}
                />
              </ListItemAvatar>
              <ListItemText>
                <Stack direction="row" gap="5px" alignItems="center">
                  <Box mr="auto" sx={{ maxWidth: 'calc(100% - 70px)' }}>
                    <Typography variant="subtitle1" noWrap fontSize={13}>
                      {contact?.firstName} {contact?.lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      fontSize={12}
                    >
                      +1{contact?.phone}
                    </Typography>
                  </Box>
                  <Box>
                    <IconMessageCircle
                      onClick={(event) => {
                        event.stopPropagation();
                        handleMessage(contact);
                      }}
                      size="16"
                      stroke={1}
                    />
                    <IconStar
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStar(contact);
                      }}
                      size="16"
                      stroke={1}
                      style={{
                        fill: contact?.starred ? '#FFD700' : 'transparent',
                        stroke: contact?.starred ? '#FFD700' : 'currentcolor',
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    />
                    <IconTrash
                      onClick={(event: any) => {
                        event.stopPropagation();
                        handleDelete(contact);
                      }}
                      size="16"
                      stroke={1}
                    />
                  </Box>
                </Stack>
              </ListItemText>
            </ListItemButton>
          ))
        ) : (
          <Box m={2}>
            <Alert
              severity="error"
              icon={false}
              variant="filled"
              sx={{ color: 'white' }}
            >
              No Contacts Found!
            </Alert>
          </Box>
        )}
      </SimpleBarReact>
    </Box>
  );
};

export default ContactList;
