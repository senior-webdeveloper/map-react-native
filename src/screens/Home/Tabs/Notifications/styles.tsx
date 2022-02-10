import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView, SectionList } from 'react-native';
import colors from '~/styles/colors';

export const Container = styled(SafeAreaView)`
  flex: 1;
  padding: 0px 20px;
  background-color: ${colors.darkenWhite};
`;
export const HeaderPageNameContainer = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.darkestGrey};
  padding: 11px 0;
  width: 100%;
  align-items: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export const HeaderPageText = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 28px;
  line-height: 34px;
  color: ${colors.blackGrey};
  margin-left: 6px;
`;
export const HeaderSectionText = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 15px;
  line-height: 18px;
  color: ${colors.blackGrey};
  margin-top: 15px;
`;
export const OptionsContainer = styled(SectionList)``;
export const UnityOptionContainerNew = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  padding: 15px;
  border-radius: 5px;
  background-color: ${(props) =>
    !props.isRead ? colors.lightPurple : colors.white};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 1;
`;
export const UnityOptionContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
  padding: 15px;
  border-radius: 5px;
  background-color: ${colors.white};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 1;
`;
export const UnityOptionContainerWrapper = styled(View)`
  width: 65%;
`;
export const UnityOptionTitle = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 13px;
  line-height: 16px;
  color: ${colors.blackGrey};
`;
export const UnityOptionDescription = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: 13px;
  line-height: 16px;
  color: ${colors.blackGrey};
  margin-top: 5px;
`;
