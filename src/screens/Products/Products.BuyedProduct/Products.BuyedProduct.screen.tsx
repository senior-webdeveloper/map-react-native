import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { addDays, format, isFuture } from 'date-fns';
import { PUBLIC_STORAGE } from '@env';
import FastImage from 'react-native-fast-image';
import { layout, space, flexbox } from 'styled-system';
import ModalComponent from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { ProductPurchasedType } from '~/graphql/autogenerate/schemas';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { RootStackParamList } from '~/routes.types';
import { Button, Icons, SafeAreaView, Text, TitleText } from '~/components';

export const SuccessTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.green};
`;

export const ErrorTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.red};
`;

export const AwaitTitle = styled(TitleText)<StatsProps>`
  font-size: 16px;
  color: ${({ color }) => color};
`;

interface StatsProps {
  color: string;
}
export const PaymentStatusContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  elevation: 10;
  /* Shadow try 1 */
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;
export const StatsCard = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: flex-end;
`;
export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  width: 97%;
  padding: 18px 19px;
  align-items: center;
`;

export const Description = styled(Text)`
  font-size: 14px;
  line-height: 16.1px;
  text-align: center;
`;

export const DescriptionBold = styled(TitleText)`
  font-size: 14px;
  line-height: 16.1px;
  text-align: center;
`;

export const MinorDescription = styled(Text)`
  font-size: 14px;
  line-height: 16.1px;
  opacity: 0.56;
  margin-top: 16px;
`;

export const InfoTitle = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 16px;
  line-height: 18.4px;
`;
export const InfoDescription = styled(Text)`
  font-weight: 400;
  font-size: 16px;
  line-height: 18.4px;
`;
export const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  border-bottom-width: 0.5px;
  width: 100%;
  border-bottom-color: rgba(21, 46, 88, 0.5);
  justify-content: space-between;
`;

export const HistoryContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  border-bottom-width: 0.5px;
  width: 100%;
  border-bottom-color: rgba(21, 46, 88, 0.5);
  justify-content: space-between;
`;
export const IconContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
`;
interface StatsProps {
  color: string;
}

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Products.BuyedProduct'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Products.BuyedProduct'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export const Box = styled(View)(layout);

