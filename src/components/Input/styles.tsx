import { TextInput, Text } from 'react-native';
import styled from 'styled-components';
import colors from '~/styles/colors';

export const CustomInput = styled(TextInput)`
  color: ${colors.darkenBlue};
  font-family: 'Montserrat-Regular';
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  elevation: 1;
  border-width: ${(props) => (props.error ? '1px' : '0')};
  border-color: ${(props) => (props.error ? colors.error : '#FFF')};
`;

export const ErrorText = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: 13px;
  margin-top: 5px;
  color: ${colors.error};
`;

export const RecoverEmailText = styled(Text)`
  font-family: 'Montserrat-Regular';
  color: ${colors.purple};
  font-size: 13px;
  margin-top: 5px;
  align-items: center;
  text-align: right;
`;
