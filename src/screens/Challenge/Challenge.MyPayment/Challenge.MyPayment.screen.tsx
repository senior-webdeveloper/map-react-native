import React, { useEffect, useRef, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as Sentry from '@sentry/react-native';
import { isFuture, isPast } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-simple-toast';
import {
  Box,
  Button,
  Icons,
  SafeAreaView,
  Text,
  TitleText,
} from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useGetPaymentsOfASubscriptionLazyQuery } from '~/graphql/autogenerate/hooks';
import {
  RetrieveSubscriptionPaymentsInput,
  SubscriptionPayment,
} from '~/graphql/autogenerate/schemas';
import { useOfflinePayments, useUserToken } from '~/hooks';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { lightTheme } from '~/global/themes';
import { useStoreActions, useStoreState } from '~/store';
import Payments from './components/Payments';
import Buys from './components/Buys';
import { PaymentStatusContainer } from '~/screens/Challenge/Challenge.MyPayment/Styles';
import { sumTwoNumber } from '~/screens/Challenge/Challenge.MyPayment/SumTwoNumber';
import { LoadingComponent } from '~/screens/Challenge/Challenge.MyPayment/components/LoadingComponent';
import { DetailedSubscriptionComponent } from '~/screens/Challenge/Challenge.MyPayment/components/DetailedSubscriptionComponent';
import { ModalContainerComponent } from '~/screens/Challenge/Challenge.MyPayment/components/ModalContainerComponent';
import { SubscribeContainer } from '~/screens/Awards/Awards.Description/Awards.Description.styles';
import { GetPaymentsOfASubscriptionQuery } from '~/graphql/autogenerate/operations';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.MyPayment'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.MyPayment'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

type Tabs = 'detailed' | 'payments' | 'buyed';
const COLORS = {
  green: '#009D33',
  red: '#FF2525',
  yellow: '#FFC502',
  purple: '#612F74',
};
export const colorsOfSubscriptions = {
  SUB_PAID4: COLORS.yellow,
  SUB_PAID3: COLORS.yellow,
  SUB_PAID7: COLORS.red,
  SUB_PAID5: COLORS.red,
  SUB_FREE2: COLORS.red,
  SUB_PAID1: COLORS.green,
  SUB_PAID8: COLORS.green,
  SUB_FREE1: COLORS.green,
  SUB_PAID10: COLORS.green,
  SUB_PAID9: COLORS.purple,
  SUB_PAID6: COLORS.purple,
};

