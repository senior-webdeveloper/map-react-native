import React, { useState } from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { isPast } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { Icons, Text, TitleText } from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { CurrencyText } from '~/screens/Challenge/Challenge.Description/components/BuyModal/styles';
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
  'selectMode'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
  'selectMode'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function SelectMode({ route, navigation }: Props): JSX.Element {
  const cartStatus = useRecoilValue(_cartStatus);
  const { data, award_index } = route.params;
  const [awardOptions, setAwardOptionStep] = useState<number>(0);

  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );

  const chart = useStoreState((state) => state.chart.payload);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View>
        <View style={{ marginVertical: 15, paddingTop: 50 }}>
          <TouchableOpacity
            onPress={() => {
              if (route.params.hasOptions === false) {
                route.params.rootNavigation.pop();
              } else if (
                data?.getChallengeDetail.awards &&
                data?.getChallengeDetail.awards[award_index]
                  .awardAdditionalRequest.length > 0
              ) {
                if (
                  data?.getChallengeDetail.awards &&
                  data?.getChallengeDetail.awards[award_index]
                    .awardAdditionalRequest &&
                  data?.getChallengeDetail.awards[award_index]
                    .awardAdditionalRequest.length > 0
                ) {
                  navigation.goBack();
                } else {
                  navigation.goBack();
                }
              } else {
                navigation.goBack();
              }
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>

        <View>
          <TitleText>Selecione uma categoria</TitleText>
          <Text style={{ opacity: 0.56 }}>
            Escolha em qual categoria você quer se inscrever.
          </Text>
          <Text style={{ opacity: 0.56 }}>
            {(data.getChallengeDetail.configuration?.deadline_category_change
              ? !isPast(
                  new Date(
                    data.getChallengeDetail.configuration?.deadline_category_change,
                  ),
                )
              : true) &&
            data.getChallengeDetail.configuration?.allows_category_change
              ? 'Você pode trocar depois.'
              : 'Você não poderá trocar depois.'}
          </Text>
        </View>

        <ScrollView style={{ height: heightPercentageToDP('55') }}>
          <RadioForm formHorizontal={false} animation style={{ width: '100%' }}>
            {/* To create radio buttons, loop through your array of options */}
            {data.getChallengeDetail.challenge_categories.map((category, i) => (
              <RadioButton
                labelHorizontal
                key={category.id}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomColor: 'rgba(22, 28, 37, 0.2)',
                  borderBottomWidth:
                    data.getChallengeDetail.challenge_categories.length - 1 ===
                    i
                      ? 0
                      : 0.5,
                  paddingVertical: 24,
                }}
              >
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={category}
                  index={i}
                  initial={awardOptions}
                  isSelected={awardOptions === i}
                  onPress={() => setAwardOptionStep(i)}
                  borderWidth={0.5}
                  buttonInnerColor={awardOptions === i ? '#0564FF' : '#000'}
                  buttonOuterColor={
                    awardOptions === i ? '#0564FF' : 'rgba(135, 149, 173, 0.64)'
                  }
                  buttonSize={14}
                  buttonOuterSize={24}
                  buttonStyle={{}}
                  buttonWrapStyle={{ marginLeft: 10 }}
                />
                <TouchableOpacity
                  hitSlop={{ left: 10, right: 10, top: 24, bottom: 24 }}
                  activeOpacity={0.7}
                  key={category.id}
                  onPress={() => setAwardOptionStep(i)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 16,
                    width: widthPercentageToDP('78'),
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        lineHeight: 23,
                        width: widthPercentageToDP('38'),
                        fontFamily: 'NeuzeitGro-Bol',
                      }}
                      numberOfLines={2}
                    >
                      {category.name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                      {category.category_configuration.distance_goal_value ? (
                        <View>
                          <Text
                            style={{
                              opacity: 0.56,
                              fontSize: 14,
                              fontFamily: 'NeuzeitGro-Lig',
                            }}
                          >
                            Distância
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              lineHeight: 16.1,
                              fontFamily: 'NeuzeitGro-Lig',
                            }}
                          >
                            {category.category_configuration
                              .distance_goal_value / 1000}
                            km
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View
                      style={{
                        height: 26,
                        borderLeftColor: '#161C25',
                        borderLeftWidth: 0.5,
                        marginHorizontal: 16,
                      }}
                    />

                    <View>
                      {category.category_configuration.altimetry_goal_value ? (
                        <View>
                          <Text
                            style={{
                              opacity: 0.56,
                              fontSize: 14,
                              fontFamily: 'NeuzeitGro-Lig',
                            }}
                          >
                            Altimetria
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              lineHeight: 16.1,
                              fontFamily: 'NeuzeitGro-Lig',
                            }}
                          >
                            {
                              category.category_configuration
                                .altimetry_goal_value
                            }
                            m
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              </RadioButton>
            ))}
          </RadioForm>
        </ScrollView>
      </View>
      <View style={{ alignItems: 'center' }}>
        <SubscribeContainer
          style={{
            elevation: 10,
            width: widthPercentageToDP('100'),
            paddingBottom: 21,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {route.params.extraordinaryActions &&
          route.params.extraordinaryActions.bonus_subscription &&
          cartStatus.totalPrice <= 0 ? (
            <CurrencyText>
              <Text style={{ color: '#009D33' }}>Bonificado</Text>
            </CurrencyText>
          ) : (
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
          )}

          <TouchableOpacity
            style={{
              width: 136,
              backgroundColor: '#0564FF',
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              paddingHorizontal: 13,
            }}
            onPress={() => {
              if (data.getChallengeDetail.physical_event) {
                if (
                  route.params.extraordinaryActions &&
                  route.params.extraordinaryActions.bonus_subscription
                ) {
                  if (totalAddonPrice <= 0) {
                    if (route.params.has_address) {
                      if (route.params.data.getChallengeDetail.physical_event) {
                        navigation.push('personalInformation', {
                          ...route.params,
                        });
                      }
                    } else {
                      navigation.navigate('billingAddress', {
                        ...route.params,
                      });
                    }
                  } else {
                    navigation.push('selectMethod', {
                      ...route.params,
                      category_index: awardOptions,
                      category_id:
                        data.getChallengeDetail.challenge_categories[
                          awardOptions
                        ].id,
                    });
                  }
                } else {
                  navigation.push('selectMethod', {
                    ...route.params,
                    category_index: awardOptions,
                    category_id:
                      data.getChallengeDetail.challenge_categories[awardOptions]
                        .id,
                  });
                }
              } else {
                navigation.push('selectAddress', {
                  ...route.params,
                  category_index: awardOptions,
                  category_id:
                    data.getChallengeDetail.challenge_categories[awardOptions]
                      .id,
                });
              }
            }}
          >
            <Text style={{ color: 'white', fontSize: 20 }}>Próximo</Text>
          </TouchableOpacity>
        </SubscribeContainer>
      </View>
    </View>
  );
}
