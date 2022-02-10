import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, Platform, TouchableOpacity, View } from 'react-native';
import { authorize } from 'react-native-app-auth';
import Modal from 'react-native-modal';
import StravaLogin from '~/assets/btn_strava_connectwith_orange.svg';
import {
  ModalButton,
  ModalButtonText,
  ModalContainer,
  ModalDescriptionText,
  ModalHeaderText,
  TermsOfUse,
} from '~/components/FacebookSigninComponent/styles';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '~/helpers/convertPixelToDP';
import { translate } from '~/locales';

const STRAVA_LOGIN = gql`
  mutation RegisterStravaUser2(
    $input: CreateStravaUserInput!
    $scopeInput: String!
  ) {
    registerStravaUser(data: $input, scope: $scopeInput) {
      id
    }
  }
`;

interface IAthletePayload {
  city: string;
  country: string;
  firstname: string;
  follower: string;
  friend: string;
  id: number;
  lastname: string;
  premium: string;
  profile: string;
  sex: string;
  state: string;
  summit: string;
  username: string;
}
interface IAdditionalParameters {
  athlete: IAthletePayload;
  expires_at: number;
}
interface IStravaPayload {
  accessToken: string;
  accessTokenExpirationDate: string;
  tokenType: string;
  tokenAdditionalParameters: IAdditionalParameters;
  scope: string;
}

function StravaSigninComponent({
  isCommercialAccount,
}: {
  isCommercialAccount: boolean;
}) {
  const navigation = useNavigation();
  const [stravaSendPayload] = useMutation(STRAVA_LOGIN, {
    errorPolicy: 'all',
    onError: (err) => {
      Alert.alert(err.name, err.message);
    },
  });

  const [modalState, setModalState] = React.useState(false);

  const toggleModal = () => {
    setModalState(!modalState);
  };

  const storeData = async (value: IStravaPayload) => {
    try {
      const {
        accessToken,
        scope,
        accessTokenExpirationDate,
        tokenAdditionalParameters,
        tokenType,
      } = value;
      const { athlete, expires_at } = tokenAdditionalParameters;
      const { data: userInfo } = await stravaSendPayload({
        variables: {
          input: {
            username: athlete.username,
            firstname: athlete.firstname,
            lastname: athlete.lastname,
            strava_city: athlete.city,
            strava_country: athlete.country,
            strava_state: athlete.state,
            gender: athlete.sex,
            paid_strava: athlete.premium,
            profile_avatar: athlete.profile,
            strava_id: athlete.id,
            token_type: tokenType,
            access_token: accessToken,
            expires: Number(expires_at),
          },
          scopeInput: scope,
        },
      });
      const jsonValue = userInfo.registerStravaUser.id;
      await AsyncStorage.setItem('@stravaLoginPayload', jsonValue);
      if (jsonValue) {
        if (isCommercialAccount) {
          navigation.navigate('CreateCommercialSignUp');
        } else {
          navigation.navigate('Home');
        }
      }
    } catch (e) {
      // saving error
    }
  };
  const stravaLoginOption = async () => {
    toggleModal();

    const config = {
      // TODO: change this to .env file
      clientId: '28214',
      clientSecret: 'fb806042d2a210e12f3d740a5f9d1876b15666c0',
      redirectUrl:
        'com.riderize://api-staging.riderize.com/auth/strava/callback',
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
        tokenEndpoint:
          'https://www.strava.com/oauth/token?client_id=28214&client_secret=fb806042d2a210e12f3d740a5f9d1876b15666c0',
      },
      scopes: ['profile:read_all,activity:read_all'],
    };
    setTimeout(async () => {
      try {
        if (Platform.OS === 'ios') {
          const response = await authorize(config);
          const scope = response.scopes[0];
          storeData({
            scope,
            tokenAdditionalParameters: response.tokenAdditionalParameters,
            accessTokenExpirationDate: response.accessTokenExpirationDate,
            accessToken: response.accessToken,
            tokenType: response.tokenType,
          });
        }
        if (Platform.OS === 'android') {
          const response = await authorize(config);
          const { athlete: athleteString } = response.tokenAdditionalParameters;
          const athleteJSON = JSON.parse(athleteString);
          const scope = 'profile:read_all,activity:read_all';
          await storeData({
            scope,
            tokenAdditionalParameters: {
              athlete: athleteJSON,
              expires_at: response.tokenAdditionalParameters.expires_at,
            },
            accessTokenExpirationDate: response.accessTokenExpirationDate,
            accessToken: response.accessToken,
            tokenType: response.tokenType,
          });
        }
      } catch (error) {
        //
      }
    }, 140);
  };
  const linking = 'https://www.goldentakes.com/privacy-policy.pdf';

  const handleTerms = async () => {
    await Linking.openURL(linking);
  };
  return (
    <View>
      <TouchableOpacity onPress={() => toggleModal()}>
        <StravaLogin width={wp('50%')} height={hp('10%')} />
      </TouchableOpacity>
      <Modal isVisible={modalState} onBackdropPress={() => toggleModal()}>
        <ModalContainer>
          <ModalHeaderText>
            {translate('accept_our_terms_of_use')}
          </ModalHeaderText>
          <ModalDescriptionText>
            {translate('by_signing_up_you_agree_to_our')}
            <TermsOfUse onPress={() => handleTerms()}>
              {' '}
              {translate('terms_of_use')}
            </TermsOfUse>
          </ModalDescriptionText>
          <TouchableOpacity onPress={() => stravaLoginOption()}>
            <ModalButton>
              <ModalButtonText>
                {translate('agree_and_continue')}
              </ModalButtonText>
            </ModalButton>
          </TouchableOpacity>
        </ModalContainer>
      </Modal>
    </View>
  );
}

export default StravaSigninComponent;
