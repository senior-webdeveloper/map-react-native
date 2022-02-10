import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image } from 'react-native';
import colors from '~/styles/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '~/helpers/convertPixelToDP';

export const Container = styled(SafeAreaView)`
  flex: 1;
  /* margin-top: 20px; */
  padding: 20px;
  background-color: ${colors.darkenWhite};
  align-items: flex-start;
`;
export const UserInfoContainer = styled(View)`
  margin-top: 14px;
  border-top-width: 1px;
  border-top-color: ${colors.darkestGrey};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.darkestGrey};
  padding: 11px 0;
  width: 100%;
  align-items: center;
`;
export const UserInfoUnityContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;
export const UserInfoTextBold = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 13px;
  line-height: 16px;
  color: ${colors.blackGrey};
  margin-left: 6px;
  text-align: left;
`;
export const UserAvatar = styled(Image)`
  width: ${wp('30')};
  height: ${wp('30')};
  border-radius: ${wp('100')};
  margin-top: -10%;
  border: 3px solid ${colors.darkenWhite};
  border-color: ${colors.darkenWhite};
  background-color: ${colors.darkenWhite};
`;
export const UserCover = styled(Image)`
  width: 100%;
  height: ${hp('20')};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;
export const UserEditProfileContainer = styled(View)`
  background-color: ${colors.lilac};
  width: 260px;
  height: 40px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  border-radius: 4px;
`;
export const UserEditProfileText = styled(Text)`
  font-family: 'Montserrat-Bold';
  color: ${colors.purple};
`;
