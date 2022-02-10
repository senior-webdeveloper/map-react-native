/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, StatusBar, Modal, Dimensions } from 'react-native';

import Gallery from 'react-native-image-gallery';

import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icons } from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';

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

function ChallengeGalleryDetail({ route, navigation }) {
  const { goBack } = navigation;

  const { index, images } = route.params;

  const [actualPage, setActualPage] = useState(index);
  const [tapped, setTapped] = useState(false);
  const sortedBricks = images;
  const galleryImages = sortedBricks
    .sort((a, b) => a.index - b.index)
    .map((image) => ({
      source: {
        uri: image.uri,
      },
      dimensions: {
        width: widthPercentageToDP('100'),
        height: widthPercentageToDP('100') / 2,
      },
    }));
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#161C25',
      }}
    >
      {tapped ? (
        <>
          <StatusBar hidden />
          <Header style={{ opacity: 0 }}>
            <GoBackTouchable onPress={goBack}>
              <Icons name="arrow-left-white" width={30} />
            </GoBackTouchable>

            <Count>
              {actualPage} / {images.length}
            </Count>
          </Header>
        </>
      ) : (
        <>
          <StatusBar barStyle="light-content" />
          <Header>
            <GoBackTouchable onPress={goBack}>
              <Icons name="arrow-left-white" width={30} />
            </GoBackTouchable>

            <Count>
              {actualPage} / {images.length}
            </Count>
          </Header>
        </>
      )}
      <Gallery
        onPageSelected={(page) => setActualPage(page + 1)}
        onSingleTapConfirmed={() => setTapped(!tapped)}
        style={{ backgroundColor: 'transparent', paddingTop: -20 }}
        imageComponent={(source) => <FastImage {...source} />}
        images={galleryImages}
        initialPage={actualPage}
        flatListProps={{
          initialNumToRender: 20,
          initialScrollIndex: actualPage - 1,
          getItemLayout: (data, index) => ({
            length: Dimensions.get('screen').width,
            offset: Dimensions.get('screen').width * index,
            index,
          }),
        }}
      />
    </View>
  );
}

export default ChallengeGalleryDetail;
