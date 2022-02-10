import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { icons } from '~/assets/icons';
import Icons from './Icons';
import SmallText from './SmallText';

interface InputProps {
  leftIcon?: keyof typeof icons;
  rightIcon?: keyof typeof icons;
  isPassword?: boolean;
  isValid: boolean;
  loginError?: string;
  error?: string;
  isRegister?: boolean;
  customValue?: string;
}
type DefaultInputProps = TextInputProps & InputProps;
interface InputReference extends TextInput {
  value: string;
}
interface TextTwoInputProps {
  hasTwoIcons?: boolean;
}
interface ContainerProps {
  error: boolean;
}
interface IconProps {
  isActive?: boolean;
}
type TextInputDefaultProps = TextTwoInputProps & TextInputProps;

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 50px;
  border-bottom-width: 0.5px;
  padding: 0;
  border-bottom-color: ${({ theme, error }) =>
    !error ? theme.colors.text : theme.colors.semantic.red};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LabeledInput = styled.TextInput<TextInputDefaultProps>`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 16px;
  width: ${(props) => (props.hasTwoIcons ? '85%' : '94%')};
  text-align: left;
  color: rgba(22, 28, 37, 0.6);
`;
export const LeftIcon = styled(Icons)<IconProps>`
  color: ${({ theme, isActive }) =>
    !isActive ? theme.colors.gray : theme.colors.blue};
`;
export const RightIcon = styled(Icons)<IconProps>`
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.gray : theme.colors.blue};
`;
export const ErrorText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.semantic.red};
`;
export const CreateAccount = styled(SmallText)`
  color: ${({ theme }) => theme.colors.blue};
`;

const Input: React.FC<DefaultInputProps> = ({
  leftIcon,
  rightIcon,
  isPassword,
  loginError,
  isValid,
  error,
  customValue,
  isRegister = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const inputRef = useRef<InputReference>(null);
  const navigation = useNavigation();

  useEffect(() => {
    inputRef.current?.setNativeProps({
      style: { fontFamily: 'NeuzeitGro-Reg' },
    });
  }, []);

  return (
    <>
      <Container error={error !== undefined || loginError?.length > 0}>
        {leftIcon && <LeftIcon name={leftIcon} isActive={isValid} />}
        <LabeledInput
          ref={inputRef}
          placeholderTextColor="rgba(22, 28, 37, 0.6)"
          secureTextEntry={isPassword ? showPassword : false}
          hasTwoIcons={leftIcon !== undefined && rightIcon !== undefined}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 20 }}
          allowFontScaling={false}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={() => {
              if (isPassword) {
                setShowPassword(!showPassword);
              }
            }}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <RightIcon name={rightIcon} isActive={showPassword} />
          </TouchableOpacity>
        )}
      </Container>
      <ErrorText>{error}</ErrorText>
      {loginError?.length > 0 && !isRegister && (
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <ErrorText>{loginError}</ErrorText>
        </View>
      )}
      {loginError?.length > 0 &&
        !isRegister &&
        loginError !== 'Senha inválida.' && (
          <View style={{ width: '100%', flexDirection: 'column' }}>
            <ErrorText>{loginError} você é um usuário novo? </ErrorText>

            <TouchableOpacity
              onPress={() => navigation.navigate('User.EmailSignUp')}
              hitSlop={{ left: 10, right: 50, top: 10, bottom: 20 }}
              style={{ width: 100 }}
            >
              <CreateAccount>Crie uma conta</CreateAccount>
            </TouchableOpacity>
          </View>
        )}
      {loginError?.length > 0 && isRegister && (
        <View>
          <ErrorText>{loginError} já possui conta? </ErrorText>

          <TouchableOpacity
            onPress={() =>
              navigation.push('User.EmailLogin', { email: customValue })
            }
            hitSlop={{ left: 10, right: 50, top: 10, bottom: 20 }}
            style={{ width: 100 }}
          >
            <CreateAccount>Entrar no app</CreateAccount>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
export default Input;
