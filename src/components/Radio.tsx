import React from 'react';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
// import { Container } from './styles';
// const radioprops2 = [
//   { label: 'Sim  ', value: 0 },
//   { label: 'Não', value: 1 },
// ];
interface RadioProps {
  label: string;
  value: number;
}
interface Props {
  item: RadioProps[];
  horizontal?: boolean;
  onChangeValue?: (e: string) => void;
}
const Radio: React.FC<Props> = ({
  item,
  horizontal = false,
  onChangeValue = () => {},
}) => {
  const [radioSelect, setRadioSelect] = React.useState(0);

  React.useEffect(() => {
    onChangeValue(String(radioSelect));
  }, [radioSelect]);
  return (
    <RadioForm formHorizontal={horizontal} animation>
      {/* To create radio buttons, loop through your array of options */}
      {item.map((obj, i) => (
        <RadioButton
          labelHorizontal
          key={i}
          style={{
            justifyContent: 'space-between',
            marginTop: horizontal ? 0 : 20,
          }}
        >
          {horizontal ? (
            <>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={radioSelect === i}
                onPress={() => setRadioSelect(i)}
                borderWidth={1}
                buttonInnerColor="#0564FF"
                buttonOuterColor={
                  radioSelect === i
                    ? '#0564FF'
                    : 'rgba(135, 149, 173, 0.323071)'
                }
                buttonSize={5}
                buttonOuterSize={16}
                buttonStyle={{}}
                buttonWrapStyle={{ marginLeft: 10 }}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal
                onPress={() => setRadioSelect(i)}
                labelStyle={{
                  fontSize: 16,
                  color: '#161C25',
                  fontFamily: 'NeuzeitGro-Reg',
                }}
                labelWrapStyle={{}}
              />
            </>
          ) : (
            <>
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal
                onPress={() => setRadioSelect(i)}
                labelStyle={{
                  fontSize: 16,
                  color: '#161C25',
                  fontFamily: 'NeuzeitGro-Reg',
                }}
                labelWrapStyle={{}}
              />
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={radioSelect === i}
                onPress={() => setRadioSelect(i)}
                borderWidth={1}
                buttonInnerColor="#0564FF"
                buttonOuterColor={
                  radioSelect === i
                    ? '#0564FF'
                    : 'rgba(135, 149, 173, 0.323071)'
                }
                buttonSize={5}
                buttonOuterSize={16}
                buttonStyle={{}}
                buttonWrapStyle={{ marginLeft: 10 }}
              />
            </>
          )}
        </RadioButton>
      ))}
    </RadioForm>
  );
};

export default Radio;
