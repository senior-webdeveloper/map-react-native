import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import { Icons, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useCalculateInstallmentsQuery } from '~/graphql/autogenerate/hooks';
import {
  OptionContainer,
  SubscribeContainer,
} from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import formatCurrency from '~/helpers/formatCurrency';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

export const OptionImage = styled(FastImage)``;

type ChallengeDescriptionRouteProp = RouteProp<
  PaymentAwardRootParamList,
  'selectInstallments'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
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
  const cartStatus = useRecoilValue(_cartStatus);
  const { data } = route.params;

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);

  const { data: installments, loading } = useCalculateInstallmentsQuery({
    variables: {
      data: {
        challenge_id: route.params.data.getChallengeDetail.id,
        amount: Number(cartStatus.totalPrice),
      },
    },
    onError(e) {
      console.log('error: ', e.message);
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
            ? 'Escolha a melhor forma para comprar sua inscri????o.'
            : 'Escolha a melhor forma para comprar seu Kit.'}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator color="#0564FF" /> : null}
        {installments?.calculateInstallments &&
          installments?.calculateInstallments.installments.map((element) => (
            <OptionContainer
              key={element.installments_quantity}
              onPress={() => {
                if (route.params.has_address) {
                  navigation.push('personalInformation', {
                    installments: element,
                    ...route.params,
                  });
                } else {
                  navigation.push('billingAddress', {
                    installments: element,
                    ...route.params,
                  });
                }
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
                    {formatCurrency(
                      element.installment_value,
                      element.installments_quantity > 1,
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {element.installments_quantity > 1 &&
                !(element.total_amount > Number(cartStatus.totalPrice)) ? (
                  <Text
                    style={{
                      color: '#009D33',
                      fontSize: 16,
                    }}
                  >
                    Sem juros
                  </Text>
                ) : null}

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
          <Text>Voc?? pagar??</Text>

          <Text style={{ fontSize: 12 }}>
            R${' '}
            <TitleText style={{ fontSize: 24 }}>
              {!Number.isInteger(cartStatus.totalPrice)
                ? String(Number(cartStatus.totalPrice).toFixed(2)).replace(
                    '.',
                    ',',
                  )
                : cartStatus.totalPrice}
            </TitleText>
          </Text>
        </SubscribeContainer>
      </View>
    </View>
  );
}
