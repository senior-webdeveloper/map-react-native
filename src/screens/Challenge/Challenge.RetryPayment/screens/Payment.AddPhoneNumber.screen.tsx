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

  return (
    <Formik
      initialValues={{ phone_number: '' }}
      onSubmit={async (values) => {
        const { data } = await updateProfilePersonalMutation({
          variables: {
            data: {
              firstname: userProfile?.getProfile.user.firstname,
              lastname: userProfile?.getProfile.user.lastname,
              username: userProfile?.getProfile.username,
              phone_number: `+55${values.phone_number.replace(/\D+/g, '')}`,
            },
          },
        });

        if (data) {
          navigation.push('selectMethod', { ...route.params });
        }
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <>
          <View
            style={{
              height: heightPercentageToDP('85'),
              paddingHorizontal: 16,
              paddingTop: 50,
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
                  handleSubmit();
                }}
              >
                <Icons name="arrow-left" />
              </TouchableOpacity>
              {values.phone_number.length > 14 && (
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <Text style={{ color: '#0564FF' }}>Próximo</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ marginTop: 24 }}>
              <TitleText>Informe seu telefone</TitleText>
              <Text style={{ opacity: 0.56 }}>
                Caso tenhamos alguma dificuldade no envio, entraremos em contato
                no telefone abaixo
              </Text>
            </View>

            <>
              <View
                style={{
                  paddingTop: 26,
                  marginBottom: 15,
                  borderBottomColor: '#161C25',
                  borderBottomWidth: 0.5,
                  paddingVertical: 12,
                  width: '60%',
                }}
              >
                <TextInputMask
                  type="cel-phone"
                  keyboardType="numeric"
                  placeholder="(99) 99999-9999"
                  hitSlop={{
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                  }}
                  value={values.phone_number}
                  onChangeText={handleChange('phone_number')}
                />
              </View>
            </>
          </View>
        </>
      )}
    </Formik>
  );
}
