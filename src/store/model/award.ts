import { Action, action } from 'easy-peasy';
import { Image } from 'react-native-image-crop-picker';
import {
  CreateChallengeAwardImageInput,
  CreateChallengeAwardInput,
} from '~/generated/graphql';

interface IPayload {
  award_name: string;
  award_description: string;
  award_images: CreateChallengeAwardImageInput[];
  position: number;
  price?: number;
}
interface CreateAward {
  award: CreateChallengeAwardInput;
}
interface ISaveAward {
  award: CreateChallengeAwardInput;
  index?: number;
}
interface IPriceAward {
  index: number;
  price: string;
}
interface IChangeIdAward {
  index: number;
  id: string;
}
export interface IAwardModel {
  payload: CreateChallengeAwardInput[];
  createAward: Action<IAwardModel, CreateAward>;
  saveAward: Action<IAwardModel, ISaveAward>;
  deleteAward: Action<IAwardModel, number>;
  duplicateAward: Action<IAwardModel, number>;
  reOrderAwards: Action<IAwardModel, IPayload[]>;
  deleteLatest: Action<IAwardModel>;
  changeTypeAward: Action<IAwardModel, boolean>;
  changeAwardPrice: Action<IAwardModel, IPriceAward>;
  addAwardId: Action<IAwardModel, IChangeIdAward>;
  reset: Action<IAwardModel>;
}
const awards: IAwardModel = {
  payload: [],
  createAward: action((state, payload) => {
    state.payload.push(payload.award);
  }),
  saveAward: action((state, payload) => {
    state.payload[payload.index] = payload.award;
  }),
  duplicateAward: action((state, payload) => {
    const selectedAward = state.payload[payload];
    const duplicateAward = {
      award_name: selectedAward.award_name,
      award_description: selectedAward.award_description,
      position: state.payload.length + 1,
      price: selectedAward.price,
      award_images: selectedAward.award_images,
    };
    state.payload.push(duplicateAward);
  }),
  deleteAward: action((state, payload) => {
    state.payload.splice(payload, 1);
  }),
  reOrderAwards: action((state, payload) => {
    state.payload = payload;
  }),
  deleteLatest: action((state) => {
    state.payload.pop();
  }),
  changeTypeAward: action((state, payload) => {
    if (payload) {
      state.payload.map((item) => {
        item.hasPrice = payload;
      });
    } else {
      state.payload.map((item) => {
        item.hasPrice = payload;
        item.price = undefined;
      });
    }
  }),
  changeAwardPrice: action((state, payload) => {
    state.payload[payload.index].price = payload.price;
  }),
  addAwardId: action((state, payload) => {
    state.payload[payload.index].award_id = payload.id;
  }),
  reset: action((state) => {
    state.payload = [];
  }),
};

export default awards;
