import { selector } from 'recoil';

import { cartState, subscriptionPrice } from './atoms';
import { selectedAwardAtom } from '~/screens/Challenge/Challenge.Description/components/ModalizeComponent';
import { shippingCoastAtom } from '~/screens/Challenge/Challenge.PaymentAward/screens/Payment.ShippingCoast.screen';

export const cartStatus = selector({
  key: 'cartStatus',
  get: ({ get }) => {
    const cart = get(cartState);
    const sub = get(subscriptionPrice);
    const award = get(selectedAwardAtom);
    const shipping = get(shippingCoastAtom);

    const totalItems = cart.length;
    const total = cart.reduce(
      (total, props) =>
        props?.quantity ? total + props.quantity * props.price : total,
      0,
    );

    const totalPrice =
      total +
      (sub ? sub.price : 0) +
      (award ? award.price : 0) +
      (shipping || 0);

    const totalWithoutSub = total;

    return {
      totalItems,
      totalPrice,
      totalWithoutSub,
    };
  },
});
