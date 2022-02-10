import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { ScrollView, View } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import { RadioButtonInput } from 'react-native-simple-radio-button';
import CustomHTML from 'react-native-render-html';
import { isFuture, isPast } from 'date-fns';
import { compact } from 'lodash';
import { useRecoilValue } from 'recoil';
import { Icons, Text, TitleText } from '~/components';
import { useStoreActions, useStoreState } from '~/store';
import { RootStackParamList } from '~/routes.types';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import {
  AwardImage,
  Container,
  AwardNameContainer,
  FooterContainer,
  HeaderContainer,
  AwardInformationContainer,
  CloseButton,
  CurrencyText,
  CustomRadioButton,
  DescriptionText,
  ImageContainer,
  NextButton,
  NextButtonText,
  OptionButton,
  OptionWrapper,
  PriceText,
  RadioContainer,
  ValueText,
} from './styles';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  EventSubscriptionPriceType,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';
import { useAddSubscriptionKit } from '~/hooks';
import { cartStatus as _cartStatus } from '~/recoil/selectors';

export type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

interface Props {
  navigation: ChallengeDescriptionNavigationProp;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  data: GetChallengeDetailQuery;
  hasSubscription?: boolean;
  extraordinaryActions?: UserEventExtraordinaryActionType;
}

