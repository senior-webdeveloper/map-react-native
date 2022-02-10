import React, { useState } from 'react';
import {
  ListRenderItem,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import { PUBLIC_STORAGE } from '@env';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import { atom, useSetRecoilState } from 'recoil';
import { Box, Icons, Typography } from '~/components';
import {
  ModalButton,
  ModalButtonText,
  ModalContainer,
  ModalDescriptionText,
  ModalHeaderText,
  TermsOfUse,
} from '~/components/EmailSigninComponent/styles';
import { translate } from '~/locales';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { ChallengeAwards } from '~/generated/graphql';
import formatCurrency from '~/helpers/formatCurrency';
import { selectedAwardAtom } from '~/screens/Challenge/Challenge.Description/components/ModalizeComponent';
import { ChallengeDescriptionNavigationProp } from '~/screens/Challenge/Challenge.Description/components/BuyModal';

interface FreemiumCallModalProps {
  canShowModal: boolean;
  data: GetChallengeDetailQuery;
  navigation: ChallengeDescriptionNavigationProp;
}

export const AwardImage = styled(FastImage).attrs({
  resizeMode: 'contain',
})`
  width: ${widthPercentageToDP('80')}
  height: ${widthPercentageToDP('40')}
`;

export const isBuyingAfterCompleted = atom({
  key: 'isBuyingAfterCompleted',
  default: false,
});

export function FreemiumCallModal({
  canShowModal,
  data,
  navigation,
}: FreemiumCallModalProps): JSX.Element {
  const setIsBuyingAfterCompleted = useSetRecoilState(isBuyingAfterCompleted);
  const [modalState, setModalState] = useState(canShowModal);
  const [selectedAwardIndex, setSelectedAwardIndex] = useState(0);
  const [currentAward, setCurrentAward] = useState<ChallengeAwards>();
  const setSelectedAward = useSetRecoilState(selectedAwardAtom);

  const handleElements = () => {
    console.log(currentAward);
    setSelectedAward({
      id: currentAward.id,
      price: currentAward.price,
    });
    navigation.push('Challenge.PaymentAward', {
      data,
      award_index:
        data.getChallengeDetail.awards[
          data.getChallengeDetail.awards?.findIndex(
            (el) => el.id === currentAward.id,
          )
        ],
      firstElementId: 0,
      has_subscription: false,
      award_id: currentAward.id,
    });
  };

  function RenderItemModalize(
    { item, index }: ListRenderItem<ChallengeAwards>,
    setSelectedAward,
    data: GetChallengeDetailQuery,
  ): JSX.Element {
    if (selectedAwardIndex === index) {
      setCurrentAward(item);
    }
    return (
      <Box
        backgroundColor="#F8FAFB"
        height={heightPercentageToDP('50')}
        borderRadius={12}
        overflow="hidden"
        justifyContent="space-between"
      >
        <Box px={3} paddingBottom={3} paddingTop={24} flexDirection="row">
          <Icons name="award-medal" />
          <Typography marginLeft={12} type="h4">
            {item.name}
          </Typography>
        </Box>

        <Box as={ScrollView} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {item.awards_products.map(({ product }) => (
            <Box
              backgroundColor="white"
              borderRadius={8}
              py={2}
              px={2}
              mb={3}
              flexDirection="row"
            >
              <Box marginRight={2}>
                <FastImage
                  source={{
                    uri: `${PUBLIC_STORAGE}/${product.images[0].link}`,
                  }}
                  style={{ width: 53, height: 53 }}
                />
              </Box>
              <Box>
                <Typography type="h4">{product.name}</Typography>

                <Box flexDirection="row" width={widthPercentageToDP('48')}>
                  <Icons name="award-medal-two" style={{ marginTop: 3 }} />
                  <Typography color="#A1A8B1" marginLeft={1}>
                    Modelo Exclusivo do Desafio
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Box flexDirection="row" justifyContent="space-between" py={16} px={18}>
          <Typography color="#A1A8B1">Valor Total:</Typography>
          <Typography>{formatCurrency(item.price)}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Modal
      isVisible={modalState}
      onBackdropPress={() => setModalState((prevState) => !prevState)}
      useNativeDriver
      backdropTransitionOutTiming={0}
    >
      <Box backgroundColor="white" borderRadius={12}>
        <Box flexDirection="row" justifyContent="space-between" pt={24} px={3}>
          <Typography type="h1" lineHeight={32}>
            Parabéns,{'\n'}desafio concluído!
          </Typography>

          <Box m={2}>
            <Icons name="close" />
          </Box>
        </Box>

        <Box flexDirection="row" justifyContent="space-between" pt={2} px={3}>
          <Typography>
            Você concluiu o{' '}
            <Typography type="h4">{data.getChallengeDetail.name}</Typography>
            {'\n'}que tal guardar esse desafio além da memória?{'\n'}Veja os
            kits exclusivos do evento:
          </Typography>
        </Box>

        <Carousel
          // data={awards.filter((el) => el.price > 0)}
          data={data.getChallengeDetail.awards?.filter(
            (el) => !el.only_for_draw && el.price > 0,
          )}
          removeClippedSubviews={false}
          renderItem={(props) =>
            RenderItemModalize(props, handleElements, data)
          }
          itemHeight={heightPercentageToDP('50')}
          sliderWidth={widthPercentageToDP('90')}
          sliderHeight={heightPercentageToDP('50')}
          itemWidth={widthPercentageToDP('75')}
          onSnapToItem={(index) => setSelectedAwardIndex(index)}
          loop
        />

        <Box
          backgroundColor="black"
          py={14}
          px={24}
          as={TouchableOpacity}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          borderBottomLeftRadius={12}
          borderBottomRightRadius={12}
          mt={3}
          onPress={() => {
            setIsBuyingAfterCompleted(true);
            handleElements(data.getChallengeDetail.awards[selectedAwardIndex]);
            setModalState(false);
          }}
        >
          <Typography color="white">Configure seu kit</Typography>

          <Icons name="arrow_forward" color="white" />
        </Box>
      </Box>

      <Box
        alignItems="center"
        mt={3}
        flexDirection="row"
        justifyContent="center"
        as={TouchableOpacity}
      >
        <Typography color="white" marginRight={3}>
          Não exibir novamente
        </Typography>
        <Icons name="close" color="white" />
      </Box>
    </Modal>
  );
}
