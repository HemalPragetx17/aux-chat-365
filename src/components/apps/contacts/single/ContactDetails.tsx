import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  IconChevronDown,
  IconEdit,
  IconMail,
  IconMessageCircle2,
  IconPhone,
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

import { IconAddressBook } from '@tabler/icons-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../hooks/useAuth';
import { AppState } from '../../../../store/Store';
import axios from '../../../../utils/axios';
import CustomTextField from '../../../custom/CustomTextField';
import ContactPictureDialog from './ContactPictureDialog';
import ContactSideBar from './ContactSidebar';

const CONTACT_STAGES = [
  { label: 'New', value: 'NEW' },
  { label: 'Engaged', value: 'ENGAGED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Proposal Sent', value: 'PROPOSALSENT' },
  { label: 'Negotations', value: 'NEGOTIATIONS' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
  { label: 'Nurturing', value: 'NURTURING' },
];

interface ContactDetailsProp {
  handleFilePreview: (data: any) => string | undefined;
  onUpdated: (data: any) => void;
  handleMessage: (data: any) => void;
  handleMail: () => void;
  editLoading: boolean;
  setEditLoading: (data: boolean) => void;
  containerHeight: any;
}

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '20px !important',
  },
  '&.MuiToggleButton-root': {
    borderRadius: '20px',
    padding: '0px',
    width: 100,
    height: 25,
    border: `1px solid ${theme.palette.primary.main}`,
    transition: 'background-color 0.3s, color 0.3s',
  },
}));

const Divider = styled(Grid)(({ theme }) => ({
  borderTop: `1px solid ${
    theme.palette.mode === 'light' ? '#cecece' : '#575757'
  }`,
  marginTop: 20,
  marginBottom: 20,
}));

