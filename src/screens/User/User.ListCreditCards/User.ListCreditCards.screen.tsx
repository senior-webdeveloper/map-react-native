/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, StatusBar, View, FlatList } from 'react-native';

import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { Icons, TitleText } from '~/components';

import { OptionContainer } from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

import { useUserToken } from '~/hooks';
import { useGetCardsLazyQuery } from '~/graphql/autogenerate/hooks';
import {
  Container,
  Header,
  GoBackTouchable,
  CardsFlatList,
  BrandContainer,
  BrandName,
} from '~/styles/pages/PersonalAccount/CreditCards';
import { Card } from '~/graphql/autogenerate/schemas';

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
export default function UserListCreditCards({ navigation }) {
  const { goBack, navigate } = navigation;
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);
  const hasFetched = useRef(false);
  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const { userID } = useUserToken();

  const [fetch, { data: cards }] = useGetCardsLazyQuery({
    onCompleted: (e) => {
      setDataProvider(dataProviderMaker(e?.getCards));
    },
  });

  useEffect(() => {
    if (!cards?.getCards && hasFetched.current === false && userID) {
      console.log('fetch');
      fetch({
        variables: { pagination: { page: 1, offset: 5 }, user_id: userID },
      });
      hasFetched.current = true;
    }
  }, [userID]);

  const addNewCard = () => {
    navigate('User.CreditCardsCreate');
  };

  const onPressCard = (creditCard: Card) => {
    navigate('User.CreditCardsDetail', { creditCard });
  };

  const RenderCard = ({ type, item, index }) => (
    <OptionContainer key={index} onPress={() => onPressCard(item)}>
      <BrandContainer>
        <Icons
          name={
            item?.brand === 'unknown'
              ? 'credit-card'
              : item?.brand ?? 'credit-card'
          }
          width={40}
          height={40}
        />
        <View style={{ width: '80%' }}>
          <BrandName>{item.name}</BrandName>
        </View>
      </BrandContainer>
      <Icons name="chevron-right" />
    </OptionContainer>
  );

  const ListFooterComponent = () => (
    <OptionContainer onPress={addNewCard}>
      <BrandContainer>
        <Icons name="credit-card" width={40} height={40} />
        <BrandName>Adicionar novo cartão</BrandName>
      </BrandContainer>
      <Icons name="plus" />
    </OptionContainer>
  );

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      <Header>
        <GoBackTouchable onPress={goBack}>
          <Icons name="arrow-left" width={30} />
        </GoBackTouchable>
        <TitleText>Meus Cartões</TitleText>
      </Header>

      <FlatList
        data={cards?.getCards}
        renderItem={RenderCard}
        ListFooterComponent={ListFooterComponent}
      />
      {/* <RecyclerListView
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={RenderCard}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        renderFooter={ListFooterComponent}
      /> */}
    </Container>
  );
}
