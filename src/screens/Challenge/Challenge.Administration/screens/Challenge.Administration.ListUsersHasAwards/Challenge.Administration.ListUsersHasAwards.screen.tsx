import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  Alert,
  Dimensions,
  RefreshControl,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { NetworkStatus } from '@apollo/client';
import { setUser } from '@sentry/react-native';
import {
  Checkbox,
  Icons,
  SafeAreaView,
  Text,
  TitleText,
  ImageZoom,
} from '~/components';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import {
  AdvancedFiltersToFindSubscriptionsInput,
  SubscriptionsPaginatedResponse,
  UserChallenges,
} from '~/graphql/autogenerate/schemas';
import { useSubscriptionsWithAwardAlreadyWithdrawnLazyQuery } from '~/graphql/autogenerate/hooks';
import { clearUndefinedOrEmpty } from '~/helpers/clearUndefinedOrEmpty';
import networkStatus from '~/store/model/network';

export const Container = styled.ScrollView`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  background-color: transparent;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const Title = styled(TitleText)``;
export const Subtitle = styled(TitleText)`
  font-size: 20px;
  line-height: 20px;
`;
export const SeeAllText = styled(Text)`
  text-transform: uppercase;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  color: rgba(22, 28, 37, 0.5);
`;
export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 16px;
`;
export const MenuItemWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export const MenuItemBox = styled.View`
  background: #ffffff;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  width: 100px;
  height: 100px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;
export const MenuItem = styled.View`
  margin-top: 24px;
  align-items: center;
`;
export const MenuItemText = styled(Text)`
  font-size: 12px;
  margin-top: 12px;
`;
export const FeedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const FeedItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 30px 10px;
  padding: 12px 10px;
  background: #ffffff;
  border-radius: 16px;

  box-shadow: -40px 20px 40px rgba(255, 255, 255, 0.235522);
`;
export const FeedItemName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const FeedDescritionText = styled(Text)``;
export const FeedTimeText = styled(Text)`
  color: rgba(22, 28, 37, 0.6);
`;
export const FeedTextContainer = styled.View``;
export const FeedWrapper = styled.View`
  align-items: flex-start;
  flex-direction: row;
`;
export const Avatar = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  margin-right: 10px;
`;
export const FeedChalengeImage = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 8px;
`;
export const EventsItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 30px;
  padding: 17px 24px 22px 24px;
  background: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 16px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;

export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  border-radius: 8px;
  max-height: 40%;
  align-items: center;
  padding: 8%;
  justify-content: space-between;
`;
export const ModalButton = styled.View`
  background: #0564ff;
  border-radius: 3px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
`;
export const ModalHeaderText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
`;
export const ModalDescriptionText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;
export const ModalButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: ${({ theme }) => theme.colors.textWhite};
  text-align: center;
`;
export const CompanyButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
export const CompanyAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  margin-right: 15px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsersHasAwards'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsersHasAwards'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const { width } = Dimensions.get('window');
const ViewTypes = {
  FULL: 0,
};
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 86;
    },
  );

function ListUsersHasAwards({ route, navigation }: Props): JSX.Element {
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const [users, setUsers] = useState<SubscriptionsPaginatedResponse>();
  const [
    fetch,
    { data, loading, error },
  ] = useSubscriptionsWithAwardAlreadyWithdrawnLazyQuery({
    onCompleted: (e) => console.log('e', e),
    onError: (e) => console.log('error: ', e.message),
  });

  useEffect(() => {
    if (data?.subscriptionsWithAwardAlreadyWithdrawn) {
      if (
        users &&
        users.subscriptions &&
        data?.subscriptionsWithAwardAlreadyWithdrawn.page_info.current_page > 1
      ) {
        if (
          data.subscriptionsWithAwardAlreadyWithdrawn.page_info.current_page >
          users.page_info.current_page
        ) {
          console.log('Buscando a pagina 2');
          setUsers({
            page_info: data.subscriptionsWithAwardAlreadyWithdrawn.page_info,
            subscriptions: [
              ...users.subscriptions,
              ...data.subscriptionsWithAwardAlreadyWithdrawn.subscriptions,
            ],
          });
          setDataProvider(
            dataProviderMaker([
              ...users.subscriptions,
              ...data.subscriptionsWithAwardAlreadyWithdrawn.subscriptions,
            ]),
          );
        }
      } else if (
        !users ||
        data.subscriptionsWithAwardAlreadyWithdrawn.page_info.current_page === 1
      ) {
        setUsers(data?.subscriptionsWithAwardAlreadyWithdrawn);
        setDataProvider(
          dataProviderMaker(
            data.subscriptionsWithAwardAlreadyWithdrawn.subscriptions,
          ),
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (users?.subscriptions) {
      setDataProvider(dataProviderMaker(users?.subscriptions));
    }
  }, [users]);

  useEffect(() => {
    if (route.params.challenge_id) {
      fetch({
        variables: {
          pagination: {
            page: 1,
            offset: 20,
          },
          challenge_id: route.params.challenge_id,
        },
      });
    }
  }, [route.params]);

  const onEndReached = async () => {
    if (
      data?.subscriptionsWithAwardAlreadyWithdrawn.page_info.has_next_page &&
      users &&
      users?.page_info.current_page >= 1
    ) {
      fetch({
        variables: {
          pagination: {
            page:
              data?.subscriptionsWithAwardAlreadyWithdrawn.page_info
                .current_page + 1,
            offset: 20,
          },
          challenge_id: route.params.challenge_id,
        },
      });
    }
  };

  const RenderItemCall = (type: string, el: UserChallenges, index: number) => {
    return (
      <TouchableOpacity
        disabled={!route.params.findUserSubscription}
        onPress={() => {
          navigation.navigate('Challenge.Administration.UserInformation', {
            ...route.params,
            subscription_id: String(el.short_id),
            user_subscribe_id: el.id,
          });
        }}
        activeOpacity={route.params.findUserSubscription ? 0.5 : 1}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <View>
          <ImageZoom
            source={{
              uri: `${PUBLIC_STORAGE}/${el.user.profile?.profile_avatar}`,
            }}
            uri={{
              uri: `${PUBLIC_STORAGE}/${el.user.profile?.profile_avatar}`,
            }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text>
            {el.user.firstname} {el.user.lastname}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {el.paid ? (
              <View
                style={{
                  borderColor: '#A9CB00',
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ color: '#A9CB00' }}>
                  {el.paid ? 'Pago' : 'Nao Pago'}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#F8FAFB', flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <HeaderContainer>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" />
        </TouchableOpacity>

        <Subtitle>Todos os Inscritos</Subtitle>

        <View style={{ width: 30 }} />
      </HeaderContainer>

      {loading && !users?.subscriptions ? (
        <ActivityIndicator color="#0564FF" size="large" />
      ) : (
        <RecyclerListView
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={RenderItemCall}
          onEndReached={onEndReached}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={loading} onRefresh={() => {}} />
            ),
            contentContainerStyle: {
              paddingHorizontal: 8,
            },
          }}
        />
      )}
    </SafeAreaView>
  );
}

export default ListUsersHasAwards;
