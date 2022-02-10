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
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';
import { PUBLIC_STORAGE } from '@env';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import {
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
  useAssociateUserToCompanyMutation,
  useSearchUsersLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { clearUndefinedOrEmpty } from '~/helpers/clearUndefinedOrEmpty';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { SearchUsersQuery } from '~/graphql/autogenerate/operations';
import { User, UsersPaginatedResponse } from '~/generated/graphql';
import { useUserToken } from '~/hooks';
import { RootStackParamList } from '~/routes.types';

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

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 16px;
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

export const FeedDescritionText = styled(Text)``;

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
  RootStackParamList,
  'Staff.SearchUsers'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Staff.SearchUsers'
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
      dim.height = 76;
    },
  );

export default function SearchUsers({ route, navigation }: Props): JSX.Element {
  const [associateUserToCompanyMutation] = useAssociateUserToCompanyMutation({
    onCompleted: (e) => {
      console.log('completou: ', e);
      navigation.goBack();
    },
    onError: (e) => console.error(e),
  });
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const [users, setUsers] = useState<UsersPaginatedResponse>();
  const { profileID, userinfo, userID } = useUserToken();
  const [fetch, { data, loading }] = useSearchUsersLazyQuery({
    onCompleted: (e) => console.log(e),
    onError: (e) => console.log(e.message),
  });
  const [searchText, setSearchText] = useState('');

  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    if (data?.searchUsers) {
      if (
        users &&
        users.users &&
        data?.searchUsers.page_info.current_page > 1
      ) {
        if (
          data.searchUsers.page_info.current_page > users.page_info.current_page
        ) {
          console.log('Buscando a pagina 2');
          setUsers({
            page_info: data.searchUsers.page_info,
            users: [...users.users, ...data.searchUsers.users],
          });
          setDataProvider(
            dataProviderMaker([...users.users, ...data.searchUsers.users]),
          );
        }
      } else if (!users || data.searchUsers.page_info.current_page === 1) {
        console.log('Buscando a pagina 1');
        setUsers(data?.searchUsers);
        setDataProvider(dataProviderMaker(data.searchUsers.users));
      }
    }
  }, [data]);

  useEffect(() => {
    if (users?.searchUsers) {
      setDataProvider(dataProviderMaker(users?.searchUsers.users));
    }
  }, [users]);

  useEffect(() => {
    fetch({
      variables: {
        pagination: {
          page: 1,
          offset: 20,
        },
        search_text: '',
      },
    });
  }, [route.params]);

  const handleSearch = async (
    values: AdvancedFiltersToFindSubscriptionsInput,
  ) => {
    await fetch({
      variables: {
        pagination: {
          page: 1,
          offset: 20,
        },
        search_text: searchText.trim(),
      },
    });
  };

  const onEndReached = async () => {
    if (
      data?.searchUsers.page_info.has_next_page &&
      users &&
      users?.page_info.current_page >= 1
    ) {
      fetch({
        variables: {
          pagination: {
            page: data?.searchUsers.page_info.current_page + 1,
            offset: 20,
          },
          search_text: searchText,
        },
      });
    }
  };

  const RenderItemCall = (type, el: User, index) => {
    return (
      <Box paddingLeft={2}>
        <TouchableOpacity
          onPress={() => {
            if (!route.params.searchForCompany) {
              if (profileID === el?.profile.id) {
                navigation.navigate('User.Profile');
              } else {
                navigation.navigate('User.VisitorProfile', {
                  profile_id: el?.profile.id,
                });
              }
            } else if (el.id === userID && !userinfo.staff) {
              Alert.alert('Houve um Erro', 'Voce ja faz parte da companhia');
            } else {
              Alert.alert(
                'Adicionar usuário',
                'Deseja adicionar este usuário a sua companhia?',
                [
                  {
                    text: 'Ok',
                    onPress: async () => {
                      console.log('variables: ', {
                        data: {
                          user_id: el.id,
                          company_id: route.params.company_id,
                          creator: false,
                        },
                      });
                      await associateUserToCompanyMutation({
                        variables: {
                          data: {
                            user_id: el.id,
                            company_id: route.params.company_id,
                            creator: false,
                          },
                        },
                      });
                    },
                  },
                  {
                    text: 'Cancelar',
                    onPress: () => {},
                    style: 'cancel',
                  },
                ],
              );
            }
          }}
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box>
            <ImageZoom
              source={{
                uri: `${PUBLIC_STORAGE}/${el.profile?.profile_avatar}`,
              }}
              uri={{
                uri: `${PUBLIC_STORAGE}/${el.profile?.profile_avatar}`,
              }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </Box>
          <Box ml={15}>
            <Typography color={el.staff ? 'blue100' : 'text'}>
              {el.firstname} {el.lastname} {el.staff ? '- STAFF' : null}
            </Typography>
            <Typography type="small">
              {el.city
                ? `${el.city?.name} - ${el.city?.state.abbreviation} - `
                : null}
              {el.email}
            </Typography>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <Formik onSubmit={(values) => handleSearch(values)} initialValues={{}}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
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

            <Subtitle>Buscar Usuários</Subtitle>

            <Box width={11} />
          </HeaderContainer>

          <Box>
            <Box
              paddingHorizontal={16}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Icons name="search" color="#4595EC" />
              <TextInput
                onChangeText={(e) => setSearchText(e)}
                value={searchText}
                allowFontScaling={false}
                placeholder="Procure por Nome/CPF/Email/Telefone"
                placeholderTextColor="#161c2561"
                onSubmitEditing={() => handleSubmit()}
                style={{
                  width: widthPercentageToDP('80'),
                  paddingVertical: Platform.OS === 'ios' ? 18 : 10,
                  paddingHorizontal: 10,
                }}
              />

              <TouchableOpacity
                disabled={loading}
                style={{ alignItems: 'center', flexDirection: 'row' }}
                onPress={() => handleSubmit()}
              >
                {loading ? (
                  <ActivityIndicator color="#4595EC" />
                ) : (
                  <Icons name="arrow-right" color="#4595EC" />
                )}
              </TouchableOpacity>
            </Box>
          </Box>

          {loading && !users?.users ? (
            <ActivityIndicator color="#0564FF" size="large" />
          ) : (
            <RecyclerListView
              layoutProvider={layoutProvider}
              dataProvider={dataProvider}
              // extendedState={users}
              rowRenderer={RenderItemCall}
              // onEndReachedThreshold={onEndReachedThreshold} // CONTA
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

          <Modalize
            ref={modalizeRef}
            HeaderComponent={() => (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingTop: 20,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: 60 }} />
                <Subtitle>Filtros</Subtitle>
                <TouchableOpacity
                  style={{ alignItems: 'center', flexDirection: 'row' }}
                  onPress={() => handleSubmit()}
                >
                  <Text style={{ color: '#0564FF', marginRight: 5 }}>
                    Buscar
                  </Text>
                  <Icons name="search" color="#0564FF" />
                </TouchableOpacity>
              </View>
            )}
          >
            <>
              <View
                style={{
                  paddingHorizontal: 16,
                }}
              >
                <TextInput
                  style={{
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: '#161c2561',
                    paddingVertical: 10,
                  }}
                  onChangeText={(e) => setSearchText(e)}
                  value={searchText}
                  allowFontScaling={false}
                  placeholder="Procure por Nome/CPF/Email/Telefone"
                  placeholderTextColor="#161c2561"
                />
              </View>
            </>
          </Modalize>
        </SafeAreaView>
      )}
    </Formik>
  );
}

type HandleFiltersProps = {
  element: { label: string; value: string };
  handleToggle: (id: string) => void;
  formValues: string[];
};
