import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  ListRenderItem,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { PUBLIC_STORAGE } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import { NetworkStatus } from '@apollo/client';
import { StackNavigationProp } from '@react-navigation/stack';
import CachedImage from 'react-native-image-cache-wrapper';
import FastImage from 'react-native-fast-image';
import { useGetChallengeRanksLazyQuery } from '~/graphql/autogenerate/hooks';
import { Icons, Text, TitleText, Input } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import formatNumbers from '~/helpers/formatNumbers';
import { ModalDescriptionText } from '~/components/FacebookSigninComponent/styles';
import formatMinutesInHours from '~/helpers/formatMinutesInHours';
import formatSecondsInHours from '~/helpers/formatSecondsInHours';

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px 18px 16px;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;
export const Title = styled(TitleText)`
  font-size: 20px;
`;
export const Container = styled.View`
  /* padding: 0px 24px; */
  flex: 1;
  background-color: rgba(239, 250, 255, 0.5);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;
export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  elevation: 4;
  height: 80px;
`;
export const InputContainer = styled.View`
  background-color: white;
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'android' ? '3px' : '9px'} 14px;
  border-radius: 8px;
  width: 80%;
  justify-content: space-between;
`;

export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 8px;
  align-items: center;
  width: 50%;
  justify-content: space-between;
  margin-top: 12px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.Classification'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Classification'
>;
type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const Options = [
  { name: 'Distancia Total', index: 0 },
  { name: 'Altimetria Total', index: 1 },
  { name: 'Menor Tempo', index: 2 },
];
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

const OFFSET = 50;

