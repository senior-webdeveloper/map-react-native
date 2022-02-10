import React from 'react';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icons, SafeAreaView, Text } from '~/components';
import Card from './assets/card.png';
import Apple from './assets/applepay.png';
import Visa from './assets/visa.png';
import Master from './assets/master.png';
import Debit from './assets/debit.png';

export const Container = styled.ScrollView`
  padding: 0px 24px;
  margin-bottom: 60px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;
export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const CardComponent = styled.Image`
  width: 308.49px;
  height: 205px;
`;
export const Subtitle = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 16px;
  line-height: 24px;
  margin-top: 25px;
`;
export const OptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
  margin-top: 10px;
`;
export const SelectedOptionText = styled(Text)`
  margin-right: 10px;
`;
export const PaymentMethodsImage = styled.Image`
  width: 43px;
`;
export const PaymentMethodText = styled(Text)`
  width: 70%;
  margin-left: 28px;
`;
const BankSettings: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ backgroundColor: '#F9F9F9', flex: 1 }}>
      <Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Conta bancária</Title>
        <View style={{ width: 20 }} />
      </Header>
      <Container
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Wrapper>
          <CardComponent source={Card} />
        </Wrapper>
        <Subtitle>Conta </Subtitle>
        <OptionContainer>
          <Text>Editar conta bancária</Text>
          <Wrapper>
            <SelectedOptionText>Editar </SelectedOptionText>
            <Icons name="pen" />
          </Wrapper>
        </OptionContainer>
        <Subtitle>Adicionar forma de pagamento</Subtitle>
        <OptionContainer>
          <PaymentMethodsImage source={Apple} />
          <PaymentMethodText>Apple Pay</PaymentMethodText>
          <Title>+</Title>
        </OptionContainer>
        <OptionContainer>
          <PaymentMethodsImage source={Visa} />
          <PaymentMethodText>Visa</PaymentMethodText>
          <Title>+</Title>
        </OptionContainer>
        <OptionContainer>
          <PaymentMethodsImage source={Master} />
          <PaymentMethodText>MasterCard</PaymentMethodText>
          <Title>+</Title>
        </OptionContainer>
        <OptionContainer>
          <PaymentMethodsImage source={Debit} />
          <PaymentMethodText>Cartão de débito</PaymentMethodText>
          <Title>+</Title>
        </OptionContainer>
      </Container>
    </SafeAreaView>
  );
};

export default BankSettings;
