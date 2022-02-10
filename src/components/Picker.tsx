import React from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { onChange } from 'react-native-reanimated';

// import { Container } from './styles';
interface ItemsProps {
  label: string;
  value: string;
}

interface Props {
  data: ItemsProps[];
  onChangeValue: (e: string) => void;
}
const Picker: React.FC<Props> = ({
  data,
  onChangeValue,
  placeholder,
  ...rest
}) => {
  return (
    <RNPickerSelect
      {...rest}
      onValueChange={(value) => onChangeValue(value)}
      placeholder={placeholder || { label: 'Selecione', value: null }}
      useNativeAndroidPickerStyle={false}
      textInputProps={{ allowFontScaling: false }}
      items={data}
      style={{
        inputIOS: {
          fontFamily: 'NeuzeitGro-Reg',
          fontSize: 16,
          paddingVertical: 8,
          borderRadius: 8,
          color: 'rgba(22, 28, 37, 0.7);',
          paddingRight: 30, // to ensure the text is never behind the icon
        },
        inputAndroid: {
          fontFamily: 'NeuzeitGro-Reg',
          fontSize: 16,
          paddingVertical: 8,
          borderRadius: 8,
          color: 'rgba(22, 28, 37, 0.7);',
          paddingRight: 30, // to ensure the text is never behind the icon
        },
      }}
    />
  );
};

export default Picker;
