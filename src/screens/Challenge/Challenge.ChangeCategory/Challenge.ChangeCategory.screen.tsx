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
  useChangeSubscriptionCategoryMutation,
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
  'Challenge.ChangeCategory'
>;

type ChallengeChangeAddressToReceiveNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.ChangeCategory'
>;

type Props = {
  route: ChallengeChangeAddressToReceiveRouteProp;
  navigation: ChallengeChangeAddressToReceiveNavigationProp;
};

const ChallengeChangeCategory: React.FC<Props> = ({ route, navigation }) => {
  const categorySelected = useStoreState(
    (state) => state.challenge.categorySelected,
  );
  const setCategorySelected = useStoreActions(
    (actions) => actions.challenge.setCategorySelected,
  );

  const [awardOptions, setAwardOptions] = useState<number>(0);

  const [
    changeSubscriptionCategoryMutation,
    { loading },
  ] = useChangeSubscriptionCategoryMutation({
    onCompleted: () => {
      setCategorySelected(
        route.params.data.getChallengeDetail.challenge_categories[awardOptions]
          .id,
      );
      navigation.goBack();
    },
    onError: (e) => console.log('error', e.message),
  });

  useEffect(() => {
    if (route.params.data.getChallengeDetail.challenge_categories) {
      route.params.data.getChallengeDetail.challenge_categories.map(
        (category, i) => {
          if (category.id === categorySelected) {
            setAwardOptions(i);
          }
        },
      );
    }
  }, [route.params.data]);

  const userProfile = useStoreState((state) => state.profile.payload);

  const saveCategory = async () => {
    console.log('Data: ', {
      challenge_category_id:
        route.params.data.getChallengeDetail.challenge_categories[awardOptions]
          .id,
      user_challenge_id:
        route.params.data.getChallengeDetail.user_challenges[0].id,
    });
    changeSubscriptionCategoryMutation({
      variables: {
        data: {
          challenge_category_id:
            route.params.data.getChallengeDetail.challenge_categories[
              awardOptions
            ].id,
          user_challenge_id:
            route.params.data.getChallengeDetail.user_challenges[0].id,
        },
      },
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
        <TitleText style={{ fontSize: 20 }}>Categorias</TitleText>
        <View style={{ width: 20 }} />
      </PaymentStatusContainer>
      <ScrollView>
        <View style={{ marginTop: 16, paddingBottom: 40 }}>
          <PaymentStatusContainer color="#FFF">
            <TitleText style={{ fontSize: 20 }}>
              Categorias disponíveis
            </TitleText>
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
                {route.params.data.getChallengeDetail.challenge_categories.map(
                  (category, i) => (
                    <RadioButton
                      labelHorizontal
                      key={category.id}
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: 'rgba(22, 28, 37, 0.2)',
                        borderBottomWidth:
                          route.params.data?.getChallengeDetail
                            .challenge_categories.length -
                            1 ===
                          i
                            ? 0
                            : 0.5,
                        paddingVertical: 24,
                      }}
                    >
                      {/*  You can set RadioButtonLabel before RadioButtonInput */}
                      <RadioButtonInput
                        obj={category}
                        index={i}
                        initial={awardOptions}
                        isSelected={awardOptions === i}
                        onPress={() => setAwardOptions(i)}
                        borderWidth={0.5}
                        buttonInnerColor={
                          awardOptions === i ? '#0564FF' : '#000'
                        }
                        buttonOuterColor={
                          awardOptions === i
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
                        key={category.id}
                        onPress={() => setAwardOptions(i)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginLeft: 16,
                          width: widthPercentageToDP('78'),
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 20,
                              lineHeight: 23,
                              width: widthPercentageToDP('38'),
                              fontFamily: 'NeuzeitGro-Bol',
                            }}
                            numberOfLines={2}
                          >
                            {category.name}
                          </Text>
                        </View>

                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <View>
                            {category.category_configuration
                              .distance_goal_value ? (
                              <View>
                                  <Text
                                  style={{
                                    opacity: 0.56,
                                    fontSize: 14,
                                    fontFamily: 'NeuzeitGro-Lig',
                                  }}
                                >
                                  Distância
                                </Text>
                                  <Text
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 16.1,
                                    fontFamily: 'NeuzeitGro-Lig',
                                  }}
                                >
                                  {category.category_configuration
                                    .distance_goal_value / 1000}
                                  km
                                </Text>
                                </View>
                            ) : null}
                          </View>

                          <View
                            style={{
                              height: 26,
                              borderLeftColor: '#161C25',
                              borderLeftWidth: 0.5,
                              marginHorizontal: 16,
                            }}
                          />

                          <View>
                            {category.category_configuration
                              .altimetry_goal_value ? (
                              <View>
                                  <Text
                                  style={{
                                    opacity: 0.56,
                                    fontSize: 14,
                                    fontFamily: 'NeuzeitGro-Lig',
                                  }}
                                >
                                  Altimetria
                                </Text>
                                  <Text
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 16.1,
                                    fontFamily: 'NeuzeitGro-Lig',
                                  }}
                                >
                                  {
                                    category.category_configuration
                                      .altimetry_goal_value
                                  }
                                  m
                                </Text>
                                </View>
                            ) : null}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </RadioButton>
                  ),
                )}
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
              disabled={loading}
              onPress={() => saveCategory()}
            >
              {loading ? (
                <ActivityIndicator color="#0564FF" />
              ) : (
                <>
                  <Icons name="switch" style={{ marginRight: 5 }} />
                  <Text style={{ color: '#0564ff', marginTop: 8 }}>
                    Trocar Categoria
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

export default ChallengeChangeCategory;
