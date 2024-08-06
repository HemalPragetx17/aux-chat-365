import {
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  List,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useNylas } from '@nylas/nylas-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import EmailContent from '../../../components/apps/email/EmailContent';
import EmailFilter from '../../../components/apps/email/EmailFilter';
import EmailList from '../../../components/apps/email/EmailList';
import EmailSearch from '../../../components/apps/email/EmailSearch';
import axios from '../../../utils/axios';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import EmailCompose from '../../../components/apps/email/EmailCompose';

const drawerWidth = 240;
const secdrawerWidth = 340;

export default function Email() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const nylas = useNylas();
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [selectedEmailThread, setSelectedEmailThread] = useState<any>(null);
  const [draftEmail, setDraftEmail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchEmailList();
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      getEmailMessages();
    }
  }, [selectedEmail]);

  const fetchEmailList = async () => {
    const response = await axios.get(`/email-nylas`, {
      params: {
        status: 'ACTIVE',
      },
    });
    let emails = response.status === 200 ? response.data.data : [];
    emails = emails.filter((email: any) => Boolean(email.accessTokenNylas));
    setData(emails);
    const defaultEmail = emails.find((email: any) => email.isDefault);
    if (defaultEmail) {
      setSelectedEmail(defaultEmail.accessTokenNylas);
    }
  };

  const getEmailMessages = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NYLAS_API_URL + '/nylas/read-emails';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: selectedEmail }),
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setEmails(data);
        setSelectedEmailThread(null);
      } else {
        setEmails([]);
        setSelectedEmailThread(null);
      }
    } catch (e) {
      console.warn(`Error retrieving emails:`, e);
      return false;
    }
    setIsLoading(false);
  };

  const refresh = () => {
    getEmailMessages();
    setSelectedEmailThread(null);
  };

  const disconnectUser = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    setUserId('');
    setUserEmail('');
  };

  const handleEmailSelect = (thread: any) => {
    setSelectedEmailThread(thread);
    if (draftEmail?.isOpen) {
      setDraftEmail((prev: any) => {
        return { ...prev, isOpen: false };
      });
    }
  };

  const handleComposeEmail = () => {
    composeEmail();
  };

  const composeEmail = () => {
    if (draftEmail) {
      // Open the existing draft email
      setDraftEmail((prev: any) => ({ ...prev, isOpen: true }));
    } else {
      // Create new draft email
      const currentDate = new Date();
      const newDraft = {
        object: 'draft',
        to: '',
        subject: '',
        body: '',
        last_message_timestamp: Math.floor(currentDate.getTime() / 1000),
        isOpen: true,
      };
      setDraftEmail(newDraft);
    }
    setSelectedEmailThread(null);
  };

  const onEmailSent = () => {
    setDraftEmail(null);
    refresh();
    toast.success('Success');
  };

  return (
    <Card
      className="test"
      sx={{ display: 'flex', p: 0, height: '100%', padding: 0 }}
      elevation={0}
      variant={undefined}
    >
      <Drawer
        open={isLeftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            position: 'relative',
            zIndex: 2,
          },
          flexShrink: 0,
          display: 'none', // to be removed
        }}
        variant={lgUp ? 'permanent' : 'temporary'}
      >
        <EmailSearch
          onClick={() => setLeftSidebarOpen(true)}
          selectedEmail={selectedEmail}
          setSelectedEmail={setSelectedEmail}
          data={data}
        />

        <Divider />

        <EmailFilter
          emailDetails={selectedEmailThread}
          selectedEmail={selectedEmail}
          userId={userId}
          refresh={refresh}
          data={data}
        />
      </Drawer>

      <Box
        sx={{
          minWidth: secdrawerWidth,
          width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
          flexShrink: 0,
        }}
      >
        <Box display={'flex'}>
          <EmailSearch
            onClick={() => setLeftSidebarOpen(true)}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            data={data}
          />
          <EmailCompose
            emailDetails={selectedEmailThread}
            selectedEmail={selectedEmail}
            userId={userId}
            refresh={refresh}
            data={data}
          />
        </Box>

        <List>
          <Scrollbar
            sx={{
              height: 'calc(100vh - 140px)',
              maxHeight: '800px',
            }}
          >
            <EmailList
              showrightSidebar={() => setRightSidebarOpen(true)}
              emails={emails}
              selectedEmailThread={selectedEmailThread}
              setSelectedEmailThread={setSelectedEmailThread}
              composeEmail={composeEmail}
              draftEmail={draftEmail}
              setDraftEmail={setDraftEmail}
            />
          </Scrollbar>
        </List>
      </Box>

      {mdUp ? (
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            zIndex: 0,
            width: '200px',
            flex: '1 1 auto',
            [`& .MuiDrawer-paper`]: { position: 'relative' },
          }}
        >
          {selectedEmailThread && selectedEmailThread !== '' && (
            <Box>
              <EmailContent
                emailDetails={selectedEmailThread}
                userEmail={userEmail}
                selectedEmail={selectedEmail}
                userId={userId}
                refresh={refresh}
                data={data}
              />
            </Box>
          )}
        </Drawer>
      ) : (
        <Drawer
          anchor="right"
          open={isRightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: '85%' },
          }}
          variant="temporary"
        >
          {selectedEmailThread && selectedEmailThread && (
            <Box p={3}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setRightSidebarOpen(false)}
                sx={{
                  mb: 3,
                  display: { xs: 'block', md: 'none', lg: 'none' },
                }}
              >
                {' '}
                Back{' '}
              </Button>
              <EmailContent
                emailDetails={selectedEmailThread}
                userEmail={userEmail}
                userId={userId}
                selectedEmail={selectedEmail}
                refresh={refresh}
                data={data}
              />
            </Box>
          )}
        </Drawer>
      )}
    </Card>
  );
}
