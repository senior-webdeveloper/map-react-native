import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  TouchableHighlight,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import BlurView from 'react-native-blur';
import { PUBLIC_STORAGE } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { RootStackParamList } from '~/routes';
import {
  useGetChallengeSubscriptionsQuery,
  useListChallengeAwardWinnersQuery,
} from '~/graphql/autogenerate/hooks';
import { Icons, SafeAreaView, Text } from '~/components';

import { translate } from '~/locales';
import { UserChallenges } from '~/graphql/autogenerate/schemas';

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;
export const UserName = styled(Text)`
  margin-left: 10px;
`;
export const AwardName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.blue};
  margin-left: 10px;
`;
export const Name = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  margin-left: 10px;
`;
export const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 32px;
`;
export const AvatarContainer = styled.TouchableOpacity`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal}
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
`;
export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  border-radius: 8px;
  max-height: 30%;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0px 20px 56px rgba(0, 33, 88, 0.1);

  elevation: 2;
`;
export const ModalButton = styled.View`
  background: #0564ff;
  border-radius: 3px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
`;
export const ModalHeaderText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;
export const ModalDescriptionText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
export const ModalButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: ${({ theme }) => theme.colors.textWhite};
`;
export const TermsOfUse = styled.Text`
  color: #0564ff;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.Winners'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const { width } = Dimensions.get('window');
const ViewTypes = {
  FULL: 0,
};
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 86;
    },
  );

const ChallengeWinners: React.FC<Props> = ({ route }) => {
  const { challenge_id, isCreator } = route.params;
  const [modalState, setModalState] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<UserChallenges>();
  const navigation = useNavigation();
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const toggleModal = () => {
    setModalState(!modalState);
  };

  const { data, loading, error } = useListChallengeAwardWinnersQuery({
    variables: {
      challenge_id,
    },
  });

  useEffect(() => {
    if (data?.listChallengeAwardWinners) {
      setDataProvider(dataProviderMaker(data?.listChallengeAwardWinners));
    }
  }, [data]);

  const RenderCard = (type, item, index) => {
    return (
      <AvatarContainer>
        <TouchableOpacity
          onPress={() => {
            navigation.push('User.VisitorProfile', {
              profile_id: item.user.profile.id,
              user_id: item.user.id,
            });
          }}
        >
          <Avatar
            progressiveRenderingEnabled
            source={{
              uri: `${PUBLIC_STORAGE}/${item.user.profile.profile_avatar}`,
            }}
          />
        </TouchableOpacity>
        <View style={{ width: '84%' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push('User.VisitorProfile', {
                profile_id: item.user.profile.id,
                user_id: item.user.id,
              });
            }}
          >
            <Name>{`${item.user.firstname} ${item.user.lastname}`}</Name>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (isCreator) {
                navigation.navigate('Challenge.SendAwardsInformation', {
                  userChallenges: { ...item },
                });
              } else {
                setSelectedItem(item);
                setTimeout(() => {
                  toggleModal();
                }, 200);
              }
            }}
          >
            <UserName>
              Sorteado com <AwardName>{item.award.name}</AwardName>
            </UserName>
          </TouchableOpacity>
        </View>
        <Icons name="chevron-right" />
      </AvatarContainer>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Participantes</Title>
          <View style={{ width: 20 }} />
        </Header>
        <ActivityIndicator size="large" color="#0564FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Premiações</Title>
        <View style={{ width: 20 }} />
      </Header>
      <RecyclerListView
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={RenderCard}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
      />
      <Modal
        isVisible={modalState}
        onBackdropPress={() => toggleModal()}
        useNativeDriver
        scrollHorizontal
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        propagateSwipe
        customBackdrop={(
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={{ flex: 1, backgroundColor: '#FFF' }} />
          </TouchableWithoutFeedback>
        )}
      >
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => toggleModal()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="close" width={40} />
          </TouchableOpacity>
        </View>
        <ModalContainer>
          <ModalHeaderText>Prêmio</ModalHeaderText>
          <ModalDescriptionText>
            {selectedItem?.award.name}
          </ModalDescriptionText>
          <ModalHeaderText style={{ marginTop: 16 }}>Descrição</ModalHeaderText>
          <ModalDescriptionText>
            {selectedItem?.award.description}
          </ModalDescriptionText>
        </ModalContainer>

        <ModalContainer>
          <ScrollView
            horizontal
            style={{ flex: 1 }}
            contentContainerStyle={{ width: '100%', height: '100%' }}
          >
            {selectedItem?.award.awardsImages.map((award) => (
              <Image
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                resizeMethod="scale"
                resizeMode="contain"
                source={{
                  uri: `${PUBLIC_STORAGE}/${award.link}`,
                }}
              />
            ))}
          </ScrollView>
        </ModalContainer>
      </Modal>
    </SafeAreaView>
  );
};

export default ChallengeWinners;
