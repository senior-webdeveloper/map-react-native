import React, { useState } from 'react';
import {
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import CustomHTML from 'react-native-render-html';
import { Box, ImageZoom, Text, TitleText, Typography } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import * as Styled from '~/screens/Challenge/Challenge.Description/components/MainScreen/styles';

type ScrollViewRef = React.RefObject<ScrollView>;

interface Props {
  description: string;
  scrollView: ScrollViewRef;
}

export default function HTML({
  description,
  scrollView,
  navigation,
}: Props): JSX.Element {
  const [seeMore, setSeeMore] = useState<boolean>(false);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Challenge.DescriptionInfo', {
          description: `<div>${description}</div>`,
          navigation,
        });
        // setSeeMore((prevState) => !prevState);
        if (seeMore) {
          if (scrollView.current)
            scrollView.current.scrollTo({ y: 119, animated: true });
        }
      }}
    >
      <View key="html-container">
        <CustomHTML
          key="html"
          source={{ html: `<div>${description}</div>` }}
          // source={{ html: seeMore ? description : `<div>${description}</div>` }}
          ignoredStyles={['font-family']}
          containerStyle={{ marginTop: 16 }}
          onLinkPress={(evt, href) => {
            Linking.openURL(href);
          }}
          renderers={{
            img: (attribs, children, objectCSS, contentProps) => {
              if (Platform.OS === 'ios') {
                return (
                  <ImageZoom
                    uri={{ uri: attribs.src }}
                    style={{
                      marginTop: 10,
                      width: widthPercentageToDP('91'),
                      height: widthPercentageToDP('100') / 2,
                    }}
                  />
                );
              }
              return null;
            },

            p: (htmlAttribs, children) => <Text>{children}</Text>,
            div: (htmlAttribs, children) => (
              <Box>
                {seeMore ? (
                  <Box>{children}</Box>
                ) : (
                  <Typography numberOfLines={2}>{children}</Typography>
                )}
              </Box>
            ),
            b: (htmlAttribs, children) => <TitleText>{children}</TitleText>,
          }}
          tagsStyles={{
            div: {
              marginTop: 5,
            },
            p: {
              fontFamily: 'NeuzeitGro-Reg',
              fontWeight: null,
            },
            img: {
              marginTop: 5,
            },
            b: {
              fontFamily: 'NeuzeitGro-Bol',
              fontWeight: null,
            },
          }}
        />

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Challenge.DescriptionInfo', {
                description: `<div>${description}</div>`,
                navigation,
              });
              // setSeeMore((prevState) => !prevState);
              if (seeMore) {
                if (scrollView.current)
                  scrollView.current.scrollTo({ y: 119, animated: true });
              }
            }}
          >
            <Styled.BlueText>
              {seeMore ? 'Ver menos' : 'Ver mais'}
            </Styled.BlueText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
