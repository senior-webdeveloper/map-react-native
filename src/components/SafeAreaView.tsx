import React from 'react';
import { StatusBar, Platform, ViewProps } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  padding-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 0};
  background-color: #fff;
`;

const SafeAreaView: React.FC<ViewProps> = ({ children, ...rest }) => {
  return <Container {...rest}>{children}</Container>;
};

export default SafeAreaView;
