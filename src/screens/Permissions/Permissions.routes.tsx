import { RoutesInterface } from '~/routes.types';
import PermissionAppleHealth from './Permissions.AppleHealth/Permissions.AppleHealth.screen';
import PermissionCamera from './Permissions.Camera';
import PermissionLocation from './Permissions.Location';
import PermissionNotifications from './Permissions.Notifications';
import PermissionWrite from './Permissions.Write';

export const permissionsRoutes: RoutesInterface[] = [
  {
    name: 'Permission.AppleHealth',
    component: PermissionAppleHealth,
  },
  {
    name: 'Permission.Camera',
    component: PermissionCamera,
  },
  {
    name: 'Permission.Location',
    component: PermissionLocation,
  },
  {
    name: 'Permission.Notifications',
    component: PermissionNotifications,
  },
  {
    name: 'Permission.Write',
    component: PermissionWrite,
  },
];
