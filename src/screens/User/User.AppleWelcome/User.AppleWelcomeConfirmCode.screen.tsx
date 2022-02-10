import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components/native';
import {
  CommonActions,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  NativeModules,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import OneSignal from 'react-native-onesignal';
import {
  TitleText,
  SafeAreaView,
  InputWithIcon,
  Button,
  SmallText,
  Text,
  Icons as CustomIcon,
} from '~/components';
import {
  GetProfileDocument,
  useRegisterAppleUserMutation,
  useSendMailMutation,
  useUpdateProfilePersonalMutation,
  useVerifyEmailCodeMutation,
} from '~/graphql/autogenerate/hooks';
import {
  MutationSendMailArgs,
  MutationVerifyEmailCodeArgs,
} from '~/generated/graphql';
import {
  RootStackEmailSignupParamList,
  RootStackParamList,
} from '~/routes.types';
import { ErrorText } from '~/screens/User/User.EmailSignUp/steps/StepFour';
import { useUserToken } from '~/hooks';
import { useStoreActions, useStoreState } from '~/store';
import user from '~/store/model/user';
import { dbCLient, IDataCompiledSchema, IUserSchema } from '~/db';

export const Container = styled.ScrollView`
  padding: 23px;
  height: 100%;
`;
export const Divider = styled.View`
  margin-top: 30px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const Title = styled(TitleText)`
  font-size: 20px;
`;
export const Icon = styled(CustomIcon)`
  color: ${({ theme }) => theme.colors.text};
`;
export const Input = styled(InputWithIcon)``;
export const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
export const ForgotText = styled(SmallText)`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
`;
export const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-top: 43px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  padding-vertical: 23px;
`;
export const TouchHereText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.blue};
`;
interface ResendTextProps {
  disabled: boolean;
}
export const ResendText = styled(SmallText)<ResendTextProps>`
  margin-top: 11px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray : theme.colors.blue};
