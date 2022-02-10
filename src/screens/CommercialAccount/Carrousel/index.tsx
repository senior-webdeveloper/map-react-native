import React, { useRef } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import functionalitiesList from '~/screens/CommercialAccount/Carrousel/constants/functionalitiesList';
import colors from '~/styles/colors';
import { translate } from '~/locales';
import {
  ButtonContainer,
  ButtonText,
  Container,
  FooterView,
  HeaderContainer,
  HeaderText,
  HeaderTextContainer,
  SubHeaderText,
  Wrapper,
} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '~/helpers/convertPixelToDP';

interface ISliderContent {
  title: string;
  subtitle: string;
  uri: ImageSourcePropType;
}

const CommercialCarouselSignUp: React.FC = () => {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const navigation = useNavigation();
  const inputEl = useRef('');
  const [userID, setUserID] = React.useState('');

  const getData = async () => {
    try {
      const universalToken = await AsyncStorage.getAllKeys();
      if (universalToken.length === 0) setUserID('');
      if (universalToken.length > 0) {
        const uniqueToken = await AsyncStorage.getItem(universalToken[0]);
        if (uniqueToken) setUserID(uniqueToken);
      }
    } catch (e) {
      // error reading value
    }
  };
  React.useEffect(() => {
    getData();
  }, []);

  const handleLoggedUser = () => {
    getData();
    if (userID === '') {
      navigation.navigate('CreateCommercialLogin');
    } else {
      navigation.navigate('CreateCommercialSignUp');
    }
  };
  const renderItem = ({ item }: { item: ISliderContent }) => {
    return (
      <ImageBackground
        source={item.uri}
        style={{
          flex: 1,
        }}
      >
        <LinearGradient
          colors={[colors.black, 'transparent', 'transparent', colors.black]}
          style={{
            flex: 1,
          }}
        >
          <Container>
            <HeaderContainer>
              <Wrapper>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialIcons
                    name="keyboard-arrow-left"
                    size={38}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Wrapper>
              <HeaderTextContainer>
                <HeaderText>{item.title}</HeaderText>
                <SubHeaderText>{item.subtitle}</SubHeaderText>
              </HeaderTextContainer>
              <Wrapper />
            </HeaderContainer>
            <FooterView>
              <Pagination
                dotsLength={functionalitiesList.length}
                activeDotIndex={activeSlide}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
              <TouchableOpacity
                onPress={() => handleLoggedUser()}
                accessibilityLabel="create-commercial-account-button"
                testID="create-commercial-account-button"
                accessible
              >
                <ButtonContainer
                  accessibilityLabel="create-commercial-account-button"
                  testID="create-commercial-account-button"
                >
                  <ButtonText>
                    {translate('create_your_commercial_account')}
                  </ButtonText>
                </ButtonContainer>
              </TouchableOpacity>
            </FooterView>
          </Container>
        </LinearGradient>
      </ImageBackground>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000000',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
      accessibilityLabel="create-commercial-account-caroussel"
      testID="create-commercial-account-caroussel"
    >
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <Carousel
        ref={inputEl}
        data={functionalitiesList}
        renderItem={renderItem}
        sliderWidth={wp('100')}
        itemWidth={wp('100')}
        sliderHeight={hp('100')}
        itemHeight={hp('100')}
        loop
        autoplay
        autoplayDelay={3000}
        autoplayInterval={3500}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
    </View>
  );
};

export default CommercialCarouselSignUp;
