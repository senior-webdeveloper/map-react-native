import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import styled from 'styled-components/native';
import Text from './Text';

interface Props {
  name: string;
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean;
  isFreeSub?:boolean;
}
type ViewDefaultProps = ViewProps & Props;

interface ContainerProps {
  disabled?: boolean;
  loading?: boolean;
}
export const Container = styled.View<ContainerProps>`
  width: 100%;
  background: ${({ theme, disabled, isFreeSub }) =>
    !disabled ? isFreeSub ? "#009D33" : theme.colors.blue : theme.colors.gray};
  align-items: center;
  justify-content: center;
  flex-direction: ${({ theme, loading }) => (loading ? 'row' : 'column')};
  padding: 12px;
  border-radius: 24px;
  margin-top: 32px;
`;
export const ButtonText = styled(Text)`
  color: ${({ theme }) => theme.colors.textWhite};
`;

export const LoadingContainer = styled(View)`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Button: React.FC<ViewDefaultProps> = ({
  name,
  onPress,
  disabled,
  loading,
  isFreeSub,
  ...rest
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Container {...rest} disabled={disabled || loading} loading={loading} isFreeSub={isFreeSub}>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#0564FF" />
          </LoadingContainer>
        ) : (
          <ButtonText>{name}</ButtonText>
        )}
      </Container>
    </TouchableOpacity>
  );
};

export default Button;