`;
const { UIManager } = NativeModules;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AppleWelcomeConfirmCode'
>;
type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'AppleWelcomeConfirmCode'
>;
type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};
const CELL_COUNT = 4;
const AppleWelcomeConfirmCode: React.FC<Props> = ({ route, navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState('');
  const [value, setValue] = useState('');
  const [registerAppleUserMutation] = useRegisterAppleUserMutation();
  const [timer, setTimer] = useState<number>(60);
  const { profileID } = useUserToken();
  const saveData = useStoreActions((actions) => actions.profile.saveUserInfo);
  const userProfile = useStoreState((state) => state.profile.payload);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const setUserProfile = useStoreActions(
    (actions) => actions.profile.saveUserInfo,
  );
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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
      navigation.navigate('User.AppleWelcomeEmail', { hasPrevious: true });
    },
  });

  const handleAppleUser = async () => {
    updateProfilePersonalMutation({
      variables: {
        data: {
          email: route.params.email,
          firstname: userProfile?.getProfile.user.firstname,
          lastname: userProfile?.getProfile.user.lastname,
          username: userProfile?.getProfile.username,
        },
      },
    });
    const realmUser = await dbCLient();
    const { data } = await registerAppleUserMutation({
      variables: {
        data: {
          apple_id: route.params.apple_id,
          email: route.params.email,
          firstname: userProfile?.getProfile.user.firstname,
          lastname: userProfile?.getProfile.user.lastname,
        },
      },
    });
    if (data?.registerAppleUser) {
      OneSignal.setExternalUserId(data.registerAppleUser.user.id, (results) => {
        // The results will contain push and email success statuses
        console.log(`User id to onesignal: ${data.registerAppleUser.user.id}`);
        console.log('Results of setting external user id');
        console.log(results);
      });
      if (data.registerAppleUser.user.id) {
        const userLocal = realmUser.objectForPrimaryKey<IUserSchema>(
          'User',
          data.registerAppleUser.user.id,
        );

        if (userLocal) {
          realmUser.write(() => {
            userLocal.email = route.params.email;
          });
        }
      }

      await AsyncStorage.setItem(
        '@riderize::user_id',
        data.registerAppleUser.user.id,
      );
      await AsyncStorage.setItem(
        `@riderize::${data.registerAppleUser.user.id}:acesstoken:`,
        data.registerAppleUser.accessToken,
      );
      await AsyncStorage.setItem(
        `@riderize::${data.registerAppleUser.user.id}:refreshtoken:`,
        data.registerAppleUser.refreshToken,
      );
      await AsyncStorage.setItem(
        `@riderize::${data.registerAppleUser.user.id}:profileid:`,
        data.registerAppleUser.profile?.id ?? '',
      );
      await AsyncStorage.setItem(
        `@riderize::${data.registerAppleUser.user.id}:userinfo:`,
        JSON.stringify(data.registerAppleUser.user),
      );

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
            params: {
              apple_id: user,
              hasUserEmail: true,
            },
          },
        ],
      });
    }
  };

  const [verifyCode] = useVerifyEmailCodeMutation({
    onError: (e) => {
      setLoading(false);
      setValue('');
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      setUserProfile({ getProfile: { email: route.params.email } });
      if (route.params.apple_id) {
        handleAppleUser();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home', params: { hasUserEmail: true } }],
          }),
        );
      }
      setLoading(false);
    },
  });
  const [sendCodeEmail] = useSendMailMutation({
    onError: (e) => {
      setLoading(false);
      setValue('');
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      console.log(e);
      setLoading(false);
    },
  });
  useEffect(() => {
    if (timer === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearInterval(interval);
      return;
    }
    const interval = setInterval(() => {
      setTimer((seconds) => seconds - 1);
      clearInterval(interval);
    }, 1000);
  }, [timer]);

  const handleSubmit = async () => {
    setLoading(true);
    await verifyCode({
      variables: {
        data: {
          code: value,
          email: route.params.email,
          isRegister: true,
        },
      },
    });
  };
  const handleEmail = async () => {
    setLoading(true);
    console.log('Resend Email');
    saveData({
      getProfile: {
        ...userProfile?.getProfile,
        user: {
          ...userProfile?.getProfile?.user,
          email: route.params.email,
        },
      },
    });
    const { data } = await sendCodeEmail({
      variables: {
        data: {
          email: route.params.email,
          isRegister: true,
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

  useEffect(() => {
    if (value.length > 0) {
      setErrorText('');
    }
  }, [value]);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icon name="arrow-left" width={20} height={30} />
          </TouchableOpacity>
          <Title>Cadastro</Title>
          <View style={{ width: 20 }} />
        </Header>

        <Wrapper>
          <View>
            <SmallText>Digite o código recebido.</SmallText>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              onBlur={() => handleSubmit()}
              rootStyle={{
                marginTop: 20,
                width: 280,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                  onLayout={getCellOnLayoutHandler(index)}
                  key={index}
                  style={[
                    {
                      width: 60,
                      height: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomColor: '#ccc',
                      borderBottomWidth: 1,
                    },
                    isFocused && {
                      borderBottomColor: '#007AFF',
                      borderBottomWidth: 2,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 26,
                      textAlign: 'center',
                    }}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            {error && <ErrorText>{errorText}</ErrorText>}
            <TouchableOpacity
              disabled={timer > 0}
              onPress={() => {
                setTimer(60);
                handleEmail();
              }}
            >
              <ResendText disabled={timer > 0}>
                Reenviar (0:{timer < 10 && '0'}
                {timer})
              </ResendText>
            </TouchableOpacity>
            <ResendText disabled style={{ fontSize: 15 }}>
              * Lembre-se de consultar sua caixa de SPAM.
            </ResendText>
          </View>
          {loading && <ActivityIndicator size="large" color="#0564FF" />}
          <Button
            name="Próximo"
            onPress={() => handleSubmit()}
            disabled={loading}
          />
        </Wrapper>
      </SafeAreaView>
    </>
  );
};

export default AppleWelcomeConfirmCode;
