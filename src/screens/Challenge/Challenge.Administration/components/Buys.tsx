import React, { useEffect, useRef, useState } from 'react';
import { RouteProp, CommonActions } from '@react-navigation/native';
import { Header, StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Alert,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import styled from 'styled-components/native';
import { format } from 'date-fns';
import Carousel, {
  Pagination,
  ParallaxImage,
} from 'react-native-snap-carousel';
import { PUBLIC_STORAGE } from '@env';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import SmartGallery from 'react-native-smart-gallery';
import PaginationDot from 'react-native-animated-pagination-dot';
import HTML from 'react-native-render-html';
import {
  Button,
  Icons,
  SafeAreaView,
  Text,
  ImageZoom,
  TitleText,
  Box,
  Typography,
} from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  useGetAwardSubscriptionPaymentQuery,
  useGetAwardSubscriptionPaymentLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { useUserInfo, useUserToken } from '~/hooks';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import award from '~/store/model/award';
import { GoBackTouchable } from '~/styles/pages/PersonalAccount/CreditCards';
import { Count } from '../../Challenge.GalleryDetail/Challenge.GalleryDetail.screen';
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
  /* Shadow try 1 */
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
  const [modalState, setModalState] = useState<boolean>(false);
  const [modalStateProducts, setModalStateProducts] = useState<boolean>(false);
  const [productImagesToshow, setProductImagesToShow] = useState<
    ProductImageType[]
  >([]);
  const [actualPage, setActualPage] = useState(0);

  console.log(
    'teste: ',
    route.params.subscription_status.getDetailedSubscription.subscription_status
      ?.status_description.translations,
  );

  const Images =
    route?.params?.award?.awardsImages.map((el) => ({
      source: {
        uri: `${PUBLIC_STORAGE}/${el.link}`,
      },
      dimensions: {
        height: heightPercentageToDP('50'),
        width: widthPercentageToDP('10'),
      },
    })) || [];

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View>
          <Box px={3} py={3}>
            <Box flexDirection="row" width={1}>
              {Images &&
                Images.map((el, index) => (
                  <>
                    {index === 0 ? (
                      <FastImage
                        source={el.source}
                        style={{ width: 80, height: 80, borderRadius: 12 }}
                      />
                    ) : null}
                  </>
                ))}

              <Box
                alignSelf="stretch"
                ml={24}
                width={widthPercentageToDP('60')}
              >
                <TitleText style={{ fontSize: 16 }}>
                  {route.params.award.name}
                </TitleText>

                <Box>
                  <HTML
                    html={`<span>${route.params.award.description}</span>`}
                    ignoredStyles={['font-family']}
                    onLinkPress={(evt, href) => {
                      Linking.openURL(href);
                    }}
                    renderers={{
                      span: (htmlAttribs, children) => (
                        <SmallText numberOfLines={3}>{children}</SmallText>
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
                </Box>
              </Box>
            </Box>
          </Box>

          <Box color="#FFF" style={{ marginTop: 16 }} px={3}>
            <Box flexDirection="row" alignItems="center">
              <Icons name="bag" style={{ marginRight: 10 }} />
              <TitleText style={{ fontSize: 20 }}>
                Compras com a Inscrição
              </TitleText>
            </Box>

            {route.params?.products_bought.filter(
              (el) => el.user_challenge_id !== null,
            ).length <= 0 ? (
              <Box alignItems="center" py={5}>
                <Typography textAlign="center">
                  Nenhuma compra realizada junto com a inscrição
                </Typography>
              </Box>
            ) : null}

            {route.params?.products_bought
              .filter((el) => el.user_challenge_id !== null)
              .map((el) => (
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
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      marginRight: 32,
                      // height: heightPercentageToDP('50'),
                    }}
                  />

                  <Box>
                    <Box
                      backgroundColor="#F8FAFB"
                      p={3}
                      width={widthPercentageToDP('60')}
                      borderRadius={12}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 13,
                        }}
                      >
                        <Text style={{ wordWrap: 'wrap' }}>
                          {el.product.name}
                        </Text>
                      </View>

                      {el.quantity > 1 ? (
                        <Box
                          width="100%"
                          flexDirection="row"
                          justifyContent="space-between"
                        >
                          <Text
                            style={{
                              fontFamily: 'NeuzeitGro-Lig',
                              fontSize: 14,
                            }}
                          >
                            Quantidade
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'NeuzeitGro-Bol',
                              color: 'rgba(22, 28, 37, 0.56)',
                              fontSize: 14,
                            }}
                          >
                            {el.quantity}
                          </Text>
                        </Box>
                      ) : null}

                      <Box
                        width="100%"
                        flexDirection="row"
                        justifyContent="space-between"
                      >
                        <Text
                          style={{
                            fontFamily: 'NeuzeitGro-Lig',
                            fontSize: 14,
                          }}
                        >
                          Variação
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'NeuzeitGro-Bol',
                            color: 'rgba(22, 28, 37, 0.56)',
                            fontSize: 14,
                          }}
                        >
                          {el.variation.text}
                        </Text>
                      </Box>

                      <Box
                        width="100%"
                        flexDirection="row"
                        justifyContent="space-between"
                      >
                        <Text
                          style={{
                            fontFamily: 'NeuzeitGro-Lig',
                            fontSize: 14,
                          }}
                        >
                          Status
                        </Text>
                        <Text
                          style={{
                            maxWidth: widthPercentageToDP('40'),
                            fontFamily: 'NeuzeitGro-Bol',
                            color: 'rgba(22, 28, 37, 0.56)',
                            fontSize: 14,
                            textAlign: 'right',
                          }}
                        >
                          {route.params.subscription_status
                            .getDetailedSubscription.subscription_status
                            ?.status_description.translations
                            ? route.params.subscription_status
                                .getDetailedSubscription.subscription_status
                                ?.status_description.translations[0].name
                            : 'Em Análise'}
                        </Text>
                      </Box>
                    </Box>

                    <Box
                      width={widthPercentageToDP('60')}
                      flexDirection="row"
                      px={3}
                      justifyContent="space-between"
                    >
                      <Text style={{ fontSize: 14 }}>Valor</Text>
                      {el.value > 0 ? (
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'NeuzeitGro-Lig',
                          }}
                        >
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
                    </Box>
                  </Box>
                </TouchableOpacity>
              ))}
          </Box>

          {route.params?.products_bought.filter(
            (el) => el.user_challenge_id === null,
          ).length > 0 ? (
            <Box color="#FFF" style={{ marginTop: 16 }} px={3}>
              <Box flexDirection="row" alignItems="center">
                <Icons name="bag" style={{ marginRight: 10 }} />
                <TitleText style={{ fontSize: 20 }}>
                  Compras Adicionais
                </TitleText>
              </Box>

              {route.params?.data.getChallengeDetail.user_challenges[0].products_bought
                .filter((el) => el.user_challenge_id === null)
                .map((el) => (
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
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                        marginRight: 32,
                        // height: heightPercentageToDP('50'),
                      }}
                    />

                    <Box>
                      <Box
                        backgroundColor="#F8FAFB"
                        p={3}
                        width={widthPercentageToDP('60')}
                        borderRadius={12}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 13,
                          }}
                        >
                          <Text style={{ wordWrap: 'wrap' }}>
                            {el.product.name}
                          </Text>
                        </View>

                        {el.quantity > 1 ? (
                          <Box
                            width="100%"
                            flexDirection="row"
                            justifyContent="space-between"
                          >
                            <Text
                              style={{
                                fontFamily: 'NeuzeitGro-Lig',
                                fontSize: 14,
                              }}
                            >
                              Quantidade
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'NeuzeitGro-Bol',
                                color: 'rgba(22, 28, 37, 0.56)',
                                fontSize: 14,
                              }}
                            >
                              {el.quantity}
                            </Text>
                          </Box>
                        ) : null}

                        <Box
                          width="100%"
                          flexDirection="row"
                          justifyContent="space-between"
                        >
                          <Text
                            style={{
                              fontFamily: 'NeuzeitGro-Lig',
                              fontSize: 14,
                            }}
                          >
                            Variação
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'NeuzeitGro-Bol',
                              color: 'rgba(22, 28, 37, 0.56)',
                              fontSize: 14,
                            }}
                          >
                            {el.variation.text}
                          </Text>
                        </Box>

                        <Box
                          width="100%"
                          flexDirection="row"
                          justifyContent="space-between"
                        >
                          <Text
                            style={{
                              fontFamily: 'NeuzeitGro-Lig',
                              fontSize: 14,
                            }}
                          >
                            Status
                          </Text>
                          <Text
                            style={{
                              maxWidth: widthPercentageToDP('40'),
                              fontFamily: 'NeuzeitGro-Bol',
                              color: 'rgba(22, 28, 37, 0.56)',
                              fontSize: 14,
                              textAlign: 'right',
                            }}
                          >
                            {el.related_payment?.payment.is_paid
                              ? 'Pago'
                              : 'Aguardando Pagamento'}
                          </Text>
                        </Box>
                      </Box>

                      <Box
                        width={widthPercentageToDP('60')}
                        flexDirection="row"
                        px={3}
                        justifyContent="space-between"
                      >
                        <Text style={{ fontSize: 14 }}>Valor</Text>
                        {el.value > 0 ? (
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'NeuzeitGro-Lig',
                            }}
                          >
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
                      </Box>
                    </Box>
                  </TouchableOpacity>
                ))}
            </Box>
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
