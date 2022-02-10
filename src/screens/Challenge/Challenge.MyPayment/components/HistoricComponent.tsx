import { View } from 'react-native';
import { format } from 'date-fns';
import React from 'react';
import { Icons } from '~/components';
import { Payment } from '~/graphql/autogenerate/schemas';
import {
  HistoryContainer,
  IconContainer,
  InfoDescription,
  InfoTitle,
} from '~/screens/Challenge/Challenge.MyPayment/components/Styles';

export function HistoricComponent({ payment }: { payment: Payment }) {
  return (
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
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
                  <InfoDescription>{payment.installments}x</InfoDescription>
                </>
              ) : (
                <>
                  <InfoTitle>Data pgto</InfoTitle>
                  <InfoDescription>
                    {format(new Date(payment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </>
              )}
            </View>
          )}

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <InfoTitle>Valor</InfoTitle>
            <InfoDescription>
              <InfoTitle>R$</InfoTitle>
              {String(payment.value.toFixed(2)).replace().replace('.', ',')}
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
                  <InfoDescription>{payment.installments}x</InfoDescription>
                </>
              ) : (
                <>
                  <InfoTitle>Data pgto</InfoTitle>
                  <InfoDescription>
                    {format(new Date(payment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </>
              )}
            </View>
          )}

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <InfoTitle>Valor</InfoTitle>
            <InfoDescription>
              <InfoTitle>R$</InfoTitle>
              {String(payment.value.toFixed(2)).replace().replace('.', ',')}
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
                  <InfoDescription>{payment.installments}x</InfoDescription>
                </>
              ) : (
                <>
                  <InfoTitle>Data pgto</InfoTitle>
                  <InfoDescription>
                    {format(new Date(payment.created_at), "dd'/'MM'/'yyyy")}
                  </InfoDescription>
                </>
              )}
            </View>
          )}

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <InfoTitle>Situação</InfoTitle>
            <InfoDescription>Recusado</InfoDescription>
          </View>
        </HistoryContainer>
      )}
    </>
  );
}