export const ModalContentContainer = styled(View)<layout>(
  {
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
  layout,
  space,
  flexbox,
);

const RenderProducts: React.FC<ProductPurchasedType> = ({ el }) => {
  const [show, setShow] = useState(false);
  const [modalState, setModalState] = useState(false);

  return (
    <>
      <TouchableOpacity
        disabled={
          !el.related_payment ||
          (el.related_payment && el.related_payment.payment.status === 'paid')
        }
        onPress={() => setShow((prevState) => !prevState)}
        style={{
          paddingVertical: 24,
          borderBottomColor: 'rgba(22, 28, 37, 0.2)',
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 16,
        }}
      >
        <FastImage
          resizeMethod="scale"
          resizeMode="contain"
          source={{
            uri: `${PUBLIC_STORAGE}/${
              el.variation.images &&
              el.variation.images.length > 0 &&
              el.variation.images[0].link
                ? el.variation.images[0].link
                : 'miscellaneous/product.jpg'
            }`,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            marginRight: 5,
            // height: heightPercentageToDP('50'),
          }}
        />
        <View
          style={{
            justifyContent: 'space-between',
            width: widthPercentageToDP('80'),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                width: widthPercentageToDP('65'),
              }}
              numberOfLines={1}
            >
              {el.quantity > 1 ? `${el.quantity}x ` : null}
              {el.product.name}
            </Text>
            {el.related_payment &&
            el.related_payment.payment.status !== 'paid' ? (
              <Icons name={!show ? 'chevron-down' : 'chevron-up'} />
            ) : null}
          </View>
          <Text style={{ fontFamily: 'NeuzeitGro-Lig' }}>
            {el.variation.text}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {el?.related_payment?.payment?.status === 'paid' ? (
              <View
                style={{
                  backgroundColor: '#009D33',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: 'white' }}>Pago</Text>
              </View>
            ) : null}

            {el?.related_payment?.payment?.status === 'waiting_payment' ? (
              <View
                style={{
                  backgroundColor: '#FFC502',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: 'white' }}>Aguardando pagamento</Text>
              </View>
            ) : null}

            {el?.related_payment?.payment?.status === 'refused' ? (
              <View
                style={{
                  backgroundColor: '#FF2525',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: 'white' }}>Pagamento recusado</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      {show ? (
        <>
          {el.related_payment && el.related_payment.payment && (
            <>
              {el.related_payment.payment.bill_link ? (
                <>
                  {el.related_payment.payment.status === 'waiting_payment' && (
                    <PaymentStatusContainer color="#FFF">
                      <StatsCard color="#FFC502">
                        <InnerStatsContainer>
                          <AwaitTitle color="#FFC502">
                            Aguardando pagamento
                          </AwaitTitle>
                          <Description>
                            Pague{' '}
                            <DescriptionBold>
                              R${' '}
                              {String(
                                el.related_payment.payment.value.toFixed(2),
                              ).replace('.', ',')}
                            </DescriptionBold>{' '}
                            via boleto antes do seu vencimento{' '}
                            <DescriptionBold>
                              (
                              {format(
                                new Date(
                                  el.related_payment.payment.bill_expiration_date,
                                ),
                                "dd'/'MM",
                              )}
                            </DescriptionBold>
                            )
                          </Description>
                          <View style={{ marginTop: 24, width: '100%' }}>
                            <InfoContainer>
                              <InfoTitle>Meio de pagamento</InfoTitle>
                              <InfoDescription>Boleto</InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de emissão</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.bill_expiration_date,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de vencimento</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.bill_expiration_date,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer style={{ borderBottomWidth: 0 }}>
                              <InfoTitle>Valor</InfoTitle>
                              <InfoDescription>
                                R${' '}
                                {String(
                                  el.related_payment.payment.value.toFixed(2),
                                ).replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                        </InnerStatsContainer>
                      </StatsCard>
                      <View
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 28,
                        }}
                      >
                        {isFuture(
                          addDays(
                            new Date(
                              el.related_payment.payment.bill_expiration_date,
                            ),
                            1,
                          ),
                        ) ? (
                          <Button
                            name="Visualizar Boleto"
                            onPress={() => {
                              Linking.openURL(
                                el.related_payment.payment.bill_link,
                              );
                            }}
                          />
                        ) : null}
                      </View>
                    </PaymentStatusContainer>
                  )}

                  {el.related_payment.payment.status === 'paid' && (
                    <PaymentStatusContainer color="#FFF">
                      <StatsCard color="#009D33">
                        <InnerStatsContainer>
                          <AwaitTitle color="#009D33">
                            Pagamento confirmado
                          </AwaitTitle>
                          <Description>
                            Seu pagamento foi aprovado. Agora basta pedalar e
                            superar mais este desafio!
                          </Description>
                          <View style={{ marginTop: 24, width: '100%' }}>
                            <InfoContainer>
                              <InfoTitle>Meio de pagamento</InfoTitle>
                              <InfoDescription>Boleto</InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de emissão</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.bill_expiration_date,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de vencimento</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.bill_expiration_date,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer style={{ borderBottomWidth: 0 }}>
                              <InfoTitle>Valor</InfoTitle>
                              <InfoDescription>
                                R${' '}
                                {String(
                                  el.related_payment.payment.value.toFixed(2),
                                ).replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                        </InnerStatsContainer>
                      </StatsCard>
                    </PaymentStatusContainer>
                  )}

                  {el.related_payment.payment.status === 'refused' && (
                    <PaymentStatusContainer color="#FFF">
                      <StatsCard color="#FF2525">
                        <InnerStatsContainer>
                          <AwaitTitle color="#FF2525">
                            Pagamento Recusado
                          </AwaitTitle>
                          <Description>
                            Seu boleto de R${' '}
                            {String(
                              el.related_payment.payment.value.toFixed(2),
                            ).replace('.', ',')}{' '}
                            venceu e não foi confirmado pelo banco. Realize uma
                            nova compra para adquirir seu produto.
                          </Description>
                          <View style={{ marginTop: 24, width: '100%' }}>
                            <InfoContainer>
                              <InfoTitle>Meio de pagamento</InfoTitle>
                              <InfoDescription>Boleto</InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de emissão</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.created_at,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de vencimento</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.bill_expiration_date,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer style={{ borderBottomWidth: 0 }}>
                              <InfoTitle>Valor</InfoTitle>
                              <InfoDescription>
                                R${' '}
                                {String(
                                  el.related_payment.payment.value.toFixed(2),
                                ).replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                          {/* <View
                            style={{
                              paddingHorizontal: 15,
                              paddingVertical: 28,
                            }}
                          >
                            {!isPast(
                              new Date(
                                route.params.data.getChallengeDetail.end_date_registration,
                              ),
                            ) ? (
                              <Button
                                name="Novo boleto ou trocar pagamento"
                                disabled={isPast(
                                  new Date(
                                    route.params.data.getChallengeDetail.end_date_registration,
                                  ),
                                )}
                                onPress={() => {
                                  navigation.push('Challenge.RetryPayment', {
                                    data: route.params.data,
                                    challenge_id: route.params.challenge_id,
                                    award: route.params.award,
                                    value: route.params.value,
                                  });
                                }}
                              />
                            ) : null}
                          </View> */}
                        </InnerStatsContainer>
                      </StatsCard>
                    </PaymentStatusContainer>
                  )}
                </>
              ) : (
                <>
                  {el.related_payment.payment.status === 'waiting_payment' &&
                    !el.related_payment.payment.pix_qrcode && (
                      <PaymentStatusContainer color="#FFF">
                        <StatsCard color="#FFC502">
                          <InnerStatsContainer>
                            <AwaitTitle color="#FFC502">
                              Aguardando pagamento
                            </AwaitTitle>
                            <Description>
                              Contate a empresa responsável pelo seu cartão para
                              obter mais informações.
                            </Description>
                            <View style={{ marginTop: 24, width: '100%' }}>
                              <InfoContainer>
                                <InfoTitle>Meio de pagamento</InfoTitle>
                                <InfoDescription>Cartão</InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de emissão</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.created_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de Pagamento</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.updated_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer style={{ borderBottomWidth: 0 }}>
                                <InfoTitle>Valor</InfoTitle>
                                <InfoDescription>
                                  R${' '}
                                  {String(
                                    el.related_payment.payment.value.toFixed(2),
                                  )
                                    .replace()
                                    .replace('.', ',')}
                                </InfoDescription>
                              </InfoContainer>
                            </View>
                          </InnerStatsContainer>
                        </StatsCard>
                      </PaymentStatusContainer>
                    )}

                  {el.related_payment.payment.status === 'waiting_payment' &&
                    el.related_payment.payment.pix_qrcode && (
                      <PaymentStatusContainer color="#FFF">
                        <StatsCard color="#FFC502">
                          <InnerStatsContainer>
                            <AwaitTitle color="#FFC502">
                              Aguardando pagamento
                            </AwaitTitle>
                            <Description>
                              A chave PIX ficará disponível por 30 minutos e
                              depois será automaticamente cancelada. O banco
                              poderá levar até 1 dia útil para confirmar o
                              pagamento.
                            </Description>
                            <View style={{ marginTop: 24, width: '100%' }}>
                              <InfoContainer>
                                <InfoTitle>Meio de pagamento</InfoTitle>
                                <InfoDescription>Pix</InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de emissão</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.created_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de Pagamento</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.updated_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer style={{ borderBottomWidth: 0 }}>
                                <InfoTitle>Valor</InfoTitle>
                                <InfoDescription>
                                  R${' '}
                                  {String(
                                    el.related_payment.payment.value.toFixed(2),
                                  )
                                    .replace()
                                    .replace('.', ',')}
                                </InfoDescription>
                              </InfoContainer>
                            </View>
                          </InnerStatsContainer>
                        </StatsCard>

                        <View
                          style={{
                            paddingHorizontal: 15,
                            paddingVertical: 28,
                          }}
                        >
                          {isFuture(
                            addDays(
                              new Date(
                                el.related_payment.payment.pix_expiration_date,
                              ),
                              1,
                            ),
                          ) ? (
                            <Button
                              name="Ver chave PIX novamente"
                              onPress={() => {
                                setModalState(true);
                              }}
                            />
                          ) : null}
                        </View>
                      </PaymentStatusContainer>
                    )}

                  {el.related_payment.payment.status === 'paid' &&
                    !el.related_payment.payment.pix_qrcode && (
                      <PaymentStatusContainer color="#FFF">
                        <StatsCard color="#009D33">
                          <InnerStatsContainer>
                            <Icons
                              height={65}
                              name={
                                el.related_payment.payment.card?.brand ||
                                'credit-card'
                              }
                            />
                            <AwaitTitle color="#009D33">
                              Inscrito com sucesso
                            </AwaitTitle>
                            <Description>
                              Seu pagamento foi aprovado dia{' '}
                              {format(
                                new Date(el.related_payment.payment.updated_at),
                                "dd'/'MM'/'yyyy",
                              )}
                              . Agora basta pedalar e superar mais este desafio!
                            </Description>
                            <View style={{ marginTop: 24, width: '100%' }}>
                              <InfoContainer>
                                <InfoTitle>Meio de pagamento</InfoTitle>
                                <InfoDescription>Cartão</InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de emissão</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.created_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de Pagamento</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.updated_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer style={{ borderBottomWidth: 0 }}>
                                <InfoTitle>Valor</InfoTitle>
                                <InfoDescription>
                                  R${' '}
                                  {String(
                                    el.related_payment.payment.value.toFixed(2),
                                  )
                                    .replace()
                                    .replace('.', ',')}
                                </InfoDescription>
                              </InfoContainer>
                            </View>
                          </InnerStatsContainer>
                        </StatsCard>
                      </PaymentStatusContainer>
                    )}

                  {el.related_payment.payment.status === 'paid' &&
                    el.related_payment.payment.pix_qrcode && (
                      <PaymentStatusContainer color="#FFF">
                        <StatsCard color="#009D33">
                          <InnerStatsContainer>
                            <Icons
                              height={65}
                              name={
                                el.related_payment.payment.card?.brand ||
                                'credit-card'
                              }
                            />
                            <AwaitTitle color="#009D33">
                              Inscrito com sucesso
                            </AwaitTitle>
                            <Description>
                              Seu pagamento foi aprovado dia{' '}
                              {format(
                                new Date(el.related_payment.payment.updated_at),
                                "dd'/'MM'/'yyyy",
                              )}
                              . Agora basta pedalar e superar mais este desafio!
                            </Description>
                            <View style={{ marginTop: 24, width: '100%' }}>
                              <InfoContainer>
                                <InfoTitle>Meio de pagamento</InfoTitle>
                                <InfoDescription>Pix</InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de emissão</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.created_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer>
                                <InfoTitle>Data de Pagamento</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(
                                      el.related_payment.payment.updated_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              <InfoContainer style={{ borderBottomWidth: 0 }}>
                                <InfoTitle>Valor</InfoTitle>
                                <InfoDescription>
                                  R${' '}
                                  {String(
                                    el.related_payment.payment.value.toFixed(2),
                                  )
                                    .replace()
                                    .replace('.', ',')}
                                </InfoDescription>
                              </InfoContainer>
                            </View>
                          </InnerStatsContainer>
                        </StatsCard>
                      </PaymentStatusContainer>
                    )}

                  {el.related_payment.payment.status === 'refused' && (
                    <PaymentStatusContainer color="#FFF">
                      <StatsCard color="#FF2525">
                        <InnerStatsContainer>
                          <AwaitTitle color="#FF2525">
                            Pagamento recusado
                          </AwaitTitle>
                          <Description>
                            Não foi possível realizar o pagamento da inscrição,
                            tente novamente mais tarde ou troque a forma de
                            pagamento.
                          </Description>
                          <View style={{ marginTop: 24, width: '100%' }}>
                            <InfoContainer>
                              <InfoTitle>Meio de pagamento</InfoTitle>
                              <InfoDescription>Cartão</InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de emissão</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.created_at,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de Pagamento</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(
                                    el.related_payment.payment.updated_at,
                                  ),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer style={{ borderBottomWidth: 0 }}>
                              <InfoTitle>Valor</InfoTitle>
                              <InfoDescription>
                                R${' '}
                                {String(
                                  el.related_payment.payment.value.toFixed(2),
                                )
                                  .replace()
                                  .replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 15,
                              paddingVertical: 28,
                            }}
                          >
                            <Button
                              name="Trocar forma de pagamento"
                              onPress={() => {
                                navigation.push('Challenge.RetryPayment', {
                                  data: route.params.data,
                                  challenge_id: route.params.challenge_id,
                                  award: route.params.award,
                                  value: route.params.value,
                                });
                              }}
                            />
                          </View>
                        </InnerStatsContainer>
                      </StatsCard>
                    </PaymentStatusContainer>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : null}
      <ModalComponent
        isVisible={modalState}
        onBackdropPress={() => {
          setModalState(false);
        }}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
      >
        {modalState ? (
          <ModalContentContainer>
            <Text
              style={{
                fontFamily: 'NeuzeitGro-Bol',
                fontSize: 20,
                lineHeight: 20,
              }}
            >
              Pagamento em Pix
            </Text>

            <Box marginVertical={20} alignItems="center">
              <Text>Escaneie o QrCode</Text>
              <Text>para efetuar o pagamento:</Text>
            </Box>

            {el.related_payment.payment.pix_qrcode ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <QRCode
                  value={el.related_payment.payment.pix_qrcode}
                  size={widthPercentageToDP('70')}
                  logoBackgroundColor="#FFF"
                />
              </View>
            ) : null}
            <Box marginTop={20} alignItems="center">
              <Text>
                Ou use o{' '}
                <Text style={{ fontFamily: 'NeuzeitGro-Bol' }}>
                  Pix Copia e Cola
                </Text>
              </Text>
              <Text>para efetuar o pagamento</Text>
            </Box>

            <Box width={1} paddingHorizontal={20}>
              <Button
                name="Copiar"
                onPress={() => {
                  Clipboard.setString(
                    String(el.related_payment.payment.pix_qrcode),
                  );
                  Toast.show('Pix copiado com sucesso!', Toast.LONG);
                }}
              />
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </>
  );
};

const ProductBuyedProduct: React.FC<Props> = ({ route, navigation }) => {
  const [products, setProducts] = useState<ProductPurchasedType[]>();

  useEffect(() => {
    if (
      route.params.data.getChallengeDetail
        .products_purchased_without_subscription &&
      route.params.data.getChallengeDetail
        .products_purchased_without_subscription.length > 0
    ) {
      const buyedProducts =
        route.params.data.getChallengeDetail
          .products_purchased_without_subscription;
      if (buyedProducts) {
        setProducts(buyedProducts);
      }
    }
  }, [route.params]);

  if (!products) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 14,
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: '90%',
          }}
        >
          <ActivityIndicator size="large" color="#0564FF" />
          <Text style={{ textAlign: 'center', marginTop: 14 }}>
            Carregando Informações de pagamento...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingHorizontal: 16,
          paddingTop: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <TitleText style={{ fontSize: 20 }}>Minhas compras</TitleText>
        <View style={{ width: 20 }} />
      </PaymentStatusContainer>
      <ScrollView>
        <View style={{ marginTop: 16, paddingBottom: 40 }}>
          {products && products.map((el, index) => <RenderProducts el={el} />)}
        </View>
      </ScrollView>
      <View />
    </View>
  );
};

export default ProductBuyedProduct;
