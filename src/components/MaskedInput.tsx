import React, { useState, useCallback, useRef } from 'react';
import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

interface InputProps {
  placeholder: string;
  widthSize?: number | string;
  onChangeText?: ((text: string) => void) | undefined;
}
interface InputReference extends TextInput {
  value: string;
}
interface PlaceholderLabelProps {
  isFocused: boolean;
  isFilled: boolean;
}
export const Container = styled.View`
  width: 306px;
  height: 50px;
  margin-top: 15px;
  border-bottom-width: 0.5px;
  padding: 0;
  border-bottom-color: #161c25;
`;
export const PlaceholderLabel = styled.Text<PlaceholderLabelProps>`
  font-family: ${(props) =>
    !props.isFocused ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Bol'};
  position: absolute;
  left: 0;
  color: ${(props) =>
    !props.isFocused ? 'rgba(22, 28, 37, 0.6)' : 'rgba(22, 28, 37, 1)'};
  ${(props) =>
    props.isFocused || props.isFilled
      ? css`
          transform: translateY(-5px);
          font-size: 14px;
        `
      : css`
          transform: translateY(+25px);
          font-size: 16px;
        `}
`;
export const LabeledInput = styled(TextInputMask)`
  flex: 1;
  font-family: 'NeuzeitGro-Reg';
  font-size: 16px;
  color: rgba(22, 28, 37, 0.6);
  padding: 0;
  margin: 0;
`;
const Input: React.FC<InputProps> = ({
  placeholder,
  widthSize = '100%',
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<InputReference>(null);
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    if (inputRef.current) setIsFilled(!!inputRef.current.value);
  }, []);
  const handleChangeText = useCallback((text) => {
    if (inputRef.current) {
      inputRef.current.value = text;
      setValue(text);
    }
  }, []);

  return (
    <Container style={{ width: widthSize }}>
      <PlaceholderLabel
        isFocused={isFocused}
        isFilled={isFilled}
        onPress={() => setIsFocused(!isFocused)}
      >
        {placeholder}
      </PlaceholderLabel>
      <LabeledInput
        ref={inputRef}
        placeholderTextColor="rgba(22, 28, 37, 0.6)"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        allowFontScaling={false}
        // includeRawValueInChangeText
        onChangeText={handleChangeText}
        value={value}
        {...rest}
      />
    </Container>
  );
};
export default Input;
