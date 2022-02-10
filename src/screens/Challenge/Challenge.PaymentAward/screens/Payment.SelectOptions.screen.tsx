import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import styled, { CSSProps } from 'styled-components/native';
import { isFuture, isPast } from 'date-fns';
import { ActivityIndicator } from 'react-native-paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isNumber } from 'lodash';
import { Icons, Text, TitleText, ImageZoom } from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreActions, useStoreState } from '~/store';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import {
  ProductType,
  ProductVariationPriceType,
} from '~/graphql/autogenerate/schemas';
import {
  CurrencyText,
  ValueText,
} from '~/screens/Challenge/Challenge.Description/components/BuyModal/styles';
import { ProductVariationType } from '~/generated/graphql';
import { cartState } from '~/recoil/atoms';
import { useAddProduct, useCleanCart, useRemoveProduct } from '~/hooks';
import { cartStatus as _cartStatus } from '~/recoil/selectors';
import { useRemoveAllProducts } from '~/hooks/useCartHooks';

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
  'selectOptions'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
  'selectOptions'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};
const WIDTH = widthPercentageToDP('100');
const ImageStyle: CSSProps = {
  width: widthPercentageToDP('92'),
  height: widthPercentageToDP('60'),
  borderRadius: 8,
  marginLeft: 32,
};

type ModalOptionsType = 'options' | 'quantity';

