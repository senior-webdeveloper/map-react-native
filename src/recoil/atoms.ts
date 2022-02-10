import { atom } from 'recoil';
import { ProductPurchasedInput } from '~/generated/graphql';

interface ProductsCart extends ProductPurchasedInput {
  quantity: number;
  price: number;
  variation_index: number;
  name: string;
  optionName: string;
}

export const cartState = atom<ProductsCart[]>({
  key: 'cartState',
  default: [],
});

export interface ISubscriptionPrice {
  price: number;
  name: string;
  index: number;
  product_id: string;
}

export const subscriptionPrice = atom<ISubscriptionPrice>({
  key: 'subPrice',
  default: null,
});
