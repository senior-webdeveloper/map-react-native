/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import { Icons, TitleText } from '~/components';

import { OptionContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

import facebook from '../../../assets/SocialMedias/facebook.png';
import instagram from '../../../assets/SocialMedias/instagram.png';

import {
  Container,
  Header,
  GoBackTouchable,
  CardsFlatList,
  BrandContainer,
  BrandName,
  ExtensionIcon,
} from '~/styles/pages/PersonalAccount/CreditCards';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.Links'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Links'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};
const { width } = Dimensions.get('window');
const ViewTypes = {
  FULL: 0,
};
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 86;
    },
  );
export default function ChallengeLinks({ navigation, route }: Props) {
  const { goBack } = navigation;
  const { links } = route.params;
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;

  useEffect(() => {
    setDataProvider(dataProviderMaker(links));
  }, [links]);

  const RenderCard = (type, item, index) => (
    <OptionContainer key={item.id} onPress={() => Linking.openURL(item.link)}>
      <BrandContainer>
        {item.icon === 'network' ? (
          <Icons name="network" />
        ) : (
          <FastImage
            style={{ width: 24, height: 24, borderRadius: 4 }}
            source={{ uri: `${PUBLIC_STORAGE}/${item.favicon_image_link}` }}
          />
        )}
        <View style={{ width: widthPercentageToDP('65') }}>
          <BrandName>{item.name}</BrandName>
        </View>
      </BrandContainer>

      <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
        <Icons name="open-ex" />
      </TouchableOpacity>
    </OptionContainer>
  );

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      <Header>
        <GoBackTouchable onPress={goBack}>
          <Icons name="arrow-left" width={30} />
        </GoBackTouchable>
        <TitleText>Links</TitleText>
      </Header>

      <RecyclerListView
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={RenderCard}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
      />
    </Container>
  );
}
