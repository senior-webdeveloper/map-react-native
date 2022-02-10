import React, { useState } from 'react';
import Modal from 'react-native-modal';
import ImageZoomPan from 'react-native-image-pan-zoom';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import styled from 'styled-components/native';

interface ImageProps extends FastImageProps {
  uri: { uri: string };
}

export const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

export default function ImageZoom({
  uri,
  ...imageProps
}: ImageProps): JSX.Element {
  const [modalState, setModalState] = useState<boolean>(false);
  const { width, height } = Dimensions.get('window');
  return (
    <View>
      <TouchableOpacity onPress={() => setModalState((prev) => !prev)}>
        <FastImage {...imageProps} source={uri} />
      </TouchableOpacity>

      <Modal
        isVisible={modalState}
        onBackdropPress={() => setModalState((prev) => !prev)}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <Container>
          <ImageZoomPan
            cropWidth={width}
            cropHeight={height}
            imageWidth={width}
            imageHeight={width}
            onClick={() => setModalState((prev) => !prev)}
          >
            <FastImage
              resizeMethod="scale"
              resizeMode="contain"
              style={{
                width,
                height: width,
              }}
              source={uri}
            />
          </ImageZoomPan>
        </Container>
      </Modal>
    </View>
  );
}
