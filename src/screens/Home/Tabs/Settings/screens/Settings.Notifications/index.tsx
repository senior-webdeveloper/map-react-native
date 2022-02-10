import React from 'react';
import styled from 'styled-components/native';

import { useNavigation, CommonActions } from '@react-navigation/native';

import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Icons, SafeAreaView, Switch, Text } from '~/components';
import { useUserToken } from '~/hooks';
import {
  Mutation,
  MutationChangeSettingsProfileNotificationsArgs,
  Query,
  QueryGetSettingsProfileNotificationsArgs,
} from '~/generated/graphql';

const GET_NOTIFICATIONS_SETTINGS = gql`
  query GetUserSettingsProfileNotifications($profile_id: String!) {
    getSettingsProfileNotifications(profile_id: $profile_id) {
      comments_push
      comments_email
      comment_response_push
      comment_response_email
      comment_claps_push
      comment_claps_email
      claps_push
      claps_email
      challenge_reminder_push
      challenge_reminder_email
      challenge_subscribed_received_push
      challenge_subscribed_received_email
      activities_received_push
      activities_received_email
    }
  }
`;
interface GetUserSettingsProfileNotificationsProps {
  getSettingsProfileNotifications: Query['getSettingsProfileNotifications'];
}

const SET_NOTIFICATIONS_SETTINGS = gql`
  mutation SettingsProfileNotifications(
    $data: UpdateSettingsProfileNotificationInput!
  ) {
    changeSettingsProfileNotifications(data: $data) {
      _id
      profile_id
    }
  }
`;
interface ChangeSettingsProfileNotificationsProps {
  changeSettingsProfileNotifications: Mutation['changeSettingsProfileNotifications'];
}
export const Container = styled.ScrollView`
  /* padding: 0px 24px; */
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  margin-bottom: 80px;
  padding: 0 24px;
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
  color: #161c25;
`;

export const Subtitle = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 16px;
  line-height: 24px;
  margin-top: 25px;
`;
export const OptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
`;
export const SelectedOptionText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray};
  margin-right: 26px;
