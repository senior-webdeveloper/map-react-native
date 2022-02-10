import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import Carousel from 'react-native-snap-carousel';
import {
  Alert,
  Linking,
  ListRenderItem,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import styled from 'styled-components';
import HTML from 'react-native-render-html';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import analytics from '@react-native-firebase/analytics';
import { ActivityIndicator } from 'react-native-paper';
import {
  Box,
  Icons,
  ImageZoom,
  SafeAreaView,
  TitleText,
  Typography,
} from '~/components';
import { ChallengeAwards } from '~/generated/graphql';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import formatCurrency from '~/helpers/formatCurrency';
import { SmallText } from '~/screens/Awards/Awards.Description/Awards.Description.screen';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { ChallengeDescriptionNavigationProp } from '~/screens/Challenge/Challenge.Description/components/BuyModal';
import { UserEventExtraordinaryActionType } from '~/graphql/autogenerate/schemas';
import { userIsSubscribed } from '~/screens/Challenge/Challenge.Description/components/MainScreen';
import { useSubscribeUserChallengeMutation } from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';

interface ModalizeComponentProps {
  data: GetChallengeDetailQuery;
  navigation: ChallengeDescriptionNavigationProp;
  modalizeRef: any;
  extraordinaryActions?: UserEventExtraordinaryActionType;
}

interface SelectAwardProps {
  id: string;
  price: number;
}

export const selectedAwardAtom = atom<SelectAwardProps>({
  key: 'selectedAward',
  default: null,
});

export const showModalizeBottomButton = atom({
  key: 'showModalizeBottomButton',
  default: true,
});

export function ModalizeComponent({
  data,
  navigation,
  modalizeRef,
  extraordinaryActions,
}: ModalizeComponentProps): JSX.Element {
  const { profileID, userID } = useUserToken();
  const showBottomButton = useRecoilValue(showModalizeBottomButton);
  console.log('showBottomButton: ', showBottomButton);
  const setUserIsSubscribed = useSetRecoilState(userIsSubscribed);
  const [elements, setElements] = useState([]);
  const setSelectedAward = useSetRecoilState(selectedAwardAtom);
  const [subscribeUserChallengeMutation, { loading }] =
    useSubscribeUserChallengeMutation({
      onError: (e) => {
        Alert.alert('Erro', e.message);

        setUserIsSubscribed(false);
        modalizeRef.current.close();
      },
      onCompleted: () => {
        setUserIsSubscribed(true);

        navigation.push('Challenge.SubscribedWithoutMonitors', {
          challenge_type: data?.getChallengeDetail.challenge_type,
          challenge_id: data.getChallengeDetail.id,
          end_date: data.getChallengeDetail.end_date,
          start_date: data.getChallengeDetail.start_date,
        });
        modalizeRef.current.close();
      },
    });

  useEffect(() => {
    setElements(data.getChallengeDetail.awards.filter((el) => el.price > 0));
  }, [data]);

  const handleElements = (item, index) => {
    setSelectedAward({
      id: item.id,
      price: item.price,
    });
    modalizeRef.current.close();
    navigation.push('Challenge.PaymentAward', {
      data,
      award_index: index,
      firstElementId: 0,
      has_subscription: false,
      extraordinaryActions,
      award_id: item.id,
    });
  };

  const handleSubscribeUserWithoutKit = async () => {
    console.log('variable: ', {
      data: {
        challenge_id: data?.getChallengeDetail.id,
        registration_date: new Date(),
        profile_id: profileID,
      },
    });
    await subscribeUserChallengeMutation({
      variables: {
        data: {
          challenge_id: data?.getChallengeDetail.id,
          registration_date: new Date(),
          profile_id: profileID,
        },
      },
    });
    await analytics().logEvent('subscribe_free_challenge', {
      challenge_id: data?.getChallengeDetail.id,
      profile_id: profileID,
    });
  };

  return (
    <Box
      flex={1}
      // height={heightPercentageToDP('80')}
      alignItems="center"
      justifyContent="center"
      backgroundColor="blue"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
    >
      <Box
        width={1}
        p={3}
        mt={2}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography type="h3" color="white">
            Kit do desafio
          </Typography>
          <Typography
            color="white"
            type="awardCarouselLabel"
            lineHeight={16}
            fontSize={12}
          >
            Guarde o desafio além da memória, compre agora{'\n'}mesmo o kit do
            desafio {data.getChallengeDetail.name}
          </Typography>
        </Box>

        <Box
          paddingRight={2}
          as={TouchableOpacity}
          onPress={() => {
            modalizeRef.current.close();
          }}
        >
          <Icons name="close" width={14} height={14} color="white" />
        </Box>
      </Box>

      {elements && elements.length > 0 ? (
        <Carousel
          // data={awards.filter((el) => el.price > 0)}
          data={elements}
          removeClippedSubviews={false}
          renderItem={(props) =>
            RenderItemModalize(props, handleElements, loading, data)
          }
          itemHeight={heightPercentageToDP('70')}
          sliderWidth={widthPercentageToDP('100')}
          sliderHeight={heightPercentageToDP('70')}
          itemWidth={widthPercentageToDP('85')}
          loop
        />
      ) : null}
      <Box width={1} height={20} />
      {!data.getChallengeDetail.configuration?.is_paid && showBottomButton ? (
        <Box
          as={TouchableOpacity}
          backgroundColor="white"
          width={1}
          py={14}
          px={24}
          flexDirection="row"
          justifyContent="space-between"
          onPress={() => {
            handleSubscribeUserWithoutKit();
          }}
          disabled={loading}
        >
          <Typography color="#0564FF">Continuar sem o Kit</Typography>

          {loading ? (
            <ActivityIndicator color="#0564FF" />
          ) : (
            <Icons name="arrow_forward" color="#0564FF" />
          )}
        </Box>
      ) : null}
    </Box>
  );
}

export const AwardImage = styled(FastImage).attrs({
  resizeMode: 'contain',
})`
  width: ${widthPercentageToDP('80')}
  height: ${widthPercentageToDP('40')}
`;

export function RenderItemModalize(
  { item, index }: ListRenderItem<ChallengeAwards>,
  setSelectedAward,
  loading,
  data: GetChallengeDetailQuery,
): JSX.Element {
  return (
    <Box
      backgroundColor="white"
      height={heightPercentageToDP('65')}
      borderRadius={12}
      overflow="hidden"
      justifyContent="space-between"
    >
      <Box>
        <AwardImage
          source={{ uri: `${PUBLIC_STORAGE}/${item.awardsImages[0].link}` }}
        />
        <Box px={3} mt={3}>
          <Typography type="h3">{item.name}</Typography>
          <Typography>Compre agora mesmo seu Kit do desafio!</Typography>

          <ScrollView style={{ height: heightPercentageToDP('25') }}>
            {item.awards_products.map((el) => (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                px={2}
                py={3}
                borderBottomColor="#A1A8B1"
                borderBottomWidth={0.5}
                alignItems="center"
              >
                <Box>
                  <Typography color="#0564FF">{el.product.name}</Typography>
                  <Typography type="small" color="#A1A8B1">
                    Descriptor
                  </Typography>
                </Box>
                <Icons name="check" color="#0564FF" />
              </Box>
            ))}
            {/* <AwardDescription description={item.description} /> */}
          </ScrollView>
        </Box>
      </Box>

      <Box
        backgroundColor="black"
        py={14}
        px={24}
        as={TouchableOpacity}
        disabled={(item.price < 1 && !item.only_for_draw) || loading}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        onPress={() => setSelectedAward(item, index)}
      >
        <Typography color="white">
          Total: {formatCurrency(item.price)}
        </Typography>

        <Icons name="arrow_forward" color="white" />
      </Box>
    </Box>
  );
}
