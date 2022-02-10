import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHTML from 'react-native-render-html';
import { Icons, SafeAreaView, TitleText, ImageZoom } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  HeaderContainer,
  HeaderText,
  HeaderWrapper,
  ParagraphText,
} from './Challenge.DescriptionInfo.styles';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.DescriptionInfo'
>;

type Props = {
  navigation: ChallengeDescriptionNavigationProp;
};

export default function ChallengeDescriptionInfo({
  navigation,
  route,
}: Props): JSX.Element {
  // const { data: userProfile, refetch: getUserProfile } = useUserInfo();
  const userProfile = useStoreState((state) => state.profile.payload);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <HeaderContainer>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>

        <HeaderText>Descrição</HeaderText>
        <HeaderWrapper />
      </HeaderContainer>

      <ScrollView>
        <Styled.AwardContainer style={{ marginBottom: 20 }}>
          <CustomHTML
            key="html"
            source={{ html: route.params.description }}
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

              p: (htmlAttribs, children) => (
                <ParagraphText>{children}</ParagraphText>
              ),
              div: (htmlAttribs, children) => (
                <View>
                  <View>{children}</View>
                </View>
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
        </Styled.AwardContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
