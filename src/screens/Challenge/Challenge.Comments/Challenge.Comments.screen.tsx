/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  LayoutAnimation,
  Keyboard,
  Platform,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { formatDistanceToNowStrict } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import styled from 'styled-components/native';
import * as Yup from 'yup';
import ActionSheet from 'react-native-actionsheet';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import {
  Mutation,
  MutationCreateCommentArgs,
  Query,
  Comment,
} from '~/generated/graphql';
import {
  useGetCommentsQuery,
  useCreateCommentClapMutation,
  useDeleteCommentMutation,
  GetCommentsDocument,
} from '~/graphql/autogenerate/hooks';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useUserInfo, useUserToken } from '~/hooks';
import { Icons, SmallText, ImageBackground } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useStoreActions, useStoreState } from '~/store';
import { GetCommentsQuery } from '~/graphql/autogenerate/operations';

const CREATE_COMMENT = gql`
  mutation createComment($data: CreateCommentInput!) {
    createComment(data: $data) {
      text
    }
  }
`;

interface ICommentMutationData {
  createComment: Mutation['createComment'];
}
export const Container = styled.View`
  flex: 1;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;

export const TitleOthers = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 24px;
`;
export const HighlightsCard = styled.View`
  margin-bottom: 24px;
  background: #ffffff;
  padding: 12px;
  border-radius: 16px;
`;

export const RockyMountain = styled(ImageBackground)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;

export const InfoContainer = styled.View``;

export const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
export const CommentContainer = styled.View`
  flex-direction: row;
  margin-vertical: 16px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const Avatar = styled(ImageBackground)`
  width: 42px;
  height: 42px;
  border-radius: 64px;
  margin-right: 12px;
`;
export const CommentBox = styled.View`
  background: rgba(172, 183, 199, 0.12754);
  border-color: rgba(22, 28, 37, 0.0939958);
  border-width: 0.5px;
  border-radius: 16px;
  padding: 11px;
  width: 100%;
  min-width: 200px;
  margin-right: 10px;
`;
export const UserName = styled(SmallText)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const CommentText = styled(SmallText)``;
export const Time = styled(SmallText)`
  color: ${({ theme }) => theme.colors.gray};
  margin-left: 10px;
`;
export const ChildrenContainer = styled.View`
  padding-left: 42px;
