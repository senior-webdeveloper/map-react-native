import { RoutesInterface } from '~/routes.types';
import AwardsShowcase from './Awards.Showcase/Awards.Showcase.screen';
import AwardDescription from './Awards.Description/Awards.Description.screen';

export const awardsRoutes: RoutesInterface[] = [
  {
    name: 'AwardsShowcase',
    component: AwardsShowcase,
  },
  {
    name: 'Award.Description',
    component: AwardDescription,
  },
];
