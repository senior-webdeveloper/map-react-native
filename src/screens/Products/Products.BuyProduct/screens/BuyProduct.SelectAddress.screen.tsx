import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { useRecoilValue } from 'recoil';
import { BoxShadow, Icons, SafeAreaView, Text, TitleText } from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { useGetChallengeWithdrawalAddressesLazyQuery } from '~/graphql/autogenerate/hooks';
import { SubscribeContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { cartState } from '~/recoil/atoms';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

export const OptionImage = styled(FastImage)``;
export const OptionImageContainer = styled.View`
  width: ${widthPercentageToDP('92')}px;
  height: ${widthPercentageToDP('60')}px;
  background-color: #ffffff;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  elevation: 5;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
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
  const { rootNavigation } = route.params;
  const userProfile = useStoreState(({ profile }) => profile.payload);
  const cartStatus = useRecoilValue(_cartStatus);

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );

  const chart = useStoreState((state) => state.chart.payload);

  const [
    getChallengeWithdrawalAddresses,
    { data: withdrawAddresses, loading: loadingWithdrawAddresses },
  ] = useGetChallengeWithdrawalAddressesLazyQuery();

  useEffect(() => {
    if (route.params.data.getChallengeDetail.id) {
      getChallengeWithdrawalAddresses({
        variables: {
          data: {
            challenge_id: route.params.data.getChallengeDetail.id,
          },
        },
      });
    }
  }, [
    getChallengeWithdrawalAddresses,
    route.params.data.getChallengeDetail.id,
  ]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <View>
        <View
          style={{
            height: heightPercentageToDP('8'),
            marginVertical: 15,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (route.params.hasOptions === false) {
                route.params.rootNavigation.pop();
              } else {
                navigation.goBack();
              }
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <View>
            <TitleText>Método de entrega</TitleText>
          </View>
          <View style={{ width: 20 }} />
        </View>
        <ScrollView
          style={{ height: heightPercentageToDP('75') }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        >
          <BoxShadow
            style={{ paddingVertical: 24, paddingTop: 16, paddingBottom: 40 }}
          >
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 24,
                paddingHorizontal: 24,
              }}
            >
              <Icons name="truck-delivery" color="#0564FF" />
              <Text
                style={{
                  fontSize: 20,
                  color: '#0564FF',
                  marginLeft: 10,
                }}
              >
                Enviar para o meu endereço
              </Text>
            </View>

            {userProfile?.getProfile.user.city &&
            userProfile?.getProfile.user.street_number &&
            userProfile?.getProfile.user.zip_code &&
            userProfile?.getProfile.user.address_line_one ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('shippingCoast', {
                      ...route.params,
                      user: userProfile?.getProfile.user,
                      has_address: !!(
                        userProfile?.getProfile.user.city &&
                        userProfile?.getProfile.user.street_number &&
                        userProfile?.getProfile.user.zip_code &&
                        userProfile?.getProfile.user.address_line_one
                      ),
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 16 }}>Calcular</Text>
                    <Icons name="chevron-right" />
                  </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
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
              <View style={{ alignItems: 'center' }}>
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
                  <Text>Adicionar endereço</Text>
                </TouchableOpacity>
              </View>
            )}
          </BoxShadow>
          {loadingWithdrawAddresses && (
            <View
              style={{
                paddingVertical: 24,
                paddingHorizontal: 16,
                marginTop: 16,
              }}
            >
              <ActivityIndicator size="large" color="#0564FF" />
            </View>
          )}
          {withdrawAddresses?.getChallengeWithdrawalAddresses &&
            withdrawAddresses?.getChallengeWithdrawalAddresses.length > 0 && (
              <BoxShadow
                style={{
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  marginTop: 16,
                }}
              >
                <>
                  {!loadingWithdrawAddresses && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 8,
                        paddingHorizontal: 8,
                      }}
                    >
                      <Icons name="user" color="#0564FF" />
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#0564FF',
                          marginLeft: 10,
                        }}
                      >
                        Retirar presencialmente
                      </Text>
                    </View>
                  )}

                  {withdrawAddresses?.getChallengeWithdrawalAddresses &&
                    withdrawAddresses?.getChallengeWithdrawalAddresses.map(
                      (address, index) => (
                        <TouchableOpacity
                          key={address.id}
                          onPress={() => {
                            navigation.push('selectMethod', {
                              ...route.params,
                              withdrawAddresse: address,
                              challenge_withdrawal_address_id: address.id,
                              user: userProfile?.getProfile.user,
                              has_address: !!(
                                userProfile?.getProfile.user.city &&
                                userProfile?.getProfile.user.street_number &&
                                userProfile?.getProfile.user.zip_code &&
                                userProfile?.getProfile.user.address_line_one
                              ),
                            });
                            // if (
                            //   !userProfile?.getProfile.user.legal_registry_number
                            // ) {
                            //   navigation.push('addLegalRegisterNumber', {
                            //     ...route.params,
                            //     withdrawAddresse: address,
                            //     challenge_withdrawal_address_id: address.id,
                            //     user: userProfile?.getProfile.user,
                            //     has_address: !!(
                            //       userProfile?.getProfile.user.city &&
                            //       userProfile?.getProfile.user.street_number &&
                            //       userProfile?.getProfile.user.zip_code &&
                            //       userProfile?.getProfile.user.address_line_one
                            //     ),
                            //   });
                            // } else if (!userProfile?.getProfile.user.phone) {
                            //   navigation.push('addPhoneNumber', {
                            //     ...route.params,
                            //     withdrawAddresse: address,
                            //     challenge_withdrawal_address_id: address.id,
                            //     user: userProfile?.getProfile.user,
                            //     has_address: !!(
                            //       userProfile?.getProfile.user.city &&
                            //       userProfile?.getProfile.user.street_number &&
                            //       userProfile?.getProfile.user.zip_code &&
                            //       userProfile?.getProfile.user.address_line_one
                            //     ),
                            //   });
                            // } else {
                            //   navigation.push('selectMethod', {
                            //     ...route.params,
                            //     withdrawAddresse: address,
                            //     challenge_withdrawal_address_id: address.id,
                            //     user: userProfile?.getProfile.user,
                            //     has_address: !!(
                            //       userProfile?.getProfile.user.city &&
                            //       userProfile?.getProfile.user.street_number &&
                            //       userProfile?.getProfile.user.zip_code &&
                            //       userProfile?.getProfile.user.address_line_one
                            //     ),
                            //   });
                            // }
                          }}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 16,
                            borderBottomWidth:
                              index + 1 !==
                              withdrawAddresses?.getChallengeWithdrawalAddresses
                                .length
                                ? 0.5
                                : 0,
                            borderBottomColor: 'rgba(23, 28, 37, 0.5)',
                          }}
                        >
                          <View>
                            <Text style={{ width: widthPercentageToDP('58') }}>
                              {address.name}
                            </Text>
                            <Text
                              style={{
                                width: widthPercentageToDP('58'),
                                opacity: 0.56,
                              }}
                            >
                              {address.address_line_one},{' '}
                              {address.street_number}{' '}
                              {address.address_line_two.length > 1
                                ? address.address_line_two
                                : null}
                              {', '}
                              {address.city?.name}/
                              {address.city?.state.abbreviation}
                            </Text>
                            <Text style={{ opacity: 0.56 }}>
                              CEP: {address.zip_code}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: '#009D33', marginRight: 16 }}>
                              Grátis
                            </Text>
                            <Icons name="chevron-right" />
                          </View>
                        </TouchableOpacity>
                      ),
                    )}
                </>
              </BoxShadow>
            )}
        </ScrollView>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          // height: heightPercentageToDP('15'),
        }}
      >
        <SubscribeContainer
          style={{
            elevation: 10,
            width: widthPercentageToDP('100'),
            paddingTop: 25,
            paddingBottom: 20,
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
    </SafeAreaView>
  );
}
