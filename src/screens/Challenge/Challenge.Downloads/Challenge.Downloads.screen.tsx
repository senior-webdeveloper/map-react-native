/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { PUBLIC_STORAGE } from '@env';
import { PERMISSIONS, check } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icons, TitleText } from '~/components';

import { OptionContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

import { useAllChallengeAttachedFilesQuery } from '~/graphql/autogenerate/hooks';

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
  'Challenge.Downloads'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Downloads'
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

export default function ChallengeDownloads({ navigation, route }: Props) {
  const { goBack, navigate } = navigation;
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const { challenge_id, files } = route.params;

  useEffect(() => {
    setDataProvider(dataProviderMaker(files));
  }, [files]);

  const download = async (
    link: string,
    name: string,
    extension: string,
    description: string,
  ) => {
    const permissionWrite = await check(
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
    if (permissionWrite === 'granted' || Platform.OS === 'ios') {
      const { dirs } = RNFetchBlob.fs;

      const dirToSave = Platform.select({
        ios: dirs.DocumentDir,
        android: dirs.DownloadDir,
      });

      const filePath = `${dirToSave}/${name}${extension}`;

      const configfb = {
        addAndroidDownloads: {
          fileCache: true,
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: `${name}${extension}`,
          path: filePath,
        },
      };

      const configIos = {
        fileCache: true,
        title: `${name}${extension}`,
        path: filePath,
      };

      const configOptions = Platform.select({
        android: configfb,
        ios: configIos,
      });

      RNFetchBlob.config(configOptions)
        .fetch('GET', link)
        .then((res): void => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(filePath, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(filePath);
          }
        })
        .catch((): void => {
          Alert.alert('Não foi possivel realizar download.');
        });
    } else {
      navigation.push('Permission.Write');
    }
  };

  const open = (link: string) => {
    Linking.openURL(link);
  };

  const RenderCard = (type, item, index) => (
    <OptionContainer key={index} activeOpacity={1}>
      <BrandContainer>
        <ExtensionIcon>
          <TitleText style={{ color: '#fff', fontSize: 15 }}>
            {item.extension.toUpperCase()}
          </TitleText>
        </ExtensionIcon>
        <View style={{ width: widthPercentageToDP('60') }}>
          <BrandName>{item.name}</BrandName>
        </View>
      </BrandContainer>
      <View
        style={{
          width: '20%',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() =>
            download(
              `${PUBLIC_STORAGE}/${item.link}`,
              item.name,
              item.extension,
              item.description,
            )}
        >
          <Icons name="download" style={{ marginRight: 20 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => open(`${PUBLIC_STORAGE}/${item.link}`)}
        >
          <Icons name="open-ex" />
        </TouchableOpacity>
      </View>
    </OptionContainer>
  );

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      <Header>
        <GoBackTouchable onPress={goBack}>
          <Icons name="arrow-left" width={30} />
        </GoBackTouchable>
        <TitleText>Downloads</TitleText>
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
