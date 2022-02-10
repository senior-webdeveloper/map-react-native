import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import styled from 'styled-components/native';
import * as Yup from 'yup';
import { Button, Input, SafeAreaView, Text } from '~/components';
import {
  useUpdateProfilePersonalMutation,
  GetProfileDocument,
} from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';
import { RootStackParamList } from '~/routes.types';
import { LoadingContainer } from '~/screens/Home/Tabs/Settings/screens/Settings.Notifications';
import { useStoreActions, useStoreState } from '~/store';

export const HeaderText = styled(Text)`
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 66px;
`;

// type ChallengeDescriptionRouteProp = RouteProp<
//   RootStackParamList,
//   'Challenge.Classification'
// >;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'User.AppleWelcomeName'
>;
type Props = {
  // route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function AppleWelcomeName({
  route,
  navigation,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const saveData = useStoreActions((actions) => actions.profile.saveUserInfo);
  const userProfile = useStoreState((state) => state.profile.payload);
  const { profileID } = useUserToken();
  const [updateProfilePersonalMutation] = useUpdateProfilePersonalMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetProfileDocument,
        variables: {
          data: {
            profile_id_requesting: profileID,
            profile_id_accessed: profileID,
          },
        },
      },
    ],
    onCompleted: () => {
      navigation.navigate('User.AppleWelcomeEmail', {
        hasPrevious: true,
        ...route.params,
      });
    },
  });

  const schema = Yup.object().shape({
    name: Yup.string().required('Você deve informar seu nome!'),
    lastname: Yup.string().required('Você deve informar seu sobrenome!'),
  });

  const handleUpdateProfile = async (values): Promise<void> => {
    setLoading(true);
    saveData({
      getProfile: {
        ...userProfile?.getProfile,
        username: String(
          String(values.name).trim() +
            String(values.lastname).trim() +
            Math.floor(1000 + Math.random() * 9000),
        ).trim(),
        user: {
          ...userProfile?.getProfile?.user,
          firstname: String(values.name).trim(),
          lastname: String(values.lastname).trim(),
        },
      },
    });
    await updateProfilePersonalMutation({
      variables: {
        data: {
          firstname: String(values.name).trim(),
          lastname: String(values.lastname).trim(),
          username: String(
            String(values.name).trim() +
              String(values.lastname).trim() +
              Math.floor(1000 + Math.random() * 9000),
          ).trim(),
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GetProfileDocument,
          variables: {
            data: {
              profile_id_requesting: profileID,
              profile_id_accessed: profileID,
            },
          },
        },
      ],
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Formik
        onSubmit={handleUpdateProfile}
        initialValues={{ name: '', lastname: '' }}
        validationSchema={schema}
        validateOnMount={false}
        validateOnChange
        validateOnBlur={false}
      >
        {({ setFieldTouched, handleChange, errors, handleSubmit, isValid }) => (
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="never"
            contentContainerStyle={{
              paddingHorizontal: 16,
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <View />
            <View>
              <HeaderText>Como podemos te chamar?</HeaderText>
              <Input
                placeholder="Nome"
                onChangeText={handleChange('name')}
                onBlurFunc={() => setFieldTouched('name')}
                error={errors.name}
              />
              <Input
                placeholder="Sobrenome"
                onChangeText={handleChange('lastname')}
                onBlurFunc={() => setFieldTouched('lastname')}
                error={errors.lastname}
              />
            </View>

            <Button
              name={
                loading ? (
                  <ActivityIndicator color="#0564FF" size="small" />
                ) : (
                  'Próximo'
                )
              }
              onPress={() => handleSubmit()}
              disabled={!isValid || loading}
            />
            <View />
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
}
