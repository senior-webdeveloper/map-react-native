import styled from 'styled-components/native';
import { View } from 'react-native';
import { flexbox, layout, space } from 'styled-system';
import { Text, TitleText } from '~/components';

export const SuccessTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.green};
`;
export const ErrorTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.red};
`;
export const AwaitTitle = styled(TitleText)<StatsProps>`
  font-size: 16px;
  color: ${({ color }) => color};
`;

interface StatsProps {
  color: string;
}

export const PaymentStatusContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  elevation: 10;
  /* Shadow try 1 */
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;
export const StatsCard = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: flex-end;
`;
export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  width: 100%;
  padding: 18px 19px;
  align-items: center;
`;
export const Description = styled(Text)`
  font-size: 14px;
  line-height: 16.1px;
  text-align: center;
`;
export const DescriptionBold = styled(TitleText)`
  font-size: 14px;
  line-height: 16.1px;
  text-align: center;
`;
export const MinorDescription = styled(Text)`
  font-size: 14px;
  line-height: 16.1px;
  opacity: 0.56;
  margin-top: 16px;
`;
export const InfoTitle = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 16px;
  line-height: 18.4px;
`;
export const InfoDescription = styled(Text)`
  font-weight: 400;
  font-size: 16px;
  line-height: 18.4px;
`;
export const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  border-bottom-width: 0.5px;
  width: 100%;
  border-bottom-color: rgba(21, 46, 88, 0.5);
  justify-content: space-between;
`;
export const HistoryContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  border-bottom-width: 0.5px;
  width: 100%;
  border-bottom-color: rgba(21, 46, 88, 0.5);
  justify-content: space-between;
`;
export const IconContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
`;
export const Box = styled(View)(layout);
export const ModalContentContainer = styled(View)(
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
