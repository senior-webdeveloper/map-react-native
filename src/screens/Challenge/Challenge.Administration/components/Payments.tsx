import React, { useEffect, useRef, useState } from 'react';
import { RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Alert,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import styled from 'styled-components/native';
import { addDays, format, isFuture, isPast } from 'date-fns';
import Clipboard from '@react-native-community/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { layout, space, flexbox } from 'styled-system';
import ModalComponent from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { useUserToken } from '~/hooks';
import {
  useFindPaymentLazyQuery,
  useFindPaymentQuery,
} from '~/graphql/autogenerate/hooks';
import { RootStackParamList } from '~/routes';
import { Button, Icons, SafeAreaView, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

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
  width: 100%;
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

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.PaymentHistoric'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.PaymentHistoric'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

type PaymentsStatus =
  | 'processing'
  | 'authorized'
  | 'paid'
  | 'refunded'
  | 'waiting_payment'
  | 'pending_refund'
  | 'refused';

const ChallengePaymentHistoric: React.FC<Props> = ({ route, navigation }) => {
  const [modalState, setModalState] = useState(false);
  const { userinfo } = useUserToken();

  return (
    <SafeAreaView style={{}}>
      <ScrollView>
        <View style={{ marginTop: 10 }}>
          {route.params.lastPayment && (
            <>
              {route.params.lastPayment.bill_link ? (
                <>
                  {route.params.lastPayment.status === 'waiting_payment' && (
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
                              {String(route.params.lastPayment.value.toFixed(2))
                                .replace()
                                .replace('.', ',')}
                            </DescriptionBold>{' '}
                            via boleto antes do seu vencimento{' '}
                            <DescriptionBold>
                              (
                              {format(
                                new Date(
                                  route.params.lastPayment.bill_expiration_date,
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
                                    route.params.lastPayment.bill_expiration_date,
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
                                    route.params.lastPayment.bill_expiration_date,
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
                                  route.params.lastPayment.value.toFixed(2),
                                )
                                  .replace()
                                  .replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                        </InnerStatsContainer>
                      </StatsCard>
                      {!route.params.isAdmin ? (
                        <View
                          style={{
                            paddingHorizontal: 15,
                            paddingVertical: 28,
                          }}
                        >
                          {isFuture(
                            addDays(
                              new Date(
                                route.params.payment_historic[0].payment.bill_expiration_date,
                              ),
                              1,
                            ),
                          ) ? (
                            <Button
                              name="Visualizar Boleto"
                              onPress={() => {
                                Linking.openURL(
                                  route.params.payment_historic[0].payment
                                    .bill_link,
                                );
                              }}
                            />
                          ) : (
                            <>
                              {userinfo?.staff ||
                              !isPast(
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
                                    if (
                                      route.params.interest_free_amount &&
                                      route.params.interest_free_amount > 0
                                    ) {
                                      navigation.push(
                                        'Challenge.RetryPayment',
                                        {
                                          data: route.params.data,
                                          challenge_id:
                                            route.params.challenge_id,
                                          award:
                                            route.params.payment_historic[0]
                                              .award,
                                          cancel_waiting_payments: true,
                                          value:
                                            route.params.interest_free_amount,
                                        },
                                      );
                                    } else {
                                      navigation.push(
                                        'Challenge.RetryPayment',
                                        {
                                          data: route.params.data,
                                          challenge_id:
                                            route.params.challenge_id,
                                          award:
                                            route.params.payment_historic[0]
                                              .award,
                                          cancel_waiting_payments: true,
                                          value: route.params.value,
                                        },
                                      );
                                    }
                                  }}
                                />
                              ) : null}
                            </>
                          )}
                        </View>
                      ) : null}
                    </PaymentStatusContainer>
                  )}

                  {route.params.lastPayment.status === 'paid' && (
                    <PaymentStatusContainer color="#FFF">
                      <StatsCard color="#009D33">
                        <InnerStatsContainer>
                          <AwaitTitle color="#009D33">
                            Pagamento confirmado
                          </AwaitTitle>
                          <Description>
                            Seu pagamento foi aprovado dia 02/06/21. Agora basta
                            pedalar e superar mais este desafio!
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
                                    route.params.lastPayment.bill_expiration_date,
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
                                    route.params.lastPayment.bill_expiration_date,
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
                                  route.params.lastPayment.value.toFixed(2),
                                ).replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                        </InnerStatsContainer>
                      </StatsCard>
                    </PaymentStatusContainer>
                  )}

                  {route.params.lastPayment.status === 'refused' && (
                    <PaymentStatusContainer color="#FFF">
                      <StatsCard color="#FF2525">
                        <InnerStatsContainer>
                          <AwaitTitle color="#FF2525">
                            Pagamento Recusado
                          </AwaitTitle>
                          <Description>
                            Seu boleto de R${' '}
                            {String(
                              route.params.lastPayment.value.toFixed(2),
                            ).replace('.', ',')}{' '}
                            venceu, gere um novo para se increver.
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
                                    route.params.lastPayment.bill_expiration_date,
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
                                    route.params.lastPayment.bill_expiration_date,
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
                                  route.params.lastPayment.value.toFixed(2),
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
                            {userinfo?.staff ||
                            !isPast(
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
                                  if (
                                    route.params.interest_free_amount &&
                                    route.params.interest_free_amount > 0
                                  ) {
                                    navigation.push('Challenge.RetryPayment', {
                                      data: route.params.data,
                                      challenge_id: route.params.challenge_id,
                                      award:
                                        route.params.payment_historic[0].award,
                                      cancel_waiting_payments: true,
                                      value: route.params.interest_free_amount,
                                    });
                                  } else {
                                    navigation.push('Challenge.RetryPayment', {
                                      data: route.params.data,
                                      challenge_id: route.params.challenge_id,
                                      award:
                                        route.params.payment_historic[0].award,
                                      cancel_waiting_payments: true,
                                      value: route.params.value,
                                    });
                                  }
                                }}
                              />
                            ) : null}
                          </View>
                        </InnerStatsContainer>
                      </StatsCard>
                    </PaymentStatusContainer>
                  )}
                </>
              ) : (
                <>
                  {route.params.lastPayment.status === 'waiting_payment' &&
                    !route.params.lastPayment.pix_qrcode && (
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
                                      route.params.lastPayment.created_at,
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
                                      route.params.lastPayment.updated_at,
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
                                    route.params.lastPayment.value.toFixed(2),
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

                  {route.params.lastPayment.status === 'waiting_payment' &&
                    route.params.lastPayment.pix_qrcode && (
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
                                      route.params.lastPayment.created_at,
                                    ),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer>

                              {/* <InfoContainer>
                                <InfoTitle>Data de Pagamento</InfoTitle>
                                <InfoDescription>
                                  {format(
                                    new Date(route.params.lastPayment.updated_at),
                                    "dd'/'MM'/'yyyy",
                                  )}
                                </InfoDescription>
                              </InfoContainer> */}

                              <InfoContainer style={{ borderBottomWidth: 0 }}>
                                <InfoTitle>Valor</InfoTitle>
                                <InfoDescription>
                                  R${' '}
                                  {String(
                                    route.params.lastPayment.value.toFixed(2),
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
                          <Button
                            name="Ver chave PIX novamente"
                            onPress={() => {
                              setModalState(true);
                            }}
                          />
                        </View>
                      </PaymentStatusContainer>
                    )}

                  {route.params.lastPayment.status === 'paid' &&
                    !route.params.lastPayment.pix_qrcode && (
                      <PaymentStatusContainer color="#FFF">
                        <StatsCard color="#009D33">
                          <InnerStatsContainer>
                            <Icons
                              height={65}
                              name={
                                route.params.lastPayment.card?.brand ||
                                'credit-card'
                              }
                            />
                            <AwaitTitle color="#009D33">
                              Inscrito com sucesso
                            </AwaitTitle>
                            <Description>
                              Seu pagamento foi aprovado dia{' '}
                              {format(
                                new Date(route.params.lastPayment.updated_at),
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
                                      route.params.lastPayment.created_at,
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
                                      route.params.lastPayment.updated_at,
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
                                    route.params.lastPayment.value.toFixed(2),
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

                  {route.params.lastPayment.status === 'paid' &&
                    route.params.lastPayment.pix_qrcode && (
                      <PaymentStatusContainer color="#FFF">
                        <StatsCard color="#009D33">
                          <InnerStatsContainer>
                            <Icons height={65} name="pix" color="#32BCAD" />
                            <AwaitTitle color="#009D33">
                              Inscrito com sucesso
                            </AwaitTitle>
                            <Description>
                              Seu pagamento foi aprovado dia{' '}
                              {format(
                                new Date(route.params.lastPayment.updated_at),
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
                                      route.params.lastPayment.created_at,
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
                                      route.params.lastPayment.updated_at,
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
                                    route.params.lastPayment.value.toFixed(2),
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

                  {route.params.lastPayment.status === 'refused' && (
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
                                  new Date(route.params.lastPayment.created_at),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer>
                              <InfoTitle>Data de Pagamento</InfoTitle>
                              <InfoDescription>
                                {format(
                                  new Date(route.params.lastPayment.updated_at),
                                  "dd'/'MM'/'yyyy",
                                )}
                              </InfoDescription>
                            </InfoContainer>

                            <InfoContainer style={{ borderBottomWidth: 0 }}>
                              <InfoTitle>Valor</InfoTitle>
                              <InfoDescription>
                                R${' '}
                                {String(
                                  route.params.lastPayment.value.toFixed(2),
                                )
                                  .replace()
                                  .replace('.', ',')}
                              </InfoDescription>
                            </InfoContainer>
                          </View>
                          {!route.params.isAdmin ? (
                            <View
                              style={{
                                paddingHorizontal: 15,
                                paddingVertical: 28,
                              }}
                            >
                              <Button
                                name="Trocar forma de pagamento"
                                onPress={() => {
                                  if (
                                    route.params.interest_free_amount &&
                                    route.params.interest_free_amount > 0
                                  ) {
                                    navigation.push('Challenge.RetryPayment', {
                                      data: route.params.data,
                                      challenge_id: route.params.challenge_id,
                                      award:
                                        route.params.payment_historic[0].award,
                                      cancel_waiting_payments: true,
                                      value: route.params.interest_free_amount,
                                    });
                                  } else {
                                    navigation.push('Challenge.RetryPayment', {
                                      data: route.params.data,
                                      challenge_id: route.params.challenge_id,
                                      award:
                                        route.params.payment_historic[0].award,
                                      cancel_waiting_payments: true,
                                      value: route.params.value,
                                    });
                                  }
                                }}
                              />
                            </View>
                          ) : null}
                        </InnerStatsContainer>
                      </StatsCard>
                    </PaymentStatusContainer>
                  )}
                </>
              )}
            </>
          )}
        </View>
        <Box
          style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 24 }}
        >
          <TitleText style={{ fontSize: 20 }}>Histórico de compra</TitleText>
          {route.params.payment_historic &&
            route.params.payment_historic.map(({ payment }) => (
              <>
                {payment.status === 'waiting_payment' && (
                  <HistoryContainer>
                    <IconContainer color="#FFC502">
                      <Icons
                        height={19}
                        color="#FFFF"
                        name={
                          payment.card
                            ? 'credit-card'
                            : payment.pix_qrcode
                            ? 'pix'
                            : 'bar-code'
                        }
                      />
                    </IconContainer>
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <InfoTitle>Valor</InfoTitle>
                      <InfoDescription>
                        <InfoTitle>R$</InfoTitle>
                        {String(payment.value.toFixed(2)).replace('.', ',')}
                      </InfoDescription>
                    </View>
                    {payment.bill_expiration_date ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InfoTitle>Vencimento</InfoTitle>
                        <InfoDescription>
                          {format(
                            new Date(payment.bill_expiration_date),
                            "dd'/'MM'/'yyyy",
                          )}
                        </InfoDescription>
                      </View>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {payment.installments > 1 ? (
                          <>
                            <InfoTitle>Parcelas</InfoTitle>
                            <InfoDescription>
                              {payment.installments}x
                            </InfoDescription>
                          </>
                        ) : (
                          <>
                            <InfoTitle>Data pgto</InfoTitle>
                            <InfoDescription>
                              {format(
                                new Date(payment.created_at),
                                "dd'/'MM'/'yyyy",
                              )}
                            </InfoDescription>
                          </>
                        )}
                      </View>
                    )}

                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <InfoTitle>Situação</InfoTitle>
                      <InfoDescription>Aguardando</InfoDescription>
                    </View>
                  </HistoryContainer>
                )}

                {payment.status === 'paid' && (
                  <HistoryContainer>
                    <IconContainer color="#009D33">
                      <Icons
                        height={19}
                        color="#FFFF"
                        name={
                          payment.card
                            ? 'credit-card'
                            : payment.pix_qrcode
                            ? 'pix'
                            : 'bar-code'
                        }
                      />
                    </IconContainer>
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <InfoTitle>Valor</InfoTitle>
                      <InfoDescription>
                        <InfoTitle>R$</InfoTitle>
                        {String(payment.value.toFixed(2))
                          .replace()
                          .replace('.', ',')}
                      </InfoDescription>
                    </View>

                    {payment.bill_expiration_date ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InfoTitle>Vencimento</InfoTitle>
                        <InfoDescription>
                          {format(
                            new Date(payment.bill_expiration_date),
                            "dd'/'MM'/'yyyy",
                          )}
                        </InfoDescription>
                      </View>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {payment.installments > 1 ? (
                          <>
                            <InfoTitle>Parcelas</InfoTitle>
                            <InfoDescription>
                              {payment.installments}x
                            </InfoDescription>
                          </>
                        ) : (
                          <>
                            <InfoTitle>Data pgto</InfoTitle>
                            <InfoDescription>
                              {format(
                                new Date(payment.created_at),
                                "dd'/'MM'/'yyyy",
                              )}
                            </InfoDescription>
                          </>
                        )}
                      </View>
                    )}

                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <InfoTitle>Situação</InfoTitle>
                      <InfoDescription>Concluído</InfoDescription>
                    </View>
                  </HistoryContainer>
                )}

                {payment.status === 'refused' && (
                  <HistoryContainer>
                    <IconContainer color="#FF2525">
                      <Icons
                        height={19}
                        color="#FFFF"
                        name={
                          payment.card
                            ? 'credit-card'
                            : payment.pix_qrcode
                            ? 'pix'
                            : 'bar-code'
                        }
                      />
                    </IconContainer>
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <InfoTitle>Valor</InfoTitle>
                      <InfoDescription>
                        <InfoTitle>R$</InfoTitle>
                        {String(payment.value.toFixed(2))
                          .replace()
                          .replace('.', ',')}
                      </InfoDescription>
                    </View>

                    {payment.bill_expiration_date ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InfoTitle>Vencimento</InfoTitle>
                        <InfoDescription>
                          {format(
                            new Date(payment.bill_expiration_date),
                            "dd'/'MM'/'yyyy",
                          )}
                        </InfoDescription>
                      </View>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {payment.installments > 1 ? (
                          <>
                            <InfoTitle>Parcelas</InfoTitle>
                            <InfoDescription>
                              {payment.installments}x
                            </InfoDescription>
                          </>
                        ) : (
                          <>
                            <InfoTitle>Data pgto</InfoTitle>
                            <InfoDescription>
                              {format(
                                new Date(payment.created_at),
                                "dd'/'MM'/'yyyy",
                              )}
                            </InfoDescription>
                          </>
                        )}
                      </View>
                    )}

                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <InfoTitle>Situação</InfoTitle>
                      <InfoDescription>Recusado</InfoDescription>
                    </View>
                  </HistoryContainer>
                )}
              </>
            ))}
        </Box>
      </ScrollView>
      <View />
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

            {route.params.lastPayment.pix_qrcode ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <QRCode
                  value={route.params.lastPayment.pix_qrcode}
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
                    String(route.params.lastPayment.pix_qrcode),
                  );
                  Toast.show('Pix copiado com sucesso!', Toast.LONG);
                }}
              />
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </SafeAreaView>
  );
};
export default ChallengePaymentHistoric;
