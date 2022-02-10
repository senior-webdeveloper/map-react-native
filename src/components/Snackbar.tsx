import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SnackBar from 'react-native-snackbar-component';
import styled from 'styled-components/native';
import CustomText from './Text';
import Icons from './Icons';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: red;
`;
export const MessageText = styled(CustomText)`
  color: ${({ theme }) => theme.colors.textWhite};
  margin-left: 8px;
`;
export type TypeSnackBar = 'success' | 'error' | 'warning';
interface Props {
  show: boolean;
  setShow: (e: boolean) => void;
  message: string;
  type: TypeSnackBar;
}
const Snackbar: React.FC<Props> = ({ show, setShow, message, type }) => {
  const handleType = () => {
    switch (type) {
      case 'error':
        return '#FF2525';
      case 'success':
        return '#00BE8E';
      case 'warning':
        return '#FFC502';
    }
  };
  return (
    <SnackBar
      visible={show}
      textMessage={message}
      actionHandler={() => {
        setShow(false);
      }}
      actionText="X"
      position="bottom"
      backgroundColor={handleType()}
      autoHidingTime={5000}
      accentColor="#FFF"
      bottom={20}
    />
  );
};

export default Snackbar;