export function formatToCurrency(value: number) {
  const price = new Intl.NumberFormat('pr-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
  return price;
}

const PaymentAward: React.FC<Props> = ({ route, navigation }) => {
  const cart = useRecoilValue(cartState);
  const cartStatus = useRecoilValue(_cartStatus);
  const clearCart = useRemoveAllProducts();

  const addProductToCart = useAddProduct();
  const removeProductFromCart = useRemoveProduct();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>();
  const [actualPage, setActualPage] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState<ModalOptionsType>('options');
  const { data } = route.params;
  const [awardOptions, setAwardOptionStep] = useState<number>(0);

  const setSelectedProducts = useStoreActions(
    (actions) => actions.chart.setSelectedProducts,
  );

  const firstElementId = useStoreState((state) => state.chart.firstElementId);

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

  useEffect(() => {
    if (route.params.data.getChallengeDetail.products) {
      const filteredAvailableElements =
        route.params.data.getChallengeDetail.products.filter(
          (product) => product.available === true,
        );
      const filterAvailablePerDate = filteredAvailableElements.filter(
        (product) =>
          product.date_initial && product.date_end
            ? isPast(new Date(product.date_initial)) &&
              isFuture(new Date(product.date_end))
            : true,
      );

      const elementsWithVariation = filterAvailablePerDate.filter(
        ({ variations }) => hasVariationWithQuantity(variations),
      );

      if (firstElementId) {
        const elementSelected = elementsWithVariation.filter(
          (a) => a.id === route.params.firstElementId,
        );
        const elementNotSelected = elementsWithVariation.filter(
          (a) => a.id !== route.params.firstElementId,
        );
        if (elementSelected && elementNotSelected) {
          const newProductsOrder = elementSelected.concat(elementNotSelected);
          if (!newProductsOrder || newProductsOrder.length < 1) {
            if (data.getChallengeDetail.has_categories) {
              navigation.push('selectMode', {
                ...route.params,
                hasOptions: false,
              });
            } else {
              navigation.push('selectAddress', {
                ...route.params,
                hasOptions: false,
              });
            }
          } else {
            setProducts(newProductsOrder as ProductType[]);
            setLoading(false);
          }
        }
      } else if (!elementsWithVariation || elementsWithVariation.length < 1) {
        if (data.getChallengeDetail.has_categories) {
          navigation.push('selectMode', {
            ...route.params,
            hasOptions: false,
          });
        } else {
          navigation.push('selectAddress', {
            ...route.params,
            hasOptions: false,
          });
        }
      } else {
        setProducts(elementsWithVariation as ProductType[]);
        setLoading(false);
      }
    }
  }, [firstElementId]);

  const handlePricesData = (prices: ProductVariationPriceType[]) => {
    const actualPrice = prices
      .filter((el) => isPast(new Date(el.date_initial)))
      .sort(
        (a, b) =>
          new Date(b.date_initial).getTime() -
          new Date(a.date_initial).getTime(),
      );

    if (actualPrice && actualPrice.length > 0) {
      return Number(actualPrice[0].value);
    }

    // return true;
  };

  const SelectOptions = () => (
    <>
      <RadioForm formHorizontal={false} animation style={{ width: '100%' }}>
        {/* To create radio buttons, loop through your array of options */}
        {products &&
          products[awardOptions].variations.map((obj, i) => (
            <>
              {(products[awardOptions]?.variations[i]?.available_quantity > 0 ||
                products[awardOptions]?.variations[i]?.available_quantity ===
                  null) &&
              products[awardOptions]?.variations[i]?.available ? (
                <RadioButton
                  labelHorizontal
                  key={i}
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  {/*  You can set RadioButtonLabel before RadioButtonInput */}
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    initial={0}
                    isSelected={
                      cart[awardOptions] &&
                      cart[awardOptions]?.variation_index === i
                    }
                    onPress={() => {
                      if (
                        products[awardOptions]?.variations[i]
                          ?.available_quantity > 0 ||
                        products[awardOptions]?.variations[i]
                          ?.available_quantity === null
                      ) {
                        addProductToCart(
                          {
                            name: products[awardOptions].name,
                            optionName: obj.text,
                            product_id: products[awardOptions].id,
                            product_variation_id: obj.id,
                            price: handlePricesData(obj.prices)
                              ? handlePricesData(obj.prices)
                              : handlePricesData(
                                  products[awardOptions].prices,
                                ) ?? 0,
                            quantity: 1,
                            variation_index: i,
                          },
                          awardOptions,
                        );
                        setModalState((state) => !state);
                      }
                    }}
                    borderWidth={0.5}
                    buttonInnerColor={
                      cart[awardOptions] &&
                      cart[awardOptions]?.variation_index === i
                        ? '#0564FF'
                        : '#000'
                    }
                    buttonOuterColor={
                      cart[awardOptions] &&
                      cart[awardOptions]?.variation_index === i
                        ? '#0564FF'
                        : 'rgba(135, 149, 173, 0.64)'
                    }
                    buttonSize={14}
                    buttonOuterSize={24}
                    buttonStyle={{}}
                    buttonWrapStyle={{ marginLeft: 10 }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        products[awardOptions]?.variations[i]
                          ?.available_quantity > 0 ||
                        products[awardOptions]?.variations[i]
                          ?.available_quantity === null
                      ) {
                        addProductToCart(
                          {
                            name: products[awardOptions].name,
                            optionName: obj.text,
                            product_id: products[awardOptions].id,
                            product_variation_id: obj.id,
                            price: handlePricesData(obj.prices)
                              ? handlePricesData(obj.prices)
                              : handlePricesData(
                                  products[awardOptions].prices,
                                ) ?? 0,
                            quantity: 1,
                            variation_index: i,
                          },
                          awardOptions,
                        );
                        setModalState((state) => !state);
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      width: '98%',
                      justifyContent: 'space-between',
                      marginLeft: 6,
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          marginLeft: 12,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: widthPercentageToDP('70'),
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              width: widthPercentageToDP('50'),
                            }}
                          >
                            {obj.text}{' '}
                          </Text>
                          {(obj.prices.length > 0 &&
                            handlePricesData(obj.prices) > 0) ||
                          (products[awardOptions].prices &&
                            handlePricesData(products[awardOptions].prices) >
                              0) ? (
                            <TitleText
                              style={{
                                fontSize: 16,
                                opacity: 0.56,
                              }}
                            >
                              {obj.prices.length > 0 ? (
                                <>
                                  {formatToCurrency(
                                    handlePricesData(obj.prices),
                                  )}
                                </>
                              ) : (
                                <>
                                  {formatToCurrency(
                                    handlePricesData(
                                      products[awardOptions].prices,
                                    ),
                                  )}
                                </>
                              )}
                            </TitleText>
                          ) : (
                            <>
                              {false ? (
                                <TitleText
                                  style={{
                                    fontSize: 16,
                                    opacity: 0.56,
                                  }}
                                >
                                  Sem custo
                                </TitleText>
                              ) : null}
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </RadioButton>
              ) : null}
            </>
          ))}
      </RadioForm>
    </>
  );

  const elements = new Array(
    cart[awardOptions] &&
    cart[awardOptions]?.variation_index &&
    products &&
    products[awardOptions] &&
    products[awardOptions]?.variations[cart[awardOptions]?.variation_index]
      ?.available_quantity <= 10
      ? products[awardOptions]?.variations[cart[awardOptions]?.variation_index]
          ?.available_quantity !== null
        ? products[awardOptions]?.variations[
            cart[awardOptions]?.variation_index
          ]?.available_quantity
        : 10
      : 10,
  )
    .fill(undefined)
    .map((val, idx) => ({ value: idx, key: idx }));

  const SelectQuantity = () => (
    <>
      <RadioForm formHorizontal={false} animation style={{ width: '100%' }}>
        {/* To create radio buttons, loop through your array of options */}
        {elements.map((obj, i) => (
          <RadioButton
            labelHorizontal
            key={obj.value}
            obj={obj}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            {/*  You can set RadioButtonLabel before RadioButtonInput */}
            <RadioButtonInput
              index={i}
              obj={obj}
              initial={0}
              key={obj.value}
              isSelected={
                cart[awardOptions] && cart[awardOptions]?.quantity === i + 1
              }
              onPress={() => {
                setActualPage(0);
                addProductToCart(
                  {
                    quantity: i + 1,
                  },
                  awardOptions,
                );
                setModalState((state) => !state);
              }}
              borderWidth={0.5}
              buttonInnerColor={
                cart[awardOptions] && cart[awardOptions]?.quantity === i + 1
                  ? '#0564FF'
                  : '#000'
              }
              buttonOuterColor={
                cart[awardOptions] && cart[awardOptions]?.quantity === i + 1
                  ? '#0564FF'
                  : 'rgba(135, 149, 173, 0.64)'
              }
              buttonSize={14}
              buttonOuterSize={24}
              buttonStyle={{}}
              buttonWrapStyle={{ marginLeft: 10 }}
            />
            <TouchableOpacity
              onPress={() => {
                setActualPage(0);
                addProductToCart(
                  {
                    quantity: i + 1,
                  },
                  awardOptions,
                );
                setModalState((state) => !state);
              }}
              style={{
                flexDirection: 'row',
                width: '98%',
                justifyContent: 'space-between',
                marginLeft: 6,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    marginLeft: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: widthPercentageToDP('70'),
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        width: widthPercentageToDP('58'),
                      }}
                    >
                      {i + 1 === 1 ? `${i + 1} unidade` : `${i + 1} unidades`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </RadioButton>
        ))}
      </RadioForm>
    </>
  );

  const CarouselRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setActualPage(index);
        }}
      >
        <ImageZoom
          style={ImageStyle}
          resizeMethod="scale"
          resizeMode="contain"
          uri={item.source}
          source={item.source}
        />
      </TouchableOpacity>
    );
  };

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        clearCart();
        navigation.dispatch(e.data.action);
      }),
    [navigation, awardOptions],
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#0564FF" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          height: heightPercentageToDP('90'),
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 50,
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (awardOptions === 0) {
                removeProductFromCart(awardOptions);
                navigation.goBack();
              } else if (products.length > awardOptions) {
                removeProductFromCart(awardOptions);
                setAwardOptionStep((prevState) => prevState - 1);
              } else {
                removeProductFromCart(awardOptions);
                navigation.goBack();
              }
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <TitleText>
            {data.getChallengeDetail.physical_event ? 'Extas' : 'Personalizar'}
          </TitleText>
          <View style={{ width: 20 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ marginTop: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {products && products.length > 0 ? (
            <>
              <Text style={{ fontSize: 20, marginBottom: 5 }}>
                {products[awardOptions].name}
              </Text>
              {products[awardOptions].free_field ? (
                <>
                  <View
                    style={{
                      marginBottom: 32,
                      borderBottomWidth: 0.5,
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'rgba(22, 28, 37, 0.56)',
                      borderBottomColor: 'rgba(22, 28, 37, 0.56)',
                      paddingVertical: 8,
                    }}
                  >
                    <TextInput
                      hitSlop={{
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                      }}
                      placeholder="Sua resposta"
                      defaultValue={
                        cart &&
                        cart.length >= awardOptions &&
                        cart[awardOptions] &&
                        cart[awardOptions].response
                          ? cart[awardOptions].response
                          : ''
                      }
                      onChangeText={(e) => {
                        setSelectedProducts({
                          index: awardOptions,
                          product: {
                            free_value: e,
                            quantity: 1,
                          },
                        });
                      }}
                    />
                  </View>
                </>
              ) : null}
              <OptionImageContainer style={{ marginTop: 7 }}>
                {cart &&
                cart.length >= 0 &&
                cart[awardOptions] &&
                cart[awardOptions].picker_index !== undefined &&
                products[awardOptions].variations[
                  cart[awardOptions].picker_index
                ].images?.length > 0 ? (
                  <>
                    <Carousel
                      autoplay={false}
                      lockScrollWhileSnapping
                      swipeThreshold={0}
                      bounces={
                        products[awardOptions].variations[
                          cart[awardOptions].picker_index
                        ].images.length > 1
                      }
                      onSnapToItem={(index) => setActualPage(index)}
                      style={{ width: '100%' }}
                      data={products[awardOptions].variations[
                        cart[awardOptions].picker_index
                      ].images.map((el) => ({
                        source: {
                          uri: `${PUBLIC_STORAGE}/${el.link}`,
                        },
                        dimensions: {
                          width: widthPercentageToDP('92'),
                          height: widthPercentageToDP('60'),
                        },
                      }))}
                      renderItem={CarouselRenderItem}
                      sliderWidth={WIDTH}
                      itemWidth={WIDTH}
                    />
                  </>
                ) : (
                  <ImageZoom
                    style={{
                      width: widthPercentageToDP('92'),
                      height: widthPercentageToDP('60'),
                    }}
                    resizeMethod="scale"
                    resizeMode="contain"
                    uri={{
                      uri: `${PUBLIC_STORAGE}/${
                        cart &&
                        cart.length >= 0 &&
                        cart[awardOptions] &&
                        cart[awardOptions].picker_index !== undefined &&
                        products[awardOptions].variations[
                          cart[awardOptions].picker_index
                        ].images?.length > 0 &&
                        products[awardOptions].variations[
                          cart[awardOptions].picker_index
                        ].images[0].link
                          ? products[awardOptions].variations[
                              cart[awardOptions].picker_index
                            ].images[0].link
                          : products[awardOptions].images &&
                            products[awardOptions].images.length > 0
                          ? products[awardOptions].images[0].link
                          : 'miscellaneous/product.jpg'
                        // 'miscellaneous/product.jpg'
                      }`,
                    }}
                  />
                )}
              </OptionImageContainer>
              {cart &&
              cart.length >= 0 &&
              cart[awardOptions] &&
              cart[awardOptions].picker_index !== undefined &&
              products[awardOptions].variations[cart[awardOptions].picker_index]
                .images?.length > 0 ? (
                <View style={{ alignItems: 'center', marginTop: 15 }}>
                  <PaginationDot
                    activeDotColor="#0564FF"
                    curPage={actualPage}
                    maxPage={
                      products[awardOptions].variations[
                        cart[awardOptions].picker_index
                      ].images.length
                    }
                    sizeRatio={0.9}
                  />
                </View>
              ) : null}

              <View style={{ marginTop: 20 }}>
                <Text>
                  {cart &&
                  cart.length >= awardOptions &&
                  cart[awardOptions] &&
                  cart[awardOptions].picker_index &&
                  products[awardOptions]?.variations[
                    cart[awardOptions].picker_index
                  ]?.description
                    ? products[awardOptions]?.variations[
                        cart[awardOptions].picker_index
                      ]?.description
                    : ''}
                </Text>
              </View>
            </>
          ) : null}
        </ScrollView>
        {products &&
        products[awardOptions] &&
        !products[awardOptions].only_award &&
        products[awardOptions].variations &&
        products[awardOptions].variations.length > 0 &&
        cart &&
        cart[awardOptions] ? (
          <TouchableOpacity
            onPress={() => {
              setModalType('quantity');
              setActualPage(0);
              setModalState((prev) => !prev);
            }}
            style={{
              backgroundColor: 'rgba(22, 28, 37, 0.1)',
              borderRadius: 10,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 15,
            }}
          >
            <Text style={{ textTransform: 'capitalize' }} numberOfLines={1}>
              QUANTIDADE:{' '}
              {cart && cart[awardOptions] ? cart[awardOptions].quantity : 1}{' '}
              unidade{' '}
              {cart[awardOptions] &&
              products[awardOptions].variations[
                cart[awardOptions].variation_index
              ].available_quantity
                ? `(${
                    products[awardOptions].variations[
                      cart[awardOptions].variation_index
                    ].available_quantity
                  } Disponíveis)`
                : null}
            </Text>
            <Icons name="chevron-right" />
          </TouchableOpacity>
        ) : null}
        {products &&
        products[awardOptions] &&
        products[awardOptions].variations &&
        products[awardOptions].variations.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setModalType('options');
              setActualPage(0);
              setModalState((prev) => !prev);
            }}
            style={{
              backgroundColor: 'rgba(22, 28, 37, 0.1)',
              borderRadius: 10,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ textTransform: 'uppercase' }}>
              {cart[awardOptions] &&
              isNumber(cart[awardOptions].variation_index) &&
              products[awardOptions]?.variations[
                cart[awardOptions]?.variation_index
              ]?.text
                ? products[awardOptions].variations[
                    cart[awardOptions]?.variation_index
                  ].text
                : 'selecione uma opção'}
            </Text>
            <Icons name="chevron-right" />
          </TouchableOpacity>
        ) : null}
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
              <>
                {cartStatus.totalPrice ? (
                  <Text style={{ fontSize: 12 }}>
                    R${' '}
                    <TitleText style={{ fontSize: 24 }}>
                      {!Number.isInteger(cartStatus.totalPrice)
                        ? String(
                            Number(cartStatus.totalPrice).toFixed(2),
                          ).replace('.', ',')
                        : cartStatus.totalPrice}
                    </TitleText>
                  </Text>
                ) : null}
              </>
            )}

            <View style={{ flexDirection: 'row' }}>
              {data.getChallengeDetail.physical_event ? (
                <TouchableOpacity
                  style={{
                    width: 106,
                    backgroundColor: 'transparent',
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 13,
                  }}
                  onPress={() => {
                    removeProductFromCart(awardOptions);
                    if (products.length - 1 > awardOptions) {
                      setAwardOptionStep((prevState) => prevState + 1);
                    } else if (data.getChallengeDetail.has_categories) {
                      navigation.push('selectMode', { hasOptions: true });
                    } else {
                      navigation.push('selectAddress', { hasOptions: true });
                    }
                  }}
                >
                  <Text style={{ color: '#0564FF', fontSize: 20 }}>Pular</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={{
                  width: 136,
                  backgroundColor:
                    !cart || !cart[awardOptions] || cart[awardOptions] === null
                      ? '#A1A8B1'
                      : '#0564FF',
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 13,
                }}
                disabled={
                  !cart || !cart[awardOptions] || cart[awardOptions] === null
                }
                onPress={() => {
                  if (products.length - 1 > awardOptions) {
                    setAwardOptionStep((prevState) => prevState + 1);
                  } else if (data.getChallengeDetail.has_categories) {
                    navigation.push('selectMode', {
                      ...route.params,
                      hasOptions: true,
                    });
                  } else {
                    navigation.push('selectAddress', {
                      ...route.params,
                      hasOptions: true,
                    });
                  }
                }}
              >
                <Text style={{ color: 'white', fontSize: 20 }}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </SubscribeContainer>
        </View>
      </View>

      <Modal
        isVisible={modalState}
        onBackdropPress={() => setModalState((prev) => !prev)}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        {modalState && modalType === 'options' ? (
          <ScrollView
            style={{
              backgroundColor: 'white',
              maxHeight: heightPercentageToDP('50'),
              borderRadius: 10,
            }}
            contentContainerStyle={{ paddingVertical: 20 }}
          >
            <SelectOptions />
          </ScrollView>
        ) : null}
        {modalState && modalType === 'quantity' ? (
          <ScrollView
            style={{
              backgroundColor: 'white',
              maxHeight: heightPercentageToDP('50'),
              borderRadius: 10,
            }}
            contentContainerStyle={{ paddingVertical: 20 }}
          >
            <SelectQuantity />
          </ScrollView>
        ) : null}
      </Modal>
    </View>
  );
};

export default PaymentAward;
