import { Action, action } from 'easy-peasy';
import { GetProfileQuery } from '~/graphql/autogenerate/operations';

export interface IProfileInfoModel {
  payload?: GetProfileQuery;
  saveUserInfo: Action<IProfileInfoModel, GetProfileQuery>;
  deleteUserInfo: Action<IProfileInfoModel>;
}
const profileInfoModel: IProfileInfoModel = {
  payload: undefined,
  saveUserInfo: action((state, payload) => {
    state.payload = payload;
  }),
  deleteUserInfo: action((state) => {
    state.payload = undefined;
  }),
};

export default profileInfoModel;
