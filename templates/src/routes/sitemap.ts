import paths from 'routes/paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
  messages?: number;
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'solar:widget-bold',
    active: true,
  },
  {
    id: 'management',
    subheader: 'Management',
    path: paths.management,
    icon: 'solar:chart-square-bold',
    active: true,
  },
  // {
  //   id: 'invoice',
  //   subheader: 'Invoice',
  //   path: '#!',
  //   icon: 'solar:ticket-bold',
  // },
  // {
  //   id: 'schedule',
  //   subheader: 'Schedule',
  //   path: '#!',
  //   icon: 'solar:document-text-bold',
  // },
  // {
  //   id: 'calendar',
  //   subheader: 'Calendar',
  //   path: '#!',
  //   icon: 'mage:calendar-2-fill',
  // },
  // {
  //   id: 'messages',
  //   subheader: 'Messages',
  //   path: '#!',
  //   icon: 'mage:dashboard-chart-fill',
  //   messages: 49,
  // },
  {
    id: 'notification',
    subheader: 'Notification',
    path: paths.notification,
    icon: 'solar:bell-bold',
    active: true
  }
  // {
  //   id: 'settings',
  //   subheader: 'Settings',
  //   path: '#!',
  //   icon: 'solar:settings-bold',
  // },
  // {
  //   id: 'signin',
  //   subheader: 'Sign In',
  //   path: paths.signin,
  //   icon: 'mage:lock-fill',
  //   active: true,
  // },
  // {
  //   id: 'signup',
  //   subheader: 'Sign Up',
  //   path: paths.signup,
  //   icon: 'mage:user-plus-fill',
  //   active: true,
  // },
];

export default sitemap;
