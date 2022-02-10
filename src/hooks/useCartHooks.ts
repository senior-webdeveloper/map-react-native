/* eslint-disable prefer-const */
import { useRecoilState } from 'recoil';

import {
  cartState,
  ISubscriptionPrice,
  subscriptionPrice,
} from '~/recoil/atoms';

export const useAddProduct = () => {
  const [cart, setCart] = useRecoilState(cartState);
  let elements = [...cart];

  return (product, index) => {
    if (elements[index]) {
      elements[index] = { ...elements[index], ...product };
    } else {
      elements[index] = product;
    }

    setCart(elements);
  };
};

export const useRemoveProduct = () => {
  const [cart, setCart] = useRecoilState(cartState);
  let elements = [...cart];

  return (index) => {
    // const index = cart.findIndex((item) => item.product_id === id);
    elements[index] = null;

    setCart(elements);
  };
};

export const useCleanCart = () => {
  const [_cart, setCart] = useRecoilState(cartState);
  const [_, setSubPrice] = useRecoilState(subscriptionPrice);

  return () => {
    setCart([]);
    setSubPrice(null);
  };
};

export const useRemoveAllProducts = () => {
  const [_cart, setCart] = useRecoilState(cartState);

  return () => {
    setCart([]);
  };
};

export const useAddSubscriptionKit = () => {
  const [_, setSubPrice] = useRecoilState(subscriptionPrice);

  return (product: ISubscriptionPrice) => {
    setSubPrice(product);
  };
};
