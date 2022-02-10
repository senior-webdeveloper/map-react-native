import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import TitleText from './TitleText';
import SmallText from './SmallText';

interface TextProps {
  isFilled: boolean;
}
// export const Text = styled(TitleText)<TextProps>`
//   font-family: ${({ theme }) => theme.fontFamily.light};
//   color: ${({ theme, isFilled }) =>
//     isFilled ? theme.colors.blue : theme.colors.text};
//   /* font-size: 36px; */
// `;
export const ResendText = styled(SmallText)`
  margin-top: 11px;
  color: ${({ theme }) => theme.colors.blue};
`;
// interface Props {
//   onChangeText?: (e: string) => void;
// }
const Code: React.FC = () => {
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <SafeAreaView style={{ padding: 20, minHeight: 300 }}>
      <CodeField
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={{
          marginTop: 20,
          width: 280,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[
              {
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
              },
              isFocused && {
                borderBottomColor: '#007AFF',
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={{
                color: '#000',
                fontSize: 36,
                textAlign: 'center',
              }}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Code;
