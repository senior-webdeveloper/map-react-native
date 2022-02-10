/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import { View, StatusBar, TouchableOpacity, Alert } from 'react-native';

import {
  Container,
  Header,
  GoBackTouchable,
  BoxViewCard,
  CardContentContainer,
  ItemLabelText,
  ItemValueText,
  ItemRow,
  Footer,
  Description,
  DeleteText,
  CardSvgBackground,
  SwitchContainer,
} from '~/styles/pages/PersonalAccount/CreditCards.Detail';
import { Icons, TitleText, Switch } from '~/components';

import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

import {
  useUpdateCardMutation,
  useDeleteCardMutation,
  GetCardsDocument,
} from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';

function UserCreditCardsDetail({ navigation, route }) {
  const card = route.params.creditCard;

  const [isMain, setIsMain] = useState<boolean>(card.main);

  const { goBack } = navigation;
  const { userID } = useUserToken();

  const parsedCardNumber = `${card.first_digits
    .toString()
    .slice(0, 4)} ${card.first_digits.toString().slice(4, 6)}** **** ${
    card.last_digits
  }`;

  const parsedDateNumber = () => {
    const stringDate = String(card.expiration_date);

    const yearDate = stringDate.slice(stringDate.length - 2, stringDate.length);

    if (stringDate.length === 4) {
      return `${stringDate[0]}${stringDate[1]}/${yearDate}`;
    }
    return `0${stringDate[0]}/${yearDate}`;
  };

  const parseCpf = (value) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

  // MUTATIONS
  const [updateCardMutation] = useUpdateCardMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetCardsDocument,
        variables: { pagination: { page: 1, offset: 5 }, user_id: userID },
      },
    ],
  });

  const toggleMainCard = async () => {
    await updateCardMutation({
      variables: { data: { main: !isMain, name: card.name }, id: card.id },
    });
  };

  const [deleteCardMutation] = useDeleteCardMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetCardsDocument,
        variables: { pagination: { page: 1, offset: 5 }, user_id: userID },
      },
    ],
  });

  const deleteCard = async () => {
    await deleteCardMutation({
      variables: {
        id: card.id,
      },
    });
    goBack();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Excluir cartão',
      'Você deseja mesmo excluir esse cartão?',
      [
        {
          text: 'Cancelar',
          onPress: () => true,
          style: 'cancel',
        },
        // { text: 'Confirmar', onPress: () => console.warn('deleet') },
        { text: 'Confirmar', onPress: () => deleteCard() },
      ],
      { cancelable: false },
    );
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      <Header>
        <GoBackTouchable onPress={goBack}>
          <Icons name="arrow-left" width={30} />
        </GoBackTouchable>
        <TitleText>{card.name}</TitleText>
      </Header>

      <BoxViewCard>
        <CardSvgBackground />

        <CardContentContainer
          width={widthPercentageToDP('92.6')}
          height={widthPercentageToDP('100') / 1.7}
        >
          <ItemRow totalWidth>
            <ItemRow isColumn>
              <ItemLabelText>NÚMERO</ItemLabelText>
              <ItemValueText cardNumber>{parsedCardNumber}</ItemValueText>
            </ItemRow>
            <Icons
              name={
                card?.brand === 'unknown'
                  ? 'credit-card-white'
                  : card?.brand ?? 'credit-card-white'
              }
              width={60}
              height={40}
            />
          </ItemRow>

          <ItemRow totalWidth={false}>
            <View>
              <ItemLabelText>EXPIRA EM</ItemLabelText>
              <ItemValueText>{parsedDateNumber()}</ItemValueText>
            </View>

            <View>
              <ItemLabelText>CVC</ItemLabelText>
              <ItemValueText>***</ItemValueText>
            </View>
          </ItemRow>

          <ItemRow totalWidth>
            <View>
              <ItemLabelText>PORTADOR</ItemLabelText>
              <ItemValueText>{card.holder_name}</ItemValueText>
            </View>

            <View>
              <ItemLabelText>CPF</ItemLabelText>
              <ItemValueText>
                {parseCpf(card.legal_holder_number)}
              </ItemValueText>
            </View>
          </ItemRow>
        </CardContentContainer>
        <SwitchContainer>
          <Description>Principal</Description>
          <Switch
            active={isMain}
            setActive={() => {
              setIsMain((prevMain) => !prevMain);
              toggleMainCard();
            }}
          />
        </SwitchContainer>
      </BoxViewCard>

      <Footer>
        <Description>
          * Por segurança não é possível alterar dados do cartão já salvo. Caso
          tenha algum problema você pode excluir e incluir um novo.
        </Description>

        <TouchableOpacity onPress={confirmDelete}>
          <DeleteText>Excluir</DeleteText>
        </TouchableOpacity>
      </Footer>
    </Container>
  );
}

export default UserCreditCardsDetail;