`;
export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoadingComponent = () => {
  return (
    <LoadingContainer>
      <ActivityIndicator size="large" />
    </LoadingContainer>
  );
};

const Notifications: React.FC = () => {
  const navigation = useNavigation();
  const { profileID } = useUserToken();
  const { data, loading } = useQuery<
    GetUserSettingsProfileNotificationsProps,
    QueryGetSettingsProfileNotificationsArgs
  >(GET_NOTIFICATIONS_SETTINGS, {
    variables: {
      profile_id: profileID,
    },
  });
  const [setSettings] = useMutation<
    ChangeSettingsProfileNotificationsProps,
    MutationChangeSettingsProfileNotificationsArgs
  >(SET_NOTIFICATIONS_SETTINGS, {
    onError: (e) => console.log(e),
  });
  const handleSubmitNotifications = async (values) => {
    await setSettings({
      variables: {
        data: {
          profile_id: profileID,
          comments_push: values.comments_push,
          comments_email: values.comments_email,
          comment_response_push: values.comment_response_push,
          comment_response_email: values.comment_response_email,
          comment_claps_push: values.comment_claps_push,
          comment_claps_email: values.comment_claps_email,
          claps_push: values.claps_push,
          claps_email: values.claps_email,
          challenge_reminder_push: values.challenge_reminder_push,
          challenge_reminder_email: values.challenge_reminder_email,
          challenge_subscribed_received_push:
            values.challenge_subscribed_received_push,
          challenge_subscribed_received_email:
            values.challenge_subscribed_received_email,
          activities_received_push: values.activities_received_push,
          activities_received_email: values.activities_received_email,
        },
      },
    });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" width={18} />
        </TouchableOpacity>
        <Title>Notificações</Title>
        <View style={{ width: 20 }} />
      </Header>
      {loading ? (
        <LoadingComponent />
      ) : (
        <Container
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <Formik
            initialValues={{
              comments_push:
                data?.getSettingsProfileNotifications.comments_push,
              comments_email:
                data?.getSettingsProfileNotifications.comments_email,
              comment_response_push:
                data?.getSettingsProfileNotifications.comment_response_push,
              comment_response_email:
                data?.getSettingsProfileNotifications.comment_response_email,
              comment_claps_push:
                data?.getSettingsProfileNotifications.comment_claps_push,
              comment_claps_email:
                data?.getSettingsProfileNotifications.comment_claps_email,
              claps_push: data?.getSettingsProfileNotifications.claps_push,
              claps_email: data?.getSettingsProfileNotifications.claps_email,
              challenge_reminder_push:
                data?.getSettingsProfileNotifications.challenge_reminder_push,
              challenge_reminder_email:
                data?.getSettingsProfileNotifications.challenge_reminder_email,
              challenge_subscribed_received_push:
                data?.getSettingsProfileNotifications
                  .challenge_subscribed_received_push,
              challenge_subscribed_received_email:
                data?.getSettingsProfileNotifications
                  .challenge_subscribed_received_email,
              activities_received_push:
                data?.getSettingsProfileNotifications.activities_received_push,
              activities_received_email:
                data?.getSettingsProfileNotifications.activities_received_email,
            }}
            onSubmit={handleSubmitNotifications}
          >
            {({
              values,
              setFieldTouched,
              handleChange,
              errors,
              setFieldValue,
              handleSubmit,
              isValid,
            }): JSX.Element => (
              <>
                <Subtitle>Notificações de comentários</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.comments_push}
                    setActive={() => {
                      setFieldValue('comments_push', !values.comments_push);
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.comments_email}
                    setActive={() => {
                      setFieldValue('comments_email', !values.comments_email);
                      handleSubmit();
                    }}
                  />
                </OptionContainer>

                <Subtitle>Notificações de respostas em comentários</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.comment_response_push}
                    setActive={() => {
                      setFieldValue(
                        'comment_response_push',
                        !values.comment_response_push,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.comment_response_email}
                    setActive={() => {
                      setFieldValue(
                        'comment_response_email',
                        !values.comment_response_email,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>

                <Subtitle>Notificações de claps em seus desafios</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.claps_push}
                    setActive={() => {
                      setFieldValue('claps_push', !values.claps_push);
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.claps_email}
                    setActive={() => {
                      setFieldValue('claps_email', !values.claps_email);
                      handleSubmit();
                    }}
                  />
                </OptionContainer>

                <Subtitle>Notificações de claps em seus comentários</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.comment_claps_push}
                    setActive={() => {
                      setFieldValue(
                        'comment_claps_push',
                        !values.comment_claps_push,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.comment_claps_email}
                    setActive={() => {
                      setFieldValue(
                        'comment_claps_email',
                        !values.comment_claps_email,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>

                <Subtitle>Notificações de lembretes de desafios</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.challenge_reminder_push}
                    setActive={() => {
                      setFieldValue(
                        'challenge_reminder_push',
                        !values.challenge_reminder_push,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.challenge_reminder_email}
                    setActive={() => {
                      setFieldValue(
                        'challenge_reminder_email',
                        !values.challenge_reminder_email,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>

                <Subtitle>Notificações de desafios inscritos</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.challenge_subscribed_received_push}
                    setActive={() => {
                      setFieldValue(
                        'challenge_subscribed_received_push',
                        !values.challenge_subscribed_received_push,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.challenge_subscribed_received_email}
                    setActive={() => {
                      setFieldValue(
                        'challenge_subscribed_received_email',
                        !values.challenge_subscribed_received_email,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>

                <Subtitle>Notificações de atividades recebidas</Subtitle>
                <OptionContainer>
                  <Text>Por Push</Text>
                  <Switch
                    active={values.activities_received_push}
                    setActive={() => {
                      setFieldValue(
                        'activities_received_push',
                        !values.activities_received_push,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
                <OptionContainer>
                  <Text>Por Email</Text>
                  <Switch
                    active={values.activities_received_email}
                    setActive={() => {
                      setFieldValue(
                        'activities_received_email',
                        !values.activities_received_email,
                      );
                      handleSubmit();
                    }}
                  />
                </OptionContainer>
              </>
            )}
          </Formik>
        </Container>
      )}
    </SafeAreaView>
  );
};

export default Notifications;
