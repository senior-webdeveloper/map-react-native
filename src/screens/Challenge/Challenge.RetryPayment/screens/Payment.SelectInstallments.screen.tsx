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
  useCalculateInstallmentsQuery,
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
import formatCurrency from '~/helpers/formatCurrency';
import { RetryPaymentAwardRootParamList } from '../RetryPaymentAward.routes';

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
  'selectInstallments'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RetryPaymentAwardRootParamList,
  'selectInstallments'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function SelectInstallments({
  route,
  navigation,
}: Props): JSX.Element {
  const { data, payment_method, selected_card } = route.params;
  const { userID: user_id } = useUserToken();

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);

  const {
    data: installments,
    loading: loadingInstallments,
  } = useCalculateInstallmentsQuery({
    variables: {
      data: {
        amount: route.params.value,
      },
    },
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
        <TitleText>Em quantas vezes?</TitleText>
        <Text>
          {data.getChallengeDetail.physical_event
            ? 'Escolha a melhor forma para comprar sua inscrição.'
            : 'Escolha a melhor forma para comprar seu Kit.'}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {installments?.calculateInstallments &&
          installments?.calculateInstallments.installments.map((element) => (
            <OptionContainer
              onPress={() => {
                navigation.push('confirmation', {
                  installments: element,
                  ...route.params,
                });
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TitleText style={{ fontSize: 18, lineHeight: 20 }}>
                  {element.installments_quantity}x
                </TitleText>

                <View>
                  <Text
                    style={{ marginLeft: 15, fontSize: 18, lineHeight: 20 }}
                  >
                    {formatCurrency(element.installment_value)}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {element.installments_quantity > 1 && (
                  <Text
                    style={{
                      color: '#009D33',
                      fontSize: 16,
                    }}
                  >
                    Sem juros
                  </Text>
                )}

                <Icons name="chevron-right" style={{ marginLeft: 16 }} />
              </View>
            </OptionContainer>
          ))}
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
              {chart && (
                <Text style={{ fontSize: 12 }}>
                  R${' '}
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(chart.price + totalAddonPrice)
                      ? String(
                          Number(chart.price + totalAddonPrice).toFixed(2),
                        ).replace('.', ',')
                      : chart.price + totalAddonPrice}
                  </TitleText>
                </Text>
              )}
            </>
          ) : (
            <>
              {chart && (
                <Text style={{ fontSize: 12 }}>
                  R${' '}
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(chart.price + totalAddonPrice + 19)
                      ? String(
                          Number(chart.price + totalAddonPrice + 19).toFixed(2),
                        ).replace('.', ',')
                      : chart.price + totalAddonPrice + 19}
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