export default function BuyModal({
  modalState,
  setModalState,
  data,
  navigation,
  hasSubscription,
  extraordinaryActions,
}: Props): JSX.Element {
  const cartStatus = useRecoilValue(_cartStatus);
  const addSubscriptionPrice = useAddSubscriptionKit();
  const chart = useStoreState((state) => state.chart.payload);
  const [selectedAward, setSelectedAward] = useState<number>(chart?.index ?? 0);
  const cleanChart = useStoreActions((actions) => actions.chart.cleanChart);
  const setIsOnPurchase = useStoreActions(
    (actions) => actions.chart.setIsOnPurchase,
  );
  const firstElementId = useStoreState((state) => state.chart.firstElementId);

  const addProductToChart = useStoreActions(
    (actions) => actions.chart.addProduct,
  );

  function handlePrices(prices: EventSubscriptionPriceType[]) {
    const filterAvailablePerDate = prices.filter((product) =>
      product.date_initial ? isPast(new Date(product.date_initial)) : true,
    );

    console.log('prices: ', filterAvailablePerDate);

    // return filterAvailablePerDate
  }

  useEffect(() => {
    if (data.getChallengeDetail.subscription_prices) {
      handlePrices(data.getChallengeDetail.subscription_prices);
    }
  }, [data]);

  useEffect(() => {
    if (
      data?.getChallengeDetail.awards &&
      data.getChallengeDetail.awards.length > 0
    ) {
      const teste = data.getChallengeDetail.subscription_prices.map(
        (el, index) => {
          if (isPast(new Date(el.date_initial))) {
            if (data.getChallengeDetail.subscription_prices[index + 1]) {
              if (
                isFuture(
                  new Date(
                    data.getChallengeDetail.subscription_prices[
                      index + 1
                    ].date_initial,
                  ),
                )
              ) {
                return el.value;
              }
            } else {
              return el.value;
            }
          }
        },
      );
      const value = compact(teste)[0];
      console.log('value: ', value);
      if (extraordinaryActions) {
        addSubscriptionPrice({
          price: extraordinaryActions?.bonus_subscription
            ? 0
            : value || data.getChallengeDetail.awards[chart?.index ?? 0].price,
          name: data.getChallengeDetail.awards[chart?.index ?? 0].name,
          index: chart?.index,
          product_id: data.getChallengeDetail.awards[chart?.index ?? 0].id,
        });
      } else {
        addSubscriptionPrice({
          price: extraordinaryActions?.bonus_subscription
            ? 0
            : value || data.getChallengeDetail.awards[chart?.index ?? 0].price,
          name: data.getChallengeDetail.awards[chart?.index ?? 0].name,
          index: chart?.index,
          product_id: data.getChallengeDetail.awards[chart?.index ?? 0].id,
        });
      }

      setSelectedAward(chart?.index ?? 0);
    }
  }, [data, chart?.index]);

  return (
    <Modal
      isVisible={modalState}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      onBackdropPress={() => {
        setIsOnPurchase(false);
        setModalState((prevState) => !prevState);
        setIsOnPurchase(false);
      }}
      backdropOpacity={0.6}
      useNativeDriver
      backdropTransitionOutTiming={0}
    >
      <Container>
        <View>
          <CloseButton
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            onPress={() => {
              setModalState((prevState) => !prevState);
              setIsOnPurchase(false);
            }}
          >
            <Icons name="close" />
          </CloseButton>
          {data.getChallengeDetail.temporarily_unavailable && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: widthPercentageToDP('100'),
              }}
            >
              <TitleText style={{ marginTop: 20 }}>
                Manutenção Temporária
              </TitleText>
              <Icons
                name="broken-bike"
                width={widthPercentageToDP('80')}
                height={200}
                style={{ marginVertical: 20 }}
              />
              <Text>
                A inscrição deste desafio está passando por uma manutenção.
                Volte mais tarde e tente novamente.{' '}
              </Text>
            </View>
          )}
          {!data.getChallengeDetail.temporarily_unavailable ? (
            <>
              <HeaderContainer>
                <TitleText>
                  {data?.getChallengeDetail.physical_event
                    ? 'Selecionar Kit Atleta'
                    : 'Selecionar Kit do Desafio'}
                </TitleText>

                <Text>
                  {data?.getChallengeDetail.physical_event
                    ? ' Escolha qual Kit Atleta quer receber no evento.'
                    : ' Escolha qual o Kit você deseja receber em casa, depois de concluir o desafio.'}
                </Text>
              </HeaderContainer>

              <ScrollView showsVerticalScrollIndicator={false}>
                <RadioContainer formHorizontal={false} animation>
                  {data?.getChallengeDetail.awards.map((obj, i) => (
                    <CustomRadioButton labelHorizontal key={i}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={selectedAward === i}
                        onPress={() => {
                          cleanChart(null);
                          setSelectedAward(i);
                          addProductToChart({
                            price: obj.price,
                            name: obj.name,
                            index: i,
                            product_id: obj.id,
                          });
                        }}
                        borderWidth={0.5}
                        buttonInnerColor={
                          selectedAward === i ? '#0564FF' : '#000'
                        }
                        buttonOuterColor={
                          selectedAward === i
                            ? '#0564FF'
                            : 'rgba(135, 149, 173, 0.64)'
                        }
                        buttonSize={14}
                        buttonOuterSize={24}
                        buttonStyle={{}}
                        buttonWrapStyle={{ marginLeft: 10 }}
                      />
                      <OptionButton
                        onPress={() => {
                          cleanChart(null);
                          setSelectedAward(i);
                          addProductToChart({
                            price: obj.price ?? 0,
                            name: obj.name,
                            index: i,
                            product_id: obj.id,
                          });
                        }}
                      >
                        <OptionWrapper>
                          {obj.awardsImages && obj.awardsImages.length > 0 ? (
                            <ImageContainer>
                              <AwardImage
                                source={{
                                  uri: `${PUBLIC_STORAGE}/${obj.awardsImages[0].link}`,
                                }}
                              />
                            </ImageContainer>
                          ) : null}
                          <AwardInformationContainer>
                            <AwardNameContainer>
                              <Text>{obj.name}</Text>
                              {obj.price &&
                              !data.getChallengeDetail.physical_event ? (
                                <PriceText>
                                  R${' '}
                                  {Number.isInteger(obj.price)
                                    ? obj.price
                                    : String(obj.price.toFixed(2)).replace(
                                        '.',
                                        ',',
                                      )}
                                </PriceText>
                              ) : null}
                            </AwardNameContainer>
                            {obj.description.length > 0 &&
                            obj.description[0] === '<' ? (
                              <CustomHTML
                                key="html"
                                source={{
                                  html: `<div>${obj.description}</div>`,
                                }}
                                // source={{ html: seeMore ? description : `<div>${description}</div>` }}
                                ignoredStyles={['font-family']}
                                containerStyle={{ marginTop: 16 }}
                                onLinkPress={(evt, href) => {
                                  Linking.openURL(href);
                                }}
                                renderers={{
                                  p: (htmlAttribs, children) => (
                                    <DescriptionText>
                                      {children}
                                    </DescriptionText>
                                  ),
                                  div: (htmlAttribs, children) => (
                                    <View>
                                      <DescriptionText numberOfLines={3}>
                                        {children}
                                      </DescriptionText>
                                    </View>
                                  ),
                                  b: (htmlAttribs, children) => (
                                    <TitleText>{children}</TitleText>
                                  ),
                                }}
                                tagsStyles={{
                                  div: {
                                    marginTop: 5,
                                  },
                                  p: {
                                    fontFamily: 'NeuzeitGro-Reg',
                                    fontWeight: null,
                                  },
                                  img: {
                                    marginTop: 5,
                                  },
                                  b: {
                                    fontFamily: 'NeuzeitGro-Bol',
                                    fontWeight: null,
                                  },
                                }}
                              />
                            ) : (
                              <DescriptionText numberOfLines={3}>
                                {obj.description}
                              </DescriptionText>
                            )}
                          </AwardInformationContainer>
                        </OptionWrapper>
                      </OptionButton>
                    </CustomRadioButton>
                  ))}
                </RadioContainer>
              </ScrollView>
              <FooterContainer>
                {extraordinaryActions &&
                extraordinaryActions.bonus_subscription ? (
                  <CurrencyText>
                    <ValueText style={{ color: '#009D33' }}>
                      Bonificado
                    </ValueText>
                  </CurrencyText>
                ) : null}
                {cartStatus ? (
                  <CurrencyText>
                    R${' '}
                    <ValueText>
                      {!Number.isInteger(cartStatus.totalPrice)
                        ? String(cartStatus.totalPrice.toFixed(2)).replace(
                            '.',
                            ',',
                          )
                        : cartStatus.totalPrice}
                    </ValueText>
                  </CurrencyText>
                ) : null}

                <NextButton
                  onPress={() => {
                    setIsOnPurchase(true);
                    setModalState((prevState) => !prevState);
                    if (data?.getChallengeDetail.awards) {
                      navigation.push('Challenge.PaymentAward', {
                        data,
                        award_index: selectedAward,
                        firstElementId,
                        has_subscription: hasSubscription,
                        extraordinaryActions,
                        award_id:
                          data?.getChallengeDetail.awards[selectedAward].id,
                      });
                    }
                  }}
                >
                  <NextButtonText>Próximo</NextButtonText>
                </NextButton>
              </FooterContainer>
            </>
          ) : null}
        </View>
      </Container>
    </Modal>
  );
}
