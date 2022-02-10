import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Linking,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import styled, { CSSProps } from 'styled-components/native';
import { PUBLIC_STORAGE } from '@env';
import HTML from 'react-native-render-html';
import Modal from 'react-native-modal';
import SmartGallery from 'react-native-smart-gallery';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import PaginationDot from 'react-native-animated-pagination-dot';
import { isFuture, isPast } from 'date-fns';
import {
  BoxShadow,
  Button,
  Icons,
  ImageZoom,
  Text,
  TitleText,
} from '~/components';
import { useStoreActions, useStoreState } from '~/store';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from './Products.Description.styles';
import { ProductVariationType } from '~/graphql/autogenerate/schemas';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Products.Description'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Products.Description'
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
export const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

export const GoBackTouchable = styled.TouchableOpacity`
  position: absolute;

  left: 16px;
  top: 55px;
`;

export const Header = styled.View`
  padding: 50px 0 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Count = styled.Text`
  position: absolute;
  color: #fff;

  right: 25px;
  top: 54px;
`;

const WIDTH = widthPercentageToDP('100');
const HEIGHT = widthPercentageToDP('100') / 2;

const ImageStyle: CSSProps = {
  height: widthPercentageToDP('86') * 1,
  width: widthPercentageToDP('86'),
  borderRadius: 8,
  marginLeft: 32,
};

export default function ProductsDescription({
  route: {
    params: {
      product,
      title,
      subscribe,
      showSubscribe,
      hasClickedOnSubscribe,
      isPaid,
      award_index,
      showBuyMore,
      data,
    },
  },
  navigation,
}: Props): JSX.Element {
  const cleanChart = useStoreActions((actions) => actions.chart.cleanChart);
  const [modalState, setModalState] = useState<boolean>(false);
  const [canBuyProduct, setCanBuyProduct] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [modalStateOptions, setModalStateOptions] = useState<boolean>(false);
  const [actualPage, setActualPage] = useState(0);
  const [variantOption, setVariantOption] = useState(0);
  const [Images, setImages] = useState([
    {
      source: {
        uri: `${PUBLIC_STORAGE}/miscellaneous/product.jpg`,
      },
      dimensions: {
        height: heightPercentageToDP('50'),
        width: widthPercentageToDP('10'),
      },
    },
  ]);

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
              setCanBuyProduct(false);
            } else {
              setCanBuyProduct(true);
            }
          } else {
            setCanBuyProduct(true);
          }
        }
      } else {
        setCanBuyProduct(false);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product.variations && product.variations.length > 0) {
      if (
        product.variations[variantOption] &&
        product.variations[variantOption].images &&
        product.variations[variantOption].images.length > 0
      ) {
        const formatedImages = product.variations[variantOption].images.map(
          (el) => ({
            source: {
              uri: `${PUBLIC_STORAGE}/${el.link}`,
            },
            dimensions: {
              height: heightPercentageToDP('50'),
              width: widthPercentageToDP('10'),
            },
          }),
        );
        if (formatedImages) setImages(formatedImages);
      }
    } else if (product.images && product.images.length > 0) {
      const formatedImages = product.images.map((el) => ({
        source: {
          uri: `${PUBLIC_STORAGE}/${el.link}`,
        },
        dimensions: {
          height: heightPercentageToDP('50'),
          width: widthPercentageToDP('10'),
        },
      }));
      if (formatedImages) setImages(formatedImages);
    }
  }, [product, variantOption]);

  const SelectOptions = () => (
    <>
      <RadioForm formHorizontal={false} animation style={{ width: '100%' }}>
        {/* To create radio buttons, loop through your array of options */}
        {product.variations.map((obj, i) => (
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
              isSelected={variantOption === i}
              onPress={() => {
                setVariantOption(Number(i));
                setModalStateOptions((state) => !state);
              }}
              borderWidth={0.5}
              buttonInnerColor={variantOption === i ? '#0564FF' : '#000'}
              buttonOuterColor={
                variantOption === i ? '#0564FF' : 'rgba(135, 149, 173, 0.64)'
              }
              buttonSize={14}
              buttonOuterSize={24}
              buttonStyle={{}}
              buttonWrapStyle={{ marginLeft: 10 }}
            />
            <TouchableOpacity
              onPress={() => {
                setVariantOption(Number(i));
                setModalStateOptions((state) => !state);
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
                      {obj.text}
                    </Text>
                    {obj.prices.length > 0 && obj.prices[0].value > 0 ? (
                      <TitleText
                        style={{
                          fontSize: 16,
                          opacity: 0.56,
                        }}
                      >
                        R${' '}
                        {Number.isInteger(obj.prices[0].value)
                          ? obj.prices[0].value
                          : String(obj.prices[0].value.toFixed(2)).replace(
                              '.',
                              ',',
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
        ))}
      </RadioForm>
    </>
  );

  // const Images = new Array([]).map(() => ());
  console.log('showBuyMore: ', showBuyMore);

  const CarouselRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setActualPage(index);
          setTimeout(() => {
            setModalState((prev) => !prev);
          }, 350);
        }}
      >
        <FastImage style={ImageStyle} source={item.source} />
      </TouchableOpacity>
    );
  };

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

      <ScrollView style={{ paddingVertical: 16, paddingBottom: 40 }}>
        <BoxShadow style={{ marginBottom: 20, paddingTop: 16 }}>
          <Carousel
            autoplay={false}
            lockScrollWhileSnapping
            swipeThreshold={0}
            bounces={Images.length > 1}
            onSnapToItem={(index) => setActualPage(index)}
            style={{ width: '100%' }}
            data={Images}
            renderItem={CarouselRenderItem}
            sliderWidth={WIDTH}
            itemWidth={WIDTH}
          />
          <View style={{ alignItems: 'center', marginTop: 15 }}>
            <PaginationDot
              activeDotColor="#0564FF"
              curPage={actualPage}
              maxPage={Images.length}
              sizeRatio={0.9}
            />
          </View>

          {/* <ScrollView horizontal>
            {Images.map((image, index) => (
              <TouchableOpacity
                onPress={() => {
                  setActualPage(index);
                  setTimeout(() => {
                    setModalState((prev) => !prev);
                  }, 350);
                }}
              >
                <FastImage style={ImageStyle} source={image.source} />
              </TouchableOpacity>
            ))}
          </ScrollView> */}

          <View style={{ paddingHorizontal: 16, marginTop: 40 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TextBold style={{ width: widthPercentageToDP('60') }}>
                {product.name}
              </TextBold>
              <View style={{ flexDirection: 'row' }}>
                {product.variations &&
                  product.variations[variantOption] &&
                  product.variations[variantOption].prices &&
                  product.variations[variantOption].prices.length > 0 &&
                  product.variations[variantOption].prices[0].value > 0 && (
                    <>
                      <SmallText>R$</SmallText>
                      <NormalParagraph>
                        {' '}
                        {!Number.isInteger(
                          product.variations[variantOption].prices[0].value,
                        )
                          ? String(
                              product.variations[
                                variantOption
                              ].prices[0].value.toFixed(2),
                            ).replace('.', ',')
                          : product.variations[variantOption].prices[0].value}
                      </NormalParagraph>
                    </>
                  )}
              </View>
            </View>
            {showSubscribe && isPaid && canBuyProduct ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                  marginBottom: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'rgba(137, 217, 36, 0.4)',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setAlertModal(true);
                  }}
                >
                  <Text style={{ marginRight: 10, color: '#009D33' }}>
                    Comprar
                  </Text>
                  <Icons name="shopping" color="#009D33" />
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={{ marginTop: 8, marginBottom: 40 }}>
              <HTML
                html={product.description}
                ignoredStyles={['font-family']}
                containerStyle={{ marginTop: 16 }}
                onLinkPress={(evt, href) => {
                  Linking.openURL(href);
                }}
                renderers={{
                  img: (attribs, children, objectCSS, contentProps) => (
                    <ImageZoom
                      uri={{ uri: attribs.src }}
                      style={{
                        marginTop: 10,
                        width: widthPercentageToDP('91'),
                        height: widthPercentageToDP('100') / 2,
                      }}
                    />
                  ),
                  p: (htmlAttribs, children) => (
                    <SmallText>{children}</SmallText>
                  ),
                  b: (htmlAttribs, children) => (
                    <TitleText>{children}</TitleText>
                  ),
                }}
                tagsStyles={{
                  div: {
                    marginTop: 5,
                  },
                  p: {
                    fontFamily: 'NeuzeitGro-Reg',
                    fontFace: 'NeuzeitGro-Reg',
                    fontWeight: null,
                  },
                  img: {
                    marginTop: 5,
                  },
                  b: {
                    fontFamily: 'NeuzeitGro-Bol',
                    fontFace: 'NeuzeitGro-Bol',
                    fontWeight: null,
                  },
                }}
              />
            </View>

            {product?.variations && product?.variations.length > 0 ? (
              <TouchableOpacity
                onPress={() => setModalStateOptions((prev) => !prev)}
                style={{
                  backgroundColor: 'rgba(22, 28, 37, 0.1)',
                  borderRadius: 10,
                  paddingVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  marginBottom: 20,
                }}
              >
                <Text style={{ textTransform: 'uppercase' }}>
                  {product?.variations &&
                  product?.variations[variantOption] &&
                  product?.variations[variantOption].text
                    ? product.variations[variantOption].text
                    : 'selecione uma opção'}
                </Text>
                <Icons name="chevron-right" />
              </TouchableOpacity>
            ) : null}
          </View>
        </BoxShadow>
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
              navigation.navigate('Products.BuyProduct', {
                data,
                firstElementId: product.id,
              });
            }}
          />
        </SubscribeContainer>
      ) : null}
      {showSubscribe && (
        <SubscribeContainer>
          <Button
            disabled={hasClickedOnSubscribe}
            name={
              isPaid
                ? product.only_for_draw
                  ? `Inscrever-se`
                  : `Inscrever-se`
                : 'Inscrever-se Gratuitamente'
            }
            loading={hasClickedOnSubscribe}
            style={{ marginTop: 0 }}
            onPress={() => {
              subscribe();
            }}
          />
        </SubscribeContainer>
      )}
      <Modal
        isVisible={modalState}
        onBackdropPress={() => setModalState((prev) => !prev)}
        backdropOpacity={1}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <StatusBar barStyle="light-content" />
        <Header>
          <GoBackTouchable
            onPress={() => setModalState((prev) => !prev)}
            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
          >
            <Icons name="close" width={30} color="#fff" />
          </GoBackTouchable>

          <Count>
            {actualPage} / {Images.length}
          </Count>
        </Header>
        <SmartGallery
          index={actualPage}
          onPageSelected={(page) => {
            setActualPage(page + 1);
          }}
          images={Images.map((el) => ({
            source: {
              uri: el.source.uri,
            },
            dimensions: {
              height: heightPercentageToDP('50'),
              width: widthPercentageToDP('10'),
            },
          }))}
          enableScale
          maxScale={5}
          imageComponent={(source) => (
            <FastImage
              resizeMethod="scale"
              resizeMode="contain"
              {...source}
              style={{
                flex: 1,
                width: widthPercentageToDP('90'),
                // height: heightPercentageToDP('50'),
              }}
            />
          )}
        />

        {/* <Gallery
          onPageSelected={(page) => {
            setActualPage(page + 1);
          }}
          // style={{ backgroundColor: 'red' }
          // onSingleTapConfirmed={() => setModalState((prev) => !prev)}
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          flatListProps={{
            initialNumToRender: 20,
            initialScrollIndex: actualPage - 1,
            getItemLayout: (data, index) => ({
              length: Dimensions.get('screen').width,
              offset: Dimensions.get('screen').width * index,
              index,
            }),
          }}
          imageComponent={(source) => (
            // <ImageZoomPan
            //   cropWidth={widthPercentageToDP('100')}
            //   cropHeight={heightPercentageToDP('100') / 1.5}
            //   imageWidth={widthPercentageToDP('100')}
            //   imageHeight={heightPercentageToDP('100') / 1}
            //   onClick={() => setModalState((prev) => !prev)}
            // >
            <FastImage
              resizeMethod="scale"
              resizeMode="contain"
              {...source}
              style={{
                flex: 1,
                width: widthPercentageToDP('90'),
                // height: heightPercentageToDP('50'),
              }}
            />
            // </ImageZoomPan>
          )}
          images={award.awardsImages.map((el) => ({
            source: {
              uri: `${PUBLIC_STORAGE}/${el.link}`,
            },
          }))}
          initialPage={actualPage}
        /> */}
      </Modal>

      <Modal
        isVisible={modalStateOptions}
        onBackdropPress={() => setModalStateOptions((prev) => !prev)}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        {modalStateOptions ? (
          <ScrollView
            style={{
              backgroundColor: 'white',
              maxHeight: heightPercentageToDP('40'),
              borderRadius: 10,
            }}
            contentContainerStyle={{ paddingVertical: 20 }}
          >
            <SelectOptions />
          </ScrollView>
        ) : null}
      </Modal>

      <Modal
        isVisible={alertModal}
        onBackdropPress={() => setAlertModal((prev) => !prev)}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <View
          style={{
            backgroundColor: 'white',
            height: heightPercentageToDP('80'),
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ paddingHorizontal: 26 }}>
            <Text style={{ textAlign: 'center', marginBottom: 30 }}>
              Você deseja comprar este item sem realizar uma inscrição para o
              evento ou quer se inscrever com este produto?
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              style={{
                borderColor: '#0564FF',
                borderWidth: 1,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
              }}
              onPress={() => {
                setAlertModal(false);
                setTimeout(() => {
                  cleanChart();
                  navigation.navigate('Products.BuyProduct', {
                    data,
                    firstElementId: product.id,
                  });
                }, 450);
              }}
            >
              <Text style={{ color: '#0564ff' }}>Comprar SEM inscrição</Text>
            </TouchableOpacity>
            <Button
              name="Vou me inscrever com este produto"
              onPress={() => {
                setAlertModal(false);
                setTimeout(() => {
                  subscribe(product.id);
                }, 450);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