const ChallengeClassification: React.FC<Props> = ({ route, navigation }) => {
  const { filterName, challenge_id, key, challenge_type } = route.params;
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchValue, setSerchValue] = useState<string | undefined>();

  const [selectedOption, setSelectedOption] = useState<number>(
    challenge_type === 'distance'
      ? 0
      : challenge_type === 'altimetric' ||
        challenge_type === 'mixed-distance-altimetric'
      ? 1
      : challenge_type === 'time'
      ? 2
      : 0,
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);

  const [fetch, { data, loading, fetchMore, refetch, networkStatus }] =
    useGetChallengeRanksLazyQuery({
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    });

  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;

  useEffect(() => {
    fetch();
  }, [route.params]);

  const handleProgress = (value: number, goalValue: number): number => {
    const result = (value * 100) / goalValue / 100;
    return result > 1 ? 1 : result;
  };

  useEffect(() => {
    setPage(1);
    fetch({
      variables: {
        data: {
          challenge_id,
          key: key[selectedOption],
        },
        pagination: {
          offset: OFFSET,
          page: 1,
        },
      },
    });
    if (refetch) {
      refetch();
    }
  }, [selectedOption]);

  const RenderItemCall = useCallback(
    (type, item, index) => {
      return (
        <OptionContainer
          key={item.user_id}
          style={{ marginTop: 6 }}
          activeOpacity={0.5}
          onPress={() =>
            navigation.navigate('Challenge.CompareResults', {
              user_id: item.user_id,
              user: item.user,
              challenge: route.params.challenge,
              subscription_id: item.id,
              subscribed_date: item.registration_date,
              my_subscribed_date: route.params.my_subscribed_date,
              user_activities: route.params.user_challenges,
              selected_user_info: { ...item },
            })
          }
        >
          <View style={{ marginRight: 6, width: 40, alignItems: 'center' }}>
            {item.classification ? (
              <>
                {item.classification === 1 ? (
                  <Icons name="crown" />
                ) : (
                  <Text>{item.classification}</Text>
                )}
              </>
            ) : (
              <>
                {index === 0 ? (
                  <Icons name="crown" />
                ) : (
                  <Text>{index + 1}</Text>
                )}
              </>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '74%',
            }}
          >
            <FastImage
              source={{
                uri: `${PUBLIC_STORAGE}/${item.user.profile.profile_avatar}`,
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 48,
                marginRight: 10,
                marginTop: item.completed ? 10 : 0,
              }}
            />

            <View>
              <Text
                numberOfLines={1}
                style={{ width: widthPercentageToDP('50') }}
              >
                {`${item.user.firstname} ${item.user.lastname}`}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: widthPercentageToDP('30'),
                    marginRight: 8,
                  }}
                >
                  <ProgressBar
                    progress={handleProgress(
                      selectedOption === 0
                        ? item.total_distance
                        : selectedOption === 1
                        ? item.total_altimetry
                        : item.total_time_seconds,

                      selectedOption === 0
                        ? route.params.goal_distance
                        : selectedOption === 1
                        ? route.params.goal_altimetric
                        : 1,
                    )}
                    color={
                      handleProgress(
                        selectedOption === 0
                          ? item.total_distance
                          : selectedOption === 1
                          ? item.total_altimetry
                          : item.total_time_seconds,

                        selectedOption === 0
                          ? route.params.goal_distance
                          : selectedOption === 1
                          ? route.params.goal_altimetric
                          : 1,
                      ) >= 1
                        ? '#009D33'
                        : '#0564FF'
                    }
                    style={{
                      height: 9,
                      borderRadius: 24,
                      backgroundColor: '#D8D8D8',
                    }}
                  />
                </View>
                <Text style={{ opacity: 0.7 }}>
                  {selectedOption === 0
                    ? `${formatNumbers(item.total_distance / 1000, {
                        hasDot: true,
                        digits: 1,
                      })} km`
                    : selectedOption === 1
                    ? `${formatNumbers(item.total_altimetry ?? 0, {
                        hasDot: false,
                      })} m`
                    : `${formatSecondsInHours(item.total_time_seconds)}h`}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '10%',
              flexDirection: 'row',
            }}
          >
            {item.completed ? (
              <Icons name="check" color="#009D33" style={{ marginRight: 10 }} />
            ) : (
              <View style={{ width: 20, marginRight: 10 }} />
            )}
            <Icons name="chevron-right" />
          </View>
        </OptionContainer>
      );
    },
    [selectedOption],
  );

  const onEndReachedThreshold = useMemo(() => {
    return (
      (data?.getChallengeRanks.length - data?.getChallengeRanks.length * 0.8) /
      8
    );
  }, [data?.getChallengeRanks.length]);

  const onEndReached = async () => {
    if (fetchMore) {
      setPage((prevState) => prevState + 1);
      const variables = {
        data: {
          challenge_id,
          key: key[selectedOption],
        },
        pagination: {
          offset: OFFSET,
          page: page + 1,
        },
      };

      fetchMore({
        variables,
      });
    }
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    setTimeout(() => {
      if (refetch) {
        refetch();
      }
    }, 350);
  }, []);

  useEffect(() => {
    if (data?.getChallengeRanks) {
      setDataProvider(dataProviderMaker(data?.getChallengeRanks));
    }
  }, [data]);

  if (loading && !data)
    return (
      <ActivityIndicator
        style={{ marginTop: '50%', alignSelf: 'center' }}
        size="large"
      />
    );

  if (!data?.getChallengeRanks) return null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'rgba(239, 250, 255, 0.5)',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar backgroundColor="#FFFFFF" animated barStyle="dark-content" />
      <Container>
        <View
          style={{
            width: '100%',
            marginTop: -50,
            backgroundColor: '#fff',
            height: 50,
          }}
        />
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>{filterName}</Title>
          {networkStatus === NetworkStatus.loading ? (
            <ActivityIndicator size="small" color="#0564FF" />
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            paddingHorizontal: 16,
            zIndex: 9999999999,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModal((prevState) => !prevState)}
            style={{
              backgroundColor: '#C4C4C4',
              paddingVertical: 6,
              paddingHorizontal: 15,
              marginTop: 11,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TitleText
              style={{
                color: 'white',
                fontSize: 12,
                lineHeight: 13.8,
                marginRight: 11,
              }}
            >
              {selectedOption === 0
                ? 'Distância Total'
                : selectedOption === 1
                ? 'Altimetria Total'
                : 'Menor Total'}
            </TitleText>
            <Icons name="sorter" />
          </TouchableOpacity>
        </View>
        {showSearch && (
          <>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                flexDirection: 'row',
              }}
            >
              <InputContainer>
                <View
                  style={{
                    width: '77%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Icons name="search" style={{ marginRight: 12 }} />
                  <TextInput
                    onChangeText={setSerchValue}
                    placeholder="Procurar Rider..."
                  />
                </View>
                {searchValue?.length > 0 && (
                  <ActivityIndicator size="small" color="#0564FF" />
                )}
              </InputContainer>
              <TouchableOpacity
                onPress={() => {
                  setShowSearch((prevState) => !prevState);
                  setSerchValue();
                }}
                style={{
                  width: '25%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#0564ff' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            {searchValue?.length > 0 && (
              <Text style={{ color: 'rgba(22, 28, 37, 0.56)', marginLeft: 16 }}>
                Procurando por "{searchValue}"
              </Text>
            )}
          </>
        )}
        <RecyclerListView
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={RenderItemCall}
          onEndReachedThreshold={onEndReachedThreshold} // CONTA
          onEndReached={onEndReached}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={networkStatus === NetworkStatus.loading}
                onRefresh={onRefresh}
              />
            ),
            contentContainerStyle: {
              paddingHorizontal: 8,
            },
          }}
        />

        <Modal
          isVisible={showModal}
          onBackdropPress={() => {
            setShowModal((prevState) => !prevState);
          }}
          useNativeDriver
          backdropTransitionOutTiming={0}
          useNativeDriverForBackdrop
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={50}
          animationOutTiming={50}
          coverScreen
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
          }}
        >
          <SafeAreaView
            style={{
              marginTop:
                Platform.OS === 'ios'
                  ? heightPercentageToDP('12')
                  : heightPercentageToDP('9'),
              marginRight: -4,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setShowModal((prevState) => !prevState)}
                style={{
                  backgroundColor: '#C4C4C4',
                  paddingVertical: 6,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <TitleText
                  style={{
                    color: 'white',
                    fontSize: 12,
                    lineHeight: 13.8,
                    marginRight: 11,
                  }}
                >
                  {selectedOption === 0
                    ? 'Distância Total'
                    : 'Altimetria Total'}
                </TitleText>
                <Icons name="sorter" />
              </TouchableOpacity>
            </View>

            <ModalContainer>
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 30,
                  width: 0,
                  height: 0,
                  borderLeftWidth: 21,
                  borderRightWidth: 21,
                  borderBottomWidth: 21,
                  borderStyle: 'solid',
                  backgroundColor: 'transparent',
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: '#FFF',
                }}
              />
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#D8D8D8',
                  width: widthPercentageToDP('54'),
                  paddingVertical: 11,
                  paddingHorizontal: 14,
                  alignItems: 'flex-start',
                }}
              >
                <TitleText
                  style={{ fontSize: 12, lineHeight: 13.8, textAlign: 'left' }}
                >
                  Ordenar por:
                </TitleText>
              </View>

              <RadioForm
                formHorizontal={false}
                animation
                style={{
                  width: widthPercentageToDP('54'),
                  paddingVertical: 18,
                }}
              >
                {/* To create radio buttons, loop through your array of options */}
                {Options.map((obj, i) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedOption(i);
                      if (refetch) {
                        refetch();
                      }
                      setShowModal((prevState) => !prevState);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                      marginBottom: i !== 2 ? 18 : 0,
                    }}
                  >
                    <RadioButton
                      labelHorizontal
                      key={i}
                      style={{
                        width: widthPercentageToDP('48'),
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        // paddingHorizontal: 15,
                        // marginBottom: i === 0 ? 18 : 0,
                      }}
                    >
                      {/*  You can set RadioButtonLabel before RadioButtonInput */}

                      <TouchableOpacity
                        onPress={() => {
                          setSelectedOption(i);
                          setShowModal((prevState) => !prevState);
                        }}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        {selectedOption === i ? (
                          <TitleText
                            style={{
                              color: '#0564FF',
                              fontSize: 14,
                              lineHeight: 16,
                            }}
                          >
                            {obj.name}
                          </TitleText>
                        ) : (
                          <Text style={{ fontSize: 14, lineHeight: 16 }}>
                            {obj.name}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        initial={0}
                        isSelected={selectedOption === i}
                        onPress={() => {
                          setSelectedOption(i);
                          setShowModal((prevState) => !prevState);
                        }}
                        borderWidth={0.5}
                        buttonInnerColor={
                          selectedOption === i ? '#0564FF' : '#000'
                        }
                        buttonOuterColor={
                          selectedOption === i
                            ? '#0564FF'
                            : 'rgba(135, 149, 173, 0.64)'
                        }
                        buttonSize={14}
                        buttonOuterSize={24}
                        buttonStyle={{}}
                        buttonWrapStyle={{ marginLeft: 10 }}
                      />
                    </RadioButton>
                  </TouchableOpacity>
                ))}
              </RadioForm>
            </ModalContainer>
          </SafeAreaView>
        </Modal>
      </Container>
    </SafeAreaView>
  );
};

export default ChallengeClassification;
