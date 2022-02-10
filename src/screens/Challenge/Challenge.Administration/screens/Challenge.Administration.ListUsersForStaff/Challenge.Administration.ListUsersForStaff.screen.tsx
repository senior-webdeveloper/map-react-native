import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
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
import ActionSheet from 'react-native-actionsheet';
import {
  Checkbox,
  Icons,
  SafeAreaView,
  Text,
  TitleText,
  ImageZoom,
  Box,
  Typography,
} from '~/components';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import {
  AdvancedFiltersToFindSubscriptionsInput,
  SubscriptionsPaginatedResponse,
  UserChallenges,
} from '~/graphql/autogenerate/schemas';
import {
  useDeleteAssociationUserWithCompanyMutation,
  useGetSubscriptionsOfAChallengeLazyQuery,
  useListCompanyUsersLazyQuery,
  useListCompanyUsersQuery,
} from '~/graphql/autogenerate/hooks';
import { clearUndefinedOrEmpty } from '~/helpers/clearUndefinedOrEmpty';
import networkStatus from '~/store/model/network';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useUserToken } from '~/hooks';

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

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsers'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsers'
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
      dim.height = 66;
    },
  );

function ListUsersForStaff({ route, navigation }: Props): JSX.Element {
  const panel = useRef<ActionSheet>();
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);
  const { userID } = useUserToken();
  const refSelectedUserID = useRef('');
  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const [selectedUserID, setSelectedUserID] = useState('');
  const [users, setUsers] = useState<SubscriptionsPaginatedResponse>();
  const [fetch, { data, loading, error }] = useListCompanyUsersLazyQuery({
    onCompleted: (e) => console.log(e),
  });
  const [deleteAssociationUserWithCompanyMutation, { loading: loadingDelete }] =
    useDeleteAssociationUserWithCompanyMutation({
      onCompleted: () => {
        if (route.params.challenge_id) {
          fetch({
            variables: {
              company_id: route.params.data.getChallengeDetail.company.id,
            },
          });
        }
      },
    });

  useEffect(() => {
    if (data?.listCompanyUsers) {
      setDataProvider(dataProviderMaker(data.listCompanyUsers));
    }
  }, [data]);

  useEffect(() => {
    if (route.params.challenge_id) {
      fetch({
        variables: {
          company_id: route.params.data.getChallengeDetail.company.id,
        },
      });
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('chamou');
      if (route.params.challenge_id) {
        fetch({
          variables: {
            company_id: route.params.data.getChallengeDetail.company.id,
          },
        });
      }
    }, [route.params]),
  );

  const RenderItemCall = (type, el: UserChallenges) => {
    return (
      <Box paddingLeft={2}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box>
            <ImageZoom
              source={{
                uri: `${PUBLIC_STORAGE}/${el.user.profile?.profile_avatar}`,
              }}
              uri={{
                uri: `${PUBLIC_STORAGE}/${el.user.profile?.profile_avatar}`,
              }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </Box>
          <Box
            ml={15}
            flexDirection="row"
            justifyContent="space-between"
            width={widthPercentageToDP(75)}
          >
            <Text style={{ width: widthPercentageToDP('50') }}>
              {el.user.firstname} {el.user.lastname}
            </Text>
            <Box flexDirection="row" alignItems="center">
              <Box mr={12}>
                <Text
                  style={{
                    color: el.paid ? '#009D33' : '#FFC502',
                  }}
                />
              </Box>

              {el.user_id !== userID ? (
                <TouchableOpacity
                  onPress={() => {
                    refSelectedUserID.current = el.user_id;
                    // setSelectedUserID(el.user_id);
                    // setTimeout(() => {
                    panel.current?.show();
                    // }, 250);
                  }}
                >
                  <Icons name="dots-vertical" />
                </TouchableOpacity>
              ) : null}
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
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

        <Subtitle>Gestão de equipe</Subtitle>

        <Box>
          <TouchableOpacity
            hitSlop={{ left: 10, bottom: 10, right: 10, top: 10 }}
            onPress={() =>
              route.params.rootNavigation.push('Staff.SearchUsers', {
                searchForCompany: true,
                company_id: route.params.data.getChallengeDetail.company.id,
              })
            }
          >
            <Icons name="add" height={24} />
          </TouchableOpacity>
        </Box>
      </HeaderContainer>

      {loading && !users?.subscriptions ? (
        <ActivityIndicator color="#0564FF" size="large" />
      ) : (
        <RecyclerListView
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          extendedState={[loadingDelete]}
          rowRenderer={RenderItemCall}
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
      <ActionSheet
        ref={panel}
        title="O que gostaria de fazer ?"
        options={['Remover Usuário', 'Cancelar']}
        cancelButtonIndex={1}
        destructiveButtonIndex={1}
        onPress={(e) => {
          if (e === 0) {
            console.log('variables: ', {
              user_id: selectedUserID,
              company_id: route.params.data.getChallengeDetail.company.id,
            });
            Alert.alert(
              'Remover usuário?',
              'Tem certeza que deseja remover esse usuário da companhia?',
              [
                {
                  text: 'Remover',
                  onPress: async () => {
                    await deleteAssociationUserWithCompanyMutation({
                      variables: {
                        data: {
                          user_id: refSelectedUserID.current,
                          company_id:
                            route.params.data.getChallengeDetail.company.id,
                        },
                      },
                    });
                  },
                },
                { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
              ],
            );
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ListUsersForStaff;
