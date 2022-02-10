import { Action, action } from 'easy-peasy';
import { DataCompiled } from '~/graphql/autogenerate/schemas';

interface UserInterface {
  getUserDataCompiled: DataCompiled;
  goToPhotoPermission?: boolean;
}
export interface UserInfoCompiledModel {
  payload: UserInterface;
  saveUserInfo: Action<UserInfoCompiledModel, DataCompiled>;
  deleteUserInfo: Action<UserInfoCompiledModel>;
  changePermission: Action<UserInfoCompiledModel, boolean>;
}
const userInfoModel: UserInfoCompiledModel = {
  payload: {
    getUserDataCompiled: {
      _id: '',
      user_id: '',
      integrated_with_google_fit: false,
      integrated_with_apple_health: false,
      integrated_with_garmin: false,
      integrated_with_polar: false,
      has_company: false,
      last_upload_google_fit: false,
      last_upload_apple_health: false,
      integrated_with_strava_crawler: false,
    },
    goToPhotoPermission: false,
  },
  saveUserInfo: action((state, payload) => {
    state.payload.getUserDataCompiled = payload;
  }),
  changePermission: action((state, payload) => {
    state.payload.goToPhotoPermission = payload;
  }),
  deleteUserInfo: action((state) => {
    state.payload = {
      getUserDataCompiled: {
        __typename: undefined,
        _id: '',
        user_id: '',
        integrated_with_google_fit: false,
        integrated_with_apple_health: false,
        integrated_with_garmin: false,
        integrated_with_polar: false,
        has_company: false,
        last_upload_google_fit: false,
        last_upload_apple_health: false,
        integrated_with_strava_crawler: false,
      },
    };
  }),
};

export default userInfoModel;
