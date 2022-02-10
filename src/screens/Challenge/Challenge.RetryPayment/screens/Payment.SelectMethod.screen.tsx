import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInputMask } from 'react-native-masked-text';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import styled from 'styled-components/native';
import { captureException } from '@sentry/react-native';
import * as Yup from 'yup';
import { isDate, parse } from 'date-fns';
import Analytics from 'appcenter-analytics';
import { Card } from '~/graphql/autogenerate/schemas';
import { Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import {
  GetProfileDocument,
  useCreateCardMutation,
  useGetCardsQuery,
  useSubscribeUserChallengeMutation,
  useUpdateProfilePersonalMutation,
  useCalculateInstallmentsLazyQuery,
} from '~/graphql/autogenerate/hooks';
import {
  OptionContainer,
  SubscribeContainer,
} from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreActions, useStoreState } from '~/store';
import { useUserInfo, useUserToken } from '~/hooks';
import CheckBox from '~/components/Checkbox';
import validateCpf from '~/helpers/validateCpf';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { RetryPaymentAwardRootParamList } from '../PaymentAward.routes';

export const OptionImage = styled(FastImage)``;
const RefeshContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 20px 0 80px;
`;
const RefeshText = styled(Text)`
  margin-right: 9px;
  color: ${({ theme }) => theme.colors.blue};
`;

type ChallengeDescriptionRouteProp = RouteProp<
  RetryPaymentAwardRootParamList,
  'selectMethod'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RetryPaymentAwardRootParamList,
  'selectMethod'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function SelectAddress({
  route,
  navigation,
}: Props): JSX.Element {
  const { data, value, rootNavigation } = route.params;
  const { userID: user_id } = useUserToken();

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);

  const { data: cards } = useGetCardsQuery({
    variables: { pagination: { page: 1, offset: 5 }, user_id },
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          paddingTop: 50,
          marginBottom: 15,
        }}
      >
        <View style={{ marginBottom: 15, marginTop: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>
        <TitleText>Como você prefere pagar</TitleText>
        <Text>
          {data.getChallengeDetail.physical_event
            ? 'Comprar sua inscricao.'
            : 'Escolha a melhor forma para comprar seu Kit.'}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {cards?.getCards &&
          cards?.getCards.map((card) => (
            <OptionContainer
              onPress={() => {
                navigation.navigate('selectInstallments', {
                  payment_method: 'credit_card',
                  selected_card: card,
                });
                // setSelectedCard(card);
                // setPaymentMethod('credit_card');
                // setPurchaseStep('selectInstallments');
                // fetchInstallments({
                //   variables: {
                //     data: {
                //       amount: data.getChallengeDetail.physical_event
                //         ? Number(chart.price + totalAddonPrice)
                //         : Number(chart.price + totalAddonPrice + 19),
                //     },
                //   },
                // });
                // if (
                //   data?.getChallengeDetail.awards &&
                //   data?.getChallengeDetail.awards[award_index]
                //     .awardAdditionalRequest &&
                //   data?.getChallengeDetail.awards[award_index]
                //     .awardAdditionalRequest.length > 0
                // ) {
                //   // setPurchaseStep('confirmation');
                // } else {
                //   // setPurchaseStep('confirmation');
                // }
                // paySubscription(
                //   data?.getChallengeDetail.awards[award_index].id,
                //   'credit_card',
                //   card.external_id,
                // );
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icons
                  name={
                    card?.brand === 'unknown'
                      ? 'credit-card'
                      : card?.brand ?? 'credit-card'
                  }
                  width={31}
                  height={21}
                />
                <View style={{ width: '70%' }}>
                  <Text style={{ marginLeft: 15 }} numberOfLines={1}>
                    {card.name}
                  </Text>
                  <Text style={{ marginLeft: 15, opacity: 0.56 }}>
                    **** **** **** {card.last_digits}
                  </Text>
                </View>
              </View>
              <Icons name="chevron-right" />
            </OptionContainer>
          ))}

        <OptionContainer
          onPress={() => {
            navigation.navigate('confirmation', {
              payment_method: 'pix',
              ...route.params,
            });
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icons name="pix" width={31} color="#32BCAD" />
            <Text style={{ marginLeft: 15 }}>Pix</Text>
          </View>
          <Icons name="chevron-right" />
        </OptionContainer>

        <OptionContainer
          onPress={() => {
            navigation.navigate('confirmation', {
              payment_method: 'boleto',
              ...route.params,
            });
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icons name="bar-code" width={31} />
            <Text style={{ marginLeft: 15 }}>Boleto Bancário</Text>
          </View>
          <Icons name="chevron-right" />
        </OptionContainer>
        <OptionContainer
          onPress={() => rootNavigation.push('User.CreditCardsCreate')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icons name="credit-card" width={31} />
            <Text style={{ marginLeft: 15 }}>Novo Cartão de Crédito</Text>
          </View>
          <Icons name="chevron-right" />
        </OptionContainer>

        <RefeshContainer
          onPress={() => rootNavigation.push('User.ListCreditCards')}
        >
          <RefeshText>Gerenciar meus cartões</RefeshText>
          <Icons name="arrow-right" color="#0564FF" />
        </RefeshContainer>
      </ScrollView>

      <View style={{ alignItems: 'center' }}>
        <SubscribeContainer
          style={{
            elevation: 10,
            width: widthPercentageToDP('100'),
            paddingBottom: 21,
            paddingTop: 35,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text>Você pagará</Text>
          {data.getChallengeDetail.physical_event ? (
            <>
              {value && (
                <Text style={{ fontSize: 12 }}>
                  R${' '}
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(value)
                      ? String(Number(value).toFixed(2)).replace('.', ',')
                      : value}
                  </TitleText>
                </Text>
              )}
            </>
          ) : (
            <>
              {value && (
                <Text style={{ fontSize: 12 }}>
                  R${' '}
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(value)
                      ? String(Number(value).toFixed(2)).replace('.', ',')
                      : value}
                  </TitleText>
                </Text>
              )}
            </>
          )}
        </SubscribeContainer>
      </View>
    </View>
  );
}
