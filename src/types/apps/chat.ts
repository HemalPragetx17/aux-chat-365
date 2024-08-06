export interface ChatsType {
  id: string;
  to?: string;
  Contact?: {
    image: any;
    firstName: string;
    lastName: string;
  };
  Message: any[];
  lastMessageDirection: string;
  lastMessage: string;
  from: string;
  locked: any;
  lastMessageTime: any;
  Did?: {
    title: string;
    countryCode: string;
    phoneNumber: string;
  };
  notes: any;
}
