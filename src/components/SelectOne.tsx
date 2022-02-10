import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Icons from './Icons';
import Text from './Text';

// import { Container } from './styles';
interface ElementsProps {
  label: string;
  value: string;
}
interface Props {
  data: ElementsProps[];
}
export const Container = styled.View`
  /* background-color: red; */
  border-bottom-width: 0.5px;
  border-bottom-color: #acb7c7;
  padding: 23px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SelectOne: React.FC<Props> = ({ data }) => {
  const [selected, setSelected] = useState<number>(0);
  return (
    <>
      {data.map((e, i) => (
        <TouchableOpacity onPress={() => setSelected(i)}>
          <Container>
            <Text>{e.label}</Text>
            {selected === i && <Icons name="check" color="#0564FF" />}
          </Container>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default SelectOne;
