import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { addDays, format } from 'date-fns';
import LottieView from 'lottie-react-native';
import { useRecoilValue } from 'recoil';
import { BoxShadow, Icons, SmallText, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { useUserInfo } from '~/hooks';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import ptBR from '~/helpers/dateLocale';
import {
  CurrencyText,
  FooterContainer,
  NextButton,
  NextButtonText,
  ValueText,
} from '~/screens/Challenge/Challenge.Description/components/BuyModal/styles';
import { useCalculateFreightQuoteMutation } from '~/graphql/autogenerate/hooks';
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

export default function ShippingCoast({
  route,
  navigation,
}: Props): JSX.Element {
  const cartStatus = useRecoilValue(_cartStatus);

  const { data } = route.params;
  const userProfile = useStoreState(({ profile }) => profile.payload);
  const [
    calculateFreightQuoteMutation,
    { data: calculateFreight, loading, error },
  ] = useCalculateFreightQuoteMutation();
  const [loadingAnimation, setLoadingAnimation] = useState<boolean>(true);

  const handleCalculate = async () => {
    const { data: banananinha } = await calculateFreightQuoteMutation({
      variables: {
        data: {
          award_id: route.params.award_id,
          user_id: userProfile?.getProfile.user.id,
          zip_destination: userProfile?.getProfile.user.zip_code,
          zip_origin: route.params.data.getChallengeDetail.company.zip_code,
        },
      },
    });
  };

  useEffect(() => {
    // handleCalculate();
  }, []);

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);

  return (
    <ScrollView
      contentContainerStyle={{ justifyContent: 'space-between', flex: 1 }}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      {loadingAnimation ? (
        <>
          <View>
            <LottieView
              source={require('../components/animations/bike.json')}
              autoPlay
              onAnimationFinish={() => {
                setLoadingAnimation(false);
              }}
              loop={false}
              style={{
                width: '100%',
                marginTop: 20,
              }}
            />
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text>Calculando a entrega</Text>
              <Text>em sua casa.</Text>
            </View>
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <SubscribeContainer
              style={{
                elevation: 10,
                width: widthPercentageToDP('100'),
                paddingTop: 35,
                paddingHorizontal: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>Você pagará</Text>
              {cartStatus.totalWithoutSub && (
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
              )}
            </SubscribeContainer>
          </View>
        </>
      ) : (
        <>
          <View>
            <BoxShadow>
              <View
                style={{
                  paddingTop: 50,
                  paddingBottom: 14,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.pop(1);
                  }}
                >
                  <Icons name="arrow-left" />
                </TouchableOpacity>
                <TitleText>Envio do Kit</TitleText>
                <View style={{ width: 20 }} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  marginTop: 37,
                }}
              >
                <Text>Entrega</Text>
                <Text style={{ fontSize: 20, lineHeight: 23 }}>
                  R${' '}
                  {calculateFreight?.calculateFreightQuote.value
                    ? calculateFreight?.calculateFreightQuote.value
                    : 19}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  marginTop: 37,
                }}
              >
                <Text>Previsão</Text>
                <Text style={{ fontSize: 20, lineHeight: 23 }}>
                  {format(
                    addDays(new Date(data.getChallengeDetail.end_date), 15),
                    "dd 'de' LLL 'de' yyyy",
                    { locale: ptBR },
                  )}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  marginTop: 37,
                }}
              >
                <Icons name="marker" />
                <View style={{ marginLeft: 14 }}>
                  <Text style={{ fontSize: 14, lineHeight: 16.1 }}>
                    {userProfile?.getProfile.user.address_line_one},{' '}
                    {userProfile?.getProfile.user.street_number},{' '}
                    {userProfile?.getProfile.user.city?.name}/
                    {userProfile?.getProfile.user.city?.state.abbreviation}.
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 16.1,
                      opacity: 0.56,
                      marginTop: 8,
                    }}
                  >
                    CEP: {userProfile?.getProfile.user.zip_code}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: 40,
                  paddingBottom: 40,
                }}
              >
                <SmallText style={{ fontSize: 20, lineHeight: 23 }}>
                  Como funciona o envio?
                </SmallText>
                <SmallText
                  style={{
                    fontSize: 14,
                    lineHeight: 16.1,
                    marginTop: 8,
                    opacity: 0.56,
                  }}
                >
                  Os kits são enviados para todos os participantes após o
                  período de realização do Desafio encerrar (
                  {format(new Date(data.getChallengeDetail.end_date), 'P', {
                    locale: ptBR,
                  })}
                  ).
                </SmallText>
                <SmallText
                  style={{ fontSize: 14, lineHeight: 16.1, opacity: 0.56 }}
                >
                  Então é possível alterar o endereço de entrega a qualquer
                  momento antes da emissão da Nota Fiscal de transporte.
                </SmallText>
              </View>
            </BoxShadow>
          </View>
          <View
            style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
          >
            <FooterContainer>
              {data.getChallengeDetail.physical_event ? (
                <>
                  {cartStatus.totalWithoutSub && (
                    <CurrencyText>
                      R${' '}
                      <ValueText>
                        {!Number.isInteger(cartStatus.totalWithoutSub)
                          ? String(
                              Number(cartStatus.totalWithoutSub).toFixed(2),
                            ).replace('.', ',')
                          : cartStatus.totalWithoutSub}
                      </ValueText>
                    </CurrencyText>
                  )}
                </>
              ) : (
                <>
                  {cartStatus.totalWithoutSub && (
                    <CurrencyText>
                      R${' '}
                      <ValueText>
                        {!Number.isInteger(
                          cartStatus.totalWithoutSub +
                            calculateFreight?.calculateFreightQuote.value
                            ? calculateFreight?.calculateFreightQuote.value
                            : 19,
                        )
                          ? String(
                              Number(
                                cartStatus.totalWithoutSub +
                                  calculateFreight?.calculateFreightQuote.value
                                  ? calculateFreight?.calculateFreightQuote
                                      .value
                                  : 19,
                              ).toFixed(2),
                            ).replace('.', ',')
                          : cartStatus.totalWithoutSub +
                            (calculateFreight?.calculateFreightQuote.value
                              ? calculateFreight?.calculateFreightQuote.value
                              : 19)}
                      </ValueText>
                    </CurrencyText>
                  )}
                </>
              )}

              <NextButton
                onPress={() => {
                  navigation.push('selectMethod', {
                    ...route.params,
                    has_address: true,
                    calculate_freight_quote_value: calculateFreight
                      ?.calculateFreightQuote.value
                      ? calculateFreight?.calculateFreightQuote.value
                      : 19,
                  });
                }}
              >
                <NextButtonText style={{ fontSize: 20 }}>
                  Próximo
                </NextButtonText>
              </NextButton>
            </FooterContainer>
          </View>
        </>
      )}
    </ScrollView>
  );
}
