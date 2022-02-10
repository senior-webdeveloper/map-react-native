/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableOpacity, View, TextInput } from 'react-native';
import SmallText from './SmallText';
import Text from './Text';
import { Icons } from '~/components/index';
import { LabeledInput } from '~/components/Input';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

interface InputProps {
  label: string;
  placeholder?: string;
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
interface ErrorProps {
  hasError: boolean;
}
export const OptionContainer = styled.View<ErrorProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ hasError }) => (hasError ? 'red' : '#efefef')};
`;
export const OptionTitle = styled(Text)`
  font-size: 20px;
  margin-bottom: 8px;
`;
export const Input = styled.TextInput<InputReference>`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: rgba(22, 28, 37, 0.7);
  font-size: 16px;
  width: 100%;
`;
export const ErrorTitle = styled(Text)`
  margin-bottom: 8px;
  color: red;
`;
const NewProfileInput: React.FC<InputProps> = ({
  label,
  placeholder,
  initialValue = '',
  onChangeText = (e: string) => {},
  isMultiline = false,
  onBlurFunc = () => {},
  isEditable = true,
  error,
  ...rest
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<InputReference>(null);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handleInputBlur = useCallback((e) => {
    onBlurFunc();

    setIsFocused(false);
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
      <OptionContainer hasError={error && error.length > 0}>
        <View>
          <OptionTitle>{label}</OptionTitle>
          <Input
            style={{
              width: widthPercentageToDP('90'),
              paddingVertical: 10,
            }}
            ref={inputRef}
            placeholderTextColor="rgba(22, 28, 37, 0.6)"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            defaultValue={initialValue}
            onChangeText={handleChangeText}
            multiline={isMultiline}
            allowFontScaling={false}
            {...rest}
          />
        </View>
      </OptionContainer>
      <ErrorTitle>{error}</ErrorTitle>
    </>
  );
};
export default NewProfileInput;
