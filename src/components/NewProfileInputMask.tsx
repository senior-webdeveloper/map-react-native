/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import {
  TextInputMask as TextInput,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text';
import Text from './Text';
import { LabeledInput } from '~/components/MaskedInputWithoutLabel';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { ErrorTitle } from '~/components/NewProfileInput';

interface InputProps extends TextInput {
  label: string;
  placeholder?: string;
  onBlurFunc?: () => void;
  initialValue?: string;
  error?: string;
  onChangeText: (text: string) => void;
  type: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp;
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
export const Input = styled(TextInput)<InputReference>`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: rgba(22, 28, 37, 0.7);
  font-size: 16px;
  width: 100%;
`;
const NewProfileInput: React.FC<InputProps> = ({
  label,
  placeholder,
  initialValue = '',
  onChangeText = (e: string) => {},
  error,
  onBlurFunc = () => {},
  type,
  options,
  ...rest
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handleInputBlur = useCallback((e) => {
    onBlurFunc();

    setIsFocused(false);
  }, []);

  const handleChangeText = useCallback((text) => {
    setValue(text);
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
            placeholderTextColor="rgba(22, 28, 37, 0.6)"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            defaultValue={initialValue}
            value={value}
            includeRawValueInChangeText
            onChangeText={(maskedText, rawText) => {
              if (type === 'datetime') {
                handleChangeText(maskedText);
              } else {
                handleChangeText(rawText);
              }
            }}
            allowFontScaling={false}
            type={type}
            options={options}
            {...rest}
          />
        </View>
      </OptionContainer>
      <ErrorTitle>{error}</ErrorTitle>
    </>
  );
};
export default NewProfileInput;
