import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Text from './Text';
import Icon from './Icons';
// import { Container } from './styles';

interface Props {
  onChange: (e: boolean) => void;
  value: boolean;
  title: string;
  endButton?: React.ReactNode;
  EndButtonText?: string;
  EndButtonAction?: () => void;
}
export const Title = styled(Text)`
  margin-left: 12px;
  font-family: ${({ theme }) => theme.fontFamily.light};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  flex-direction: row;
`;
export const Container = styled.View`
  flex-direction: row;
`;
export const Link = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
`;

const CheckBox: React.FC<Props> = ({
  onChange,
  title,
  value = false,
  EndButtonAction,
  EndButtonText,
  ...props
}) => {
  return (
    <TouchableOpacity
      hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
      onPress={() => onChange(!value)}
      {...props}
    >
      <Container>
        {value ? (
          <Icon name="checkbox-checked" />
        ) : (
          <Icon name="checkbox-unchecked" />
        )}
        <Title>
          {title}{' '}
          {EndButtonText ? (
            <TouchableOpacity onPress={EndButtonAction}>
              <Link>{EndButtonText}</Link>
            </TouchableOpacity>
          ) : null}
        </Title>
      </Container>
    </TouchableOpacity>
  );
};

export default CheckBox;
