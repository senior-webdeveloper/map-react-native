import { RoutesInterface } from '~/routes.types';
import ActivityCreate from './Activity.Create/Activity.Create.screen';
import ActivityStravaLink from './Activity.StravaLink/Activity.StravaLink';

export const activityRoutes: RoutesInterface[] = [
  {
    name: 'Activity.Create',
    component: ActivityCreate,
  },
  {
    name: 'Activity.StravaLink',
    component: ActivityStravaLink,
    initialParams: { link: '' },
  },
];
