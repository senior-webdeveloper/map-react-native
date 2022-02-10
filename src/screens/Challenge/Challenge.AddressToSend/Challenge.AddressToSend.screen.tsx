import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar, TouchableOpacity, View, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';
import { format } from 'date-fns';
import { Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useStoreState, useStoreActions } from '~/store';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  GetChallengeDetailDocument,
  useMarkSubscriptionAsWithdrawnMutation,
} from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';

export const SuccessTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.green};
`;

export const ErrorTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.red};
`;

export const AwaitTitle = styled(TitleText)<StatsProps>`
  font-size: 16px;
  color: ${({ color }) => color};
`;

interface StatsProps {
  color: string;
}
export const PaymentStatusContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  elevation: 10;
  /* Shadow try 1 */
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
  padding-top: 12px;
  padding-bottom: 21px;
  padding-horizontal: 16px;
`;
export const StatsCard = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: flex-end;
`;
export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  width: 97%;
  padding: 18px 19px;
`;

export const Description = styled(Text)`
  font-size: 20px;
  line-height: 23px;
`;

export const MinorDescription = styled(Text)`
  font-size: 14px;
  line-height: 16.1px;
  opacity: 0.56;
  margin-top: 16px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.AddressToSend'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.AddressToSend'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const ChallengeAddressToSend: React.FC<Props> = ({ route, navigation }) => {
  const userProfile = useStoreState((state) => state.profile.payload);
  const { userID, profileID } = useUserToken();
  const withdrawAddress = useStoreState(
    (state) => state.withdrawalAddress.payload,
  );
  const withdrawAward = useStoreState((state) => state.challenge.withdrawAward);
  const setWithdrawAward = useStoreActions(
    (actions) => actions.challenge.setWithdrawAward,
  );
  const withdrawDate = useStoreState((state) => state.challenge.withdrawDate);
  const setWithdrawDate = useStoreActions(
    (actions) => actions.challenge.setWithdrawDate,
  );

  const [markSubscriptionAsWithdrawnMutation, { loading }] =
    useMarkSubscriptionAsWithdrawnMutation({
      onCompleted: (e) => {
        setWithdrawAward(true);
        setWithdrawDate(
          format(
            new Date(e.markSubscriptionAsWithdrawn.withdrawal_date),
            "dd'/'MM'/'yyyy",
          ),
        );
      },
    });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingHorizontal: 16,
          paddingTop: 60,
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
        <TitleText style={{ fontSize: 20 }}>
          {route.params.data.getChallengeDetail.user_challenges[0]
            .withdrawal_address
            ? 'Retirada no Local'
            : 'Endereço de entrega'}
        </TitleText>
        <View style={{ width: 20 }} />
      </PaymentStatusContainer>
      <ScrollView>
        <View style={{ marginTop: 16, paddingBottom: 40 }}>
          <PaymentStatusContainer
            color="#FFF"
            style={{ marginBottom: 16, alignItems: 'center', paddingTop: 20 }}
          >
            {withdrawAward ||
            route.params.data.getChallengeDetail.user_challenges[0]
              .ready_to_withdraw ? (
              route.params.data.getChallengeDetail.user_challenges[0]
                .withdrawal_date ? (
                <Icons name="award-send-done" />
              ) : (
                <Icons name="award-send-done" />
              )
            ) : (
              <Icons name="award-send-await" />
            )}

            <TitleText style={{ fontSize: 16, marginTop: 19, marginBottom: 4 }}>
              {route.params.data.getChallengeDetail.user_challenges[0]
                .ready_to_withdraw
                ? route.params.data.getChallengeDetail.user_challenges[0]
                    .withdrawal_date || withdrawAward
                  ? 'Retirado'
                  : 'Disponível para Retirada'
                : 'Em andamento'}
            </TitleText>
            {withdrawDate ? (
              <Text
                style={{
                  color: 'rgba(22, 28, 37, 0.56)',
                  fontSize: 14,
                  lineHeight: 16,
                }}
              >
                ({withdrawDate})
              </Text>
            ) : null}

            <Text
              style={{
                color: 'rgba(22, 28, 37, 0.56)',
                fontSize: 14,
                lineHeight: 16,
              }}
            >
              {route.params.data.getChallengeDetail.user_challenges[0]
                .ready_to_withdraw
                ? route.params.data.getChallengeDetail.user_challenges[0]
                    .withdrawal_date || withdrawAward
                  ? 'Seu kit já foi retirado, se inscreva em outros desafios para ter acesso a produtos exclusivos!'
                  : 'Vá até o ponto de retirada para resgatar seu kit.'
                : '  A disponibilidade do seu kit se encontra em andamento. Assim que disponível, lhe enviaremos uma notificação para retirar seu kit.'}
            </Text>
          </PaymentStatusContainer>
          <PaymentStatusContainer color="#FFF">
            <TitleText style={{ fontSize: 20, marginTop: 4 }}>
              {route.params.data.getChallengeDetail.user_challenges[0]
                .withdrawal_address
                ? 'Retirada no Local'
                : 'Dados de entrega'}
            </TitleText>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              {withdrawAddress ? (
                <View>
                  <Text style={{ width: widthPercentageToDP('58') }}>
                    {withdrawAddress.name}
                  </Text>
                  <Text
                    style={{ width: widthPercentageToDP('58'), opacity: 0.56 }}
                  >
                    {withdrawAddress.address_line_one},{' '}
                    {withdrawAddress.address_line_two},{' '}
                    {`${withdrawAddress.name} - `}
                    {withdrawAddress.city?.state.abbreviation}
                  </Text>
                  <Text style={{ opacity: 0.56 }}>
                    CEP: {withdrawAddress.zip_code}
                  </Text>

                  {!withdrawAward &&
                  route.params.data.getChallengeDetail.user_challenges[0]
                    .ready_to_withdraw ? (
                    !route.params.data.getChallengeDetail.user_challenges[0]
                      .withdrawal_date ? (
                      <TouchableOpacity
                        disabled={loading}
                        style={{
                          borderColor: '#0564ff',
                          borderWidth: 1,
                          borderRadius: 8,
                          paddingBottom: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 25,
                          width: widthPercentageToDP('90'),
                        }}
                        onPress={() => {
                          markSubscriptionAsWithdrawnMutation({
                            variables: {
                              data: {
                                challenge_id: route.params.challenge_id,
                                subscription_user_id: userID,
                                user_id_who_marked_the_withdraw: userID,
                              },
                            },
                            awaitRefetchQueries: true,
                            refetchQueries: [
                              {
                                query: GetChallengeDetailDocument,
                                variables: {
                                  data: {
                                    id: route.params.challenge_id,
                                    profile_id: profileID,
                                  },
                                },
                              },
                            ],
                          });
                        }}
                      >
                        {loading ? (
                          <ActivityIndicator color="#0564ff" />
                        ) : (
                          <>
                            <Icons
                              name="check"
                              style={{ marginRight: 5, color: '#0564ff' }}
                            />
                            <Text style={{ color: '#0564ff', marginTop: 8 }}>
                              Já retirei o item
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : null
                  ) : (
                    <>
                      {!withdrawAward ? (
                        <TouchableOpacity
                          style={{
                            borderColor: '#0564ff',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingBottom: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 25,
                            width: widthPercentageToDP('90'),
                          }}
                          onPress={() => {
                            navigation.navigate(
                              'Challenge.ChangeAddressToReceive',
                              {
                                ...route.params,
                              },
                            );
                          }}
                        >
                          <Icons name="switch" style={{ marginRight: 5 }} />
                          <Text style={{ color: '#0564ff', marginTop: 8 }}>
                            Trocar local de retirada
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                </View>
              ) : (
                <View>
                  <Text style={{ width: widthPercentageToDP('58') }}>
                    {userProfile?.getProfile.user.address_line_one},{' '}
                    {userProfile?.getProfile.user.address_line_two},{' '}
                    {userProfile?.getProfile.user.city?.name}/
                    {userProfile?.getProfile.user.city?.state.abbreviation}
                  </Text>
                  <Text style={{ opacity: 0.56 }}>
                    CEP: {userProfile?.getProfile.user.zip_code}
                  </Text>
                </View>
              )}
            </View>
          </PaymentStatusContainer>
        </View>
      </ScrollView>
      <View />
    </View>
  );
};

export default ChallengeAddressToSend;
