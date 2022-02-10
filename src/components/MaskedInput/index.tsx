import React from 'react';
import { TouchableOpacity, TextInputProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomInput, ErrorText, RecoverEmailText } from './styles';

interface InputProps {
  error?: string;
  rest: TextInputProps;
}

const Input: React.FC<InputProps> = ({ error, ...rest }) => {
  const navigation = useNavigation();

  return (
    <>
      <CustomInput {...rest} error={error} />
      {error && <ErrorText>* {error}</ErrorText>}
    </>
  );
};

export default Input;
