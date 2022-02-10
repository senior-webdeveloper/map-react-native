import styled from 'styled-components/native';

import { Icons, TitleText } from '~/components';

import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export const Container = styled.ScrollView<{ height: number }>`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  /* justify-content: space-between; */
  flex-direction: column;
  /* height: 100%; */
  flex: 1;
`;

export const Header = styled.View`
  margin-bottom: 15px;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  position: relative;
`;

export const GoBackTouchable = styled.TouchableOpacity`
  /* position: absolute;
  left: 0px;
  top: 8px; */
`;

export const AddCardTouchable = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
  top: 8px;
`;

export const AddCardText = styled.Text<{ isValid: boolean }>`
  color: ${({ isValid }) => (isValid ? '#0564ff' : 'rgba(22, 28, 37, 0.56)')};
  font-size: 17px;
`;

// export const CardContentContainer = styled.View<{
//   width: number;
//   height: number;
// }>`
// heigh
//   padding: 29px 23px 12px 28px;
//   justify-content: space-between;
//   position: absolute;
// `;
export const CardContentContainer = styled.View<{
  height: number;
  width: number;
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  padding: 29px 23px 12px 28px;
  justify-content: space-between;
`;

export const BoxViewCard = styled.View`
  width: 100%;
  align-items: center;
  /* height: 100%; */
  position: relative;
  margin-bottom: 5px;
`;

export const ItemLabelText = styled.Text`
  color: #fff;
  font-size: 12;
  line-height: 12.65;
`;

export const ItemValueText = styled(TitleText)<{ cardNumber?: boolean }>`
  color: #fff;
  font-size: ${({ cardNumber }) => (cardNumber ? 20 : 14)}px;
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

export const CardSvgBackground = styled(Icons).attrs({
  name: 'credit-card-background',
  width: widthPercentageToDP('100'),
  height: widthPercentageToDP('50'),
})`
  position: absolute;
`;
