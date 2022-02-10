import React, { useState } from 'react';
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
import PaginationDot from 'react-native-animated-pagination-dot';
import {
  BoxShadow,
  Button,
  Icons,
  ImageZoom,
  Text,
  TitleText,
} from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { SubscribeContainer } from './Awards.Description.styles';
import { useStoreState } from '~/store';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Award.Description'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Award.Description'
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

export default function ChallengeAwardDescription({
  route: {
    params: { award, title, subscribe, showSubscribe, isPaid, award_index },
  },
  navigation,
}: Props): JSX.Element {
  const hasClickedOnSubscribe = useStoreState(
    (state) => state.challenge.hasClickedOnSubscribe,
  );
  const userHasSubscribed = useStoreState(
    (state) => state.challenge.userHasSubscribed,
  );
  const [modalState, setModalState] = useState<boolean>(false);
  const [actualPage, setActualPage] = useState(0);

  const Images = award.awardsImages.map((el) => ({
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
              <TextBold>{award.name}</TextBold>
              <View style={{ flexDirection: 'row' }}>
                {award.price && award.price > 0 ? (
                  <>
                    <SmallText>R$</SmallText>
                    <NormalParagraph>
                      {' '}
                      {!Number.isInteger(award.price)
                        ? String(award.price.toFixed(2)).replace('.', ',')
                        : award.price}
                    </NormalParagraph>
                  </>
                ) : null}
              </View>
            </View>

            <View style={{ marginTop: 8, marginBottom: 40 }}>
              <HTML
                html={award.description}
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
          </View>
        </BoxShadow>
      </ScrollView>
      {showSubscribe && !userHasSubscribed ? (
        <SubscribeContainer>
          <Button
            disabled={hasClickedOnSubscribe}
            name={
              isPaid
                ? award.only_for_draw
                  ? `Inscrever-se`
                  : `Inscrever-se com ${award.name}`
                : 'Inscrever-se Gratuitamente'
            }
            loading={hasClickedOnSubscribe}
            style={{ marginTop: 0 }}
            onPress={() => {
              subscribe(award_index);
            }}
          />
        </SubscribeContainer>
      ) : null}
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
            {actualPage} / {award.awardsImages.length}
          </Count>
        </Header>
        <SmartGallery
          index={actualPage}
          onPageSelected={(page) => {
            setActualPage(page + 1);
          }}
          images={award.awardsImages.map((el) => ({
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
}
