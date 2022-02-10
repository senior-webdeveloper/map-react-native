/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import ImageSize from 'react-native-image-size';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { ScrollView } from 'react-native-gesture-handler';

import FastImage from 'react-native-fast-image';
import { Icons, TitleText } from '~/components';

export const Header = styled.View`
  padding: 40px 0px 35px;
  margin-bottom: 15px;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: relative;
`;

export const GoBackTouchable = styled.TouchableOpacity`
  position: absolute;

  left: 16px;
  top: 50px;
`;

export const HeartTouchable = styled.TouchableOpacity`
  position: absolute;

  right: 16px;
  top: 50px;
`;

export const ShareTouchable = styled.TouchableOpacity`
  position: absolute;

  right: 55px;
  top: 50px;
`;

function ChallengeImageGallery({ route, navigation }) {
  const { goBack, navigate } = navigation;

  const bricks = route.params.images.map((uri, index) => ({ uri, index }));

  const { width, height } = Dimensions.get('window');

  const [newBricks, setNewBricks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorited, setFavorited] = useState(route.params.isFavorite);

  function split(initialArray, max) {
    const result = [[]];
    let group = 0;

    initialArray.map((_, index) => {
      if (result[group] === undefined) {
        result[group] = [];
      }

      result[group].push({ ...initialArray[index], index });

      if ((index + 1) % max === 0) {
        group += 1;
      }
    });
    return result;
  }

  const buildBricks = () => {
    const { getSize } = Image;

    bricks.map(({ uri, index }) => {
      getSize(uri, (imageWidth, imageHeight) => {
        setNewBricks((prev) => [
          ...prev,
          {
            uri,
            index,
            aspectRatio: imageHeight / imageWidth,
          },
        ]);
      });
    });
  };

  useEffect(() => {
    buildBricks();
  }, []);

  const sortedBricks = newBricks.sort((a, b) => a.index - b.index);
  const renderBricks = split(sortedBricks, 3);

  setTimeout(() => setIsLoading(false), 700);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#0564FF" />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: '#fff',
        height,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <Header>
        <GoBackTouchable onPress={goBack}>
          <Icons name="arrow-left" width={30} />
        </GoBackTouchable>

        <ShareTouchable onPress={() => route.params.shareChallenge()}>
          <Icons name="share" width={35} height={22} />
        </ShareTouchable>

        <HeartTouchable
          onPress={() => {
            setFavorited(!favorited);
            route.params.handleFavorite();
          }}
        >
          {favorited ? (
            <Icons name="heart-filled" width={30} height={20} />
          ) : (
            <Icons name="heart" width={30} height={20} />
          )}
        </HeartTouchable>
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingVertical: 20,
          backgroundColor: '#fff',
        }}
      >
        {renderBricks
          .sort((a, b) => a.order - b.order)
          .map((item, index) => {
            return item.map((item2, index2) => {
              if (item.length === 2) {
                item.push(null);
              }
              if (item.length === 1) {
                item.push(null, null);
              }
              if (index2 % 2 || (item[0] !== null && item[1] === null)) {
                return (
                  <Grid style={{ marginBottom: 7.5 }} key={String(index2)}>
                    {item[0] !== null && (
                      <Row
                        key={item[0].index}
                        activeOpacity={0.9}
                        onPress={() =>
                          navigate('Challenge.GalleryDetail', {
                            index: item[0]?.index,
                            images: newBricks,
                          })}
                      >
                        <FastImage
                          resizeMode="cover"
                          source={{ uri: item[0]?.uri }}
                          style={{
                            height:
                              item[0]?.aspectRatio > 1
                                ? item[0]?.aspectRatio * width - 190
                                : item[0]?.aspectRatio * width,
                            width,
                          }}
                        />
                      </Row>
                    )}
                    <Row style={{ marginTop: 7.5 }}>
                      {item[1] !== null && (
                        <Col
                          key={item[1].index}
                          activeOpacity={0.9}
                          onPress={() =>
                            navigate('Challenge.GalleryDetail', {
                              index: item[1]?.index,
                              images: newBricks,
                            })
                          }
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}
                        >
                          <FastImage
                            resizeMode="cover"
                            source={{ uri: item[1]?.uri }}
                            style={{
                              height: 200,
                              width: width / 2 - 5,
                            }}
                          />
                        </Col>
                      )}
                      {item[2] !== null && (
                        <Col
                          key={item[2].index}
                          activeOpacity={0.9}
                          onPress={() =>
                            navigate('Challenge.GalleryDetail', {
                              index: item[2]?.index,
                              images: newBricks,
                            })
                          }
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}
                        >
                          <FastImage
                            resizeMode="cover"
                            source={{ uri: item[2]?.uri }}
                            style={{
                              height: 200,
                              width: width / 2 - 5,
                            }}
                          />
                        </Col>
                      )}
                    </Row>
                  </Grid>
                );
              }
            });
          })}
      </ScrollView>
    </View>
  );
}

export default ChallengeImageGallery;
