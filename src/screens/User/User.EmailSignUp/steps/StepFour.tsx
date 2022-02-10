import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components/native';
import { RouteProp, useNavigation } from '@react-navigation/native';
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

import {
  TitleText,
  SafeAreaView,
  InputWithIcon,
  Button,
  Text,
  SmallText,
  Icons as CustomIcon,
} from '~/components';
import {
  VERIFY_CODE_EMAIL,
  IVerifyMailCodePayload,
  ISendMailCodePayload,
  SEND_CODE_EMAIL,
  IVerifySmsCodePayload,
  VERIFY_CODE_SMS,
  ISendCodeToNumberPayload,
  SEND_CODE_SMS,
} from '../graphql';
import {
  MutationCodeRecoveryArgs,
  MutationSendMailArgs,
  MutationVerifyEmailCodeArgs,
  MutationVerifyPhoneNumberArgs,
} from '~/generated/graphql';
import { RootStackEmailSignupParamList } from '../User.EmailSignUp.screen';
import colors from '~/styles/colors';

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
  margin-vertical: 24px;
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
  padding-vertical: 24px;
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
export const ErrorText = styled(Text)`
  font-size: 13px;
  margin-top: 5px;
  color: ${colors.error};
`;
const { UIManager } = NativeModules;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type StepTwoNavigationProp = RouteProp<
  RootStackEmailSignupParamList,
  'StepFour'
>;
type Props = {
  route: StepTwoNavigationProp;
};
const CELL_COUNT = 4;
const StepFour: React.FC<Props> = ({ route }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState('');
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState<number>(60);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const navigation = useNavigation();
  const [step, setStep] = useState<number>(1);

  const [verifyCodeSms] = useMutation<
    IVerifySmsCodePayload,
    MutationCodeRecoveryArgs
  >(VERIFY_CODE_SMS, {
    onError: (e) => {
      setValue('');
      setLoading(false);
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      console.log(e);
      setLoading(false);
    },
  });
  const [sendCodeSms] = useMutation<
    ISendCodeToNumberPayload,
    MutationVerifyPhoneNumberArgs
  >(SEND_CODE_SMS, {
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

  const handleSms = async () => {
    setLoading(true);
    console.log('Resend Sms');
    const { data } = await sendCodeSms({
      variables: {
        data: {
          phone: route.params.phone,
          isRegister: true,
        },
      },
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    const { data } = await verifyCodeSms({
      variables: {
        data: {
          phone: route.params.phone,
          code: value,
          isRegister: true,
        },
      },
    });
    console.log(data);
    if (data?.codeRecovery) {
      navigation.navigate('StepFive', {
        email: route.params.email,
        phone: route.params.phone,
      });
    }
  };
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
              if (step < 1) {
                navigation.goBack();
              }
              setStep(step - 1);
            }}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icon name="arrow-left" width={20} height={30} />
          </TouchableOpacity>
          <Title>Cadastro</Title>
          <TouchableOpacity
            onPress={() => {}}
            style={{ width: 20 }}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          />
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
                handleSms();
              }}
            >
              <ResendText disabled={timer > 0}>
                Reenviar (0:{timer < 10 && '0'}
                {timer})
              </ResendText>
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator size="large" color="#0564FF" />}
          <Button
            name="Próximo"
            onPress={() => handleSubmit()}
            disabled={loading || value.length < 1}
          />
        </Wrapper>
      </SafeAreaView>
    </>
  );
};

export default StepFour;
