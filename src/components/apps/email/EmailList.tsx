import { List } from '@mui/material';

import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import { useDispatch } from '../../../store/Store';
import { EmailType } from '../../../types/apps/email';

import EmailListItem from './EmailListItem';

interface Props {
  showrightSidebar: any;
  emails: any;
  selectedEmailThread: any;
  setSelectedEmailThread: any;
  composeEmail: any;
  draftEmail: any;
  setDraftEmail: any;
}

const EmailList = ({
  showrightSidebar,
  emails,
  selectedEmailThread,
  setSelectedEmailThread,
  composeEmail,
  draftEmail,
  setDraftEmail,
}: Props) => {
  const dispatch = useDispatch();

  const getVisibleEmail = (
    emails: EmailType[],
    filter: string,
    emailSearch: string,
  ) => {
    switch (filter) {
      case 'inbox':
        return emails.filter(
          (t) =>
            t.inbox &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'sent':
        return emails.filter(
          (t) =>
            t.sent &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'draft':
        return emails.filter(
          (t) =>
            t.draft &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'spam':
        return emails.filter(
          (t) =>
            t.spam &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'trash':
        return emails.filter(
          (t) => t.trash && t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'starred':
        return emails.filter(
          (t) =>
            t.starred &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'important':
        return emails.filter(
          (t) =>
            t.important &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'Promotional':
        return emails.filter(
          (t) =>
            t.label === 'Promotional' &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'Social':
        return emails.filter(
          (t) =>
            t.label === 'Social' &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      case 'Health':
        return emails.filter(
          (t) =>
            t.label === 'Health' &&
            !t.trash &&
            t.from.toLocaleLowerCase().includes(emailSearch),
        );
      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  };

  const active = {};
  return (
    <>
      {emails.map((email: any) => (
        <EmailListItem
          key={email.id}
          {...email}
          thread={email}
          onClick={() => {
            setSelectedEmailThread(email);
            showrightSidebar();
          }}
          isSelected={email.id === active}
        />
      ))}
    </>
  );
};

export default EmailList;
