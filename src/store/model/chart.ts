import { Action, action } from 'easy-peasy';
import {
  ChallengeAwardAdditionalRequestInput,
  ProductPurchasedInput,
} from '~/graphql/autogenerate/schemas';

interface Product {
  product_id: string;
  price: number;
  name: string;
  index: number;
}
interface AditionalRequest {
  additional_request_id?: string;
  free_field: boolean;
  free_value: string;
  picker_index: number;
  price: number;
  hasSelected?: boolean;
  response?: string;
  name: string;
  optionName?: string;
}

interface CreateAditionalRequest {
  index: number;
  aditionalRequest: AditionalRequest;
}
interface CreateAditionalRequestResponse {
  index: number;
  aditionalRequest: ProductPurchasedInput;
}

interface AddRemoveProduct {
  product: ProductPurchasedInput;
  index: number;
}

interface ProductQuantity {
  quantity: number;
  index: number;
}

export interface ChartModel {
  payload: Product | null;
  selectedProducts: ProductPurchasedInput[] | [];
  setSelectedProducts: Action<ChartModel, AddRemoveProduct>;
  setSelectedProductsQuantity: Action<ChartModel, ProductQuantity>;
  removeProduct: Action<ChartModel, AddRemoveProduct>;
  aditionalRequests: ProductPurchasedInput[] | null;
  addProduct: Action<ChartModel, Product>;
  createAditionalRequest: Action<ChartModel, CreateAditionalRequest>;
  createAditionalResponse: Action<ChartModel, CreateAditionalRequestResponse>;
  totalAddonPrice: number;
  isOnPurchase: boolean;
  setIsOnPurchase: Action<ChartModel, boolean>;
  selectedAwards: ProductPurchasedInput[] | undefined;
  setSelectedAwards: Action<ChartModel, CreateAditionalRequestResponse>;
  cleanChart: Action<ChartModel, null>;
  removeElementInChart: Action<ChartModel, { index: number }>;
  firstElementId: string | null | undefined;
  setFirstElementId: Action<ChartModel, string>;
}
const chart: ChartModel = {
  payload: null,
  firstElementId: null,

  selectedAwards: undefined,

  selectedProducts: [],

  setFirstElementId: action((state, payload) => {
    state.firstElementId = payload;
  }),

  removeProduct: action((state, payload) => {
    if (
      state.selectedProducts.length > 0 &&
      state.selectedProducts[payload.index]
    ) {
      if (state.selectedProducts[payload.index]) {
        state.totalAddonPrice -=
          state.selectedProducts[payload.index].total_price;
        console.log(
          '🚀 ~ file: chart.ts ~ line 76 ~ removeProduct:action ~  state.totalAddonPrice',
          state.totalAddonPrice,
        );
      }
      state.selectedProducts[payload.index] = undefined;
      // delete state.selectedProducts[payload.index];
    }
  }),

  setSelectedProductsQuantity: action((state, payload) => {
    state.selectedProducts[payload.index] = {
      ...state.selectedProducts[payload.index],
      total_price:
        state.aditionalRequests[payload.index].price * payload.quantity,
      quantity: payload.quantity,
    };
    state.aditionalRequests[payload.index] = {
      ...state.aditionalRequests[payload.index],
      price: state.aditionalRequests[payload.index].price,
      total_price:
        state.aditionalRequests[payload.index].price * payload.quantity,
      quantity: payload.quantity,
    };

    const value = state.aditionalRequests.reduce(
      (accumulator, currentValue) => {
        return {
          total_price: accumulator.total_price + currentValue.total_price,
          price: accumulator.price,
          additional_request_id: accumulator.additional_request_id,
          free_field: accumulator.free_field,
          picker_index: accumulator.picker_index,
          response: accumulator.response,
        };
      },
    );
    // const value = state.aditionalRequests.reduce(
    //   (accumulator, currentValue) => {
    //     return accumulator + currentValue.quantity * currentValue.price;
    //   },
    // );
    console.log(
      '🚀 ~ file: chart.ts ~ line 93 ~ setSelectedProductsQuantity:action ~ value',
      value.total_price,
    );
    state.totalAddonPrice = value.total_price;
  }),

  setSelectedProducts: action((state, payload) => {
    state.selectedProducts[payload.index] = {
      ...state.selectedProducts[payload.index],
      ...payload.product,
    };
  }),

  totalAddonPrice: 0,

  isOnPurchase: false,

  aditionalRequests: null,

  removeElementInChart: action((state, { index }) => {
    if (state.aditionalRequests && state.aditionalRequests[index]) {
      delete state.aditionalRequests[index];
    }
  }),

  cleanChart: action((state) => {
    state.payload = null;
    state.selectedAwards = undefined;
    state.totalAddonPrice = 0;
    state.aditionalRequests = null;
    state.isOnPurchase = false;
  }),

  addProduct: action((state, payload) => {
    state.payload = payload;
  }),

  setSelectedAwards: action((state, payload) => {
    if (!state.selectedAwards) {
      state.selectedAwards = [];
      state.selectedAwards[payload.index] = payload.aditionalRequest;
    } else {
      state.selectedAwards[payload.index] = payload.aditionalRequest;
    }
  }),

  setIsOnPurchase: action((state, payload) => {
    state.isOnPurchase = payload;
  }),

  createAditionalResponse: action((state, payload) => {
    if (state.aditionalRequests === null) {
      state.aditionalRequests = [];
      state.aditionalRequests[payload.index] = payload.aditionalRequest;
      state.totalAddonPrice = payload.aditionalRequest.price;
    } else {
      state.aditionalRequests[payload.index] = {
        ...payload.aditionalRequest,
        total_price:
          payload.aditionalRequest.price * payload.aditionalRequest.quantity,
      };
      const value = state.aditionalRequests.reduce(
        (accumulator, currentValue) => {
          return {
            total_price: accumulator.total_price + currentValue.total_price,
            price: accumulator.price + currentValue.price,
            additional_request_id: accumulator.additional_request_id,
            free_field: accumulator.free_field,
            picker_index: accumulator.picker_index,
            response: accumulator.response,
          };
        },
      );
      state.totalAddonPrice = value.total_price;
    }
  }),

  createAditionalRequest: action((state, payload) => {
    if (state.aditionalRequests === null) {
      state.aditionalRequests = [];
      state.aditionalRequests[payload.index] = payload.aditionalRequest;
      state.totalAddonPrice = payload.aditionalRequest.price;
    } else {
      state.aditionalRequests[payload.index] = {
        ...payload.aditionalRequest,
        total_price:
          payload.aditionalRequest.price * payload.aditionalRequest.quantity,
      };
      const value = state.aditionalRequests.reduce(
        (accumulator, currentValue) => {
          return {
            total_price: accumulator.total_price + currentValue.total_price,
            price: accumulator.price + currentValue.price,
            additional_request_id: accumulator.additional_request_id,
            free_field: accumulator.free_field,
            picker_index: accumulator.picker_index,
            response: accumulator.response,
          };
        },
      );
      state.totalAddonPrice = value.total_price;
    }
  }),
};

export default chart;
