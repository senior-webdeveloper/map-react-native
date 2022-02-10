import styled from 'styled-components/native';

import { Icons, TitleText } from '~/components';

import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export const Container = styled.View<{ height: number }>`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  justify-content: space-between;
  flex-direction: column;
  height: 90%;
  flex: 1;
`;

export const Header = styled.View`
  padding-top: 50px;
  margin-bottom: 30px;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: relative;
`;

export const GoBackTouchable = styled.TouchableOpacity`
  position: absolute;

  left: 0px;
  top: 55px;
`;

export const BoxViewCard = styled.View`
  width: 100%;
  align-items: center;
  height: 100%;
  position: relative;
`;

export const CardContentContainer = styled.View<{
  width: number;
  height: number;
}>`
  padding: 29px 23px 12px 28px;
  justify-content: space-between;
  position: absolute;
`;

export const ItemLabelText = styled.Text`
  color: #fff;
  font-size: 12;
  line-height: 12.65;
`;

export const ItemValueText = styled(TitleText)<{ cardNumber?: boolean }>`
  color: #fff;
  font-size: ${({ cardNumber }) => (cardNumber ? 24 : 18)}px;
  padding-top: 2px;
`;

export const ItemRow = styled.View<{ totalWidth?: boolean; isColumn: boolean }>`
  flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
  justify-content: space-between;
  width: ${({ totalWidth }) => (totalWidth ? '100%' : '73%')};
`;

export const Footer = styled.View`
  width: 100%;
  /* height: 100%; */
  position: absolute;

  bottom: 50px;
  left: 18px;
  justify-content: center;
`;

export const Description = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.light};
  padding-right: 20px;
  font-size: 18px;
`;

export const DeleteText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.light};
  padding: 20px 0;
  font-size: 18px;
  color: #ff2525;
`;

export const CardSvgBackground = styled(Icons).attrs({
  name: 'credit-card-background',
  width: widthPercentageToDP('100'),
  height: widthPercentageToDP('100') / 1.7,
})`
  position: absolute;
`;
export const SwitchContainer = styled.View`
  position: absolute;
  right: 0;
  top: ${widthPercentageToDP('100') / 1.6};
  flex-direction: row;
  align-items: center;
`;
