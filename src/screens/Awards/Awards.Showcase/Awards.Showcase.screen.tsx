import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { PUBLIC_STORAGE } from '@env';
import FastImage from 'react-native-fast-image';
import { BoxShadow, Button, Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from './Awards.Showcase.styles';
import { useStoreState } from '~/store';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'AwardsShowcase'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AwardsShowcase'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export const TextBold = styled(TitleText)`
  font-size: 20px;
  line-height: 23px;
`;

export const SmallText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 14px;
  line-height: 16.1px;
  color: rgba(22, 28, 37, 0.56);
`;

export const NormalParagraph = styled(Text)`
  font-size: 16px;
  line-height: 16.1px;
`;

export default function AwardsShowcase({
  route: {
    params: { awards, title, subscribe, showSubscribe, isPaid },
  },
  navigation,
}: Props): JSX.Element {
  const hasClickedOnSubscribe = useStoreState(
    (state) => state.challenge.hasClickedOnSubscribe,
  );
  const userHasSubscribed = useStoreState(
    (state) => state.challenge.userHasSubscribed,
  );
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <BoxShadow
        style={{
          paddingTop: 50,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <TextBold>{title}</TextBold>
        <View style={{ width: 20 }} />
      </BoxShadow>
      <ScrollView
        style={{ padding: 16 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {awards &&
          awards.map((award, index) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Award.Description', {
                  award,
                  title,
                  subscribe,
                  showSubscribe,
                  hasClickedOnSubscribe,
                  isPaid,
                  award_index: index,
                })
              }
            >
              <BoxShadow style={{ flexDirection: 'row', marginBottom: 16 }}>
                <FastImage
                  style={{ width: 168, height: 168, borderRadius: 12 }}
                  source={{
                    uri: `${PUBLIC_STORAGE}/${award.awardsImages[0].link}`,
                  }}
                />
                <View style={{ padding: 12, width: widthPercentageToDP('45') }}>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      width: widthPercentageToDP('42'),
                      justifyContent: 'flex-end',
                    }}
                  >
                    {title !== 'Categorias' &&
                    award.quantity &&
                    award.quantity > 0 ? (
                      <SmallText>{award.quantity} unidades</SmallText>
                    ) : null}
                  </View>
                  <TextBold numberOfLines={2} style={{ marginTop: 18 }}>
                    {award.name}
                  </TextBold>

                  {award.price ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginTop: 12,
                      }}
                    >
                      <SmallText style={{ fontSize: 12 }}>R$</SmallText>
                      <NormalParagraph>
                        {Number.isInteger(award.price)
                          ? award.price
                          : String(award.price.toFixed(2)).replace('.', ',')}
                      </NormalParagraph>
                    </View>
                  ) : null}
                </View>
              </BoxShadow>
            </TouchableOpacity>
          ))}
      </ScrollView>
      {showSubscribe && !userHasSubscribed ? (
        <SubscribeContainer>
          <Button
            disabled={hasClickedOnSubscribe}
            name={isPaid ? 'Inscrever-se' : 'Inscrever-se Gratuitamente'}
            loading={hasClickedOnSubscribe}
            style={{ marginTop: 0 }}
            onPress={() => subscribe()}
          />
        </SubscribeContainer>
      ) : null}
    </View>
  );
}
