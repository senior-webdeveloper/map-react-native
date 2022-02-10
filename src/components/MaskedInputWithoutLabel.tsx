import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text';
import { TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { icons } from '~/assets/icons';
import Icons from './Icons';
import SmallText from './SmallText';

interface InputProps {
  error?: string;
  onChangeText: (e: string) => void;
  isDate?: boolean;
  initialValue?: string;
  isEditable?: boolean;
}
type DefaultInputProps = TextInputProps & InputProps & TextInputMaskProps;
interface InputReference extends TextInput {
  value: string;
}
interface ContainerProps {
  error: boolean;
}
interface IconProps {
  isActive?: boolean;
}

export const Container = styled.View<ContainerProps>`
  /* width: 60%; */
  height: 50px;
  border-bottom-width: 0.5px;
  padding: 0;
  border-bottom-color: ${({ theme, error }) =>
    !error ? theme.colors.text : theme.colors.semantic.red};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LabeledInput = styled(TextInputMask)`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 16px;
  width: 100%;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
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
export const ClearText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.gray};
`;

const Input: React.FC<DefaultInputProps> = ({
  error,
  onChangeText,
  initialValue = '',
  isDate = false,
  isEditable = true,
  ...rest
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<InputReference>(null);

  const handleChangeText = useCallback((text) => {
    if (inputRef.current) {
      inputRef.current.value = text;
      setValue(text);
    }
  }, []);
  useEffect(() => {
    onChangeText(value);
  }, [value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <>
      <Container error={error !== undefined}>
        <LabeledInput
          ref={inputRef}
          placeholderTextColor="rgba(22, 28, 37, 0.6)"
          includeRawValueInChangeText
          allowFontScaling={false}
          onChangeText={(maskedText, rawText) => {
            if (isDate) {
              handleChangeText(maskedText);
            } else {
              handleChangeText(rawText);
            }
          }}
          value={value}
          {...rest}
        />
        {isEditable && (
          <TouchableOpacity
            hitSlop={{ left: 30, right: 30, top: 30, bottom: 30 }}
            onPress={() => {
              setValue('');
            }}
          >
            <ClearText
              style={{
                position: 'absolute',
                right: 0,
                bottom: -19,
              }}
            >
              X
            </ClearText>
          </TouchableOpacity>
        )}
      </Container>
      <ErrorText>{error}</ErrorText>
    </>
  );
};
export default Input;
