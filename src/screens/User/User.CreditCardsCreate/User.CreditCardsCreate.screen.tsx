import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TextInput,
  View,
  Insets,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { TextInputMask } from 'react-native-masked-text';
import * as Yup from 'yup';
import { isDate, parse } from 'date-fns';
import valid from 'card-validator';
import { ActivityIndicator } from 'react-native-paper';
import {
  Container,
  Header,
  GoBackTouchable,
  AddCardTouchable,
  AddCardText,
  BoxViewCard,
  CardSvgBackground,
  CardContentContainer,
  ItemLabelText,
  ItemValueText,
  ItemRow,
} from '~/styles/pages/PersonalAccount/CreditCards.Create';
import { Icons, SafeAreaView, SmallText, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  GetCardsDocument,
  useCreateCardMutation,
} from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';

import validateCpf from '~/helpers/validateCpf';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.PaymentAward'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.PaymentAward'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

type InputTypes =
  | 'card_number'
  | 'card_expiration_date'
  | 'card_cvv'
  | 'card_holder_name'
  | 'credit_card_name'
  | 'legal_holder_number';

const UserCreditCardsCreate: React.FC<Props> = ({ navigation }) => {
  const { goBack } = navigation;
  const [currentInput, setCurrentInput] = useState<InputTypes>('card_number');
  const [loading, setLoading] = useState(false);
  const scrollView = useRef<ScrollView>(null);
  const card_number = useRef<TextInputMask>(null);
  const card_expiration_date = useRef<TextInputMask>(null);
  const card_cvv = useRef<TextInputMask>(null);
  const card_holder_name = useRef<TextInput>(null);
  const credit_card_name = useRef<TextInput>(null);
  const legal_holder_number = useRef<TextInputMask>(null);

  // eslint-disable-next-line prefer-const
  console.log(
    '🚀 ~ file: User.CreditCardsCreate.screen.tsx ~ line 79 ~ currentInput',
    currentInput,
  );

  const [firstAccess, setFirstAccess] = useState(true);

  const [createCardMutation] = useCreateCardMutation({
    onCompleted: () => {
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
  const { userID } = useUserToken();

  function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, 'MM/yy', new Date());

    return parsedDate;
  }
  const today = new Date();
  const validationSchema = Yup.object().shape({
    card_number: Yup.string().min(15, '*obrigatório').required('*obrigatório'),
    card_expiration_date: Yup.date()
      .transform(parseDateString)
      .min(today, '*inválido')
      .typeError('*inválido'),
    card_cvv: Yup.string().min(3, '*obrigatório').required('*obrigatório'),
    card_holder_name: Yup.string().required('*obrigatório'),
    credit_card_name: Yup.string()
      .required('*obrigatório')
      .min(2, '*ao menos 2 caracteres'),

    legal_holder_number: Yup.string().test(
      'cpf valido',
      'cpf invalido',
      (value) => validateCpf(value?.replace(/[.-]/g, '')),
    ),
  });

  type InitialValues = {
    card_number: string;
    card_cvv: string;
    type: string;
    card_expiration_date: string;
    card_holder_name: string;
    credit_card_name: string;
    legal_holder_number: string;
  };
  const initalValues = {
    card_number: '',
    card_cvv: '',
    type: '',
    card_expiration_date: '',
    card_holder_name: '',
    credit_card_name: '',
    legal_holder_number: '',
  };

  const toggleHeaderTitle = (values: typeof initalValues) => {
    return values.credit_card_name === ''
      ? 'Novo Cartão'
      : values.credit_card_name;
  };

  const toogleCardBrandFlag = (values: typeof initalValues) => {
    const acceptedBrand = [
      'visa',
      'mastercard',
      'amex',
      'elo',
      'hipercard',
      'aura',
      'jcb',
      'diners',
      'discover',
      'maestro',
    ];
    if (acceptedBrand.includes(values.type)) {
      return values?.type === ''
        ? 'credit-card-white'
        : values?.type ?? 'credit-card-white';
    }
    return 'credit-card-white';
  };

  const hitSlopBase: Insets = { left: 10, right: 10, top: 10, bottom: 10 };

  function handlePrevious() {
    switch (currentInput) {
      case 'card_number':
        break;
      case 'card_expiration_date':
        card_number.current.getElement().focus();
        break;
      case 'card_cvv':
        card_expiration_date.current.getElement().focus();

        break;
      case 'card_holder_name':
        card_cvv.current.getElement().focus();
        break;
      case 'credit_card_name':
        card_holder_name.current.focus();
        break;
      case 'legal_holder_number':
        Keyboard.dismiss();
        setTimeout(() => {
          credit_card_name.current.focus();
        }, 350);

        break;
      default:
        break;
    }
  }

  function handleNext(isValid: boolean) {
    switch (currentInput) {
      case 'card_number':
        card_expiration_date.current.getElement().focus();
        scrollView.current?.scrollTo({ x: widthPercentageToDP('60') * 1.1 });
        break;
      case 'card_expiration_date':
        card_cvv.current.getElement().focus();
        scrollView.current?.scrollTo({ x: widthPercentageToDP('60') * 1.7 });
        break;
      case 'card_cvv':
        Keyboard.dismiss();
        setTimeout(() => {
          card_holder_name.current.focus();
          scrollView.current?.scrollTo({ x: widthPercentageToDP('60') * 2.21 });
        }, 350);

        break;
      case 'card_holder_name':
        credit_card_name.current.focus();
        scrollView.current?.scrollTo({ x: widthPercentageToDP('60') * 3.4 });
        break;
      case 'credit_card_name':
        Keyboard.dismiss();
        legal_holder_number.current.getElement().focus();
        scrollView.current?.scrollTo({ x: widthPercentageToDP('60') * 4.6 });
        break;
      case 'legal_holder_number':
        break;
      default:
        break;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="dark-content" />

      {true && (
        <Formik
          validateOnMount
          validateOnChange
          validateOnBlur
          validationSchema={validationSchema}
          initialValues={initalValues}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            const { data: responseCreateCard } = await createCardMutation({
              variables: {
                data: {
                  card_cvv: values.card_cvv,
                  card_expiration_date: values.card_expiration_date.replace(
                    '/',
                    '',
                  ),
                  card_holder_name: values.card_holder_name.trim(),
                  legal_holder_number: values.legal_holder_number.replace(
                    /[.-]/g,
                    '',
                  ),
                  card_number: values.card_number,
                  name: values.credit_card_name.trim(),
                },
              },
              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetCardsDocument,
                  variables: {
                    pagination: { page: 1, offset: 5 },
                    user_id: userID,
                  },
                },
              ],
            });
            if (responseCreateCard) {
              resetForm({
                card_number: '',
                card_cvv: '',
                type: '',
                card_expiration_date: '',
                card_holder_name: '',
                credit_card_name: '',
                legal_holder_number: '',
              });
              goBack();
            }
          }}
        >
          {({
            values,
            handleChange,
            errors,
            handleSubmit,
            isValid,
            setFieldError,
            setFieldValue,
            setFieldTouched,
            validateField,
          }) => {
            return (
              <>
                <Container>
                  <StatusBar barStyle="dark-content" />
                  <Header>
                    <GoBackTouchable onPress={goBack}>
                      <Icons name="arrow-left" width={30} />
                    </GoBackTouchable>

                    <TitleText>{toggleHeaderTitle(values)}</TitleText>
                    {loading ? (
                      <ActivityIndicator size="small" color="#0564FF" />
                    ) : (
                      <View style={{ width: 20 }} />
                    )}
                  </Header>

                  <BoxViewCard>
                    <CardSvgBackground />
                    <CardContentContainer
                      width={widthPercentageToDP('85')}
                      height={widthPercentageToDP('50')}
                    >
                      <ItemRow totalWidth>
                        <ItemRow isColumn>
                          <ItemLabelText>NÚMERO</ItemLabelText>
                          <ItemValueText cardNumber>
                            {values.card_number}
                          </ItemValueText>
                        </ItemRow>
                        <Icons
                          name={toogleCardBrandFlag(values)}
                          width={60}
                          height={40}
                        />
                      </ItemRow>

                      <ItemRow totalWidth={false}>
                        <View>
                          <ItemLabelText>EXPIRA EM</ItemLabelText>
                          <ItemValueText>
                            {values.card_expiration_date}
                          </ItemValueText>
                        </View>

                        <View>
                          <ItemLabelText>CVC</ItemLabelText>
                          <ItemValueText>{values.card_cvv}</ItemValueText>
                        </View>
                      </ItemRow>

                      <ItemRow totalWidth={false}>
                        <View>
                          <ItemLabelText>PORTADOR</ItemLabelText>
                          <ItemValueText>
                            {values.card_holder_name}
                          </ItemValueText>
                        </View>

                        <View>
                          <ItemLabelText>CPF</ItemLabelText>
                          <ItemValueText>
                            {values.legal_holder_number}
                          </ItemValueText>
                        </View>
                      </ItemRow>
                    </CardContentContainer>
                  </BoxViewCard>

                  <ScrollView
                    ref={scrollView}
                    keyboardShouldPersistTaps="always"
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled
                    horizontal
                    contentContainerStyle={{
                      paddingHorizontal: 16,
                    }}
                  >
                    <View
                      style={{
                        marginRight: 32,
                      }}
                    >
                      <View style={{ width: widthPercentageToDP('60') }}>
                        <SmallText>Número do cartão</SmallText>
                        <TextInputMask
                          ref={card_number}
                          type="credit-card"
                          inputAccessoryViewID="credit-card"
                          onFocus={() => {
                            setCurrentInput('card_number');
                          }}
                          autoFocus
                          onBlur={() => setFieldTouched('card_number')}
                          hitSlop={hitSlopBase}
                          style={{
                            paddingBottom: 5,
                            borderBottomWidth: errors.card_number
                              ? 1
                              : card_number.current?.getElement().isFocused()
                              ? 1
                              : 0,
                            borderBottomColor: errors.card_number
                              ? 'red'
                              : card_number.current?.getElement().isFocused()
                              ? '#0564FF'
                              : '#fff',
                          }}
                          keyboardType="numeric"
                          options={{
                            obfuscated: false,
                          }}
                          placeholder="5283 8811 5413 8143"
                          value={values.card_number}
                          onChangeText={(maskedText) => {
                            setFirstAccess(false);
                            setFieldValue('card_number', maskedText);
                            const numberValidation = valid.number(maskedText);
                            if (numberValidation.card) {
                              setFieldValue('type', numberValidation.card.type);
                            }
                            if (!numberValidation.isValid) {
                              setFieldError('card_number', '* inválido');
                            } else {
                              setFieldError('card_number', undefined);
                            }
                          }}
                        />
                        <Text style={{ fontSize: 12, color: 'red' }}>
                          {errors.card_number}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: widthPercentageToDP('25'),
                        marginRight: 32,
                      }}
                    >
                      <SmallText>Validade</SmallText>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TextInputMask
                          ref={card_expiration_date}
                          onFocus={() => {
                            setCurrentInput('card_expiration_date');
                          }}
                          onBlur={() => {
                            setFieldTouched('card_expiration_date');
                          }}
                          editable={valid.number(values.card_number).isValid}
                          type="custom"
                          keyboardType="numeric"
                          options={{
                            mask: '99/99',
                          }}
                          placeholder="MM/AA"
                          hitSlop={{
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
                          }}
                          style={{
                            paddingBottom: 5,
                            borderBottomWidth: errors.card_expiration_date
                              ? 1
                              : card_expiration_date.current
                                  ?.getElement()
                                  .isFocused()
                              ? 1
                              : 0,
                            borderBottomColor: errors.card_expiration_date
                              ? 'red'
                              : card_expiration_date.current
                                  ?.getElement()
                                  .isFocused()
                              ? '#0564FF'
                              : '#fff',
                          }}
                          value={values.card_expiration_date}
                          onChangeText={(e) => {
                            setFieldValue('card_expiration_date', e);
                            setTimeout(
                              () => validateField('card_expiration_date'),
                              50,
                            );
                          }}
                        />
                      </View>
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {errors.card_expiration_date}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: widthPercentageToDP('25'),
                        marginRight: 32,
                      }}
                    >
                      <SmallText>CVV</SmallText>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TextInputMask
                          ref={card_cvv}
                          onBlur={() => setFieldTouched('card_cvv')}
                          onFocus={() => {
                            setCurrentInput('card_cvv');
                          }}
                          editable={
                            values.card_expiration_date.length >= 5 && isValid
                          }
                          keyboardType="numeric"
                          type="custom"
                          options={{
                            mask: '9999',
                          }}
                          placeholder="ex: 123"
                          hitSlop={{
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
                          }}
                          style={{
                            paddingBottom: 5,
                            borderBottomWidth: errors.card_cvv
                              ? 1
                              : card_cvv.current?.getElement().isFocused()
                              ? 1
                              : 0,
                            borderBottomColor: errors.card_cvv
                              ? 'red'
                              : card_cvv.current?.getElement().isFocused()
                              ? '#0564FF'
                              : '#fff',
                          }}
                          value={values.card_cvv}
                          onChangeText={handleChange('card_cvv')}
                        />
                      </View>
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {errors.card_cvv}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: widthPercentageToDP('60'),
                        marginRight: 32,
                      }}
                    >
                      <SmallText>Nome do Titular</SmallText>
                      <TextInput
                        style={{
                          paddingBottom: 5,
                          borderBottomWidth: errors.card_holder_name
                            ? 1
                            : card_holder_name.current?.isFocused()
                            ? 1
                            : 0,
                          borderBottomColor: errors.card_holder_name
                            ? 'red'
                            : card_holder_name.current?.isFocused()
                            ? '#0564FF'
                            : '#fff',
                        }}
                        ref={card_holder_name}
                        onFocus={() => {
                          setCurrentInput('card_holder_name');
                        }}
                        onBlur={() => setFieldTouched('card_holder_name')}
                        editable={values.card_cvv.length >= 3}
                        placeholder="Jhon Doe"
                        spellCheck={false}
                        autoCompleteType="off"
                        autoCorrect={false}
                        value={values.card_holder_name}
                        onChangeText={handleChange('card_holder_name')}
                      />
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {errors.card_holder_name}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: widthPercentageToDP('60'),
                        marginRight: 32,
                      }}
                    >
                      <SmallText>Apelido do Cartão</SmallText>
                      <TextInput
                        style={{
                          paddingBottom: 5,
                          borderBottomWidth: errors.credit_card_name
                            ? 1
                            : credit_card_name.current?.isFocused()
                            ? 1
                            : 0,
                          borderBottomColor: errors.credit_card_name
                            ? 'red'
                            : credit_card_name.current?.isFocused()
                            ? '#0564FF'
                            : '#fff',
                        }}
                        ref={credit_card_name}
                        onBlur={() => setFieldTouched('credit_card_name')}
                        editable={values.card_holder_name.length > 0}
                        autoCompleteType="off"
                        autoCorrect={false}
                        onFocus={() => {
                          setCurrentInput('credit_card_name');
                        }}
                        placeholder="ex: Meu Cartao de compras"
                        value={values.credit_card_name}
                        onChangeText={handleChange('credit_card_name')}
                      />
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {errors.credit_card_name}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: widthPercentageToDP('80'),
                        marginRight: 32,
                      }}
                    >
                      <SmallText>CPF do Titular</SmallText>
                      <TextInputMask
                        ref={legal_holder_number}
                        onFocus={() => {
                          setCurrentInput('legal_holder_number');
                        }}
                        onBlur={() => setFieldTouched('legal_holder_number')}
                        type="cpf"
                        keyboardType="numeric"
                        autoCompleteType="off"
                        autoCorrect={false}
                        placeholder="123.123.123-12"
                        editable={values.credit_card_name.length > 0}
                        hitSlop={{
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10,
                        }}
                        style={{
                          paddingBottom: 5,
                          borderBottomWidth: errors.legal_holder_number
                            ? 1
                            : legal_holder_number.current
                                ?.getElement()
                                .isFocused()
                            ? 1
                            : 0,
                          borderBottomColor: errors.legal_holder_number
                            ? 'red'
                            : legal_holder_number.current
                                ?.getElement()
                                .isFocused()
                            ? '#0564FF'
                            : '#fff',
                        }}
                        value={values.legal_holder_number}
                        onChangeText={handleChange('legal_holder_number')}
                      />
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {errors.legal_holder_number}
                      </Text>
                    </View>
                  </ScrollView>
                </Container>

                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'gray',
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handlePrevious()}
                      disabled={currentInput === 'card_number'}
                      style={{
                        width: widthPercentageToDP('49.9'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 8,
                        backgroundColor: 'white',
                      }}
                    >
                      <Text
                        style={{
                          color:
                            currentInput === 'card_number' || !isValid
                              ? 'rgba(23, 28, 37, 0.5)'
                              : '#0564FF',
                        }}
                      >
                        Anterior
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      disabled={
                        !!(
                          values[currentInput].length <= 1 ||
                          errors[currentInput] ||
                          loading
                        )
                      }
                      onPress={() => {
                        if (currentInput === 'legal_holder_number') {
                          handleSubmit();
                        } else {
                          handleNext(isValid);
                        }
                      }}
                      style={{
                        width: widthPercentageToDP('49.9'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        paddingVertical: 8,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            values[currentInput].length <= 1 ||
                            errors[currentInput] ||
                            loading
                              ? 'rgba(23, 28, 37, 0.5)'
                              : '#0564FF',
                        }}
                      >
                        {currentInput === 'legal_holder_number'
                          ? loading
                            ? 'Salvando'
                            : 'Adicionar'
                          : 'Proximo'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </>
            );
          }}
        </Formik>
      )}
    </SafeAreaView>
  );
};

export default UserCreditCardsCreate;
