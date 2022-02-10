import { View } from 'react-native';
import { format } from 'date-fns';
import React from 'react';
import { Button, Icons } from '~/components';
import {
  AwaitTitle,
  Description,
  InfoContainer,
  InfoDescription,
  InfoTitle,
  InnerStatsContainer,
  PaymentStatusContainer,
  StatsCard,
} from '~/screens/Challenge/Challenge.MyPayment/components/Styles';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import {
  ChallengeAwards,
  SubscriptionPayment,
} from '~/graphql/autogenerate/schemas';

export function OtherPaymentsComponent({
  onPress,
  onPress1,
  params: { isAdmin, lastPayment },
}: {
  params: Readonly<{
    data: GetChallengeDetailQuery;
    challenge_id: string;
    award: ChallengeAwards;
    payment_id: string;
    payment_historic: SubscriptionPayment[];
    value: number;
    last_payment?: SubscriptionPayment;
    interest_free_amount?: number;
  }>;
  onPress: () => void;
  onPress1: () => void;
}) {
  return (
    <>
      {lastPayment.status === 'waiting_payment' && !lastPayment.pix_qrcode && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#FFC502">
            <InnerStatsContainer>
              <AwaitTitle color="#FFC502">Aguardando pagamento</AwaitTitle>
              <Description>
                Contate a empresa responsável pelo seu cartão para obter mais
                informações.
              </Description>
              <View style={{ marginTop: 24, width: '100%' }}>
                <InfoContainer>
                  <InfoTitle>Meio de pagamento</InfoTitle>
                  <InfoDescription>Cartão</InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de emissão</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de Pagamento</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.updated_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer style={{ borderBottomWidth: 0 }}>
                  <InfoTitle>Valor</InfoTitle>
                  <InfoDescription>
                    R${' '}
                    {String(lastPayment.value.toFixed(2))
                      .replace()
                      .replace('.', ',')}
                  </InfoDescription>
                </InfoContainer>
              </View>
            </InnerStatsContainer>
          </StatsCard>
        </PaymentStatusContainer>
      )}

      {lastPayment.status === 'waiting_payment' && lastPayment.pix_qrcode && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#FFC502">
            <InnerStatsContainer>
              <AwaitTitle color="#FFC502">Aguardando pagamento</AwaitTitle>
              <Description>
                A chave PIX ficará disponível por 30 minutos e depois será
                automaticamente cancelada. O banco poderá levar até 1 dia útil
                para confirmar o pagamento.
              </Description>
              <View style={{ marginTop: 24, width: '100%' }}>
                <InfoContainer>
                  <InfoTitle>Meio de pagamento</InfoTitle>
                  <InfoDescription>Pix</InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de emissão</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.created_at), "dd'/'MM'/'yyyy")}
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
                    {String(lastPayment.value.toFixed(2))
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
            <Button name="Ver chave PIX novamente" onPress={onPress} />
          </View>
        </PaymentStatusContainer>
      )}

      {lastPayment.status === 'paid' && !lastPayment.pix_qrcode && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#009D33">
            <InnerStatsContainer>
              <Icons
                height={65}
                name={lastPayment.card?.brand || 'credit-card'}
              />
              <AwaitTitle color="#009D33">Inscrito com sucesso</AwaitTitle>
              <Description>
                Seu pagamento foi aprovado dia{' '}
                {format(new Date(lastPayment.updated_at), "dd'/'MM'/'yyyy")}.
                Agora basta pedalar e superar mais este desafio!
              </Description>
              <View style={{ marginTop: 24, width: '100%' }}>
                <InfoContainer>
                  <InfoTitle>Meio de pagamento</InfoTitle>
                  <InfoDescription>Cartão</InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de emissão</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de Pagamento</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.updated_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer style={{ borderBottomWidth: 0 }}>
                  <InfoTitle>Valor</InfoTitle>
                  <InfoDescription>
                    R${' '}
                    {String(lastPayment.value.toFixed(2))
                      .replace()
                      .replace('.', ',')}
                  </InfoDescription>
                </InfoContainer>
              </View>
            </InnerStatsContainer>
          </StatsCard>
        </PaymentStatusContainer>
      )}

      {lastPayment.status === 'paid' && lastPayment.pix_qrcode && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#009D33">
            <InnerStatsContainer>
              <Icons height={65} name="pix" color="#32BCAD" />
              <AwaitTitle color="#009D33">Inscrito com sucesso</AwaitTitle>
              <Description>
                Seu pagamento foi aprovado dia{' '}
                {format(new Date(lastPayment.updated_at), "dd'/'MM'/'yyyy")}.
                Agora basta pedalar e superar mais este desafio!
              </Description>
              <View style={{ marginTop: 24, width: '100%' }}>
                <InfoContainer>
                  <InfoTitle>Meio de pagamento</InfoTitle>
                  <InfoDescription>Pix</InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de emissão</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de Pagamento</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.updated_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer style={{ borderBottomWidth: 0 }}>
                  <InfoTitle>Valor</InfoTitle>
                  <InfoDescription>
                    R${' '}
                    {String(lastPayment.value.toFixed(2))
                      .replace()
                      .replace('.', ',')}
                  </InfoDescription>
                </InfoContainer>
              </View>
            </InnerStatsContainer>
          </StatsCard>
        </PaymentStatusContainer>
      )}

      {lastPayment.status === 'refused' && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#FF2525">
            <InnerStatsContainer>
              <AwaitTitle color="#FF2525">Pagamento recusado</AwaitTitle>
              <Description>
                Não foi possível realizar o pagamento da inscrição, tente
                novamente mais tarde ou troque a forma de pagamento.
              </Description>
              <View style={{ marginTop: 24, width: '100%' }}>
                <InfoContainer>
                  <InfoTitle>Meio de pagamento</InfoTitle>
                  <InfoDescription>Cartão</InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de emissão</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de Pagamento</InfoTitle>
                  <InfoDescription>
                    {format(new Date(lastPayment.updated_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer style={{ borderBottomWidth: 0 }}>
                  <InfoTitle>Valor</InfoTitle>
                  <InfoDescription>
                    R${' '}
                    {String(lastPayment.value.toFixed(2))
                      .replace()
                      .replace('.', ',')}
                  </InfoDescription>
                </InfoContainer>
              </View>
              {!isAdmin ? (
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 28,
                  }}
                >
                  <Button name="Trocar forma de pagamento" onPress={onPress1} />
                </View>
              ) : null}
            </InnerStatsContainer>
          </StatsCard>
        </PaymentStatusContainer>
      )}
    </>
  );
}
