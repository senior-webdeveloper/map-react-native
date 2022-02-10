import styled from 'styled-components/native';

export const Container = styled.View<{ height: number }>`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  height: 100%;
  padding-bottom: 20px;
  background-color: #fff;
`;

export const Header = styled.View`
  padding-top: 50px;
  margin-bottom: 15px;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: relative;

  /* background-color: #3332; */
`;

export const GoBackTouchable = styled.TouchableOpacity`
  position: absolute;

  left: 0px;
  top: 55px;
`;

export const CardsFlatList = styled.FlatList.attrs({
  showVerticalScrollIndicator: false,
})``;

export const BrandContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BrandName = styled.Text.attrs({
  numberOfLines: 1,
})`
  margin-left: 18px;
  font-size: 15px;
`;
export const ExtensionIcon = styled.View`
  padding: 8px;
  background-color: #0564ff;

  font-weight: 600;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;
