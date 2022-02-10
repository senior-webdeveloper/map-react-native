import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { Icons, Text, TitleText } from '~/components';
import { useReattemptSubscriptionPaymentMutation } from '~/graphql/autogenerate/hooks';
import { useStoreActions } from '~/store';
import { RetryPaymentAwardRootParamList } from '../RetryPaymentAward.routes';

export const OptionImage = styled(FastImage)``;

interface StatsProps {
  color: string;
}

export const PaymentStatusContainer = styled.View<StatsProps>`
  /* background-color: ${({ color }) => color}; */
  border-radius: 12px;
  elevation: 10;
  /* Shadow try 1 */
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
  padding-top: 12px;
  padding-bottom: 31px;
  padding-horizontal: 16px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  RetryPaymentAwardRootParamList,
  'confirmation'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RetryPaymentAwardRootParamList,
  'confirmation'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function Confirmation({
  route,
  navigation,
}: Props): JSX.Element {
  const {
    data,
    payment_method,
    selected_card,
    installments,
    award,
  } = route.params;

  const setIsOnPurchase = useStoreActions(
    (actions) => actions.chart.setIsOnPurchase,
  );

  const [
    reattemptSubscriptionPaymentMutation,
    { loading },
  ] = useReattemptSubscriptionPaymentMutation({
    onError: (e) => Alert.alert('ERRO', e.message),
    onCompleted: (e) => {
      setIsOnPurchase(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            { name: 'Home' },
            {
              name: 'Challenge.Description',
              params: {
                challenge_id: route.params.data.getChallengeDetail.id,
              },
            },
            {
              name: 'Challenge.SuccessPayment',
              params: {
                award: route.params.award,
                data: route.params.data,
                payment_id: e.reattemptSubscriptionPayment.payment_id,
                challenge_id: route.params.data.getChallengeDetail.id,
              },
            },
          ],
        }),
      );
    },
  });

  const paySubscription = async (): Promise<void> => {
    let payment_data = {};

    if (installments && installments.installments_quantity && selected_card) {
      payment_data = {
        ...payment_data,
        installments: String(installments.installments_quantity),
        payment_method, // credit_card | boleto
        external_card_id: selected_card.external_id,
        value_paid: installments.total_amount,
        cancel_waiting_payments: route.params.cancel_waiting_payments,
      };
    } else if (selected_card) {
      payment_data = {
        ...payment_data,
        payment_method, // credit_card | boleto
        external_card_id: selected_card.external_id,
        value_paid: installments.total_amount,
        cancel_waiting_payments: route.params.cancel_waiting_payments,
      };
    } else {
      payment_data = {
        ...payment_data,
        payment_method, // credit_card | boleto
        value_paid: route.params.value,
        cancel_waiting_payments: route.params.cancel_waiting_payments,
      };
    }
    payment_data = {
      ...payment_data,
      value_without_fee: route.params.value,
      resource_paid_id: route.params.data.getChallengeDetail.id,
    };

    const variables = {
      award_data: {
        chosen_award_id: route.params.award.id,
      },
      payment_data,
    };
    console.log(
      '🚀 ~ file: Payment.Confirmation.screen.tsx ~ line 140 ~ paySubscription ~ variables',
      variables,
    );

    await reattemptSubscriptionPaymentMutation({
      variables,
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <PaymentStatusContainer
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            paddingHorizontal: 16,
            paddingTop: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 25,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <TitleText style={{ fontSize: 20 }}>Confirme o pagamento</TitleText>
          <View style={{ width: 20 }} />
        </PaymentStatusContainer>
        <PaymentStatusContainer>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            {payment_method === 'credit_card' && selected_card ? (
              <>
                <Icons name="credit-card" height={70} />
                <Text style={{ fontSize: 14, opacity: 0.56 }}>
                  {selected_card.name} **** {selected_card.last_digits}
                </Text>
              </>
            ) : null}
            {payment_method === 'boleto' ? (
              <>
                <Icons name="bar-code" width={48} height={37} />
                <Text style={{ fontSize: 18, marginTop: 12 }}>
                  Você pagará R${' '}
                  {!Number.isInteger(route.params.value)
                    ? String(Number(route.params.value).toFixed(2)).replace(
                        '.',
                        ',',
                      )
                    : route.params.value}{' '}
                  no boleto
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    opacity: 0.56,
                    textAlign: 'center',
                  }}
                >
                  O boleto compensará em até 3 dias úteis. Sua inscrição será
                  liberada após a confirmação do pagamento.
                </Text>
              </>
            ) : null}

            {payment_method === 'pix' ? (
              <>
                <Icons name="pix" width={48} height={37} color="#32BCAD" />
                <Text style={{ fontSize: 18, marginTop: 12 }}>
                  Você pagará R${' '}
                  {!Number.isInteger(route.params.value)
                    ? String(Number(route.params.value).toFixed(2)).replace(
                        '.',
                        ',',
                      )
                    : route.params.value}{' '}
                  via Pix
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    opacity: 0.56,
                    textAlign: 'center',
                  }}
                >
                  O boleto compensará em até 3 dias úteis. Sua inscrição será
                  liberada após a confirmação do pagamento.
                </Text>
              </>
            ) : null}
          </View>
          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderColor: '#161C25',
              borderBottomWidth: 0.5,
              paddingVertical: 16,
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontFamily: 'NeuzeitGro-Lig' }}>
                {data.getChallengeDetail.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'NeuzeitGro-Lig',
                  opacity: 0.56,
                }}
              >
                ({award.name})
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>
                R${' '}
                {!Number.isInteger(route.params.value)
                  ? String(Number(route.params.value).toFixed(2)).replace(
                      '.',
                      ',',
                    )
                  : route.params.value}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingVertical: 16,
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontFamily: 'NeuzeitGro-Lig' }}>
                Você pagará
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 12 }}>
                R${' '}
                <TitleText style={{ fontSize: 20 }}>
                  {installments ? (
                    <>
                      {installments.installments_quantity}x{' '}
                      {!Number.isInteger(installments.installment_value)
                        ? String(
                            Number(installments.installment_value).toFixed(2),
                          ).replace('.', ',')
                        : installments.installment_value}
                    </>
                  ) : (
                    <>
                      {!Number.isInteger(route.params.value)
                        ? String(Number(route.params.value).toFixed(2)).replace(
                            '.',
                            ',',
                          )
                        : route.params.value}
                    </>
                  )}
                </TitleText>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              paySubscription();
            }}
            style={{
              marginTop: 27,
              backgroundColor: '#0564ff',
              paddingVertical: 8,
              alignItems: 'center',
              borderRadius: 24,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <TitleText style={{ color: '#fff', fontSize: 16 }}>
                Confirmar
              </TitleText>
            )}
          </TouchableOpacity>
        </PaymentStatusContainer>
        <View style={{ paddingHorizontal: 32 }} />
      </ScrollView>
    </>
  );
}
