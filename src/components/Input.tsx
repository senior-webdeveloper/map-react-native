/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { TextInput, TouchableOpacity, View } from 'react-native';
import SmallText from './SmallText';
import Text from './Text';

interface InputProps {
  placeholder: string;
  widthSize?: number | string;
  onBlurFunc?: () => void;
  initialValue?: string;
  error?: string;
  isMultiline?: boolean;
  onChangeText: (text: string) => void;
  isEditable?: boolean;
}
interface InputReference extends TextInput {
  value: string;
}
interface PlaceholderLabelProps {
  isFocused: boolean;
  isFilled: boolean;
  hasInitialValue: boolean;
  isMultiline: boolean;
}
interface InputComponentProps {
  isMultiline: boolean;
  hasError: boolean;
}

export const Container = styled.View<InputComponentProps>`
  width: 306px;
  height: 50px;
  margin-top: ${({ isMultiline }) => (isMultiline ? '20px' : '10px')};
  border-bottom-width: 0.5px;
  padding: 0;
  border-bottom-color: ${({ hasError, theme }) =>
    hasError ? theme.colors.semantic.red : '#161c25'};
`;
export const PlaceholderLabel = styled(Text)<PlaceholderLabelProps>`
  font-family: ${({ isFocused, theme }) =>
    !isFocused ? theme.fontFamily.regular : theme.fontFamily.bold};
  position: absolute;
  left: 0;
  color: ${({ isFocused }) =>
    isFocused ? 'rgba(22, 28, 37, 0.6)' : 'rgba(22, 28, 37, 1)'};
  ${(props) =>
    props.isMultiline
      ? props.isFocused || props.isFilled || props.hasInitialValue
        ? css`
            transform: translateY(-20px);
            font-size: 14px;
          `
        : css`
            transform: translateY(+25px);
            font-size: 16px;
          `
      : props.isFocused || props.isFilled || props.hasInitialValue
      ? css`
          transform: translateY(0px);
          font-size: 14px;
        `
      : css`
          transform: translateY(+25px);
          font-size: 16px;
        `}
`;
export const LabeledInput = styled.TextInput<InputComponentProps>`
  font-family: 'NeuzeitGro-Reg';
  font-size: 16px;
  flex: 1;
  color: rgba(22, 28, 37, 0.6);
  padding: ${({ isMultiline }) => (isMultiline ? '0px 0' : '5px 0')};
  margin: 0;
`;
export const ErrorText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.semantic.red};
`;

export const ClearText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.gray};
`;
const Input: React.FC<InputProps> = ({
  placeholder,
  widthSize = '100%',
  initialValue = '',
  onChangeText = (e: string) => {},
  isMultiline = false,
  onBlurFunc = () => {},
  isEditable = true,
  error,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<InputReference>(null);
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handleInputBlur = useCallback((e) => {
    onBlurFunc();

    setIsFocused(false);
    if (inputRef.current) setIsFilled(!!inputRef.current.value);
  }, []);
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
      <Container
        style={{ width: widthSize }}
        isMultiline={isMultiline}
        hasError={error}
      >
        <PlaceholderLabel
          hasInitialValue={initialValue && initialValue.length > 0}
          isFocused={isFocused}
          isFilled={isFilled}
          isMultiline={isMultiline}
          onPress={() => setIsFocused(!isFocused)}
        >
          {placeholder}
        </PlaceholderLabel>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: isFocused || isFilled ? 0 : 0,
          }}
        >
          <LabeledInput
            ref={inputRef}
            placeholderTextColor="rgba(22, 28, 37, 0.6)"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            defaultValue={initialValue}
            onChangeText={handleChangeText}
            isMultiline={isMultiline}
            multiline={isMultiline}
            allowFontScaling={false}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 20 }}
            {...rest}
          />
          {isEditable && (
            <TouchableOpacity
              hitSlop={{ left: 20, right: 10, top: 10, bottom: 10 }}
              onPress={() => {
                inputRef.current.clear();
                handleChangeText('');
                setValue('');
              }}
              style={{
                width: 30,
                position: 'relative',
                bottom: isFocused || isFilled ? 0 : 0,
                right: 0,
              }}
            >
              <ClearText
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                }}
              >
                X
              </ClearText>
            </TouchableOpacity>
          )}
        </View>
      </Container>

      <ErrorText>{error}</ErrorText>
    </>
  );
};
export default Input;
