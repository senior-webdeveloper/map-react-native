import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import Carousel from 'react-native-snap-carousel';
import { PUBLIC_STORAGE } from '@env';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import SmartGallery from 'react-native-smart-gallery';
import PaginationDot from 'react-native-animated-pagination-dot';
import HTML from 'react-native-render-html';
import { Icons, SafeAreaView, Text, ImageZoom, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useUserToken } from '~/hooks';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { GoBackTouchable } from '~/styles/pages/PersonalAccount/CreditCards';
import { Count } from '../Challenge.GalleryDetail/Challenge.GalleryDetail.screen';
import { ProductImageType } from '~/graphql/autogenerate/schemas';

export const SuccessTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.green};
`;

export const ErrorTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.red};
`;

export const AwaitTitle = styled(TitleText)<StatsProps>`
  font-size: 16px;
  color: ${({ color }) => color};
`;

interface StatsProps {
  color: string;
}
export const PaymentStatusContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  elevation: 10;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
  padding-top: 12px;
  padding-bottom: 31px;
  padding-horizontal: 16px;
`;
export const StatsCard = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: flex-end;
`;
export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  width: 97%;
  padding: 18px 19px;
`;

export const Description = styled(Text)`
  font-size: 20px;
  line-height: 23px;
`;

export const SmallText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 14px;
  line-height: 16.1px;
  color: rgba(22, 28, 37, 0.56);
`;

export const MinorDescription = styled(Text)`
  font-size: 14px;
  opacity: 0.56;
  line-height: 20px;
`;

