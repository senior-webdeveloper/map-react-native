import { isFuture, isPast } from 'date-fns';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ModalComponent from 'react-native-modal';
import {
  ChallengeAwards,
  Maybe,
  UserChallenges,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';
import * as Styled from '~/screens/Challenge/Challenge.Description/components/MainScreen/styles';
import { Box, Icons, Text, Typography } from '~/components';
import {
  Challenge,
  ChallengeCategories,
  EventSubscriptionPriceType,
  EventSupportPointType,
  ProductImageType,
  ProductPriceType,
  ProductType,
  ProductVariationType,
} from '~/generated/graphql';
import { RootStackParamList } from '~/routes.types';
import { useUserToken } from '~/hooks';
import {
  GetChallengeDetailQuery,
  GetSubscriptionProgressQuery,
} from '~/graphql/autogenerate/operations';
import { lightTheme } from '~/global/themes';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useStoreState } from '~/store';
import { colorsOfSubscriptions } from '~/screens/Challenge/Challenge.MyPayment/Challenge.MyPayment.screen';
import { ModalContentContainer } from '~/screens/Challenge/Challenge.MyPayment/Styles';

export function MySubscriptionInformation({
  user_challenges,
  data,
  saveWithdraw,
  navigation,
  subscribe,
  categorySelected,
}: {
  user_challenges: UserChallenges;
  data: GetChallengeDetailQuery;
  categorySelected?: string;
}) {
  const profile = useStoreState((state) => state.profile.payload);
  const [modalState, setModalState] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        saveWithdraw(user_challenges.withdrawal_address);
        navigation.push('Challenge.MyPayment', {
          user_challenge_id: user_challenges.id,
          challenge_id: data.getChallengeDetail.id,
          physical_event: data.getChallengeDetail.physical_event,
          data,
          subscribe,
          last_payment_id: user_challenges.last_payment_id,
          categorySelected,
        });
      }}
    >
      <Styled.BoxContainer
        style={{ paddingHorizontal: 16, marginTop: 16, paddingVertical: 16 }}
      >
        <Box
          flexDirection="row"
          width={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={() => setModalState(true)}>
              <Box
                borderColor={lightTheme.colors.text}
                borderWidth={3}
                borderRadius={4}
                p={2}
                mr={30}
              >
                <QRCode
                  color={lightTheme.colors.text}
                  value={user_challenges.short_id}
                  size={widthPercentageToDP('20')}
                  logoBackgroundColor="#FFF"
                />
              </Box>
            </TouchableOpacity>

            <Box
              alignSelf="stretch"
              justifyContent="center"
              // backgroundColor="red"
            >
              <Typography
                type="small"
                style={{
                  fontSize: 14,
                  lineHeight: 16,
                  color: 'rgba(22, 28, 37, 0.56)',
                }}
              >
                {profile?.getProfile.user.firstname}{' '}
                {profile?.getProfile.user.lastname}
              </Typography>
              <Typography
                type="h1"
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  lineHeight: 16,
                  color: 'rgba(22, 28, 37, 0.56)',
                }}
              >
                {data.getChallengeDetail.challenge_categories &&
                  data.getChallengeDetail.challenge_categories
                    .filter((el) => el.id === categorySelected)
                    .map((el) => el.name)}
                {/* {categorySelected} */}
                {/* {user_challenges.category?.name} */}
              </Typography>

              <Typography
                type="small"
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  lineHeight: 16,
                  width: widthPercentageToDP('50'),

                  color:
                    colorsOfSubscriptions[
                      user_challenges &&
                      user_challenges?.subscription_status &&
                      user_challenges?.subscription_status
                        ?.status_description &&
                      user_challenges?.subscription_status?.status_description
                        .code
                        ? user_challenges.subscription_status
                            ?.status_description.code
                        : 0
                    ],
                }}
              >
                {user_challenges &&
                user_challenges.subscription_status &&
                user_challenges.subscription_status?.status_description &&
                user_challenges.subscription_status?.status_description
                  .translations &&
                user_challenges.subscription_status?.status_description
                  .translations[0].name
                  ? user_challenges.subscription_status?.status_description
                      .translations[0].name
                  : 'Em Análise'}
              </Typography>

              <Typography type="h2" color="blue100">
                {user_challenges.short_id}
              </Typography>
            </Box>
          </Box>

          <Icons name="chevron-right" color="#4595EC" />
        </Box>

        <ModalComponent
          isVisible={modalState}
          onBackdropPress={() => {
            setModalState(false);
          }}
          useNativeDriver
          backdropTransitionOutTiming={0}
          useNativeDriverForBackdrop
        >
          {modalState ? (
            <ModalContentContainer>
              <Box mb={2} alignItems="flex-end" width="100%">
                <TouchableOpacity
                  onPress={() => setModalState(false)}
                  hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
                >
                  <Icons name="close" style={{ marginRight: 12 }} />
                </TouchableOpacity>
              </Box>

              <Text
                style={{
                  fontFamily: 'NeuzeitGro-Bol',
                  fontSize: 20,
                  lineHeight: 20,
                }}
              >
                Minha inscrição
              </Text>

              <Box marginVertical={20} alignItems="center">
                <Text
                  style={{
                    fontFamily: 'NeuzeitGro-Bol',
                    color: 'rgba(22, 28, 37, 0.4)',
                    lineHeight: 16,
                  }}
                >
                  {user_challenges.short_id}
                </Text>
              </Box>

              <Box width={widthPercentageToDP('90')} alignItems="center">
                <Box
                  borderColor={lightTheme.colors.text}
                  borderWidth={3}
                  borderRadius={4}
                  p={21}
                  alignItems="center"
                >
                  <QRCode
                    color={lightTheme.colors.text}
                    value={user_challenges.short_id}
                    size={widthPercentageToDP('60')}
                    logoBackgroundColor="#FFF"
                  />
                </Box>
              </Box>

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
                    setModalState(false);
                    navigation.navigate('Challenge.ShareSubscription', {
                      data,
                      short_id: user_challenges.short_id,
                    });
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
          ) : null}
        </ModalComponent>
      </Styled.BoxContainer>
    </TouchableOpacity>
  );
}
