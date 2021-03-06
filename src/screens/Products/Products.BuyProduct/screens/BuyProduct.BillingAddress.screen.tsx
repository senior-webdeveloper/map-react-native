import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInputMask } from 'react-native-masked-text';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import styled from 'styled-components/native';
import { captureException } from '@sentry/react-native';
import * as Yup from 'yup';
import { isDate, parse } from 'date-fns';
import Analytics from 'appcenter-analytics';
import { useRecoilValue } from 'recoil';
import { Card } from '~/graphql/autogenerate/schemas';
import { Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import {
  GetProfileDocument,
  useCreateCardMutation,
  useGetCardsQuery,
  useSubscribeUserChallengeMutation,
  useUpdateProfilePersonalMutation,
  useCalculateInstallmentsLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { SubscribeContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreActions, useStoreState } from '~/store';
import { useUserInfo, useUserToken } from '~/hooks';
import CheckBox from '~/components/Checkbox';
import validateCpf from '~/helpers/validateCpf';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

export const OptionImage = styled(FastImage)``;
export const OptionImageContainer = styled.View`
  width: ${widthPercentageToDP('92')}px;
  height: ${widthPercentageToDP('60')}px;
  background-color: #ffffff;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  elevation: 5;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  PaymentAwardRootParamList,
  'selectAddress'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
  'selectAddress'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function SelectAddress({
  route,
  navigation,
}: Props): JSX.Element {
  const cartStatus = useRecoilValue(_cartStatus);
  const { data, award_index, rootNavigation } = route.params;
  const userProfile = useStoreState(({ profile }) => profile.payload);
  const [awardOptions, setAwardOptionStep] = useState<number>(0);
  const addAdditionalRequest = useStoreActions(
    (actions) => actions.chart.createAditionalRequest,
  );
  const storeAditionalRequests = useStoreState(
    (actions) => actions.chart.aditionalRequests,
  );
  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );

  const setIsOnPurchase = useStoreActions(
    (actions) => actions.chart.setIsOnPurchase,
  );
  const chart = useStoreState((state) => state.chart.payload);

  const setSelectedAwards = useStoreActions(
    (actions) => actions.chart.setSelectedAwards,
  );
  const selectedAwards = useStoreState((state) => state.chart.selectedAwards);

  function verifiyEditable() {
    if (
      storeAditionalRequests &&
      storeAditionalRequests.length > 0 &&
      storeAditionalRequests[awardOptions]
    ) {
      return !storeAditionalRequests[awardOptions].hasSelected;
    }
    return true;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <View>
        <View style={{ marginVertical: 15, paddingTop: 50 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          <TitleText>Endere??o de cobran??a</TitleText>
          <Text style={{ opacity: 0.56 }}>
            Essa informa????o ser?? utilizada para gerar um pagamento v??lido.
          </Text>
        </View>

        {userProfile?.getProfile.user.city &&
        userProfile?.getProfile.user.street_number &&
        userProfile?.getProfile.user.zip_code &&
        userProfile?.getProfile.user.address_line_one ? (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.push('personalInformation', { ...route.params });
              }}
              style={{
                marginTop: 48,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={{ width: widthPercentageToDP('58') }}>
                  {userProfile?.getProfile.user.address_line_one},{' '}
                  {userProfile?.getProfile.user.street_number},{' '}
                  {userProfile?.getProfile.user.address_line_two.length > 1
                    ? userProfile?.getProfile.user.address_line_two
                    : null}
                  {userProfile?.getProfile.user.city?.name}/
                  {userProfile?.getProfile.user.city?.state.abbreviation}
                </Text>
                <Text style={{ opacity: 0.56 }}>
                  CEP: {userProfile?.getProfile.user.zip_code}
                </Text>
              </View>
              <Icons name="chevron-right" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  if (userProfile && userProfile.getProfile) {
                    rootNavigation.navigate('User.EditProfileAddress', {
                      ...userProfile.getProfile,
                    });
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#161C25',
                  borderRadius: 16,
                  paddingVertical: 3,
                  paddingHorizontal: 16,
                  marginTop: 16,
                }}
              >
                <Text>Editar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 25 }}>
            <TouchableOpacity
              onPress={() => {
                if (userProfile && userProfile.getProfile) {
                  rootNavigation.navigate('User.EditProfileAddress', {
                    ...userProfile.getProfile,
                  });
                }
              }}
              style={{
                borderWidth: 1,
                borderColor: '#161C25',
                borderRadius: 16,
                paddingVertical: 3,
                paddingHorizontal: 16,
                marginTop: 16,
              }}
            >
              <Text>Atualizar endere??o</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <SubscribeContainer
          style={{
            elevation: 10,
            width: widthPercentageToDP('100'),
            paddingTop: 35,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text>Voc?? pagar??</Text>
          {cartStatus ? (
            <Text style={{ fontSize: 12 }}>
              R${' '}
              <TitleText style={{ fontSize: 24 }}>
                {route.params.installments ? (
                  <>
                    {route.params.installments.installments_quantity}x{' '}
                    {!Number.isInteger(
                      route.params.installments.installment_value,
                    )
                      ? String(
                          Number(
                            route.params.installments.installment_value,
                          ).toFixed(2),
                        ).replace('.', ',')
                      : route.params.installments.installment_value}
                  </>
                ) : (
                  <>
                    {!Number.isInteger(cartStatus.totalWithoutSub)
                      ? String(
                          Number(cartStatus.totalWithoutSub).toFixed(2),
                        ).replace('.', ',')
                      : cartStatus.totalWithoutSub}
                  </>
                )}
              </TitleText>
            </Text>
          ) : null}
        </SubscribeContainer>
      </View>
    </View>
  );
}
