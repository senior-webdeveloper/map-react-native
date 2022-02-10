import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { space, layout, flexbox, color, border } from 'styled-system';
import styled from 'styled-components/native';
import { format, formatDistance } from 'date-fns';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import { ActivityIndicator } from 'react-native-paper';
import { NetworkStatus } from '@apollo/client';
import { Subscription } from '@apollo/client/react/components';
import { Icons, SafeAreaView, Text, TitleText } from '~/components';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import {
  useFindAllUsersCurrentPointLazyQuery,
  useFindEventSupportPointsLazyQuery,
  useSubscriptionsWithAwardAlreadyWithdrawnLazyQuery,
} from '~/graphql/autogenerate/hooks';
import locale from '~/helpers/dateLocale';
import { UserChallenges } from '~/graphql/autogenerate/schemas';

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsersInEventPoints'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsersInEventPoints'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const Box = styled(View)(
  // { marginRight: 20 },
  space,
  layout,
  flexbox,
  color,
  border,
);

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
`;

const categoryColors = [
  '#0564FF',
  '#DB4AD9',
  '#F9F871',
  '#715AF1',
  '#DA38A9',
  '#298C8A',
  '#BFA975',
  '#EC0039',
  '#6BFBCE',
  '#2D2E4B',
  '#FEFAE0',
];

export default function ChallengeListUsersInEventPoints({
  route,
  navigation,
}: Props): JSX.Element {
  const [usersInWithdrawAward, setUsersInWithdraward] = useState<
    UserChallenges[]
  >();
  const [fetch, { data: eventPoints }] = useFindEventSupportPointsLazyQuery();
  const [
    fetchPersons,
    {
      data: dataWithoutFilter,
      networkStatus: personsNetwork,
      loading: loadingAward,
    },
  ] = useSubscriptionsWithAwardAlreadyWithdrawnLazyQuery({
    notifyOnNetworkStatusChange: true,
  });
  const [
    findAllUsersCurrentPoint,
    { data, refetch, loading, networkStatus },
  ] = useFindAllUsersCurrentPointLazyQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (e) => console.log('completou', e),
  });

  useEffect(() => {
    console.log(
      'page: ',
      dataWithoutFilter?.subscriptionsWithAwardAlreadyWithdrawn.page_info
        .current_page,
    );
    if (
      dataWithoutFilter?.subscriptionsWithAwardAlreadyWithdrawn.page_info
        .current_page === 1
    ) {
      setUsersInWithdraward(
        dataWithoutFilter?.subscriptionsWithAwardAlreadyWithdrawn.subscriptions,
      );
    } else if (usersInWithdrawAward && usersInWithdrawAward.length > 0) {
      setUsersInWithdraward([
        ...usersInWithdrawAward,
        ...(dataWithoutFilter?.subscriptionsWithAwardAlreadyWithdrawn
          .subscriptions ?? []),
      ]);
    }
  }, [dataWithoutFilter]);

  useEffect(() => {
    findAllUsersCurrentPoint({
      variables: {
        challenge_id: route.params.challenge_id,
      },
    });
    fetch({
      variables: {
        challenge_id: route.params.challenge_id,
      },
    });
    fetchPersons({
      variables: {
        challenge_id: route.params.challenge_id,
        pagination: {
          page: 1,
          offset: 20,
        },
      },
    });
  }, [route.params]);

  useEffect(() => {
    if (data && data.findAllUsersCurrentPoint) {
      const elements = new Array(data?.findAllUsersCurrentPoint.length).fill(0);

      const offsets = elements.map((el, index) =>
        index === 0 ? 0 : (widthPercentageToDP('80') - 20) * index,
      );
    }
  }, [data]);

  return (
    <SafeAreaView style={{ backgroundColor: '#F8FAFB', flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingTop: Platform.OS === 'ios' ? 65 : 65,
          paddingHorizontal: 16,
          paddingBottom: 15,
          marginTop: -50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          style={{ width: 60 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TitleText style={{ fontSize: 20 }}>Tempo Real</TitleText>
        </View>

        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          style={{ alignItems: 'center', width: 60 }}
          disabled={loading || networkStatus === NetworkStatus.loading}
          onPress={() => {
            if (refetch) {
              console.log('refresh');
              refetch();
              fetchPersons({
                variables: {
                  challenge_id: route.params.challenge_id,
                  pagination: {
                    page: 1,
                    offset: 20,
                  },
                },
              });
            }
          }}
        >
          {loading ||
          networkStatus === NetworkStatus.loading ||
          personsNetwork === NetworkStatus.loading ? (
            <ActivityIndicator color="#0564FF" />
          ) : (
            <Text style={{ color: '#4595EC' }}>Atualizar</Text>
          )}
        </TouchableOpacity>
      </PaymentStatusContainer>

      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingVertical: 29,
          flex: 1,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginTop: 16,
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          snapToOffsets={eventPoints?.findEventSupportPoints.map(
            (element, index) =>
              index === 0
                ? 0
                : index > 1
                ? index === 2
                  ? widthPercentageToDP('85') * index + 16
                  : widthPercentageToDP('85') * index + 32
                : widthPercentageToDP('85'),
          )}
          horizontal
          pagingEnabled
          decelerationRate="fast"
        >
          <Box
            width={widthPercentageToDP('85')}
            borderRadius={12}
            style={{
              marginLeft: 16,
            }}
            alignItems="center"
            paddingHorizontal={10}
          >
            <Box width={1} alignItems="center" mb={19}>
              <Text style={{ fontSize: 24, lineHeight: 24, color: '#4595EC' }}>
                Kits Retirados
              </Text>
            </Box>

            <FlatList
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              style={{
                width: widthPercentageToDP('85'),
                height: heightPercentageToDP('85'),
                backgroundColor: '#F8FAFB',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 14,
                paddingBottom: 100,
              }}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              onEndReached={() => {
                if (
                  dataWithoutFilter?.subscriptionsWithAwardAlreadyWithdrawn
                    .page_info.has_next_page
                ) {
                  console.log('fetch more bitchs!');
                  fetchPersons({
                    variables: {
                      challenge_id: route.params.challenge_id,
                      pagination: {
                        page:
                          dataWithoutFilter
                            .subscriptionsWithAwardAlreadyWithdrawn.page_info
                            .current_page + 1,
                        offset: 20,
                      },
                    },
                  });
                }
              }}
              data={usersInWithdrawAward?.filter(
                (el) =>
                  !data?.findAllUsersCurrentPoint.some(
                    (x) => el.short_id === x.subscription.short_id,
                  ),
              )}
              renderItem={({ item: subscription }) => (
                <Box
                  borderRadius={12}
                  paddingVertical={8}
                  flexDirection="row"
                  // width={1}
                  alignItems="center"
                >
                  <FastImage
                    source={{
                      uri: `${PUBLIC_STORAGE}/${subscription.user.profile?.profile_avatar}`,
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      backgroundColor: '#FFF',
                      marginRight: 16,
                      borderColor: subscription.category?.order
                        ? categoryColors[subscription.category?.order]
                        : 0,
                      borderWidth: subscription.category?.order ? 2 : 0,
                    }}
                  />
                  <Box>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width={widthPercentageToDP('63')}
                      height={20}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          width: widthPercentageToDP('45'),
                        }}
                        numberOfLines={1}
                      >
                        {`${subscription.user.firstname} ${subscription.user.lastname}`}
                      </Text>

                      <Text style={{ color: '#009D33', fontSize: 14 }}>
                        {format(new Date(subscription.withdrawal_date), 'pp', {
                          locale,
                        })}
                      </Text>
                    </Box>

                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width={widthPercentageToDP('63')}
                      height={20}
                    >
                      <Text
                        style={{
                          color: 'rgba(22, 28, 37, 0.4)',
                          fontSize: 14,
                        }}
                      >
                        {subscription.athlete_identification
                          ? `${subscription.athlete_identification} - `
                          : null}
                        {subscription.category?.name}
                      </Text>
                      <Text
                        style={{
                          color: 'rgba(22, 28, 37, 0.4)',
                          fontSize: 14,
                        }}
                      >
                        {format(new Date(subscription.withdrawal_date), 'P', {
                          locale,
                        })}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            />
          </Box>
          {eventPoints?.findEventSupportPoints.map((element, index) => (
            <Box
              width={widthPercentageToDP('85')}
              borderRadius={12}
              style={{
                marginLeft: index === 0 ? 16 : 16,
                marginRight:
                  index === eventPoints?.findEventSupportPoints.length - 1
                    ? 16
                    : 0,
              }}
              alignItems="center"
              paddingHorizontal={10}
            >
              <Box width={1} alignItems="center" mb={19}>
                <Text
                  style={{ fontSize: 24, lineHeight: 24, color: '#4595EC' }}
                >
                  {element.name}
                </Text>
              </Box>

              <ScrollView
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                style={{
                  width: widthPercentageToDP('85'),
                  height: heightPercentageToDP('85'),
                  backgroundColor: '#F8FAFB',
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 14,
                  paddingBottom: 100,
                }}
                contentContainerStyle={{
                  paddingBottom: 20,
                }}
              >
                {data?.findAllUsersCurrentPoint
                  .filter((el) => el.event_support_point_id === element.id)
                  .map((currentPoint) => (
                    <Box
                      borderRadius={12}
                      paddingVertical={8}
                      flexDirection="row"
                      // width={1}
                      alignItems="center"
                    >
                      <FastImage
                        source={{
                          uri: `${PUBLIC_STORAGE}/${currentPoint.subscription.user.profile?.profile_avatar}`,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 40,
                          backgroundColor: '#FFF',
                          marginRight: 16,
                          borderColor: currentPoint.subscription.category?.order
                            ? categoryColors[
                                currentPoint.subscription.category?.order
                              ]
                            : 0,
                          borderWidth: currentPoint.subscription.category?.order
                            ? 2
                            : 0,
                        }}
                      />
                      <Box>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                          width={widthPercentageToDP('63')}
                          height={20}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              width: widthPercentageToDP('45'),
                            }}
                            numberOfLines={1}
                          >
                            {`${currentPoint.subscription.user.firstname} ${currentPoint.subscription.user.lastname}`}
                          </Text>

                          <Text style={{ color: '#009D33', fontSize: 14 }}>
                            {format(new Date(currentPoint.check_time), 'pp', {
                              locale,
                            })}
                          </Text>
                        </Box>

                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                          width={widthPercentageToDP('63')}
                          height={20}
                        >
                          <Text
                            style={{
                              color: 'rgba(22, 28, 37, 0.4)',
                              fontSize: 14,
                            }}
                          >
                            {currentPoint.subscription.athlete_identification
                              ? `${currentPoint.subscription.athlete_identification} - `
                              : null}
                            {currentPoint.subscription.category?.name}
                          </Text>
                          <Text
                            style={{
                              color: 'rgba(22, 28, 37, 0.4)',
                              fontSize: 14,
                            }}
                          >
                            {format(new Date(currentPoint.check_time), 'P', {
                              locale,
                            })}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </ScrollView>
            </Box>
          ))}
        </ScrollView>
      </PaymentStatusContainer>
    </SafeAreaView>
  );
}
