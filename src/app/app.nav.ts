import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Component, OnInit, Injectable } from '@angular/core';
import { UserService } from './services/user.service';


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

//var NavData;

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
  id?:number;
}


var menu = 1;
var dashboard = {};
var User_Managment = {};
var Assign_Rights = {};
if(1==menu){
  dashboard = {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  }
}
if(1==menu){
  User_Managment = {
    name: 'User Managment',
    url: '/userlist',
    icon: 'icon-user',
    // attributes: { disabled: true },
    id:1
  }
}
if(1==menu){
  Assign_Rights = {
    name: 'Assign Rights',
    url: '/accessrights',
    icon: 'icon-user',
  }
}
export const navItems: NavData[] = [
  dashboard,
  User_Managment,
  Assign_Rights,

  {

    name: 'Inward',
    url: '/inward',
    icon: 'icon-pencil'
  },
  {
    name: 'Outward',
    url: '/outward',
    icon: 'icon-pencil'
  },
  { 
    name: 'SO ',
    url: '/so',
    icon: 'icon-pencil'
  },
  {
    name: 'Article Launch Edit',
    url: '/articlelaunchedit',
    icon: 'icon-puzzle'
  },
  {
    name: 'PO',
    url: '/po',
    icon: 'icon-pencil'
  },
  {
    name: 'Reports',
    url: '/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Master '
  },
  {
    name: 'Article Launch',
    url: '/articlelaunchlist',
    icon: 'icon-puzzle'
  },
  {
    name: 'Master',
    url: '/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Category',
        url: '/categorylist',
        icon: 'icon-puzzle'
      },

      {
        name: 'Beaner',
        url: '/beanerlist',
        icon: 'icon-puzzle'
      },
      
      {
        name: 'Article',
        url: '/articlelist',
        icon: 'icon-puzzle'
      },
      {
        name: 'Article Launch',
        url: '/articlelaunchlist',
        icon: 'icon-puzzle'
      },
      {
        name: 'Article Color',
        url: '/articlecolorlist',
        icon: 'icon-puzzle'
      },
      {
        name: 'Article Size',
        url: '/sizelist',
        icon: 'icon-puzzle'
      },
      {
        name: 'Article Ratio',
        url: '/ratiolist',
        icon: 'icon-puzzle'
      },
      {
        name: 'Vendor',
        url: '/vendor',
        icon: 'icon-puzzle'
      },
      {
        name: 'Brand',
        url: '/brand',
        icon: 'icon-puzzle'
      },
      {
        name: 'Rack',
        url: '#',
        icon: 'icon-puzzle'
      },
      {
        name: 'Rejection',
        url: '/rejectionlist',
        icon: 'icon-puzzle'
      },
      {
        name: 'AddRejection',
        url: '/rejection',
        icon: 'icon-puzzle'
      },
      {
        name: 'Debug & Fix',
        url: '/debug',
        icon: 'icon-puzzle'
      }
    ]
  },
];


