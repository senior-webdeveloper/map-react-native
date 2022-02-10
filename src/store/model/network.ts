import { Action, action } from 'easy-peasy';

export interface INetworkStatusModel {
  isConnected: boolean | null | undefined;
  setStatus: Action<INetworkStatusModel, boolean>;
}
const networkStatus: INetworkStatusModel = {
  isConnected: true,
  setStatus: action((state, payload) => {
    state.isConnected = payload;
  }),
};

export default networkStatus;