`;
export const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;
export const CommentInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-color: #edf1f6;
  border-width: 1px;
  border-radius: 100px;
  width: 89%;
  min-height: 10px;
  padding-horizontal: 16px;
  padding-vertical: ${Platform.OS === 'android' ? '2px' : '16px'};
`;
export const CommentInput = styled.TextInput`
  font-size: 16px;
  line-height: 18px;
  width: 90%;
`;
export const CommentBoxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${widthPercentageToDP('70')};
`;
export const ChildrenCommentBoxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${widthPercentageToDP('66')};
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.Comments'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
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

const ChallengeComments: React.FC<Props> = ({ route }) => {
  const seedComments = useStoreActions(
    (actions) => actions.challengeComments.seedComments,
  );
  const resetComments = useStoreActions(
    (actions) => actions.challengeComments.reset,
  );
  const createClaps = useStoreActions(
    (actions) => actions.challengeComments.createClap,
  );
  const createClapsChildren = useStoreActions(
    (actions) => actions.challengeComments.createClapChildren,
  );
  const [parentIndex, setParentIndex] = useState<number>();
  const comments = useStoreState((state) => state.challengeComments.comments);
  const claps = useRef(0);
  // const [claps, setClaps] = React.useState<number>(0);
  const [clapsChildren, setClapsChildren] = React.useState<number>(0);
  const [selectedIndex, setSelectedIndex] = React.useState<
    number | undefined
  >();
  const [selectedChildrenIndex, setSelectedChildrenIndex] = React.useState<
    number | undefined
  >();
  const { data } = useUserInfo();
  const commentReference = React.useRef<TextInput>();
  const navigation = useNavigation();
  const { params } = route;
  const { challenge_id } = params;
  const [customClaps, setCustomClaps] = useState(0);
  const [actualPage, setPage] = React.useState<number>(1);
  const panel = useRef<ActionSheet>();
  const [selectedID, setSelectedID] = React.useState<string>('');
  const [loadingPostComment, setLoadingPostComment] = useState(false);
  const [keyboardShow, setKeyboardShow] = React.useState<boolean>(false);
  const { profileID, userinfo } = useUserToken();
  const [parentCommentID, setParentCommentID] = React.useState<string | null>(
    null,
  );

  // useEffect(() => {
  //   setCustomClaps(claps.current);
  //   console.log(
  //     '🚀 ~ file: Challenge.Comments.screen.tsx ~ line 256 ~ useEffect ~ claps.current',
  //     claps.current,
  //   );
  // }, [claps.current]);

  function setClaps(number: number) {
    claps.current = number;
    setCustomClaps(number);
  }

  const {
    data: commentData,
    refetch: refetchComments,
    fetchMore,
    loading,
  } = useGetCommentsQuery({
    variables: {
      challenge_id,
      pagination: {
        offset: 15,
        page: actualPage,
      },
    },
    fetchPolicy: 'no-cache',
  });

  const [deleteCommentMutation] = useDeleteCommentMutation({
    onCompleted: (e) => {
      setParentIndex();
      setSelectedChildrenIndex();
      if (refetchComments) {
        refetchComments();
      }
    },
  });
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const [createComment] = useMutation<
    ICommentMutationData,
    MutationCreateCommentArgs
  >(CREATE_COMMENT, {
    onError: (e) => setLoadingPostComment(false),
    onCompleted: (e) => {
      setLoadingPostComment(false);
    },
  });
  const [createCommentClapMutation] = useCreateCommentClapMutation();

  React.useEffect(() => {
    if (claps.current > 50) {
      setClaps(50);
    }
  }, [claps.current]);

  interface MessageProps {
    message: string;
  }

  const initialValues: MessageProps = { message: '' };
  const handlePublishComment = async (values, { resetForm }) => {
    setLoadingPostComment(true);
    const { data: dataComment } = await createComment({
      variables: {
        data: {
          challenge_id,
          profile_id: profileID,
          parent_challenge_comment_id: parentCommentID,
          text: values.message,
        },
      },
    });
    if (dataComment) {
      // TODO: RESOLVERCOMENTARIO.
      resetForm();
      setLoadingPostComment(false);
      if (commentReference.current) {
        commentReference.current.clear();
        commentReference.current.blur();
      }
      setParentCommentID(null);
      refetchComments();
    }
  };

  const schema = Yup.object().shape({
    message: Yup.string().required(),
  });

  const handleProfileNavigation = (profile: string) => {
    if (profileID !== profile) {
      navigation.navigate('GenericProfile', {
        id: profile,
      });
    } else {
      navigation.navigate('User.Profile');
    }
  };
  React.useEffect(() => {
    if (commentData && commentData.getChallengeComments) {
      if (actualPage === 1) {
        seedComments(commentData.getChallengeComments);
      } else if (comments && comments.length >= 10 && actualPage > 1) {
        seedComments([...comments, ...commentData.getChallengeComments]);
      } else {
        seedComments(commentData.getChallengeComments);
      }
    }
  }, [commentData]);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardShow(false);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  // eslint-disable-next-line prefer-const
  const addClaps = () => {
    if (claps.current < 50) {
      console.log('claps: ', claps.current);
      setClaps(claps.current + 1);
    } else if (claps.current > 50) {
      setClaps(50);
    }

    this.timerTwo = setTimeout(addClaps, 200);
  };

  const stopTimer = async (id, count, index) => {
    clearTimeout(this.timerTwo);

    createClaps({
      index,
      claps_count: claps.current,
    });
    setClaps(0);
    await createCommentClapMutation({
      variables: {
        data: {
          profile_id: profileID,
          challenge_comment_id: id,
          count: count > 50 ? 50 : count,
        },
      },
    });
  };

  const addClapsChildren = () => {
    if (clapsChildren < 50) {
      if (clapsChildren < 50) {
        setClapsChildren((prevState) => prevState + 1);
      }
    } else if (clapsChildren > 50) {
      setClapsChildren(50);
    }

    this.timerChildren = setTimeout(addClapsChildren, 200);
  };

  const stopTimerChildren = async (id, count, index, indexChildren) => {
    clearTimeout(this.timerChildren);
    createClapsChildren({
      index,
      indexChildren,
      claps_count: clapsChildren,
    });
    setClapsChildren(0);
    await createCommentClapMutation({
      variables: {
        data: {
          profile_id: profileID,
          challenge_comment_id: id,
          count: count > 50 ? 50 : count,
        },
      },
    });
  };

  const renderItem = ({ item, index }): JSX.Element => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <CommentContainer>
          <TouchableOpacity
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            style={{ marginRight: 10 }}
            onPress={() => {
              if (profileID === item.profile.id) {
                navigation.navigate('User.Profile');
              } else {
                navigation.navigate('User.VisitorProfile', {
                  profile_id: item.profile.id,
                });
              }
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 42,
                overflow: 'hidden',
              }}
            >
              <Avatar
                source={{
                  uri: `${PUBLIC_STORAGE}/${item.profile.profile_avatar}`,
                }}
              />
            </View>
          </TouchableOpacity>
          <View>
            <CommentBoxWrapper>
              <CommentBox>
                <TouchableOpacity
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  onPress={() => {
                    if (profileID === item.profile.id) {
                      navigation.navigate('User.Profile');
                    } else {
                      navigation.navigate('User.VisitorProfile', {
                        profile_id: item.profile.id,
                      });
                    }
                  }}
                >
                  <UserName>{item.profile.username}</UserName>
                </TouchableOpacity>
                <CommentText>{item.text}</CommentText>
              </CommentBox>
              <TouchableOpacity
                hitSlop={{
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10,
                }}
                onPress={() => {
                  setSelectedIndex(index);
                }}
                onPressIn={() => {
                  setSelectedIndex(index);
                  setClaps(0);
                  addClaps();
                }}
                onPressOut={() => {
                  if (item.my_claps) {
                    stopTimer(
                      item.id,
                      item?.my_claps +
                        claps.current +
                        (item?.claps[0]?.count ?? 0),
                      index,
                    );
                  } else {
                    stopTimer(
                      item.id,
                      (item?.claps[0]?.count ?? 0) + claps.current,
                      index,
                    );
                  }
                }}
              >
                <Icons
                  name="claps"
                  style={{ marginRight: 12 }}
                  color={
                    item?.claps.length > 0 ||
                    (selectedIndex === index && claps.current > 0) ||
                    item.my_claps
                      ? '#0564FF'
                      : '#161C25'
                  }
                />
              </TouchableOpacity>
            </CommentBoxWrapper>

            <ActionsContainer>
              <Time>
                {formatDistanceToNowStrict(new Date(item.created_at), {
                  addSuffix: false,
                  locale: ptbr,
                })}
              </Time>

              <Time>
                {selectedIndex === index
                  ? item.claps_count + (item.my_claps ?? 0) + customClaps
                  : item.claps_count + (item.my_claps ? item.my_claps : 0)}{' '}
                palmas
              </Time>
              <TouchableOpacity
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                onPress={() => {
                  setParentCommentID(item.id);
                  commentReference.current?.focus();
                }}
              >
                <Time>Responder</Time>
              </TouchableOpacity>
              {profileID === item.profile.id && (
                <TouchableOpacity
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  style={{
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    setSelectedID(item.id);
                    setParentIndex(index);
                    setTimeout(() => {
                      panel.current.show();
                    }, 350);
                  }}
                >
                  <Icons name="dots-horizontal" color="rgba(22, 28, 37, 0.5)" />
                </TouchableOpacity>
              )}
            </ActionsContainer>
          </View>
        </CommentContainer>
        {/* {item.childComments && item.childComments.length > 0 && (
          <ChildrenContainer> */}
        {item.childComments &&
          item.childComments.length > 0 &&
          item.childComments.map((children, childrenIndex) => (
            <ChildrenContainer>
              <CommentContainer>
                <TouchableOpacity
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    if (profileID === children.profile.id) {
                      navigation.navigate('User.Profile');
                    } else {
                      navigation.navigate('User.VisitorProfile', {
                        profile_id: children.profile.id,
                      });
                    }
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 42,
                      overflow: 'hidden',
                    }}
                  >
                    <Avatar
                      source={{
                        uri: `${PUBLIC_STORAGE}/${children.profile.profile_avatar}`,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <View>
                  <ChildrenCommentBoxWrapper style={{ maxWidth: '88.5%' }}>
                    <CommentBox>
                      <TouchableOpacity
                        hitSlop={{
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10,
                        }}
                        onPress={() => {
                          if (profileID === children.profile.id) {
                            navigation.navigate('User.Profile');
                          } else {
                            navigation.navigate('User.VisitorProfile', {
                              profile_id: children.profile.id,
                            });
                          }
                        }}
                      >
                        <UserName>{children.profile.username}</UserName>
                      </TouchableOpacity>
                      <CommentText>{children.text}</CommentText>
                    </CommentBox>
                    <TouchableOpacity
                      hitSlop={{
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                      }}
                      onPress={() => {
                        setSelectedIndex(index);
                        setSelectedChildrenIndex(childrenIndex);
                      }}
                      onPressIn={() => {
                        setSelectedIndex(index);
                        setSelectedChildrenIndex(childrenIndex);
                        setClapsChildren(0);
                        addClapsChildren();
                      }}
                      onPressOut={() => {
                        if (children.my_claps) {
                          stopTimerChildren(
                            children.id,
                            children?.my_claps +
                              clapsChildren +
                              (children?.claps[0]?.count ?? 0),
                            index,
                            childrenIndex,
                          );
                        } else {
                          stopTimerChildren(
                            children.id,
                            (children?.claps[0]?.count ?? 0) + clapsChildren,
                            index,
                            childrenIndex,
                          );
                        }
                      }}
                    >
                      <Icons
                        name="claps"
                        style={{ marginRight: 12 }}
                        color={
                          children?.claps.length > 0 ||
                          claps.current > 0 ||
                          children.my_claps
                            ? '#0564FF'
                            : '#161C25'
                        }
                      />
                    </TouchableOpacity>
                  </ChildrenCommentBoxWrapper>
                  <ActionsContainer>
                    <Time>
                      {formatDistanceToNowStrict(
                        new Date(children.created_at),
                        {
                          addSuffix: false,
                          locale: ptbr,
                        },
                      )}
                    </Time>
                    <Time>
                      {selectedIndex === index &&
                      selectedChildrenIndex === childrenIndex
                        ? children.claps_count +
                          (children.my_claps ?? 0) +
                          clapsChildren
                        : children.claps_count + (children.my_claps ?? 0)}{' '}
                      palmas
                    </Time>
                    <TouchableOpacity
                      hitSlop={{
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                      }}
                      onPress={() => {
                        setParentCommentID(item.id);
                        commentReference.current?.focus();
                      }}
                    >
                      <Time>Responder</Time>
                    </TouchableOpacity>

                    {profileID === children.profile.id && (
                      <TouchableOpacity
                        hitSlop={{
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10,
                        }}
                        style={{
                          marginLeft: 10,
                        }}
                        onPress={() => {
                          setSelectedID(children.id);
                          setParentIndex(index);
                          setSelectedChildrenIndex(childrenIndex);
                          setTimeout(() => {
                            panel.current.show();
                          }, 350);
                        }}
                      >
                        <Icons
                          name="dots-horizontal"
                          color="rgba(22, 28, 37, 0.5)"
                        />
                      </TouchableOpacity>
                    )}
                  </ActionsContainer>
                </View>
              </CommentContainer>
            </ChildrenContainer>
          ))}
        {/* </ChildrenContainer>
        )} */}
      </View>
    );
  };

  const onEndReachedThreshold = useMemo(() => {
    return (comments.length - comments.length * 0.8) / 8;
  }, [comments.length]);

  const onEndReached = useCallback(async () => {
    if (fetchMore && comments.length > 9) {
      setPage((prevState) => prevState + 1);
      fetchMore({
        variables: {
          challenge_id,
          pagination: {
            offset: 15,
            page: actualPage,
          },
        },
      });
    }
  }, [onEndReachedThreshold]);

  const onRefresh = useCallback(() => {
    setPage(1);
    setTimeout(() => {
      if (refetchComments) {
        refetchComments();
      }
    }, 350);
  }, []);

  useEffect(() => {
    if (comments) {
      setDataProvider(dataProviderMaker(comments));
    }
  }, [comments]);

  return (
    <SafeAreaView style={{ backgroundColor: '#F9F9F9', flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor="#F9F9F9"
      />
      <Header>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            resetComments();
          }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Comentários</Title>
        <View style={{ width: 20 }} />
      </Header>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Container>
          <FlatList data={comments} renderItem={renderItem} />
          {/* <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={renderItem}
            canChangeSize
            disableRecycling
            optimizeForInsertDeleteAnimations
            onEndReachedThreshold={onEndReachedThreshold} // CONTA
            onEndReached={onEndReached}
            forceNonDeterministicRendering
            scrollViewProps={{
              refreshControl: (
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
              ),
              contentContainerStyle: {
                paddingHorizontal: 8,
              },
            }}
          /> */}

          <Formik
            initialValues={initialValues}
            onSubmit={handlePublishComment}
            validationSchema={schema}
            validateOnMount
            validateOnChange
            validateOnBlur
          >
            {({ isValid, handleSubmit, handleChange, values }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingBottom: keyboardShow
                    ? Platform.OS === 'android'
                      ? 35
                      : 5
                    : 5,
                  paddingTop: 5,
                }}
              >
                {userinfo && (
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 42,
                      overflow: 'hidden',
                      marginRight: 5,
                    }}
                  >
                    <Avatar
                      source={{
                        uri: `${PUBLIC_STORAGE}/${data?.getProfile.profile_avatar}`,
                      }}
                    />
                  </View>
                )}
                <CommentInputContainer>
                  <CommentInput
                    ref={commentReference}
                    placeholder="Digite seu comentário"
                    returnKeyType="send"
                    value={values.message}
                    multiline
                    numberOfLines={Platform.OS === 'ios' ? null : 3}
                    maxHeight={Platform.OS === 'ios' ? 20 * 3 : null}
                    onChangeText={handleChange('message')}
                    onSubmitEditing={() => handleSubmit()}
                  />
                  <TouchableOpacity
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    onPress={() => handleSubmit()}
                    disabled={loadingPostComment}
                  >
                    {loadingPostComment ? (
                      <ActivityIndicator color="#0564FF" size="small" />
                    ) : (
                      <Icons
                        name="send"
                        style={{ paddingHorizontal: 10 }}
                        color={
                          values.message ? '#0564FF' : 'rgba(9, 16, 28, 0.08)'
                        }
                      />
                    )}
                  </TouchableOpacity>
                </CommentInputContainer>
              </View>
            )}
          </Formik>
        </Container>
      </KeyboardAvoidingView>
      <ActionSheet
        ref={panel}
        title="O que gostaria de fazer ?"
        options={['Excluir Comentario', 'Cancelar']}
        cancelButtonIndex={1}
        destructiveButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            Alert.alert('Você tem certeza? ', 'Essa ação será irreversível.', [
              {
                text: 'Sim, Tenho certeza',
                onPress: () => {
                  deleteCommentMutation({
                    variables: {
                      id: selectedID,
                    },
                    awaitRefetchQueries: true,
                    refetchQueries: [
                      {
                        query: GetCommentsDocument,
                        variables: {
                          challenge_id,
                          pagination: {
                            offset: 15,
                            page: 1,
                          },
                        },
                      },
                    ],
                  });
                },
              },
              {
                text: 'Cancelar',
              },
            ]);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default ChallengeComments;
