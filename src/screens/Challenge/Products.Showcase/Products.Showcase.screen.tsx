import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { PUBLIC_STORAGE } from '@env';
import FastImage from 'react-native-fast-image';
import { isFuture, isPast } from 'date-fns';
import { useStoreActions, useStoreState } from '~/store';
import { BoxShadow, Button, Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from './Products.Showcase.styles';
import { ProductVariationType } from '~/graphql/autogenerate/schemas';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Products.Showcase'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Products.Showcase'
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

export default function ProductsShowcase({
  route: {
    params: {
      products,
      title,
      subscribe,
      showSubscribe,
      hasClickedOnSubscribe,
      isPaid,
      showBuyMore,
      data,
      extraordinaryActions,
    },
  },
  navigation,
}: Props): JSX.Element {
  const [canBuyProduct, setCanBuyProduct] = useState<boolean>(false);
  const cleanChart = useStoreActions((actions) => actions.chart.cleanChart);

  function hasVariationWithQuantity(
    variations: ProductVariationType[],
  ): boolean {
    let hasVariations = false;
    hasVariations = variations.some((el) => el.available);
    hasVariations = variations.some((el) =>
      el.available_quantity !== undefined
        ? el.available_quantity > 0 || el.available_quantity === null
        : el.available_quantity === null,
    );

    return hasVariations;
  }

  function handleIsAvailabe(product) {
    if (product) {
      if (product.available) {
        if (
          product.date_initial && product.date_end
            ? isPast(new Date(product.date_initial)) &&
              isFuture(new Date(product.date_end))
            : true
        ) {
          if (product.variations && product.variations.length > 0) {
            const elementsWithVariation = hasVariationWithQuantity(
              product.variations,
            );

            if (
              !elementsWithVariation ||
              !product.allow_buy_without_subscription
            ) {
              if (!canBuyProduct) {
                setCanBuyProduct(false);
              }
            } else if (!canBuyProduct) {
              setCanBuyProduct(true);
            }
          } else if (!canBuyProduct) {
            setCanBuyProduct(true);
          }
        }
      } else if (!canBuyProduct) {
        setCanBuyProduct(false);
      }
    }
  }

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
        {products.map((product, index) => {
          handleIsAvailabe(product);
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Products.Description', {
                  product,
                  title,
                  subscribe,
                  showSubscribe,
                  hasClickedOnSubscribe,
                  isPaid,
                  award_index: index,
                  showBuyMore,
                  data,
                })
              }
            >
              <BoxShadow style={{ flexDirection: 'row', marginBottom: 16 }}>
                <FastImage
                  style={{ width: 168, height: 168, borderRadius: 12 }}
                  source={{
                    uri:
                      product.images && product.images.length > 0
                        ? `${PUBLIC_STORAGE}/${product.images[0].link}`
                        : `${PUBLIC_STORAGE}/miscellaneous/product.jpg`,
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
                    {/* {title !== 'Categorias' &&
                    product.quantity &&
                    product.quantity > 0 && (
                      <SmallText>{product.quantity} unidades</SmallText>
                    )} */}
                  </View>
                  <TextBold numberOfLines={2} style={{ marginTop: 18 }}>
                    {product.name}
                  </TextBold>

                  {product.price && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginTop: 12,
                      }}
                    >
                      <SmallText style={{ fontSize: 12 }}>R$</SmallText>
                      <NormalParagraph>
                        {Number.isInteger(product.price)
                          ? product.price
                          : String(product.price.toFixed(2)).replace('.', ',')}
                      </NormalParagraph>
                    </View>
                  )}
                </View>
              </BoxShadow>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {showBuyMore && isPaid && canBuyProduct ? (
        <SubscribeContainer>
          <Button
            disabled={hasClickedOnSubscribe}
            name="Adicionar na Inscrição"
            loading={hasClickedOnSubscribe}
            style={{ marginTop: 0 }}
            onPress={() => {
              cleanChart();
              navigation.navigate('Products.BuyProduct', { data });
            }}
          />
        </SubscribeContainer>
      ) : null}
      {showSubscribe ? (
        <SubscribeContainer>
          <Button
            isFreeSub={extraordinaryActions?.bonus_subscription}
            disabled={hasClickedOnSubscribe}
            name={
              isPaid
                ? extraordinaryActions?.bonus_subscription
                  ? 'Inscrever-se (Bonificado)'
                  : 'Inscrever-se'
                : 'Inscrever-se Gratuitamente'
            }
            loading={hasClickedOnSubscribe}
            style={{ marginTop: 0 }}
            onPress={() => subscribe()}
          />
        </SubscribeContainer>
      ) : null}
    </View>
  );
}
