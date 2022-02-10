import { translate } from '~/locales';
import image01 from '~/assets/imageSlide/1.jpg';
import image02 from '~/assets/imageSlide/2.jpg';
import image03 from '~/assets/imageSlide/3.jpg';

export default [
  {
    title: translate('create_challenges'),
    subtitle: translate('bring_people_together_around_you'),
    uri: image01,
  },
  {
    title: translate('be_digital'),
    subtitle: translate('show_who_you_are_where_your_customer_is'),
    uri: image02,
  },
  {
    title: translate('relate'),
    subtitle: translate('take_your_client_to_you'),
    uri: image03,
  },
];
