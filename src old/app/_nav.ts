interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}


export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
  id?: number;
}

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'User Managment',
    url: '/userlist',
    icon: 'icon-user',  
    // attributes: { disabled: true },
   // id:1
  },
  {
    name: 'Assign Rights',
    url: '/accessrights',
    icon: 'icon-user-following',
  },
  {
    name: 'Inward',
    url: '/inwardlist',
    icon: 'fa fa-compress'
  },
  {
    name: 'Outward',
    url: '/outwardlist',
    icon: 'icon-social-dropbox'
  },
  {
    name: 'SO',
    url: '/solist',
    icon: 'fa fa-cart-arrow-down'
  },
  {
    name: 'Artical Launch',
    url: '/articlelaunchlist',
    icon: 'icon-puzzle'
  },
  {
    name: 'Artical Launch Report',
    url: '/articlelaunchreport',
    icon: 'icon-puzzle'
  },
  {
    name: 'PO',
    url: '/polist',
    icon: 'fa fa-cart-plus'
  },
  {
    name: 'Article Photos',
    url: '/articlephotoslist',
    icon: 'icon-tag'
  },
  {
    name: 'Article',
    url: '/articlelist',
    icon: 'icon-puzzle'
  },
  {
    name: 'Reports',
    url: '/theme/typography',
    icon: 'icon-pencil',
    // children: [
    //   {
    //     name: 'Stock Summary',
    //     //url: '/categorylist',
    //     icon: 'icon-puzzle'
    //   },
    //   {
    //     name: 'Sales report',
    //     //url: '/categorylist',
    //     icon: 'icon-puzzle'
    //   },
    //   {
    //     name: 'Inward report',
    //     //url: '/categorylist',
    //     icon: 'icon-puzzle'
    //   },
    //   {
    //     name: 'Pending sales order report',
    //     //url: '/categorylist',
    //     icon: 'icon-puzzle'
    //   },
    //   {
    //     name: 'Ful Fillment report',
    //    // url: '/categorylist',
    //     icon: 'icon-puzzle'
    //   },
    //   {
    //     name: 'Purchase & return',
    //    // url: '/categorylist',
    //     icon: 'icon-puzzle'
    //   }
    // ]
  },
  {
    title: true,
    name: 'Master '
  },
  {
    name: 'Category',
    url: '/categorylist',
    icon: 'icon-book-open'
  },
  {
    name: 'Beaner',
    url: '/beanerlist',
    icon: 'icon-book-open'
  },
  {
    name: 'Article Color',
    url: '/articlecolorlist',
    icon: 'fa fa-paint-brush'
  },
  {
    name: 'Article Size',
    url: '/sizelist',
    icon: 'icon-frame'
  },
  {
    name: 'Article Ratio',
    url: '/ratiolist',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Vendor',
    url: '/vendorlist',
    icon: 'cui-people'
  },
  {
    name: 'Brand',
    url: '/brandlist',
    icon: 'icon-tag'
  },
  {
    name: 'Party Master',
    url: '/partylist',
    icon: 'icon-tag'
  },
  {
    name: 'Rack',
    url: '/racklist',
    icon: 'icon-layers'
  }
];
