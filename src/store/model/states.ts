import { Action, action } from 'easy-peasy';

interface IPayload {
  __typename: string;
  name: string;
}

export interface IStateModel {
  payload: IPayload[];
  selectState: Action<IStateModel, IPayload>;
  deleteState: Action<IStateModel, number>;
  deleteAllItems: Action<IStateModel>;
}
const states: IStateModel = {
  payload: [],
  selectState: action((state, payload) => {
    const existCitySelected = state.payload.filter(
      (item) => item.name === payload.name,
    );
    if (existCitySelected.length === 0) state.payload.push(payload);
  }),
  deleteState: action((state, payload) => {
    state.payload.splice(payload, 1);
  }),
  deleteAllItems: action((state) => {
    state.payload = [];
  }),
};

export default states;
