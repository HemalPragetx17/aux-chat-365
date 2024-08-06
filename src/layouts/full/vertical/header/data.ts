// Notifications dropdown

interface notificationType {
  avatar: string;
  title: string;
  subtitle: string;
}

const notifications: notificationType[] = [
  {
    avatar: '/images/profile/user-1.jpg',
    title: 'Roman Joined the Team!',
    subtitle: 'Congratulate him',
  },
  {
    avatar: '/images/profile/user-2.jpg',
    title: 'New message received',
    subtitle: 'Salma sent you new message',
  },
  {
    avatar: '/images/profile/user-3.jpg',
    title: 'New Payment received',
    subtitle: 'Check your earnings',
  },
  {
    avatar: '/images/profile/user-4.jpg',
    title: 'Jolly completed tasks',
    subtitle: 'Assign her new tasks',
  },
  {
    avatar: '/images/profile/user-1.jpg',
    title: 'Roman Joined the Team!',
    subtitle: 'Congratulate him',
  },
  {
    avatar: '/images/profile/user-2.jpg',
    title: 'New message received',
    subtitle: 'Salma sent you new message',
  },
  {
    avatar: '/images/profile/user-3.jpg',
    title: 'New Payment received',
    subtitle: 'Check your earnings',
  },
  {
    avatar: '/images/profile/user-4.jpg',
    title: 'Jolly completed tasks',
    subtitle: 'Assign her new tasks',
  },
];

interface ProfileType {
  href: string;
  title: string;
  icon: any;
  roles: number[];
}

const profile: ProfileType[] = [
  {
    href: '/user/profile',
    title: 'My Profile',
    icon: '/images/svgs/icon-account.svg',
    roles: [2, 3],
  },
  {
    href: '/settings',
    title: 'Settings',
    icon: '/images/svgs/icon-settings.svg',
    roles: [2],
  },
  {
    href: '/billing',
    title: 'Billing',
    icon: '/images/svgs/icon-dd-invoice.svg',
    roles: [2],
  },
];

export { notifications, profile };
