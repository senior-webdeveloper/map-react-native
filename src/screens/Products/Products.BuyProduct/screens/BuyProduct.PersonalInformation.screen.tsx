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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
import { format } from 'date-fns';
import Analytics from 'appcenter-analytics';
import { Formik } from 'formik';
import { isDate } from 'lodash';
import { useRecoilValue } from 'recoil';
import { dbCLient, IDataCompiledSchema, IUserSchema } from '~/db';
import { Icons, Text, TitleText, SnackBar, Picker } from '~/components';
import { TypeSnackBar } from '~/components/Snackbar';
import { Card } from '~/graphql/autogenerate/schemas';
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
import { FooterContainer } from '~/screens/Activity/Activity.StravaLink/Activity.StravaLink';
import {
  CurrencyText,
  ValueText,
  NextButton,
  NextButtonText,
} from '~/screens/Challenge/Challenge.Description/components/BuyModal/styles';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

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

export default function PersonalInformation({
  route,
  navigation,
}: Props): JSX.Element {
  const cartStatus = useRecoilValue(_cartStatus);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { data: challengeData, award_index, rootNavigation } = route.params;
  const { profileID, userID } = useUserToken();
  const userProfile = useStoreState(({ profile }) => profile.payload);
  const setUserProfile = useStoreActions(
    (actions) => actions.profile.saveUserInfo,
  );
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);
  const [updateProfilePersonalMutation, { loading }] =
    useUpdateProfilePersonalMutation({
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
      onError: (e) => {
        setSnackBarMessage(e.message);
        setTypeSnack('error');
        setShowSnackBar(true);
      },
    });

  const cpfSchema = Yup.object().shape({
    firstname: Yup.string().required('* Campo obrigatório'),
    lastname: Yup.string().required('* Campo obrigatório'),
    date_of_birth: Yup.date().required('* Campo obrigatório'),
    gender: Yup.string().min(1).required('* Campo obrigatório').nullable(),
    legal_registry_number: Yup.string().test(
      'cpf valido',
      'cpf invalido',
      (value) => validateCpf(value.replace(/[.-]/g, '')),
    ),
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <Formik
      validationSchema={cpfSchema}
      validateOnBlur
      validateOnChange
      validateOnMount
      initialValues={{
        legal_registry_number: userProfile?.getProfile.user
          .legal_registry_number
          ? userProfile?.getProfile.user.legal_registry_number
          : '',
        firstname: userProfile?.getProfile.user.firstname
          ? userProfile.getProfile.user.firstname
          : '',
        lastname: userProfile?.getProfile.user.lastname
          ? userProfile.getProfile.user.lastname
          : '',
        phone: userProfile?.getProfile.user.phone
          ? userProfile?.getProfile.user.phone
          : '',
        date_of_birth: userProfile?.getProfile.user.date_of_birth
          ? userProfile?.getProfile.user.date_of_birth
          : '',
        team_name: userProfile?.getProfile.user.team_name
          ? userProfile?.getProfile.user.team_name
          : '',
        gender: userProfile?.getProfile.user.gender
          ? userProfile?.getProfile.user.gender
          : '',
      }}
      onSubmit={async (values) => {
        const realmUser = await dbCLient();
        if (userID) {
          const userLocal = realmUser.objectForPrimaryKey<IUserSchema>(
            'User',
            userID,
          );
          if (userLocal) {
            realmUser.write(() => {
              userLocal.gender = values.gender;
              userLocal.phone = values.phone;
              userLocal.firstname = values.firstname;
              userLocal.lastname = values.lastname;
              userLocal.team_name = values.team_name;
              userLocal.gender = values.gender;
              userLocal.date_of_birth = new Date(
                values.date_of_birth,
              ).toISOString();
              userLocal.legal_registry_number =
                values.legal_registry_number.replace(/\D+/g, '');
            });
          }
        }

        setUserProfile({
          getProfile: {
            ...userProfile?.getProfile,
            user: {
              ...userProfile?.getProfile.user,
              firstname: values.firstname,
              lastname: values.lastname,
              team_name: values.team_name,
              username: userProfile?.getProfile.username,
              gender: values.gender,
              date_of_birth: new Date(values.date_of_birth),
              legal_registry_number: values.legal_registry_number.replace(
                /\D+/g,
                '',
              ),
            },
          },
        });
        const { data } = await updateProfilePersonalMutation({
          variables: {
            data: {
              firstname: values.firstname,
              lastname: values.lastname,
              username: userProfile?.getProfile.username,
              team_name: values.team_name,
              gender: values.gender,
              date_of_birth: new Date(values.date_of_birth),
              legal_registry_number: values.legal_registry_number.replace(
                /\D+/g,
                '',
              ),
            },
          },
        });

        if (data) {
          // if (!userProfile?.getProfile.user.phone) {
          //   navigation.push('addPhoneNumber', { ...route.params });
          // } else {
          navigation.push('confirmation', { ...route.params });
          // }
        }
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        isValid,
        errors,
        setFieldValue,
      }) => (
        <>
          <View
            style={{
              flex: 1,
              paddingTop: 50,
              paddingHorizontal: 16,
              backgroundColor: 'white',
            }}
          >
            <View
              style={{
                marginVertical: 15,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ marginRight: 20 }}
              >
                <Icons name="arrow-left" />
              </TouchableOpacity>
              <TitleText style={{ fontSize: 20, lineHeight: 20.1 }}>
                Informações Complementares
              </TitleText>
            </View>

            <ScrollView
              style={{ paddingBottom: 40 }}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View>
                <View style={{ marginTop: 14 }}>
                  <TitleText style={{ fontSize: 18, lineHeight: 18 }}>
                    Nome*
                  </TitleText>
                </View>

                <View
                  style={{
                    paddingTop: 10,
                    marginBottom: 5,
                    borderBottomColor: errors.firstname ? 'red' : '#161C25',
                    borderBottomWidth: 0.5,
                    paddingVertical: 12,
                    width: '60%',
                  }}
                >
                  <TextInput
                    hitSlop={{
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10,
                    }}
                    value={values.firstname}
                    onChangeText={handleChange('firstname')}
                  />
                </View>
                <Text style={{ color: 'red', marginBottom: 5 }}>
                  {errors.firstname}
                </Text>
                <Text style={{ opacity: 0.56, fontSize: 14, lineHeight: 14 }} />
              </View>

              <View>
                <View>
                  <TitleText style={{ fontSize: 18, lineHeight: 18 }}>
                    Sobrenome*
                  </TitleText>
                </View>

                <View
                  style={{
                    paddingTop: 10,
                    marginBottom: 5,
                    borderBottomColor: errors.lastname ? 'red' : '#161C25',
                    borderBottomWidth: 0.5,
                    paddingVertical: 12,
                    width: '60%',
                  }}
                >
                  <TextInput
                    hitSlop={{
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10,
                    }}
                    value={values.lastname}
                    onChangeText={handleChange('lastname')}
                  />
                </View>
                <Text style={{ color: 'red', marginBottom: 5 }}>
                  {errors.lastname}
                </Text>
                <Text style={{ opacity: 0.56, fontSize: 14, lineHeight: 14 }} />
              </View>

              <View>
                <View>
                  <TitleText style={{ fontSize: 18, lineHeight: 18 }}>
                    Equipe/Time
                  </TitleText>
                </View>

                <View
                  style={{
                    paddingTop: 5,
                    marginBottom: 5,
                    borderBottomColor: errors.team_name ? 'red' : '#161C25',
                    borderBottomWidth: 0.5,
                    paddingVertical: 12,
                    width: '60%',
                  }}
                >
                  <TextInput
                    hitSlop={{
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10,
                    }}
                    value={values.team_name}
                    onChangeText={handleChange('team_name')}
                  />
                </View>
                <Text style={{ color: 'red', marginBottom: 5 }}>
                  {errors.team_name}
                </Text>
                <Text style={{ opacity: 0.56, fontSize: 14, lineHeight: 14 }} />
              </View>

              <View>
                <TitleText style={{ fontSize: 18, lineHeight: 18 }}>
                  Gênero*
                </TitleText>
              </View>

              <View
                style={{
                  paddingTop: 10,
                  marginBottom: 5,
                  borderBottomColor: errors.gender ? 'red' : '#161C25',
                  borderBottomWidth: 0.5,
                  paddingVertical: 12,
                  width: '60%',
                }}
              >
                <Picker
                  data={[
                    {
                      label: 'Masculino',
                      value: 'M',
                    },
                    {
                      label: 'Feminino',
                      value: 'F',
                    },
                    {
                      label: 'Outro',
                      value: 'O',
                    },
                  ]}
                  value={values.gender}
                  onChangeValue={(e) => setFieldValue('gender', e)}
                />
              </View>
              <Text style={{ color: 'red', marginBottom: 5 }}>
                {errors.gender}
              </Text>
              <Text style={{ opacity: 0.56, fontSize: 14, lineHeight: 14 }} />

              <TouchableOpacity onPress={showDatePicker}>
                <View>
                  <TitleText style={{ fontSize: 18, lineHeight: 18 }}>
                    Data de Nascimento*
                  </TitleText>
                </View>

                <View
                  style={{
                    paddingTop: 10,
                    marginBottom: 5,
                    borderBottomColor: errors.date_of_birth ? 'red' : '#161C25',
                    borderBottomWidth: 0.5,
                    paddingVertical: 12,
                    width: '60%',
                  }}
                >
                  <Text>
                    {values.date_of_birth &&
                    values.date_of_birth.length > 0 &&
                    isDate(new Date(values.date_of_birth))
                      ? format(new Date(values.date_of_birth), "dd'/'MM'/'yyyy")
                      : null}
                  </Text>
                </View>
                <Text style={{ color: 'red', marginBottom: 5 }}>
                  {errors.date_of_birth}
                </Text>
                <Text style={{ opacity: 0.56, fontSize: 14, lineHeight: 14 }} />
              </TouchableOpacity>

              <View>
                <View>
                  <TitleText style={{ fontSize: 18, lineHeight: 18 }}>
                    Informe seu CPF*
                  </TitleText>
                </View>

                <View
                  style={{
                    paddingTop: 10,
                    marginBottom: 5,
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
                <Text style={{ color: 'red', marginBottom: 5 }}>
                  {errors.legal_registry_number}
                </Text>
                <Text style={{ opacity: 0.56, fontSize: 14, lineHeight: 14 }}>
                  Será utilizado apenas para emissão da Nota Fiscal Eletrônica.
                </Text>
              </View>
            </ScrollView>
            <FooterContainer
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 20,
              }}
            >
              {route.params.extraordinaryActions &&
              route.params.extraordinaryActions.bonus_subscription &&
              cartStatus.totalPrice <= 0 ? (
                <CurrencyText>
                  <Text style={{ color: '#009D33' }}>Bonificado</Text>
                </CurrencyText>
              ) : (
                <CurrencyText>
                  R${' '}
                  <ValueText>
                    {route.params.installments ? (
                      <>
                        {route.params.installments.installments_quantity}x{' '}
                        {!Number.isInteger(
                          route.params.installments.installment_value,
                        )
                          ? String(
                              Number(
                                route.params.installments.installment_value,
                              ).toFixed(2),
                            ).replace('.', ',')
                          : route.params.installments.installment_value}
                      </>
                    ) : (
                      <>
                        {!Number.isInteger(cartStatus.totalWithoutSub)
                          ? String(
                              Number(cartStatus.totalWithoutSub).toFixed(2),
                            ).replace('.', ',')
                          : cartStatus.totalWithoutSub}
                      </>
                    )}
                  </ValueText>
                </CurrencyText>
              )}

              <NextButton
                onPress={() => {
                  handleSubmit();
                }}
                disabled={
                  !isValid ||
                  loading ||
                  values.legal_registry_number.length <= 0
                }
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <NextButtonText style={{ fontSize: 20 }}>
                    Próximo
                  </NextButtonText>
                )}
              </NextButton>
            </FooterContainer>
          </View>

          <SnackBar
            show={showSnackBar}
            setShow={(e) => setShowSnackBar(e)}
            message={snackBarMessage}
            type={typeSnack}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={
              values.date_of_birth.length > 0
                ? new Date(values.date_of_birth)
                : new Date()
            }
            onConfirm={(date) => {
              setFieldValue('date_of_birth', String(date.toISOString()));
              hideDatePicker();
            }}
            onCancel={hideDatePicker}
          />
        </>
      )}
    </Formik>
  );
}
