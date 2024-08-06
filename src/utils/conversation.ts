import { ChatsType } from '../types/apps/chat';

export const getChatHead = (chat: ChatsType) => {
  const { to, Contact } = chat;
  if (Boolean(Contact?.firstName)) {
    let name = `${Contact?.firstName} ${Contact?.lastName}`;
    name = name.length > 18 ? `${name.substring(0, 18)}...` : name;
    return name;
  }
  return processPhoneNumber(to);
};

export const getChatHeadMain = (chat: ChatsType) => {
  const { to, Contact } = chat;
  if (Boolean(Contact?.firstName)) {
    return `${Contact?.firstName} ${Contact?.lastName}`;
  }
  return processPhoneNumber(to);
};

export const getDetails = (chat: ChatsType) => {
  const { lastMessageDirection, lastMessage } = chat;
  if (lastMessage) {
    const sender = lastMessageDirection === 'OUTBOUND' ? 'You: ' : '';
    const message =
      lastMessage?.length > 20
        ? `${lastMessage.substring(0, 20)}...`
        : lastMessage;
    return sanitizeHtml(`${sender}${message}`);
  }
  return 'File';
};

export const getChatFrom = (chat: ChatsType) => {
  const { Did } = chat;
  return `${Did?.phoneNumber} (${Did?.title})`;
};

export const processPhoneNumber = (phoneNumber: any): string => {
  const pattern = phoneNumber.startsWith('+1') ? /^\+1/ : /^\+/;
  const sanitizedNumber = phoneNumber.replace(pattern, '');
  return sanitizedNumber;
};

export const sanitizeHtml = (input: string): string => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.body.textContent || '';
};
