/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import { gql, useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { ReactText, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  NativeModules,
  Platform,
  StatusBar,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import Materialcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
// import CenteredInput from '~/components/CenteredInput';
// import Input from '~/components/Input';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { translate } from '~/locales';
import colors from '~/styles/colors';

import {
  HeaderContainer,
  LoginButtonContainer,
  LoginContainer,
} from './styles';

const { UIManager } = NativeModules;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GET_ALL_STATES = gql`
  query getAllStatess($pagination: PaginationInput!) {
    getStates(pagination: $pagination) {
      states {
        id
        abbreviation
      }
    }
  }
`;
const GET_ALL_CITY = gql`
  query getCity($input: CitiesInput!, $pagination: PaginationInput!) {
    getCity(data: $input, pagination: $pagination) {
      cities {
        id
        name
      }
    }
  }
`;

interface IOption {
  name: string;
  id: string;
}

interface IPicker {
  label: string;
  value: string;
}

interface IStates {
  id: string;
  abbreviation: string;
}

const CREATE_COMPANY = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(data: $input) {
      business_name
    }
  }
`;

const CreateCommercialAccount: React.FC = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userSite, setUserSite] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [step, setStep] = useState<number>(6);
  const [actualPage, setPage] = React.useState<number>(1);
  const [category, setCategory] = useState<string | ReactText>();
  const [stateSelected, setStateSelected] = useState<string>();
  const [userId, setUserID] = React.useState('');
  const [citySelected, setCitySelected] = useState<string | ReactText>();
  const [changedState, setChangedState] = useState<boolean>(true);
  const [loginContainerMargin, setLoginContainerMargin] = useState<string>(
    '25%',
  );
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const { data: getAllCities, loading, refetch } = useQuery(GET_ALL_CITY, {
    onError: () => {
      setLoadingCities(false);
    },
    variables: {
      input: {
        state_id: stateSelected,
      },
      pagination: {
        offset: 900, // TODO: CHANGE THIS
        page: actualPage,
      },
    },
  });
  const { data: statesPayload, loading: loadingStates } = useQuery(
    GET_ALL_STATES,
    {
      variables: {
        pagination: {
          offset: 27,
          page: 1,
        },
      },
    },
  );
  const [createCompany] = useMutation(CREATE_COMPANY, {
    errorPolicy: 'all',
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
  const formRef = useRef<FormHandles>(null);

  const handleNextStep = () => {
    LayoutAnimation.linear();
    // eslint-disable-next-line no-unused-expressions
    formRef?.current?.submitForm();
  };
  const handlePreviousStep = () => {
    LayoutAnimation.spring();
    if (step > 1) setStep(step - 1);
  };

  interface LoginData {
    email: string;
    password: string;
    business_name: string;
    phone_number: string;
    address_one: string;
    address_two: string;
    site: string;
  }
  const getData = async () => {
    try {
      const universalToken = await AsyncStorage.getAllKeys();
      const uniqueToken = await AsyncStorage.getItem(universalToken[0]);
      if (uniqueToken) setUserID(uniqueToken);
    } catch (e) {
      // error reading value
    }
  };
  const handleSubmit = async (data: LoginData, { reset }: any) => {
    try {
      formRef.current.setErrors({});
      if (step === 1) {
        const schema = Yup.object().shape({
          business_name: Yup.string().required(
            translate('you_must_enter_a_name'),
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        setBusinessName(data.business_name);
        setStep(2);
      }
      if (step === 2) {
        const siteWithHttp = {
          site: `http://${data.site}`,
        };
        const schema = Yup.object().shape({
          site: Yup.string().url(translate('must_be_a_valid_url')),
        });
        await schema.validate(siteWithHttp, {
          abortEarly: false,
        });
        setUserSite(`http://${data.site}`);
        setStep(3);
      }
      if (step === 3) {
        if (category === '')
          Alert.alert('Error', translate('you_must_select_one_category'));
        if (category !== '') setStep(4);
      }
      if (step === 4) {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email(translate('must_be_a_valid_email'))
            .required(translate('you_must_enter_a_email')),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        setUserEmail(data.email);
        setStep(5);
      }
      if (step === 5) {
        const schema = Yup.object().shape({
          phone_number: Yup.string()
            .min(9, translate('invalid_number_phone'))
            .required(translate('you_must_enter_a_phone')),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        setUserPhone(`+55${data.phone_number}`);
        setStep(6);
      }

      if (step === 6) {
        const { data: companyCreated } = await createCompany({
          variables: {
            input: {
              business_name: businessName,
              fantasy_name: businessName,
              phone_number: userPhone,
              email: userEmail,
              address_one: data.address_one,
              address_two: data.address_two,
              city_id: citySelected,
              site: userSite,
              user_id: userId,
            },
          },
        });
        if (companyCreated) {
          Alert.alert('Conta comercial criada!');
          navigation.navigate('Posts', { commercialAccountCreated: true });
        }
      }
      reset();
    } catch (err) {
      const validationErrors = {};

      if (err instanceof Yup.ValidationError) {
        Vibration.vibrate();
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
  };
  const _keyboardDidShow = () => {
    LayoutAnimation.linear();
    setLoginContainerMargin('10%');
  };
  const _keyboardDidHide = () => {
    LayoutAnimation.linear();
    setLoginContainerMargin('25%');
  };
  useEffect(() => {
    getData();
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: Platform.OS === 'ios' ? 14 : 14,
        paddingVertical: Platform.OS === 'ios' ? 20 : 20,
      }}
    >
      {/* <KeyboardAvoidingView */}
      {/*  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} */}
      {/*  style={{ flex: 1 }} */}
      {/* > */}
      {/*  <StatusBar */}
      {/*    translucent */}
      {/*    barStyle="dark-content" */}
      {/*    backgroundColor="transparent" */}
      {/*  /> */}
      {/*  <HeaderContainer> */}
      {/*    {step >= 2 && ( */}
      {/*      <TouchableOpacity onPress={() => handlePreviousStep()}> */}
      {/*        <Materialcons */}
      {/*          name="keyboard-arrow-left" */}
      {/*          size={38} */}
      {/*          color={colors.blackGrey} */}
      {/*        /> */}
      {/*      </TouchableOpacity> */}
      {/*    )} */}
      {/*    {step >= 1 && ( */}
      {/*      <Progress.Bar */}
      {/*        progress={(step * 100) / 6 / 100} */}
      {/*        width={ */}
      {/*          step === 1 */}
      {/*            ? widthPercentageToDP('96') */}
      {/*            : widthPercentageToDP('70') */}
      {/*        } */}
      {/*        color={colors.purple} */}
      {/*        style={{ backgroundColor: '#E3E3E3', borderWidth: 0 }} */}
      {/*      /> */}
      {/*    )} */}
      {/*  </HeaderContainer> */}
      {/*  <Form ref={formRef} onSubmit={handleSubmit}> */}
      {/*    <LoginContainer style={{ marginTop: loginContainerMargin }}> */}
      {/*      <View */}
      {/*        style={{ */}
      {/*          flex: 1, */}
      {/*          justifyContent: 'space-around', */}
      {/*          alignItems: 'center', */}
      {/*          marginBottom: step > 0 ? -100 : 100, */}
      {/*        }} */}
      {/*      > */}
      {/*        {step === 1 && ( */}
      {/*          <CenteredInput */}
      {/*            label={translate('business_name')} */}
      {/*            name="business_name" */}
      {/*            keyboardType="default" */}
      {/*            autoCorrect={false} */}
      {/*          /> */}
      {/*        )} */}
      {/*        {step === 2 && ( */}
      {/*          <CenteredInput */}
      {/*            label={translate('your_website')} */}
      {/*            name="site" */}
      {/*            keyboardType="url" */}
      {/*            autoCorrect={false} */}
      {/*          /> */}
      {/*        )} */}
      {/*        {step === 3 && ( */}
      {/*          <Picker */}
      {/*            selectedValue={category} */}
      {/*            style={{ */}
      {/*              height: 50, */}
      {/*              width: '80%', */}
      {/*              color: colors.darkGrey, */}
      {/*              fontFamily: 'Montserrat-Regular', */}
      {/*            }} */}
      {/*            itemStyle={{ */}
      {/*              color: colors.darkGrey, */}
      {/*              fontFamily: 'Montserrat-Regular', */}
      {/*            }} */}
      {/*            onValueChange={(itemValue) => setCategory(itemValue)} */}
      {/*          > */}
      {/*            <Picker.Item label="Industria" value="industry" /> */}
      {/*            <Picker.Item label="Personal" value="personal" /> */}
      {/*            <Picker.Item label="Coach" value="coach" /> */}
      {/*          </Picker> */}
      {/*        )} */}
      {/*        {step === 4 && ( */}
      {/*          <CenteredInput */}
      {/*            label={translate('business_email')} */}
      {/*            name="email" */}
      {/*            keyboardType="email-address" */}
      {/*            autoCompleteType="email" */}
      {/*            autoCorrect={false} */}
      {/*          /> */}
      {/*        )} */}

      {/*        {step === 5 && ( */}
      {/*          <CenteredInput */}
      {/*            label={translate('contact_phone')} */}
      {/*            name="phone_number" */}
      {/*            keyboardType="numeric" */}
      {/*            autoCompleteType="tel" */}
      {/*            autoCorrect={false} */}
      {/*          /> */}
      {/*        )} */}

      {/*        {step === 6 && ( */}
      {/*          <View style={{ flex: 1, alignItems: 'center' }}> */}
      {/*            <Input */}
      {/*              label={translate('address_one')} */}
      {/*              name="address_one" */}
      {/*              keyboardType="default" */}
      {/*              secureTextEntry={false} */}
      {/*              autoCompleteType="street-address" */}
      {/*              autoCorrect={false} */}
      {/*            /> */}
      {/*            <View */}
      {/*              style={{ */}
      {/*                flexDirection: 'row', */}
      {/*                justifyContent: 'space-around', */}
      {/*                alignItems: 'center', */}
      {/*                marginTop: 40, */}
      {/*              }} */}
      {/*            > */}
      {/*              <Input */}
      {/*                label={translate('address_two')} */}
      {/*                name="address_two" */}
      {/*                secureTextEntry={false} */}
      {/*                autoCompleteType="email" */}
      {/*                autoCorrect={false} */}
      {/*                style={{ width: '45%' }} */}
      {/*              /> */}
      {/*              <View style={{ marginHorizontal: 10 }} /> */}
      {/*              <Input */}
      {/*                label={translate('zipcode')} */}
      {/*                name="zipcode" */}
      {/*                secureTextEntry={false} */}
      {/*                keyboardType="number-pad" */}
      {/*                autoCompleteType="email" */}
      {/*                autoCorrect={false} */}
      {/*                style={{ width: '45%' }} */}
      {/*              /> */}
      {/*            </View> */}
      {/*            <View */}
      {/*              style={{ */}
      {/*                flexDirection: 'row', */}
      {/*                justifyContent: 'space-between', */}
      {/*              }} */}
      {/*            > */}
      {/*              <Picker */}
      {/*                selectedValue={stateSelected} */}
      {/*                style={{ */}
      {/*                  height: 50, */}
      {/*                  width: '30%', */}
      {/*                  color: colors.darkGrey, */}
      {/*                  fontFamily: 'Montserrat-Regular', */}
      {/*                }} */}
      {/*                itemStyle={{ */}
      {/*                  color: colors.darkGrey, */}
      {/*                  fontFamily: 'Montserrat-Regular', */}
      {/*                }} */}
      {/*                onValueChange={(itemValue) => { */}
      {/*                  setChangedState(true); */}
      {/*                  setPage(1); */}
      {/*                  setStateSelected(itemValue); */}
      {/*                }} */}
      {/*              > */}
      {/*                {statesPayload && */}
      {/*                  statesPayload.getStates && */}
      {/*                  statesPayload.getStates.states.map((item) => ( */}
      {/*                    <Picker.Item */}
      {/*                      label={item.abbreviation} */}
      {/*                      value={item.id} */}
      {/*                    /> */}
      {/*                  ))} */}
      {/*              </Picker> */}
      {/*              <Picker */}
      {/*                enabled={!loading} */}
      {/*                selectedValue={citySelected} */}
      {/*                style={{ */}
      {/*                  height: 50, */}
      {/*                  width: '70%', */}
      {/*                  color: colors.darkGrey, */}
      {/*                  fontFamily: 'Montserrat-Regular', */}
      {/*                }} */}
      {/*                itemStyle={{ */}
      {/*                  color: colors.darkGrey, */}
      {/*                  fontFamily: 'Montserrat-Regular', */}
      {/*                }} */}
      {/*                onTouchEnd={async () => { */}
      {/*                  setPage((prevState) => prevState + 1); */}
      {/*                  await refetch(); */}
      {/*                  console.log('teste'); */}
      {/*                }} */}
      {/*                onValueChange={(itemValue) => setCitySelected(itemValue)} */}
      {/*              > */}
      {/*                {!loading && */}
      {/*                  getAllCities && */}
      {/*                  getAllCities.getCity && */}
      {/*                  getAllCities.getCity.cities.map((item) => ( */}
      {/*                    <Picker.Item value={item.id} label={item.name} /> */}
      {/*                  ))} */}
      {/*              </Picker> */}
      {/*              {loadingCities && stateSelected !== '' && ( */}
      {/*                <ActivityIndicator */}
      {/*                  size="small" */}
      {/*                  color={colors.purple} */}
      {/*                  style={{ */}
      {/*                    position: 'absolute', */}
      {/*                    right: '37%', */}
      {/*                    bottom: 10, */}
      {/*                  }} */}
      {/*                /> */}
      {/*              )} */}
      {/*            </View> */}
      {/*          </View> */}
      {/*        )} */}
      {/*      </View> */}
      {/*      <View */}
      {/*        style={{ */}
      {/*          marginTop: 150, */}
      {/*          justifyContent: 'space-between', */}
      {/*          alignItems: 'flex-end', */}
      {/*          flexDirection: 'column', */}
      {/*        }} */}
      {/*      > */}
      {/*        {step >= 1 && ( */}
      {/*          <TouchableOpacity */}
      {/*            onPress={() => handleNextStep()} */}
      {/*            style={{ */}
      {/*              marginRight: Platform.OS === 'ios' ? -60 : -60, */}
      {/*            }} */}
      {/*            disabled={citySelected === '' && step === 8} */}
      {/*          > */}
      {/*            <LoginButtonContainer> */}
      {/*              <Materialcons */}
      {/*                name="arrow-forward" */}
      {/*                size={28} */}
      {/*                color={colors.purple} */}
      {/*              /> */}
      {/*            </LoginButtonContainer> */}
      {/*          </TouchableOpacity> */}
      {/*        )} */}
      {/*      </View> */}
      {/*    </LoginContainer> */}
      {/*  </Form> */}
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default CreateCommercialAccount;