const ContactDetails = (props: ContactDetailsProp) => {
  const {
    handleFilePreview,
    onUpdated,
    handleMessage,
    handleMail,
    editLoading,
    setEditLoading,
    containerHeight,
  } = props;
  const store = useSelector((state: AppState) => state.contactsReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuth();
  const roleId = user?.role?.roleId;
  const [selectOpen, setSelectOpen] = useState(false);

  const handleStatusChange = async (status: any) => {
    setAnchorEl(null);
    setEditLoading(true);
    const response = await axios.patch(`/contact/${store.currentData.id}`, {
      status,
    });
    toast.success(`Contact updated successfully.`);
    onUpdated(response.data?.data);
  };

  return (
    <Box
      sx={{
        width: '60%',
        height: '100%',
      }}
    >
      {store.currentData ? (
        <Box sx={{ height: '100%' }}>
          <Box
            display={'flex'}
            alignItems="center"
            height={60}
            alignContent={'center'}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3">Contact Details</Typography>
              <Typography variant="caption">
                Manage and update the information of your contact easily.
              </Typography>
            </Box>
            <Stack gap={0} direction="row" ml={'auto'}>
              <Tooltip title={'Quick Message'}>
                <IconButton onClick={() => handleMessage(store.currentData)}>
                  <IconMessageCircle2 size="20" stroke={1.3} />
                </IconButton>
              </Tooltip>
              <Tooltip title={'Quick Mail'}>
                <IconButton onClick={handleMail}>
                  <IconMail size="20" stroke={1.3} />
                </IconButton>
              </Tooltip>
              <Tooltip title={'Comming Soon'}>
                <span>
                  <IconButton disabled={true}>
                    <IconPhone size="20" stroke={1.3} />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>
          <Box
            sx={{
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor:
                customizer?.activeMode === 'light' ? '#cecece' : '#575757',
              padding: 1,
              maxHeight: containerHeight,
              display: 'flex',
            }}
          >
            <Box sx={{ width: '69%', marginRight: '1%' }}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Box display={'flex'}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        sx={{
                          background: '#a953df !important',
                          padding: '4px',
                        }}
                        onClick={() => setOpen(true)}
                      >
                        <IconEdit size={14} color="white" />
                      </IconButton>
                    }
                  >
                    <Avatar
                      alt={'profile'}
                      src={handleFilePreview(store.currentData.image)}
                      sx={{ width: 60, height: 60 }}
                    />
                  </Badge>
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    ml={2}
                  >
                    <Typography variant="h5">
                      {store.currentData.firstName} {store.currentData.lastName}
                    </Typography>
                    <Typography variant="body1">
                      {store.currentData.countryCode}
                      {store.currentData.phone}
                    </Typography>
                  </Box>
                </Box>
                <FormControl sx={{ mt: 0.5, pr: 1, justifyContent: 'center' }}>
                  <Chip
                    label={store?.currentData?.status}
                    onClick={(e: any) => setAnchorEl(e.currentTarget)}
                    onDelete={(e: any) => setAnchorEl(e.currentTarget)}
                    deleteIcon={<IconChevronDown />}
                    size="small"
                    color={
                      store?.currentData?.status === 'ACTIVE'
                        ? 'success'
                        : 'error'
                    }
                    disabled={editLoading}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={(e) => setAnchorEl(null)}
                  >
                    <MenuItem
                      dense
                      value={'ACTIVE'}
                      onClick={(e) => handleStatusChange('ACTIVE')}
                    >
                      ACTIVE
                    </MenuItem>
                    <MenuItem
                      dense
                      value={'BLOCKED'}
                      onClick={(e) => handleStatusChange('BLOCKED')}
                    >
                      BLOCKED
                    </MenuItem>
                  </Menu>
                </FormControl>
              </Box>

              {(roleId !== 3 ||
                store?.currentData?.createdById === user?.uid) && (
                <ToggleButtonGroup
                  value={store?.currentData?.isShared}
                  exclusive
                  size="small"
                  onChange={async (event, flag) => {
                    console.log(flag);
                    if (flag !== null) {
                      try {
                        setEditLoading(true);
                        const response = await axios.patch(
                          `/contact/${store?.currentData?.id}`,
                          {
                            isShared: flag,
                          },
                        );
                        toast.success(`Contact updated successfully.`);
                        onUpdated(response.data?.data);
                      } catch (error) {
                        console.error(error);
                        toast.error(
                          (error as any)?.message ||
                            'API Error! Please try again.',
                        );
                      }
                    }
                  }}
                  disabled={editLoading}
                  sx={{
                    marginTop: 2,
                  }}
                >
                  <StyledToggleButton value={false} aria-label="personal">
                    Personal
                  </StyledToggleButton>
                  <StyledToggleButton
                    value={true}
                    aria-label="company"
                    sx={{ marginLeft: '-10px !important' }}
                  >
                    Company
                  </StyledToggleButton>
                </ToggleButtonGroup>
              )}

              <SimpleBarReact
                style={{
                  maxHeight: `${containerHeight - 125}px`,
                  marginTop: '10px',
                  width: '100%',
                }}
              >
                <Grid container columnSpacing={1}>
                  <Grid item xs={12} mt={2}>
                    <Typography variant="h5">Personal Information</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        id={'firstName'}
                        defaultValue={store.currentData?.firstName}
                        label={'First Name'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const element = document.getElementById('firstName');
                          const firstName = (element as any)?.value;
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { firstName },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        id={'lastName'}
                        defaultValue={store.currentData?.lastName}
                        label={'Phone Number'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const element = document.getElementById('lastName');
                          const lastName = (element as any)?.value;
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { lastName },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'number'}
                        id={'phone'}
                        defaultValue={store.currentData?.phone}
                        label={'Phone Number'}
                        size="small"
                        disabled={editLoading}
                        onBlur={async () => {
                          try {
                            const element = document.getElementById('phone');
                            const phone = (element as any)?.value;
                            if (!Boolean(phone)) {
                              toast.error('Phone Number is Required Field');
                              return false;
                            }
                            setEditLoading(true);
                            const response = await axios.patch(
                              `/contact/${store.currentData.id}`,
                              { phone },
                            );
                            toast.success(`Contact updated successfully.`);
                            onUpdated(response.data?.data);
                          } catch (error) {
                            setEditLoading(false);
                            toast.error(
                              (error as any)?.message ||
                                'API Error! Please try again.',
                            );
                          }
                        }}
                        variant="filled"
                        autoComplete="off"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">+1</InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'email'}
                        id={'emailField'}
                        defaultValue={store.currentData?.email}
                        label={'Email Address'}
                        size="small"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const element = document.getElementById('emailField');
                          const email = (element as any)?.value;
                          if (!Boolean(email)) {
                            return false;
                          }
                          const emailRegex =
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                          if (!emailRegex.test(email)) {
                            toast.error('Invalid Email!');
                            return false;
                          }
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { email },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        autoComplete="off"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Divider item xs={12} />
                  <Grid item xs={12}>
                    <Typography variant="h5">Company Information</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'jobTitle'}
                        defaultValue={store.currentData?.jobTitle}
                        label={'Job Title'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const element = document.getElementById('jobTitle');
                          const jobTitle = (element as any)?.value || '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { jobTitle },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'company'}
                        defaultValue={store.currentData?.company}
                        label={'Company'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const element = document.getElementById('company');
                          const company = (element as any)?.value || '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { company },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'number'}
                        id={'officePhone'}
                        defaultValue={store.currentData?.officePhone}
                        label={'Office Phone'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          try {
                            const element =
                              document.getElementById('officePhone');
                            const officePhone = (element as any)?.value;
                            setEditLoading(true);
                            const response = await axios.patch(
                              `/contact/${store.currentData.id}`,
                              { officePhone },
                            );
                            toast.success(`Contact updated successfully.`);
                            onUpdated(response.data?.data);
                          } catch (error) {
                            setEditLoading(false);
                            toast.error(
                              (error as any)?.message ||
                                'API Error! Please try again.',
                            );
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">+1</InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'officeWebsite'}
                        defaultValue={store.currentData?.officeWebsite}
                        label={'Office Website'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const element =
                            document.getElementById('officeWebsite');
                          const officeWebsite = (element as any)?.value || '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { officeWebsite },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Divider item xs={12} />
                  <Grid item xs={12}>
                    <Typography variant="h5">Address Information</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'street'}
                        defaultValue={store.currentData?.address?.street}
                        label={'Address Street'}
                        size="small"
                        autoComplete="off"
                        disabled={editLoading}
                        onBlur={async () => {
                          const street =
                            (document.getElementById('street') as any)?.value ||
                            '';
                          const city =
                            (document.getElementById('city') as any)?.value ||
                            '';
                          const state =
                            (document.getElementById('state') as any)?.value ||
                            '';
                          const zip =
                            (document.getElementById('zip') as any)?.value ||
                            '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { address: { street, city, state, zip } },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        variant="filled"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'city'}
                        defaultValue={store.currentData?.address?.city}
                        label={'Address Street'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const street =
                            (document.getElementById('street') as any)?.value ||
                            '';
                          const city =
                            (document.getElementById('city') as any)?.value ||
                            '';
                          const state =
                            (document.getElementById('state') as any)?.value ||
                            '';
                          const zip =
                            (document.getElementById('zip') as any)?.value ||
                            '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { address: { street, city, state, zip } },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'state'}
                        defaultValue={store.currentData?.address?.state}
                        label={'Address State'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const street =
                            (document.getElementById('street') as any)?.value ||
                            '';
                          const city =
                            (document.getElementById('city') as any)?.value ||
                            '';
                          const state =
                            (document.getElementById('state') as any)?.value ||
                            '';
                          const zip =
                            (document.getElementById('zip') as any)?.value ||
                            '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { address: { street, city, state, zip } },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <CustomTextField
                        type={'text'}
                        id={'zip'}
                        defaultValue={store.currentData?.address?.zip}
                        label={'Address Zip Code'}
                        size="small"
                        autoComplete="off"
                        variant="filled"
                        disabled={editLoading}
                        onBlur={async () => {
                          const street =
                            (document.getElementById('street') as any)?.value ||
                            '';
                          const city =
                            (document.getElementById('city') as any)?.value ||
                            '';
                          const state =
                            (document.getElementById('state') as any)?.value ||
                            '';
                          const zip =
                            (document.getElementById('zip') as any)?.value ||
                            '';
                          setEditLoading(true);
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { address: { street, city, state, zip } },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {editLoading && (
                                <CircularProgress
                                  color="primary"
                                  sx={{
                                    height: '20px !important',
                                    width: '20px !important',
                                    marginRight: 1,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Divider item xs={12} />
                  <Grid item xs={12}>
                    <Typography variant="h5">Sales Information</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <InputLabel id="type">Contact Type</InputLabel>
                      <Select
                        size="small"
                        id="type"
                        label={'Contact Type'}
                        defaultValue={store.currentData?.ContactCategory?.id}
                        disabled={editLoading}
                        variant="filled"
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                        onChange={async (event) => {
                          setEditLoading(true);
                          const contactCategoryId =
                            event?.target?.value || null;
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { contactCategoryId },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                      >
                        {store.contactCategory.map(
                          (option: any, index: number) => {
                            return (
                              <MenuItem dense key={index} value={option?.value}>
                                {option?.label}
                              </MenuItem>
                            );
                          },
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <InputLabel id="service">Service</InputLabel>
                      <Select
                        size="small"
                        id={'service'}
                        value={store?.currentData?.servicesId || []}
                        disabled={editLoading}
                        multiple
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                        variant="filled"
                        onClose={() => setSelectOpen(false)}
                        onOpen={() => setSelectOpen(true)}
                        open={selectOpen}
                        onChange={async (event) => {
                          setSelectOpen(false);
                          setEditLoading(true);
                          const servicesId = event?.target?.value || [];
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { servicesId },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                      >
                        {store.contactService.map(
                          (option: any, index: number) => {
                            return (
                              <MenuItem key={index} value={option?.value}>
                                {option?.label}
                              </MenuItem>
                            );
                          },
                        )}
                      </Select>
                    </FormControl>
                    <Button
                      id="click-me"
                      variant="contained"
                      sx={{ display: 'none' }}
                    >
                      1
                    </Button>
                  </Grid>
                  <Grid item lg={6} xs={12} mt={2}>
                    <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                      <InputLabel id="type">Stage</InputLabel>
                      <Select
                        size="small"
                        id={'stage'}
                        defaultValue={store.currentData?.stage}
                        disabled={editLoading}
                        variant="filled"
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                        onChange={async (event) => {
                          setEditLoading(true);
                          const stage = event?.target?.value || null;
                          const response = await axios.patch(
                            `/contact/${store.currentData.id}`,
                            { stage },
                          );
                          toast.success(`Contact updated successfully.`);
                          onUpdated(response.data?.data);
                        }}
                      >
                        {CONTACT_STAGES.map((option: any, index: number) => {
                          return (
                            <MenuItem key={index} value={option?.value}>
                              {option?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Divider item xs={12} />
                </Grid>
              </SimpleBarReact>
            </Box>

            <ContactSideBar
              onUpdated={onUpdated}
              containerHeight={containerHeight}
            />

            <ContactPictureDialog
              open={open}
              onClose={() => setOpen(false)}
              handleFilePreview={handleFilePreview}
              onUpdated={onUpdated}
            />
          </Box>
        </Box>
      ) : (
        <Box
          marginTop={'20px'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'column'}
          height={'100%'}
        >
          <IconAddressBook size={108} stroke={0.5} style={{ opacity: 0.5 }} />
          <Typography sx={{ opacity: 0.5 }}>
            Select a contact to view details.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContactDetails;
