import React, { useRef, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';
import { PUBLIC_STORAGE } from '@env';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { captureException, captureMessage } from '@sentry/react-native';
import RNFS from 'react-native-fs';
import { height } from 'styled-system';
import { Box, Icons, SafeAreaView, Text, Typography } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { ModalContentContainer } from '~/screens/Challenge/Challenge.MyPayment/Styles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { lightTheme } from '~/global/themes';
import {
  ArrowDown,
  ArrowUp,
  Avatar,
  AvatarChallenge,
  ChallengeName,
  UserName,
} from '~/screens/Challenge/Challenge.UserActivities/Challenge.UserActivities.screen';
import { useStoreState } from '~/store';

type ShowSpecificAcitivityRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.ShareSubscription'
>;

type ShowSpecificAcitivityNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.ShareSubscription'
>;

type Props = {
  route: ShowSpecificAcitivityRouteProp;
  navigation: ShowSpecificAcitivityNavigationProp;
};

export default function ChallengeShareSubscription({
  route,
  navigation,
}: Props) {
  const [uri, setURI] = useState<string>();
  const userinfo = useStoreState((state) => state.profile.payload);
  const viewShot = useRef<ViewShot>(null);

  const onShare = async () => {
    try {
      if (viewShot.current) {
        const url = await captureRef(viewShot.current, {
          result: 'data-uri',
        });
        const title = 'Minha Inscrição';
        const message = `Ei essa é a minha inscrição no desafio ${route.params.data?.getChallengeDetail.name}`;

        RNFS.readFile(uri ?? url, 'base64').then((res) => {
          const urlString = `data:image/jpeg;base64,${res}`;
          const icon = urlString;
          captureMessage(`data-uri: ${urlString}`);
          // const options = {
          //   title: 'Minha Inscrição',
          //   message: `Ei, essa é a minha inscrição no desafio ${route.params.data?.getChallengeDetail.name}`,
          //   url: urlString,
          //   type: 'image/jpeg',
          // };
          // Share.open(options)
          //   .then((res) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     err && console.log(err);
          //   });
          if (urlString) {
            const options = {
              title: message,
              url: urlString,
            };
            // const options = Platform.select({
            //   ios: {
            //     activityItemSources: [
            //       {
            //         placeholderItem: { type: 'url', content: icon },
            //         item: {
            //           default: { type: 'text', content: `${message}` },
            //         },
            //         activityItem: {
            //           type: url.replace(/^"+|"+$/g, ''),
            //           content: url.replace(/^"+|"+$/g, ''),
            //         },
            //         linkMetadata: {
            //           title: message,
            //           icon,
            //           image: url.replace(/^"+|"+$/g, ''),
            //           url: url.replace(/^"+|"+$/g, ''),
            //           originalUrl: url.replace(/^"+|"+$/g, ''),
            //         },
            //       },
            //     ],
            //   },
            //   default: {
            //     title: 'Minha Inscrição',
            //     message: `Ei, essa é a minha inscrição no desafio ${route.params.data?.getChallengeDetail.name}`,
            //     url,
            //     type: 'image/jpg',
            //   },
            // });
            Share.open(options)
              .then((res) => captureMessage(JSON.stringify(res)))
              .catch((e) => captureException(e));
          }
        });

        // setURI(element);
        // viewShot.current.capture().then((uri) => {
        //   RNFS.readFile(uri, 'base64')
        //     .then((res) => {
        //       const urlString = `data:image/jpeg;base64,${res}`;
        //       captureMessage(urlString);
        //       const options = {
        //         title: 'Minha Inscrição',
        //         message: `Ei, essa é a minha inscrição no desafio ${route.params.data?.getChallengeDetail.name}`,
        //         url: urlString,
        //         type: 'image/jpeg',
        //       };
        //       Share.open(options)
        //         .then((res) => {
        //           console.log(res);
        //         })
        //         .catch((err) => {
        //           err && console.log(err);
        //         });
        //     })
        //     .catch((e) => captureException(e));
        // });
      }
    } catch (error) {
      captureException(error);
    }
  };

  return (
    <Box as={SafeAreaView} flex={1}>
      <ModalContentContainer>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Typography>Compartilhar Inscrição</Typography>

          <Icons name="arrow-left" color="white" />
        </Box>

        <ViewShot
          ref={viewShot}
          onCapture={(uri) => {
            setURI(uri);
          }}
          style={{
            backgroundColor: 'white',
            paddingBottom: 40,
            width: widthPercentageToDP('100'),
            height: heightPercentageToDP('75'),
          }}
          options={{ format: 'jpg', quality: 0.9 }}
          captureMode="mount"
        >
          <Box marginVertical={20} alignItems="center" backgroundColor="white">
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Avatar
                source={{
                  uri: `${PUBLIC_STORAGE}/${userinfo?.getProfile.profile_avatar}`,
                }}
              />

              <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
                <Box flexDirection="row" alignItems="center">
                  <ArrowUp color="#4595EC" />
                  <Box backgroundColor="#4595EC" paddingHorizontal={15}>
                    <UserName
                      style={{
                        width: widthPercentageToDP('30'),
                        textAlign: 'center',
                        color: '#FFF',
                      }}
                      numberOfLines={1}
                    >
                      {`${userinfo?.getProfile.user.firstname} ${userinfo?.getProfile.user.lastname}`}
                    </UserName>
                  </Box>
                  <ArrowDown color="#4595EC" />
                </Box>

                <Box flexDirection="row" alignItems="center" marginTop={-1}>
                  <ArrowUp color="#E8ECEF" />
                  <Box backgroundColor="#E8ECEF" paddingHorizontal={15}>
                    <ChallengeName
                      style={{
                        width: widthPercentageToDP('30'),
                        textAlign: 'center',
                      }}
                      numberOfLines={1}
                    >
                      {route.params.data?.getChallengeDetail.name}
                    </ChallengeName>
                  </Box>
                  <ArrowDown color="#E8ECEF" />
                </Box>
              </View>

              <AvatarChallenge
                source={{
                  uri: `${PUBLIC_STORAGE}/${route.params.data?.getChallengeDetail.image_avatar}`,
                }}
              />
            </View>

            <Typography type="small" marginTop={10}>
              Cod. Inscrição
            </Typography>
            <Typography
              style={{
                fontFamily: 'NeuzeitGro-Bol',
                color: 'rgba(22, 28, 37, 0.4)',
                lineHeight: 16,
              }}
            >
              {route.params.short_id}
            </Typography>
          </Box>

          <Box width={widthPercentageToDP('100')} alignItems="center">
            <Box
              borderColor={lightTheme.colors.text}
              borderWidth={3}
              borderRadius={4}
              p={21}
              alignItems="center"
            >
              <QRCode
                color={lightTheme.colors.text}
                value={route.params.short_id}
                size={widthPercentageToDP('60')}
                logoBackgroundColor="#FFF"
              />
            </Box>
          </Box>
        </ViewShot>

        <Box width={1} paddingHorizontal={20} mt={32}>
          <TouchableOpacity
            style={{
              backgroundColor: lightTheme.colors.blue100,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
            }}
            onPress={() => {
              onShare();
            }}
          >
            <Icons
              name="share"
              color={lightTheme.colors.textWhite}
              style={{ marginRight: 12 }}
            />
            <Text style={{ color: lightTheme.colors.textWhite }}>
              Compartilhar
            </Text>
          </TouchableOpacity>
        </Box>
      </ModalContentContainer>
    </Box>
  );
}