export const HeaderModal = styled.View`
  padding: 50px 0 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.BuyedAward'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.BuyedAward'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const WIDTH = widthPercentageToDP('100');

const ImageStyle = {
  height: widthPercentageToDP('86') * 1,
  width: widthPercentageToDP('92'),
  borderRadius: 8,
};

const ChallengeBuyedAward: React.FC<Props> = ({ route, navigation }) => {
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<boolean>(false);
  const [modalStateProducts, setModalStateProducts] = useState<boolean>(false);
  const [productImagesToshow, setProductImagesToShow] = useState<
    ProductImageType[]
  >([]);
  const [actualPage, setActualPage] = useState(0);
  const { userID } = useUserToken();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const Images = route.params.award.awardsImages.map((el) => ({
    source: {
      uri: `${PUBLIC_STORAGE}/${el.link}`,
    },
    dimensions: {
      height: heightPercentageToDP('50'),
      width: widthPercentageToDP('10'),
    },
  }));

  const CarouselRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
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

  useEffect(() => {
    if (
      route.params?.data.getChallengeDetail.user_challenges &&
      route.params?.data.getChallengeDetail.user_challenges[0].products_bought
    ) {
      let totalProductsValues = 0;
      route.params?.data.getChallengeDetail.user_challenges[0].products_bought.map(
        (el) => {
          totalProductsValues += (el.value ? el.value : 0) * el.quantity;
        },
      );
      totalProductsValues += route.params.award.price;
      setTotalPaid(totalProductsValues);
    } else {
      let totalProductsValues = 0;
      totalProductsValues += route.params.award.price;
      setTotalPaid(totalProductsValues);
    }
  }, [route.params]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 14,
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: '90%',
          }}
        >
          <ActivityIndicator size="large" color="#0564FF" />
          <Text style={{ textAlign: 'center', marginTop: 14 }}>
            Carregando Informações de pagamento...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingHorizontal: 16,
          paddingTop: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <TitleText style={{ fontSize: 20 }}>
          {route.params.physical_event ? 'Inscrição Comprada' : 'Kit comprado'}
        </TitleText>
        <View style={{ width: 20 }} />
      </PaymentStatusContainer>
      <ScrollView>
        <View style={{ marginTop: 16, paddingBottom: 40 }}>
          <PaymentStatusContainer color="#FFF">
            <Carousel
              autoplay={false}
              lockScrollWhileSnapping
              swipeThreshold={0}
              bounces={Images.length > 1}
              onSnapToItem={(index) => setActualPage(index)}
              style={{ width: widthPercentageToDP('100') }}
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

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 40,
              }}
            >
              <TitleText style={{ fontSize: 20 }}>
                {route.params.award.name}
              </TitleText>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <MinorDescription>R$ </MinorDescription>
                <Text style={{ fontSize: 20, lineHeight: 20 }}>
                  {route.params.award.price}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 8, marginBottom: 40 }}>
              <HTML
                html={route.params.award.description}
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
          </PaymentStatusContainer>

          {route.params?.data.getChallengeDetail.user_challenges[0]
            .products_bought.length > 0 ? (
            <PaymentStatusContainer color="#FFF" style={{ marginTop: 16 }}>
              <TitleText style={{ fontSize: 20 }}>Extras</TitleText>
              <MinorDescription>
                Você customizou seu kit com os itens adicionais abaixo
              </MinorDescription>

              {route.params?.data.getChallengeDetail.user_challenges[0].products_bought.map(
                (el) => (
                  <TouchableOpacity
                    onPress={() => {
                      setProductImagesToShow(
                        el.variation.images &&
                          el.variation.images.length > 0 &&
                          el.variation.images[0].link
                          ? el.variation.images
                          : [
                              {
                                id: 'default',
                                link: 'miscellaneous/product.jpg',
                              },
                            ],
                      );
                      setTimeout(() => {
                        setModalStateProducts((prev) => !prev);
                      }, 500);
                    }}
                    style={{
                      paddingVertical: 24,
                      borderBottomColor: 'rgba(22, 28, 37, 0.2)',
                      borderBottomWidth: 0.5,
                      flexDirection: 'row',
                      width: '100%',
                    }}
                  >
                    <FastImage
                      resizeMethod="scale"
                      resizeMode="contain"
                      source={{
                        uri: `${PUBLIC_STORAGE}/${
                          el.variation.images &&
                          el.variation.images.length > 0 &&
                          el.variation.images[0].link
                            ? el.variation.images[0].link
                            : 'miscellaneous/product.jpg'
                        }`,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        marginRight: 5,
                        // height: heightPercentageToDP('50'),
                      }}
                    />
                    <View
                      style={{
                        justifyContent: 'space-between',
                        width: widthPercentageToDP('80'),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text
                          style={{
                            width: widthPercentageToDP('65'),
                          }}
                          numberOfLines={1}
                        >
                          {el.quantity > 1 ? `${el.quantity}x ` : null}
                          {el.product.name}
                        </Text>
                        {el.value > 0 ? (
                          <Text>
                            R${' '}
                            {!Number.isInteger(el.value * el.quantity)
                              ? String(
                                  Number(el.value * el.quantity).toFixed(2),
                                ).replace('.', ',')
                              : el.value * el.quantity}
                          </Text>
                        ) : (
                          <Text>Sem custo</Text>
                        )}
                      </View>
                      <Text style={{ fontFamily: 'NeuzeitGro-Lig' }}>
                        {el.variation.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ),
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 32,
                }}
              >
                <Text style={{ fontFamily: 'NeuzeitGro-Lig' }}>
                  Valor Total
                </Text>

                <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontFamily: 'NeuzeitGro-Lig',
                      lineHeight: 20,
                      fontSize: 12,
                    }}
                  >
                    R${' '}
                  </Text>
                  <TitleText style={{ fontSize: 20, lineHeight: 24 }}>
                    {!Number.isInteger(totalPaid)
                      ? String(Number(totalPaid).toFixed(2)).replace('.', ',')
                      : totalPaid}
                  </TitleText>
                </View>
              </View>
            </PaymentStatusContainer>
          ) : null}
        </View>
      </ScrollView>
      <View />
      <Modal
        isVisible={modalState}
        onBackdropPress={() => setModalState((prev) => !prev)}
        backdropOpacity={1}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <StatusBar barStyle="light-content" />
        <HeaderModal>
          <GoBackTouchable
            onPress={() => setModalState((prev) => !prev)}
            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
          >
            <Icons name="close" width={30} color="#fff" />
          </GoBackTouchable>

          <Count>
            {actualPage} / {route.params.award.awardsImages.length}
          </Count>
        </HeaderModal>
        <SmartGallery
          index={actualPage}
          onPageSelected={(page) => {
            setActualPage(page + 1);
          }}
          images={route.params.award.awardsImages.map((el) => ({
            source: {
              uri: `${PUBLIC_STORAGE}/${el.link}`,
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
      </Modal>

      <Modal
        isVisible={modalStateProducts}
        onBackdropPress={() => setModalStateProducts((prev) => !prev)}
        backdropOpacity={1}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <StatusBar barStyle="light-content" />
        <HeaderModal>
          <GoBackTouchable
            onPress={() => setModalStateProducts((prev) => !prev)}
            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
          >
            <Icons name="close" width={30} color="#fff" />
          </GoBackTouchable>

          <Count>
            {actualPage} / {productImagesToshow.length}
          </Count>
        </HeaderModal>
        <SmartGallery
          index={actualPage}
          onPageSelected={(page) => {
            setActualPage(page + 1);
          }}
          images={productImagesToshow.map((el) => ({
            source: {
              uri: `${PUBLIC_STORAGE}/${el.link}`,
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
      </Modal>
    </View>
  );
};

export default ChallengeBuyedAward;