const ChallengeMyPayment: React.FC<Props> = ({ route, navigation }) => {
  const {
    handleGetLocalPayments,
    handleRealmSavePayment,
    subscription,
    localLoading,
  } = useOfflinePayments();
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );

  const categorySelected = useStoreState(
    (actions) => actions.challenge.categorySelected,
  );

  const panel = useRef<ActionSheet>();
  const scrollView = useRef<ScrollView>(null);
  const profile = useStoreState((state) => state.profile.payload);
  const [tab, setTab] = useState<Tabs>('detailed');
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { userinfo } = useUserToken();
  const userinfoStore = useStoreState((state) => state.profile.payload);
  const svg = useRef<QRCode>(null);
  const dataRetrieveSubscriptionPaymentsInput: RetrieveSubscriptionPaymentsInput =
    {
      user_challenge_id: route.params!.user_challenge_id,
    };
  const [lastPayment, setLastPayment] = useState<SubscriptionPayment>();
  const [data, setData] = useState<GetPaymentsOfASubscriptionQuery>();
  const [getPayments] = useGetPaymentsOfASubscriptionLazyQuery({
    onError: (e) => {
      Sentry.captureException(e);
      Alert.alert('Erro no Find Payment:', e.message);
      setLoading(false);
    },
    onCompleted: (e) => {
      console.log('completou: ', e.getPaymentsOfASubscription);
      setData(e);
      handleRealmSavePayment(e, route.params!.user_challenge_id);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (route.params.user_challenge_id) {
      if (networkIsConnected) {
        console.log('chamou', route.params!.user_challenge_id);
        getPayments({
          variables: {
            data: {
              user_challenge_id: route.params!.user_challenge_id,
            },
          },
        });
      } else {
        handleGetLocalPayments(route.params.user_challenge_id);
      }
    }
  }, [route.params!.user_challenge_id]);

  useEffect(() => {
    if (subscription && !data) {
      setData(subscription);
    }
  }, [subscription]);

  useEffect(() => {
    if (data?.getPaymentsOfASubscription) {
      console.log('payments: ', data.getPaymentsOfASubscription);
      const filteredPayment = data.getPaymentsOfASubscription.filter(
        (el) => el.payment_id === route.params.last_payment_id,
      );

      if (filteredPayment && filteredPayment.length > 0) {
        setLastPayment(filteredPayment[0]);
      }
    }
  }, [data]);

  if (!data) {
    return <LoadingComponent onPress={() => navigation.goBack()} />;
  }

  function OnPressFunction(index: number) {
    if (index === 0) {
      if (
        userinfoStore?.getProfile.user.staff ||
        (route.params.data.getChallengeDetail.has_categories &&
          !isPast(
            new Date(
              route.params.data.getChallengeDetail.end_date_registration,
            ),
          ) &&
          !isFuture(
            new Date(
              route.params.data.getChallengeDetail.start_date_registration,
            ),
          ) &&
          !isPast(
            new Date(
              route.params.data.getChallengeDetail.configuration?.deadline_category_change,
            ),
          ) &&
          route.params.data.getChallengeDetail.configuration
            ?.allows_category_change)
      ) {
        navigation.push('Challenge.ChangeCategory', {
          user_challenge_id:
            route.params.data.getChallengeDetail.user_challenges[0].id,
          data: route.params.data,
        });
      } else {
        Toast.show(
          'Esta ação encontra-se indisponível no momento',
          Toast.SHORT,
        );
      }
    } else if (index === 1) {
      navigation.navigate('Challenge.ShareSubscription', {
        data: route.params.data,
        short_id:
          route.params.data.getChallengeDetail.user_challenges[0].short_id,
      });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingTop: 50,
          paddingHorizontal: 16,
          paddingBottom: 15,
          marginTop: -40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TitleText style={{ fontSize: 20 }}>Minha inscrição</TitleText>
          {route.params.data.getChallengeDetail.user_challenges &&
          route.params.data.getChallengeDetail.user_challenges[0]
            .subscription_status &&
          route.params.data.getChallengeDetail.user_challenges[0]
            .subscription_status?.status_description &&
          route.params.data.getChallengeDetail.user_challenges[0]
            .subscription_status?.status_description.translations[0].name ? (
            <Text style={{ fontSize: 14, marginTop: -10 }}>
              {`(${route.params.data.getChallengeDetail.user_challenges[0].subscription_status?.status_description.translations[0].name})`}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => panel.current.show()}
          style={{ width: 20, alignItems: 'flex-end' }}
        >
          <Icons name="dots-vertical" />
        </TouchableOpacity>
      </PaymentStatusContainer>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ paddingBottom: 50, height: heightPercentageToDP('85') }}
      >
        <PaymentStatusContainer
          color="#FFF"
          style={{ marginTop: 16, paddingVertical: 26 }}
        >
          <Box flexDirection="row" width={1} px={16}>
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
                  ref={svg}
                  value={
                    route.params.data.getChallengeDetail.user_challenges[0]
                      .short_id
                  }
                  size={widthPercentageToDP('20')}
                  logoBackgroundColor="#FFF"
                />
              </Box>
            </TouchableOpacity>

            <Box alignSelf="stretch">
              <Text style={{ fontSize: 20, lineHeight: 20 }}>
                {profile?.getProfile.user.firstname}{' '}
                {profile?.getProfile.user.lastname}
              </Text>

              <Box
                flexDirection="row"
                alignSelf="stretch"
                justifyContent="space-between"
                mt={2}
              >
                <Box mr={40}>
                  <Text>Cod. Inscrição</Text>
                  <Text
                    style={{
                      fontFamily: 'NeuzeitGro-Bol',
                      color: 'rgba(22, 28, 37, 0.4)',
                      lineHeight: 16,
                    }}
                  >
                    {
                      route.params.data.getChallengeDetail.user_challenges[0]
                        .short_id
                    }
                  </Text>
                </Box>

                <Box>
                  <Text>Status</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      width: 100,
                      color:
                        colorsOfSubscriptions[
                          route.params.data.getChallengeDetail
                            .user_challenges &&
                          route.params.data.getChallengeDetail
                            .user_challenges[0] &&
                          route.params.data.getChallengeDetail
                            .user_challenges[0].subscription_status &&
                          route.params.data.getChallengeDetail
                            .user_challenges[0].subscription_status
                            ?.status_description &&
                          route.params.data.getChallengeDetail
                            .user_challenges[0].subscription_status
                            ?.status_description.code
                            ? route.params.data.getChallengeDetail
                                .user_challenges[0].subscription_status
                                ?.status_description.code
                            : 0
                        ],
                    }}
                  >
                    {route.params.data.getChallengeDetail.user_challenges &&
                    route.params.data.getChallengeDetail.user_challenges[0]
                      .subscription_status &&
                    route.params.data.getChallengeDetail.user_challenges[0]
                      .subscription_status?.status_description &&
                    route.params.data.getChallengeDetail.user_challenges[0]
                      .subscription_status?.status_description.translations &&
                    route.params.data.getChallengeDetail.user_challenges[0]
                      .subscription_status?.status_description.translations[0]
                      .name
                      ? route.params.data.getChallengeDetail.user_challenges[0]
                          .subscription_status?.status_description
                          .translations[0].name
                      : 'Em Análise'}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box width={1} mt={32} px={3}>
            <Box borderColor="rgba(223, 232, 237, 0.6)" borderWidth="1" />
          </Box>

          <ScrollView
            ref={scrollView}
            horizontal
            contentContainerStyle={{ paddingVertical: 13 }}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                scrollView.current.scrollTo(0, 0);
                setTab('detailed');
              }}
            >
              <Text
                style={{
                  marginLeft: 16,
                  marginRight: 32,
                  fontSize: tab === 'detailed' ? 20 : 16,
                  fontFamily:
                    tab === 'detailed' ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Lig',
                  color:
                    tab === 'detailed'
                      ? lightTheme.colors.blue100
                      : 'rgba(22, 28, 37, 0.56)',
                }}
              >
                Detalhe da Inscrição
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                scrollView.current.scrollTo(0, 200);
                setTab('payments');
              }}
            >
              <Text
                style={{
                  marginRight: 32,
                  fontSize: tab === 'payments' ? 20 : 16,
                  fontFamily:
                    tab === 'payments' ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Lig',
                  color:
                    tab === 'payments'
                      ? lightTheme.colors.blue100
                      : 'rgba(22, 28, 37, 0.56)',
                }}
              >
                Pagamento
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                scrollView.current.scrollTo(0, 200);
                setTab('buyed');
              }}
            >
              <Text
                style={{
                  marginRight: 32,
                  fontSize: tab === 'buyed' ? 20 : 16,
                  fontFamily:
                    tab === 'buyed' ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Lig',
                  color:
                    tab === 'buyed'
                      ? lightTheme.colors.blue100
                      : 'rgba(22, 28, 37, 0.56)',
                }}
              >
                Compra
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <Box width={1} px={3}>
            <Box borderColor="rgba(223, 232, 237, 0.6)" borderWidth="1" />
          </Box>

          {tab === 'detailed' ? (
            <DetailedSubscriptionComponent
              params={route.params}
              userinfoStore={userinfoStore}
              onPress={() => {
                panel.current.show();
              }}
              onPress1={() => {
                if (profile && profile.getProfile) {
                  navigation.navigate('User.EditProfileMain', {
                    ...profile?.getProfile,
                  });
                }
              }}
              profile={profile}
            />
          ) : null}

          {lastPayment ? (
            <>
              {tab === 'payments' ? (
                <Box>
                  <Payments
                    navigation={navigation}
                    route={{
                      params: {
                        lastPayment: lastPayment.payment,
                        data: route.params.data,
                        payment_id: lastPayment.payment.id,
                        payment_historic: data?.getPaymentsOfASubscription,
                        award: lastPayment.award,
                        challenge_id: route.params.challenge_id,
                        interest_free_amount:
                          lastPayment.payment.interest_free_amount,
                        value: lastPayment.payment.value,
                      },
                    }}
                  />
                </Box>
              ) : null}

              {tab === 'buyed' ? (
                <Box>
                  <Buys
                    route={{
                      params: {
                        physical_event: route.params.physical_event,
                        award: lastPayment.award,
                        value: sumTwoNumber(
                          route.params.data.getChallengeDetail
                            .user_challenges[0].amount_paid,
                          route.params.data.getChallengeDetail
                            .user_challenges[0].amount_to_pay,
                        ),

                        data: route.params.data,
                      },
                    }}
                  />
                </Box>
              ) : null}
            </>
          ) : null}
        </PaymentStatusContainer>

        <PaymentStatusContainer
          color="#FFF"
          style={{ marginTop: 16, paddingHorizontal: 16 }}
        >
          {!route.params.physical_event && (
            <TouchableOpacity
              onPress={() => {
                navigation.push('Challenge.AddressToSend', {
                  ...route.params,
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(22, 28, 37, 0.19)',
              }}
            >
              <Text>
                {route.params.data.getChallengeDetail.user_challenges[0]
                  .withdrawal_address
                  ? 'Retirada no Local'
                  : 'Endereço de entrega'}
              </Text>
              <Icons name="chevron-right" />
            </TouchableOpacity>
          )}
        </PaymentStatusContainer>
      </ScrollView>

      <View />

      <ActionSheet
        ref={panel}
        title="O que gostaria de fazer ?"
        options={['Trocar Categoria', 'Compartilhar Inscrição', 'Cancelar']}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={OnPressFunction}
      />

      <ModalContainerComponent
        visible={modalState}
        onBackdropPress={() => {
          setModalState(false);
        }}
        onPress={() => setModalState(false)}
        params={route.params}
        navigation={navigation}
        ref={svg}
      />

      {lastPayment?.payment.status === 'refused' && networkIsConnected ? (
        <SubscribeContainer style={{ position: 'absolute', bottom: 0 }}>
          <Button
            name="Trocar forma de pagamento"
            style={{ marginTop: 0 }}
            onPress={() => {
              route.params.subscribe();
            }}
          />
        </SubscribeContainer>
      ) : null}
    </SafeAreaView>
  );
};

export default ChallengeMyPayment;
