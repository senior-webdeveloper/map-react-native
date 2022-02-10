import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import { Icons, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useGetCardsLazyQuery } from '~/graphql/autogenerate/hooks';
import {
  OptionContainer,
  SubscribeContainer,
} from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { useUserToken } from '~/hooks';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

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
  PaymentAwardRootParamList,
  'selectAddress'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
  'selectAddress'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function SelectAddress({
  route,
  navigation,
}: Props): JSX.Element {
  const cartStatus = useRecoilValue(_cartStatus);

  const { data, rootNavigation } = route.params;
  const { userID: user_id } = useUserToken();

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);

  const [getCards, { data: cards, loading }] = useGetCardsLazyQuery();

  useEffect(() => {
    if (user_id && !cards?.getCards) {
      getCards({
        variables: { pagination: { page: 1, offset: 5 }, user_id },
      });
    }
  }, [user_id]);

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
        {loading ? <ActivityIndicator color="#0564FF" /> : null}
        {cards?.getCards &&
          cards?.getCards.map((card) => (
            <OptionContainer
              onPress={() => {
                navigation.navigate('selectInstallments', {
                  ...route.params,
                  payment_method: 'credit_card',
                  selected_card: card,
                });
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
            if (route.params.has_address) {
              if (route.params.data.getChallengeDetail.physical_event) {
                navigation.push('personalInformation', {
                  payment_method: 'pix',
                  ...route.params,
                });
              }
            } else {
              navigation.navigate('billingAddress', {
                payment_method: 'pix',
                ...route.params,
              });
            }
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
            if (route.params.has_address) {
              if (route.params.data.getChallengeDetail.physical_event) {
                navigation.push('personalInformation', {
                  payment_method: 'boleto',
                  ...route.params,
                });
              }
            } else {
              navigation.navigate('billingAddress', {
                payment_method: 'boleto',
                ...route.params,
              });
            }
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
              <Text style={{ fontSize: 12 }}>
                R${' '}
                <TitleText style={{ fontSize: 24 }}>
                  {!Number.isInteger(cartStatus.totalWithoutSub)
                    ? String(
                        Number(cartStatus.totalWithoutSub).toFixed(2),
                      ).replace('.', ',')
                    : cartStatus.totalWithoutSub}
                </TitleText>
              </Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 12 }}>
                R${' '}
                {!route.params.withdrawAddresse ? (
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(
                      cartStatus.totalWithoutSub +
                        route.params.calculate_freight_quote_value,
                    )
                      ? String(
                          Number(
                            cartStatus.totalWithoutSub +
                              route.params.calculate_freight_quote_value,
                          ).toFixed(2),
                        ).replace('.', ',')
                      : cartStatus.totalWithoutSub +
                        route.params.calculate_freight_quote_value}
                  </TitleText>
                ) : (
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(cartStatus.totalWithoutSub)
                      ? String(
                          Number(cartStatus.totalWithoutSub).toFixed(2),
                        ).replace('.', ',')
                      : cartStatus.totalWithoutSub}
                  </TitleText>
                )}
              </Text>
            </>
          )}
        </SubscribeContainer>
      </View>
    </View>
  );
}
