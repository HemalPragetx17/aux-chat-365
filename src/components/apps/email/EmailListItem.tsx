import {
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface EmailListType {
  id: number;
  from: string;
  subject: string;
  time: string;
  unread: boolean;
  starred: boolean;
  important: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onStar: React.MouseEventHandler<SVGAElement>;
  onImportant: React.MouseEventHandler<SVGAElement>;
  onDelete: React.MouseEventHandler<SVGAElement>;
  checked?: boolean;
  isSelected: boolean;
  first_message_timestamp: number;
  thread: any;
}

const EmailListItem = ({
  id,
  onClick,
  onChange,
  onStar,
  onImportant,
  from,
  subject,
  time,
  checked,
  label,
  starred,
  onDelete,
  important,
  isSelected,
  first_message_timestamp,
  thread,
}: EmailListType) => {
  const theme = useTheme();

  const warningColor = theme.palette.warning.main;
  const errorColor = theme.palette.error.light;
  const [emailFrom, setEmailFrom] = useState('Unknown');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [hasCalendar, setHasCalendar] = useState(false);

  useEffect(() => {
    if (thread?.messages?.length) {
      setEmailFrom(thread.messages[0].from?.[0]?.email || 'Unknown');

      checkFiles: for (const msg of thread.messages) {
        if (msg.files?.length) {
          for (const file of msg.files) {
            if (
              file.content_type.includes('calendar') ||
              file.content_type.includes('ics')
            ) {
              setHasCalendar(true);
            } else if (file.content_disposition === 'attachment') {
              setHasAttachment(true);
            }

            if (hasAttachment && hasCalendar) break checkFiles;
          }
        }
      }
    }

    if (thread?.object === 'draft') {
      setEmailFrom('(draft)');
    }
  }, [thread]);

  return (
    <ListItemButton
      sx={{
        p: 1,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      selected={isSelected}
      alignItems="flex-start"
    >
      {/* <ListItemIcon sx={{ minWidth: '35px', mt: '0' }}>
        <CustomCheckbox
          edge="start"
          id={`check${id}`}
          tabIndex={-1}
          onChange={onChange}
        />
      </ListItemIcon> */}
      <ListItemText onClick={onClick}>
        <Stack direction="row" gap="10px" alignItems="center">
          <Typography variant="subtitle2" mb={0.5} fontWeight={600} mr={'auto'}>
            {emailFrom}
          </Typography>
          {/* <Chip
            label={label}
            size="small"
            color={
              label === 'Promotional'
                ? 'primary'
                : label === 'Social'
                  ? 'error'
                  : 'success'
            }
          /> */}
        </Stack>
        <Typography
          variant="subtitle2"
          noWrap
          width={'80%'}
          color="text.secondary"
        >
          {thread.subject || '(no subject)'}
        </Typography>
        {/* <Stack direction="row" mt={1} gap="10px" alignItems="center">
          <IconStar
            // onClick={onStar}
            stroke={1}
            size="18"
            style={{
              fill: thread.starred ? warningColor : '',
              stroke: thread.starred ? warningColor : '',
            }}
          />
          <IconAlertCircle
            // onClick={onImportant}
            size="18"
            stroke={1.2}
            style={{ fill: important ? errorColor : '' }}
          />
          {checked && (
            <IconTrash
              // onClick={onDelete}
              stroke={1.5}
              size="16"
            />
          )}
          <Typography variant="caption" noWrap sx={{ ml: 'auto' }}>
            {}
            {formatDistanceToNowStrict(
              new Date(Math.floor(thread.last_message_timestamp * 1000)),
              {
                addSuffix: false,
              },
            )}{' '}
            ago
          </Typography>
        </Stack> */}
      </ListItemText>
    </ListItemButton>
  );
};

export default EmailListItem;
