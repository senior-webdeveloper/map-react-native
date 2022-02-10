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
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { useRecoilValue } from 'recoil';
import { Icons, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreActions, useStoreState } from '~/store';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

export const OptionImage = styled(FastImage)``;

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
  const { rootNavigation } = route.params;
  const userProfile = useStoreState(({ profile }) => profile.payload);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <View>
        <View style={{ marginVertical: 15, paddingTop: 50 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          <TitleText>Endereço de cobrança</TitleText>
          <Text style={{ opacity: 0.56 }}>
            Essa informação será utilizada para gerar um pagamento válido.
          </Text>
        </View>

        {userProfile?.getProfile.user.city &&
        userProfile?.getProfile.user.street_number &&
        userProfile?.getProfile.user.zip_code &&
        userProfile?.getProfile.user.address_line_one ? (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.push('personalInformation', { ...route.params });
              }}
              style={{
                marginTop: 48,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={{ width: widthPercentageToDP('58') }}>
                  {userProfile?.getProfile.user.address_line_one},{' '}
                  {userProfile?.getProfile.user.street_number},{' '}
                  {userProfile?.getProfile.user.address_line_two.length > 1
                    ? userProfile?.getProfile.user.address_line_two
                    : null}
                  {userProfile?.getProfile.user.city?.name}/
                  {userProfile?.getProfile.user.city?.state.abbreviation}
                </Text>
                <Text style={{ opacity: 0.56 }}>
                  CEP: {userProfile?.getProfile.user.zip_code}
                </Text>
              </View>
              <Icons name="chevron-right" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  if (userProfile && userProfile.getProfile) {
                    rootNavigation.navigate('User.EditProfileAddress', {
                      ...userProfile.getProfile,
                    });
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#161C25',
                  borderRadius: 16,
                  paddingVertical: 3,
                  paddingHorizontal: 16,
                  marginTop: 16,
                }}
              >
                <Text>Editar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 25 }}>
            <TouchableOpacity
              onPress={() => {
                if (userProfile && userProfile.getProfile) {
                  rootNavigation.navigate('User.EditProfileAddress', {
                    ...userProfile.getProfile,
                  });
                }
              }}
              style={{
                borderWidth: 1,
                borderColor: '#161C25',
                borderRadius: 16,
                paddingVertical: 3,
                paddingHorizontal: 16,
                marginTop: 16,
              }}
            >
              <Text>Atualizar endereço</Text>
            </TouchableOpacity>
          </View>
        )}
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
          {cartStatus ? (
            <Text style={{ fontSize: 12 }}>
              R${' '}
              <TitleText style={{ fontSize: 24 }}>
                {route.params.installments ? (
                  <>
                    {route.params.installments.installments_quantity}x{' '}
                    {!Number.isInteger(
                      route.params.installments.installment_value,
                    )
                      ? String(
                          Number(
                            route.params.installments.installment_value,
                          ).toFixed(2),
                        ).replace('.', ',')
                      : route.params.installments.installment_value}
                  </>
                ) : (
                  <>
                    {!Number.isInteger(cartStatus.totalPrice)
                      ? String(
                          Number(cartStatus.totalPrice).toFixed(2),
                        ).replace('.', ',')
                      : cartStatus.totalPrice}
                  </>
                )}
              </TitleText>
            </Text>
          ) : null}
        </SubscribeContainer>
      </View>
    </View>
  );
}
