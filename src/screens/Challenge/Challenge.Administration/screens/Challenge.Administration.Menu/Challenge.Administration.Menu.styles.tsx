import { View } from 'react-native';
import styled from 'styled-components/native';
import { layout, space, flexbox } from 'styled-system';
import { Text, TitleText } from '~/components';

export const Container = styled.ScrollView`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  background-color: transparent;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const Title = styled(TitleText)``;
export const Subtitle = styled(TitleText)`
  font-size: 20px;
`;
export const SeeAllText = styled(Text)`
  text-transform: uppercase;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  color: rgba(22, 28, 37, 0.5);
`;
export const ContentWrapper = styled.View`
  border-top-width: 1px;
  border-top-color: #dfe8ed;
  padding: 25px -16px;
`;
export const MenuItemWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export const MenuItemBox = styled.View`
  background: #ffffff;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  width: 100px;
  height: 100px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;
export const MenuItem = styled.View`
  margin-top: 24px;
  align-items: center;
`;
export const MenuItemText = styled(Text)`
  font-size: 12px;
  margin-top: 12px;
  max-width: 100px;
  text-align: center;
`;
export const FeedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const FeedItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 30px 10px;
  padding: 12px 10px;
  background: #ffffff;
  border-radius: 16px;

  box-shadow: -40px 20px 40px rgba(255, 255, 255, 0.235522);
`;
export const FeedItemName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const FeedDescritionText = styled(Text)``;
export const FeedTimeText = styled(Text)`
  color: rgba(22, 28, 37, 0.6);
`;
export const FeedTextContainer = styled.View``;
export const FeedWrapper = styled.View`
  align-items: flex-start;
  flex-direction: row;
`;
export const Avatar = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  margin-right: 10px;
`;
export const FeedChalengeImage = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 8px;
`;
export const EventsItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 30px;
  padding: 17px 24px 22px 24px;
  background: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 16px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;

export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  border-radius: 8px;
  max-height: 40%;
  align-items: center;
  padding: 8%;
  justify-content: space-between;
`;
export const ModalButton = styled.View`
  background: #0564ff;
  border-radius: 3px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
`;
export const ModalHeaderText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
`;
export const ModalDescriptionText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;
export const ModalButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: ${({ theme }) => theme.colors.textWhite};
  text-align: center;
`;
export const CompanyButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
export const CompanyAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  margin-right: 15px;
`;

export const Box = styled(View)(layout, space, flexbox);

export const ModalContentContainer = styled(View)<layout>(
  {
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
  layout,
  space,
  flexbox,
);

export const BlueButton = styled.TouchableOpacity`
  margin-right: 8px;
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, loading }) =>
    loading ? theme.colors.backgroundGray : theme.colors.blue};
  border-radius: 24px;
`;
