import { Action, action } from 'easy-peasy';
import { Image } from 'react-native-image-crop-picker';
import { Mutation, LoginResponse, Query } from '~/generated/graphql';

interface IUserInterface {
  notificationsCount?: number;
}
export interface IUserInfoModel {
  payload?: IUserInterface;
  saveUserInfo: Action<IUserInfoModel, LoginResponse>;
  deleteUserInfo: Action<IUserInfoModel>;
}
const userInfoModel: IUserInfoModel = {
  payload: {},
  saveUserInfo: action((state, payload) => {
    state.payload.notificationsCount = payload;
  }),
  deleteUserInfo: action((state) => {
    state.payload = undefined;
  }),
};

export default userInfoModel;
