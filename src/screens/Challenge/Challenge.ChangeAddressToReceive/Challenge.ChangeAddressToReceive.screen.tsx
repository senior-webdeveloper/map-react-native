import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import styled from 'styled-components/native';
import { Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useStoreState, useStoreActions } from '~/store';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  GetChallengeDetailDocument,
  useGetChallengeWithdrawalAddressesLazyQuery,
  useUpdateWithdrawalAddressMutation,
} from '~/graphql/autogenerate/hooks';

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

type ChallengeChangeAddressToReceiveRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.ChangeAddressToReceive'
>;

type ChallengeChangeAddressToReceiveNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.ChangeAddressToReceive'
>;

type Props = {
  route: ChallengeChangeAddressToReceiveRouteProp;
  navigation: ChallengeChangeAddressToReceiveNavigationProp;
};

const ChallengeChangeAddressToReceive: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const withdrawStates = useStoreState(
    (state) => state.withdrawalAddress.payload,
  );
  const saveWithdraw = useStoreActions(
    (actions) => actions.withdrawalAddress.createWithdraw,
  );
  const [
    getChallengeWithdrawalAddresses,
    { data, loading },
  ] = useGetChallengeWithdrawalAddressesLazyQuery();
  const [addressOptions, setAddressOptions] = useState<number>(0);
  const [
    updateWithdrawalAddressMutation,
    { loading: loadingUpdate },
  ] = useUpdateWithdrawalAddressMutation({
    onCompleted: (e) => {
      saveWithdraw(data?.getChallengeWithdrawalAddresses[addressOptions]);
      navigation.goBack();
    },
  });

  useEffect(() => {
    data?.getChallengeWithdrawalAddresses.map((address, i) => {
      if (address.id === withdrawStates?.id) {
        setAddressOptions(i);
      }
    });
  }, [data?.getChallengeWithdrawalAddresses]);

  const userProfile = useStoreState((state) => state.profile.payload);

  useEffect(() => {
    if (route.params.data.getChallengeDetail.id) {
      getChallengeWithdrawalAddresses({
        variables: {
          data: {
            challenge_id: route.params.data.getChallengeDetail.id,
          },
        },
      });
    }
  }, [
    getChallengeWithdrawalAddresses,
    route.params.data.getChallengeDetail.id,
  ]);

  const saveAddress = async () => {
    const dataVariables = {
      challenge_id: route.params.data.getChallengeDetail.id,
      challenge_withdrawal_address_id:
        data?.getChallengeWithdrawalAddresses[addressOptions].id,
      user_id: userProfile?.getProfile.user_id,
    };

    const { data: banana, errors } = await updateWithdrawalAddressMutation({
      variables: {
        data: {
          challenge_id: route.params.data.getChallengeDetail.id,
          challenge_withdrawal_address_id:
            data?.getChallengeWithdrawalAddresses[addressOptions].id,
          user_id: userProfile?.getProfile.user_id,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GetChallengeDetailDocument,
          variables: {
            data: {
              id: route.params.data.getChallengeDetail.id,
              profile_id: userProfile?.getProfile.id,
            },
          },
        },
      ],
    });
  };

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
        <TitleText style={{ fontSize: 20 }}>Local de Retirada</TitleText>
        <View style={{ width: 20 }} />
      </PaymentStatusContainer>
      <ScrollView>
        <View style={{ marginTop: 16, paddingBottom: 40 }}>
          <PaymentStatusContainer color="#FFF">
            <TitleText style={{ fontSize: 20 }}>Locais disponíveis</TitleText>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {loading && (
                <View
                  style={{
                    marginVertical: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <ActivityIndicator size="large" color="#0564FF" />
                </View>
              )}
              <RadioForm
                formHorizontal={false}
                animation
                style={{ width: '100%' }}
              >
                {/* To create radio buttons, loop through your array of options */}
                {data?.getChallengeWithdrawalAddresses.map((address, i) => (
                  <RadioButton
                    labelHorizontal
                    key={address.id}
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomColor: 'rgba(22, 28, 37, 0.2)',
                      borderBottomWidth:
                        data?.getChallengeWithdrawalAddresses.length - 1 === i
                          ? 0
                          : 0.5,
                      paddingVertical: 24,
                    }}
                  >
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={address}
                      index={i}
                      initial={addressOptions}
                      isSelected={addressOptions === i}
                      onPress={() => setAddressOptions(i)}
                      borderWidth={0.5}
                      buttonInnerColor={
                        addressOptions === i ? '#0564FF' : '#000'
                      }
                      buttonOuterColor={
                        addressOptions === i
                          ? '#0564FF'
                          : 'rgba(135, 149, 173, 0.64)'
                      }
                      buttonSize={14}
                      buttonOuterSize={24}
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: 10 }}
                    />
                    <TouchableOpacity
                      hitSlop={{ left: 10, right: 10, top: 24, bottom: 24 }}
                      activeOpacity={0.7}
                      key={address.id}
                      onPress={() => setAddressOptions(i)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginLeft: 16,
                        width: widthPercentageToDP('78'),
                      }}
                    >
                      <View>
                        <Text style={{ width: widthPercentageToDP('58') }}>
                          {address.name}
                        </Text>
                        <Text
                          style={{
                            width: widthPercentageToDP('75'),
                            opacity: 0.56,
                          }}
                        >
                          {address.address_line_one}, {address.address_line_two}
                        </Text>
                        <Text
                          style={{
                            width: widthPercentageToDP('75'),
                            opacity: 0.56,
                          }}
                        >
                          {address.city?.name}
                          {' - '}
                          {address.city?.state.abbreviation}, CEP:{' '}
                          {address.zip_code}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </RadioButton>
                ))}
              </RadioForm>
            </View>

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
              disabled={loading || loadingUpdate}
              onPress={() => saveAddress()}
            >
              {loading || loadingUpdate ? (
                <ActivityIndicator color="#0564FF" />
              ) : (
                <>
                  <Icons name="switch" style={{ marginRight: 5 }} />
                  <Text style={{ color: '#0564ff', marginTop: 8 }}>
                    Trocar local de retirada
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </PaymentStatusContainer>
        </View>
      </ScrollView>
      <View />
    </View>
  );
};

export default ChallengeChangeAddressToReceive;
