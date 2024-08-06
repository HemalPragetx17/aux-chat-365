import { yupResolver } from '@hookform/resolvers/yup';
import {
  LoadingButton,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useAuth } from '../../../hooks/useAuth';
import { AppState, dispatch, useSelector } from '../../../store/Store';
import { updateChatContact } from '../../../store/apps/chat/ChatSlice';
import axios from '../../../utils/axios';
import { STATUS_COLOR } from '../../../utils/constant';
import { toLocalDate } from '../../../utils/date';
import { cleanPhoneNumber } from '../../../utils/format';
import CustomTextField from '../../custom/CustomTextField';
import CustomFormTextArea from '../../custom/form/CustomFormTextArea';
import SingleContactForm, {
  CONTACT_STAGES,
} from '../../forms/contact/SingleContactForm';
import ContactCustomFieldForm from '../contacts/single/ContactCustomFieldForm';

interface chatType {
  selectedChat?: any;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
});

const ChatContactArea = (props: chatType) => {
  const { selectedChat } = props;
  const { Contact } = selectedChat;
  const { user } = useAuth();
  const roleId = user?.role?.roleId;
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editList, setEditList] = useState<any>({});
  const { contactCategory, contactService } = useSelector(
    (state: AppState) => state.contactsReducer,
  );
  const [openForm, setOpenForm] = useState<boolean>(false);

  useEffect(() => {
    setEditList({});
    setOpenForm(false);
    reset(defaultValues);
    setEditLoading(false);
  }, [Contact]);

  const resetEdit = async (formBody: any) => {
    setEditLoading(true);
    const response = await axios.patch(`/contact/${Contact.id}`, formBody);
    toast.success(`Contact updated successfully.`);
    await dispatch(updateChatContact(response.data?.data?.data));
    setEditList({});
    setEditLoading(false);
    setOpenForm(false);
  };

  const schema = yup.object().shape({
    note: yup.string().required('Notes is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
    }),
    [],
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setEditList({});
      setEditLoading(true);
      const response = await axios.put(`/contact/note/${Contact.id}/`, data);
      if (response) {
        await dispatch(updateChatContact(response?.data?.data));
        reset(defaultValues);
      }
      setEditLoading(false);
    } catch (error) {
      console.error(error);
      setEditLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleFilePreview = (image: any) => {
    if (!Boolean(image)) {
      return '/images/profile/thumb.png';
    }
    return image;
  };

  const handleImageUpload = async (event: any) => {
    const file = event?.target?.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        try {
          const header = {
            headers: {
              'Content-Type': 'multipart/form-data',
              bodyParser: false,
            },
          };
          const response = await axios.put(
            `/contact/upload/${Contact?.id}`,
            { file },
            header,
          );
          await dispatch(updateChatContact(response?.data));
        } catch (error) {
          toast.error(
            (error as any)?.message || 'API Error! Please try again.',
          );
        }
      } else {
        toast.error('Only File Type Image Format Allowed!');
      }
    }
  };

  return (
    <>
      <Box>
        {Contact ? (
          <Box>
            <Box display="flex">
              <Button
                sx={{ width: '60px', height: '60px' }}
                component="label"
                variant="text"
              >
                <Avatar
                  alt={'profile'}
                  variant="square"
                  src={handleFilePreview(Contact.image?.src)}
                  sx={{ width: '60px', height: '60px', borderRadius: 1 }}
                />
                <VisuallyHiddenInput
                  onChange={handleImageUpload}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </Button>
              <Box ml={2} width={'100%'}>
                <Box>
                  {editList.firstName ? (
                    <>
                      <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                        <CustomTextField
                          id={'firstName'}
                          defaultValue={Contact?.firstName}
                          placeholder={'First Name'}
                          size="small"
                          autoComplete="off"
                          variant="standard"
                          disabled={editLoading}
                          onBlur={async () => {
                            const element =
                              document.getElementById('firstName');
                            const firstName = (element as any)?.value;
                            await resetEdit({ firstName });
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
                      <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                        <CustomTextField
                          id={'lastName'}
                          defaultValue={Contact?.lastName}
                          placeholder={'Phone Number'}
                          size="small"
                          autoComplete="off"
                          variant="standard"
                          disabled={editLoading}
                          onBlur={async () => {
                            const element = document.getElementById('lastName');
                            const lastName = (element as any)?.value;
                            await resetEdit({ lastName });
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
                    </>
                  ) : (
                    <Box
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditList({
                          firstName: true,
                        })
                      }
                    >
                      {Boolean(Contact.firstName) ? (
                        <>
                          {Contact.firstName} {Contact.lastName}
                        </>
                      ) : (
                        <Skeleton height={30} />
                      )}
                    </Box>
                  )}
                  <Typography variant="body2">{Contact.phone}</Typography>
                  <Box>
                    {editList.email ? (
                      <FormControl
                        fullWidth
                        sx={{ mt: 0.5, pr: 1, width: '67%' }}
                      >
                        <CustomTextField
                          type={'email'}
                          id={'emailField'}
                          defaultValue={Contact?.email}
                          placeholder={'Email Address'}
                          size="small"
                          disabled={editLoading}
                          variant="standard"
                          onBlur={async () => {
                            const element =
                              document.getElementById('emailField');
                            const email = (element as any)?.value;
                            if (!Boolean(email)) {
                              setEditList({});
                              return false;
                            }
                            const emailRegex =
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            if (!emailRegex.test(email)) {
                              toast.error('Invalid Email!');
                              return false;
                            }
                            await resetEdit({ email });
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
                    ) : (
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          setEditList({
                            email: true,
                          })
                        }
                      >
                        {Contact.email ? (
                          <Typography variant="body2">
                            {Contact.email}
                          </Typography>
                        ) : (
                          <Skeleton height={40} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            {Contact.isShared ||
            Contact?.createdById === user?.uid ||
            roleId === 3 ? (
              <Grid container mb={2}>
                <Grid
                  item
                  xs={12}
                  mt={2}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    width={'33%'}
                  >
                    Job Title
                  </Typography>
                  {editList.jobTitle ? (
                    <FormControl
                      fullWidth
                      sx={{ mt: 0.5, pr: 1, width: '67%' }}
                    >
                      <CustomTextField
                        type={'text'}
                        id={'jobTitle'}
                        defaultValue={Contact?.jobTitle}
                        placeholder={'Job Title'}
                        size="small"
                        autoComplete="off"
                        variant="standard"
                        onBlur={async () => {
                          const element = document.getElementById('jobTitle');
                          const jobTitle = (element as any)?.value || '';
                          await resetEdit({ jobTitle });
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
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditList({
                          jobTitle: true,
                        })
                      }
                    >
                      {Contact.jobTitle || 'N/A'}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    width={'33%'}
                  >
                    Company
                  </Typography>
                  {editList.company ? (
                    <FormControl
                      fullWidth
                      sx={{ mt: 0.5, pr: 1, width: '67%' }}
                    >
                      <CustomTextField
                        type={'text'}
                        id={'company'}
                        defaultValue={Contact?.company}
                        placeholder={'Company'}
                        size="small"
                        autoComplete="off"
                        variant="standard"
                        onBlur={async () => {
                          const element = document.getElementById('company');
                          const company = (element as any)?.value || '';
                          await resetEdit({ company });
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
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditList({
                          company: true,
                        })
                      }
                    >
                      {Contact.company || 'N/A'}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    width={'33%'}
                  >
                    Status
                  </Typography>
                  {editList.status ? (
                    <FormControl
                      fullWidth
                      sx={{ mt: 0.5, pr: 1, width: '67%' }}
                    >
                      <Select
                        size="small"
                        id={'status'}
                        defaultValue={Contact?.status}
                        disabled={editLoading}
                        onChange={async (event) => {
                          await resetEdit({ status: event?.target.value });
                        }}
                        variant="standard"
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                      >
                        <MenuItem value={'ACTIVE'}>ACTIVE</MenuItem>
                        <MenuItem value={'BLOCKED'}>BLOCKED</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      onClick={() =>
                        setEditList({
                          status: true,
                        })
                      }
                    >
                      <Chip
                        label={Contact.status}
                        color={
                          STATUS_COLOR[
                            Contact.status as keyof typeof STATUS_COLOR
                          ] as any
                        }
                        size="small"
                        sx={{ cursor: 'pointer' }}
                      />
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    width={'33%'}
                  >
                    Address
                  </Typography>
                  {editList.address ? (
                    <Box display={'flex'} flexDirection={'column'}>
                      <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                        <CustomTextField
                          type={'text'}
                          id={'street'}
                          defaultValue={Contact?.address?.street}
                          placeholder={'Address Street'}
                          size="small"
                          autoComplete="off"
                          onBlur={async () => {
                            const street =
                              (document.getElementById('street') as any)
                                ?.value || '';
                            const city =
                              (document.getElementById('city') as any)?.value ||
                              '';
                            const state =
                              (document.getElementById('state') as any)
                                ?.value || '';
                            const zip =
                              (document.getElementById('zip') as any)?.value ||
                              '';
                            await resetEdit({
                              address: { street, city, state, zip },
                            });
                          }}
                          variant="standard"
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
                      <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                        <CustomTextField
                          type={'text'}
                          id={'city'}
                          defaultValue={Contact?.address?.city}
                          placeholder={'Address Street'}
                          size="small"
                          autoComplete="off"
                          variant="standard"
                          onBlur={async () => {
                            const street =
                              (document.getElementById('street') as any)
                                ?.value || '';
                            const city =
                              (document.getElementById('city') as any)?.value ||
                              '';
                            const state =
                              (document.getElementById('state') as any)
                                ?.value || '';
                            const zip =
                              (document.getElementById('zip') as any)?.value ||
                              '';
                            await resetEdit({
                              address: { street, city, state, zip },
                            });
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
                      <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                        <CustomTextField
                          type={'text'}
                          id={'state'}
                          defaultValue={Contact?.address?.state}
                          placeholder={'Address State'}
                          size="small"
                          autoComplete="off"
                          variant="standard"
                          onBlur={async () => {
                            const street =
                              (document.getElementById('street') as any)
                                ?.value || '';
                            const city =
                              (document.getElementById('city') as any)?.value ||
                              '';
                            const state =
                              (document.getElementById('state') as any)
                                ?.value || '';
                            const zip =
                              (document.getElementById('zip') as any)?.value ||
                              '';
                            await resetEdit({
                              address: { street, city, state, zip },
                            });
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
                      <FormControl fullWidth sx={{ mt: 0.5, pr: 1 }}>
                        <CustomTextField
                          type={'text'}
                          id={'zip'}
                          defaultValue={Contact?.address?.zip}
                          placeholder={'Address Zip Code'}
                          size="small"
                          autoComplete="off"
                          variant="standard"
                          onBlur={async () => {
                            const street =
                              (document.getElementById('street') as any)
                                ?.value || '';
                            const city =
                              (document.getElementById('city') as any)?.value ||
                              '';
                            const state =
                              (document.getElementById('state') as any)
                                ?.value || '';
                            const zip =
                              (document.getElementById('zip') as any)?.value ||
                              '';
                            await resetEdit({
                              address: { street, city, state, zip },
                            });
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
                    </Box>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      sx={{
                        cursor: 'pointer',
                        minHeight: '20px',
                      }}
                      onClick={() =>
                        setEditList({
                          address: true,
                        })
                      }
                    >
                      {Boolean(Contact.address?.street) &&
                        `${Contact.address?.street}, `}
                      {Boolean(Contact.address?.city) &&
                        `${Contact.address?.city}, `}
                      {Boolean(Contact.address?.state) &&
                        `${Contact.address?.state}, `}
                      {Boolean(Contact.address?.zip) &&
                        `${Contact.address?.zip} `}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    width={'33%'}
                    color="text.secondary"
                  >
                    Contact Type
                  </Typography>
                  {editList.contactType ? (
                    <FormControl
                      fullWidth
                      sx={{ mt: 0.5, pr: 1, width: '67%' }}
                    >
                      <Select
                        size="small"
                        id="type"
                        defaultValue={Contact?.ContactCategory?.id}
                        disabled={editLoading}
                        variant="standard"
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                        onChange={async (event) => {
                          const contactCategoryId =
                            event?.target?.value || null;
                          await resetEdit({ contactCategoryId });
                        }}
                      >
                        {contactCategory.map((option: any, index: number) => {
                          return (
                            <MenuItem dense key={index} value={option?.value}>
                              {option?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditList({
                          contactType: true,
                        })
                      }
                    >
                      {Contact?.ContactCategory?.name || 'N/A'}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    width={'33%'}
                    color="text.secondary"
                  >
                    Service
                  </Typography>
                  {editList.service ? (
                    <FormControl
                      fullWidth
                      sx={{ mt: 0.5, pr: 1, width: '67%' }}
                    >
                      <Select
                        size="small"
                        id={'service'}
                        value={Contact?.servicesId || []}
                        disabled={editLoading}
                        multiple
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                        variant="standard"
                        onChange={async (event) => {
                          const servicesId = event?.target?.value || [];
                          await resetEdit({ servicesId });
                        }}
                      >
                        {contactService.map((option: any, index: number) => {
                          return (
                            <MenuItem key={index} value={option?.value}>
                              {option?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditList({
                          service: true,
                        })
                      }
                    >
                      {Contact?.Services?.length > 0
                        ? Contact?.Services[0]?.name
                        : 'N/A'}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={1}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body2"
                    width={'33%'}
                    color="text.secondary"
                  >
                    Stage
                  </Typography>
                  {editList.stage ? (
                    <FormControl
                      fullWidth
                      sx={{ mt: 0.5, pr: 1, width: '67%' }}
                    >
                      <Select
                        size="small"
                        id={'stage'}
                        defaultValue={Contact?.stage}
                        disabled={editLoading}
                        variant="standard"
                        endAdornment={
                          editLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={24} />
                            </InputAdornment>
                          ) : null
                        }
                        onChange={async (event) => {
                          const stage = event?.target?.value || null;
                          await resetEdit({ stage });
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
                  ) : (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      width={'67%'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditList({
                          stage: true,
                        })
                      }
                    >
                      {Contact?.stage || 'N/A'}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} mt={1} />
                <ContactCustomFieldForm
                  currentData={Contact}
                  success={(response) => {
                    dispatch(updateChatContact(response.data));
                  }}
                />
                <Box>
                  {Contact.notes?.length > 0 && (
                    <Timeline>
                      {Contact.notes?.map((note: any, index: number) => {
                        return (
                          <TimelineItem key={index}>
                            <TimelineSeparator>
                              <TimelineDot color="primary" />
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent
                              sx={{
                                '& svg': { verticalAlign: 'bottom', mx: 4 },
                              }}
                            >
                              <Box
                                sx={{
                                  mb: 0.5,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    color: 'text.primary',
                                  }}
                                >
                                  {note.createdBy}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'text.disabled' }}
                                >
                                  {toLocalDate(note.createdAt).format(
                                    `MM-DD-YYYY, hh:mm:ss A`,
                                  )}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ display: 'flex', flexWrap: 'wrap' }}
                              >
                                {note.note}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        );
                      })}
                    </Timeline>
                  )}
                </Box>
                <form style={{ marginTop: 30 }}>
                  <CustomFormTextArea
                    name={'note'}
                    label={'Enter Notes'}
                    errors={errors}
                    control={control}
                    rows={3}
                  />
                  <LoadingButton
                    variant="contained"
                    sx={{
                      background:
                        'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                    }}
                    fullWidth
                    loading={editLoading}
                    onClick={() => handleSubmit(onSubmit)()}
                  >
                    Add Note
                  </LoadingButton>
                </form>
              </Grid>
            ) : (
              <Alert severity="error" icon={false} sx={{ mt: 2 }}>
                This is a private contact.
              </Alert>
            )}
          </Box>
        ) : (
          <Box mb={2}>
            <Box display="flex">
              <Skeleton variant="rounded" width={60} height={60} />
              <Box ml={2}>
                <Skeleton
                  variant="rectangular"
                  width={180}
                  height={25}
                  sx={{ marginBottom: 1 }}
                />
                <Skeleton variant="rectangular" width={180} height={25} />
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenForm(true)}
              style={{
                marginTop: 20,
                marginBottom: 20,
                background:
                  'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)',
                color: 'white',
              }}
            >
              Add Contact
            </Button>
          </Box>
        )}
      </Box>
      <SingleContactForm
        open={openForm}
        chatContact={true}
        toggle={() => setOpenForm(false)}
        currentData={{ phone: cleanPhoneNumber(selectedChat.to) }}
        success={async (response) => {
          setOpenForm(false);
          dispatch(updateChatContact(response?.data));
        }}
        addFlag={true}
      />
    </>
  );
};

export default ChatContactArea;
