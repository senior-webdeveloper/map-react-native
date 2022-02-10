import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInputMask } from 'react-native-masked-text';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import styled from 'styled-components/native';
import { captureException } from '@sentry/react-native';
import * as Yup from 'yup';
import { isDate, parse } from 'date-fns';
import Analytics from 'appcenter-analytics';
import { Formik } from 'formik';
import { Card } from '~/graphql/autogenerate/schemas';
import { Icons, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import {
  GetProfileDocument,
  useCreateCardMutation,
  useGetCardsQuery,
  useSubscribeUserChallengeMutation,
  useUpdateProfilePersonalMutation,
  useCalculateInstallmentsLazyQuery,
  useCalculateInstallmentsQuery,
} from '~/graphql/autogenerate/hooks';
import {
  OptionContainer,
  SubscribeContainer,
} from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreActions, useStoreState } from '~/store';
import { useUserInfo, useUserToken } from '~/hooks';
import CheckBox from '~/components/Checkbox';
import validateCpf from '~/helpers/validateCpf';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import formatCurrency from '~/helpers/formatCurrency';

export const OptionImage = styled(FastImage)``;
const RefeshContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 20px 0 80px;
`;
const RefeshText = styled(Text)`
  margin-right: 9px;
  color: ${({ theme }) => theme.colors.blue};
`;

type ChallengeDescriptionRouteProp = RouteProp<
  PaymentAwardRootParamList,
  'selectInstallments'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
  'selectInstallments'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function SelectInstallments({
  route,
  navigation,
}: Props): JSX.Element {
  const { profileID } = useUserToken();
  const { data: userProfile } = useUserInfo();

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
  });

  const cpfSchema = Yup.object().shape({
    legal_registry_number: Yup.string().test(
      'cpf valido',
      'cpf invalido',
      (value) => validateCpf(value.replace(/[.-]/g, '')),
    ),
  });


  return (
    <Formik
      validationSchema={cpfSchema}
      initialValues={{ legal_registry_number: '' }}
      onSubmit={async (values) => {
        const { data } = await updateProfilePersonalMutation({
          variables: {
            data: {
              firstname: userProfile?.getProfile.user.firstname,
              lastname: userProfile?.getProfile.user.lastname,
              username: userProfile?.getProfile.username,
              legal_registry_number: values.legal_registry_number.replace(
                /\D+/g,
                '',
              ),
            },
          },
        });

        if (data) {
          if (!userProfile?.getProfile.user.phone) {
            navigation.push('addPhoneNumber');
          } else {
            navigation.push('selectMethod');
          }
        }
      }}
    >
      {({ values, handleChange, handleSubmit, isValid, errors }) => (
        <>
          <View
            style={{
              height: heightPercentageToDP('85'),
              paddingTop: 50,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                marginVertical: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.push('selectAddress');
                }}
              >
                <Icons name="arrow-left" />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!isValid}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text
                  style={{
                    color: isValid ? '#0564FF' : 'rgba(0, 0, 0, 0.56)',
                  }}
                >
                  Próximo
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 24 }}>
              <TitleText>Informe seu CPF</TitleText>
              <Text style={{ opacity: 0.56 }}>
                Será utilizado apenas para emissão da Nota Fiscal
                Eletrônica.
              </Text>
            </View>

            <>
              <View
                style={{
                  paddingTop: 26,
                  marginBottom: 15,
                  borderBottomColor: errors.legal_registry_number
                    ? 'red'
                    : '#161C25',
                  borderBottomWidth: 0.5,
                  paddingVertical: 12,
                  width: '60%',
                }}
              >
                <TextInputMask
                  type="cpf"
                  keyboardType="numeric"
                  placeholder="123.123.123-12"
                  hitSlop={{
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                  }}
                  value={values.legal_registry_number}
                  onChangeText={handleChange('legal_registry_number')}
                />
              </View>
              <Text style={{ color: 'red' }}>
                {errors.legal_registry_number}
              </Text>
            </>
          </View>
        </>
      )}
    </Formik>
  );
}
