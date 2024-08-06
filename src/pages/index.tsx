import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import PageContainer from '../components/container/PageContainer';
import CustomPickerRange from '../components/custom/CustomPickerRange';
import TopCards from '../components/dashboards/TopCards';
import { useAuth } from '../hooks/useAuth';
import axios from '../utils/axios';

const topcards: any = [
  {
    icon: 'tabler:messages',
    title: 'Total Messages',
    bgcolor: '#351C01',
    color: 'rgb(93, 135, 255)',
  },
  {
    icon: 'tabler:message',
    title: 'This Month Messages',
    bgcolor: '#351C01',
    color: 'rgb(255, 174, 31)',
  },
  {
    icon: 'tabler:message-plus',
    title: 'This Week Messages',
    bgcolor: '#351C01',
    color: 'rgb(73, 190, 255)',
  },
  {
    icon: 'tabler:message-2-dollar',
    title: "Today's Messages",
    bgcolor: '#351C01',
    color: 'rgb(250, 137, 107)',
  },
  {
    icon: 'tabler:percentage',
    title: 'Total Account',
    bgcolor: '#351C01',
    color: 'rgb(19, 222, 185)',
  },
  {
    icon: 'tabler:settings',
    title: "Total DID's",
    bgcolor: '#351C01',
    color: 'rgb(83, 155, 255)',
  },
  {
    icon: 'tabler:keyboard',
    title: 'Total Keywords',
    bgcolor: '#351C01',
    color: 'rgb(173 21 201)',
  },
  {
    icon: 'tabler:user',
    title: 'Total Contacts',
    bgcolor: '#351C01',
    color: 'rgb(218 8 8)',
  },
];

const didCard: any = [
  {
    icon: 'tabler:messages',
    title: 'Total Messages',
    bgcolor: '#49A8FF',
    color: '#000',
    isDidTrue: true,
  },
  {
    icon: 'tabler:mail-forward',
    title: 'Inbounds',
    bgcolor: '#49A8FF',
    color: '#000',
    isDidTrue: true,
  },
  {
    icon: 'tabler:send',
    title: 'Outbounds',
    bgcolor: '#49A8FF',
    color: '#000',
    isDidTrue: true,
  },
  {
    icon: 'tabler:arrow-autofit-left',
    title: 'Auto Reply',
    bgcolor: '#49A8FF',
    color: '#000',
    isDidTrue: true,
  },
];

export default function Dashboard() {
  const [topCards, setTopCards] = useState<any>(topcards);
  const [didCardList, setDidCardList] = useState<any>(didCard);
  const [roleId, setRoleId] = useState<any>(0);
  const [adminList, setAdminList] = useState<any>([]);
  const [admin, setAdmin] = useState<any>('none');
  const [did, setDid] = useState<any>('');
  const todayDate = moment.utc().format('YYYY-MM-DD');
  const [date, setDate] = useState<any>([todayDate, todayDate]);
  const { user } = useAuth();
  const [didList, setDidList] = useState<any>([]);

  useEffect(() => {
    const roleId = user?.role?.roleId;
    switch (roleId) {
      case 1: {
        fetchMasterAdminTopCardData();
        fetchAdminList();
        break;
      }
      case 2: {
        fetchAdminTopCardData();
        setAdmin(user?.uid);
        break;
      }
      case 3: {
        fetchOperatorTopCardData();
        setAdmin(user?.uid);
        break;
      }
    }
    setRoleId(roleId);
  }, [user]);

  const fetchAdminTopCardData = async () => {
    const response = await axios.get(`/dashboard/admin`);
    formatTopCardData(response?.data);
  };

  const fetchMasterAdminTopCardData = async () => {
    const response = await axios.get(`/dashboard/master`);
    formatTopCardData(response?.data);
  };

  const fetchOperatorTopCardData = async () => {
    const response = await axios.get(`/dashboard/operator`);
    formatTopCardData(response?.data);
  };

  const formatTopCardData = (data: any) => {
    const {
      totalMessage,
      monthlyMessage,
      weeklyMessage,
      dailyMessage,
      totalUser,
      totalDid,
      totalKeywords,
      totalContacts,
    } = data;
    const _topCards = [...topcards];
    _topCards[0].digits = totalMessage;
    _topCards[1].digits = monthlyMessage;
    _topCards[2].digits = weeklyMessage;
    _topCards[3].digits = dailyMessage;
    _topCards[4].digits = totalUser;
    _topCards[5].digits = totalDid;
    _topCards[6].digits = totalKeywords;
    _topCards[7].digits = totalContacts;
    setTopCards(_topCards);
  };

  const fetchAdminList = useCallback(async () => {
    const response = await axios.get(`/users?type=ADMIN`);
    const users = response.status === 200 ? response.data.data : [];
    setAdminList(users);
  }, []);

  const fetchDidList = useCallback(async () => {
    const response = await axios.get(
      `/did/user/${admin}?status=ACTIVE,INACTIVE`,
    );
    let dids = response.status === 200 ? response.data.data : [];
    dids = dids.map((data: any) => ({
      label: `${data?.countryCode}${data?.phoneNumber} (${data?.title})`,
      value: data.id,
    }));
    setDidList(dids);
  }, [admin]);

  useEffect(() => {
    const flag = Boolean(did);
    if (!flag) {
      setDidCardList(didCard);
      return;
    }
    fetchDidCardData({ did, date });
  }, [did, date]);

  useEffect(() => {
    admin === 'none' ? setDidList([]) : fetchDidList();
  }, [admin]);

  const fetchDidCardData = async (data: any) => {
    const response = await axios.post(`/dashboard/did-data`, data);
    const _didData = [...didCard];
    const { totalMessage, inboundMessage, outboundMessage } = response?.data;
    _didData[0].digits = totalMessage;
    _didData[1].digits = inboundMessage;
    _didData[2].digits = outboundMessage;
    setDidCardList(_didData);
  };

  return (
    <PageContainer>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TopCards topCards={topCards} />
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={3} mt={5}>
          {roleId === 1 && (
            <Grid item sm={4} xs={12}>
              <FormControl size="small" fullWidth>
                <InputLabel id="type-select">Please Select User</InputLabel>
                <Select
                  id="select-type"
                  label="Please Select User"
                  labelId="type-select"
                  value={admin}
                  onChange={(event: any) => setAdmin(event?.target?.value)}
                  inputProps={{
                    placeholder: 'Please Select User',
                  }}
                >
                  <MenuItem value={'none'}>None</MenuItem>
                  {adminList.map((option: any, index: number) => {
                    return (
                      <MenuItem key={index} value={option?.id}>
                        {option?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item sm={4} xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel id="type-select">Please Select DID</InputLabel>
              <Select
                id="select-type"
                label="Please Select DID"
                labelId="type-select"
                value={did}
                onChange={(event: any) => setDid(event?.target?.value)}
                inputProps={{
                  placeholder: 'Please Select DID',
                }}
              >
                <MenuItem value={0}>None</MenuItem>
                {didList.map((option: any, index: number) => {
                  return (
                    <MenuItem key={index} value={option?.value}>
                      {option?.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item sm={4} xs={12}>
            <FormControl size="small" fullWidth>
              <CustomPickerRange
                onChange={setDate}
                dates={date}
                disableClear={true}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} mt={5}>
            <TopCards topCards={didCardList} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
