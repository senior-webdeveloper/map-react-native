import { Action, action } from 'easy-peasy';
import { useStoreActions } from '~/store';

interface IState {
  __typename: string;
  name: string;
}
interface IPayload {
  __typename: string;
  name: string;
  state: IState;
}

export interface ICityModel {
  payload: IPayload[];
  selectCity: Action<ICityModel, IPayload>;
  deleteCity: Action<ICityModel, number>;
  removeAllItems: Action<ICityModel>;
}
const cities: ICityModel = {
  payload: [],
  selectCity: action((state, payload) => {
    const existCitySelected = state.payload.filter(
      (item) => item.name === payload.name,
    );
    if (existCitySelected.length === 0) state.payload.push(payload);
  }),
  deleteCity: action((state, payload) => {
    state.payload.splice(payload, 1);
  }),
  removeAllItems: action((state) => {
    state.payload = [];
  }),
};

export default cities;
