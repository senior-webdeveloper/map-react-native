import { RoutesInterface } from '~/routes.types';
import BuyProductsRoutes from './Products.BuyProduct/BuyProduct.routes';
import ProductsSuccessPayment from './Products.SuccessPayment/Products.SuccessPayment';
import ProductBuyedProduct from './Products.BuyedProduct/Products.BuyedProduct.screen';

export const productsRoutes: RoutesInterface[] = [
  {
    name: 'Products.BuyProduct',
    component: BuyProductsRoutes,
    options: { gestureEnabled: false },
  },
  {
    name: 'Products.SuccessPayment',
    component: ProductsSuccessPayment,
    options: { gestureEnabled: false },
  },
  {
    name: 'Products.BuyedProduct',
    component: ProductBuyedProduct,
  },
];
