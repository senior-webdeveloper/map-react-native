import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Button, Icons, Text, TitleText } from '~/components';
import { Card, Maybe, Payment } from '~/graphql/autogenerate/schemas';

export function DataComponent({
  data: { findPayment },
  onPress,
  onPress1,
  onPress2,
  onPress3,
}: {
  data: { __typename?: 'Query' } & {
    findPayment: { __typename?: 'Payment' } & Pick<
      Payment,
      | 'id'
      | 'resource_payment_id'
      | 'origin_payment_id'
      | 'payment_processor_id'
      | 'country_id'
      | 'bill_expiration_date'
      | 'value'
      | 'is_paid'
      | 'declined'
      | 'returned'
      | 'entrance'
      | 'processed'
      | 'profile_id'
      | 'user_id'
      | 'bill_barcode'
      | 'bill_link'
      | 'status'
      | 'created_at'
      | 'updated_at'
      | 'humanized_message'
      | 'installments'
      | 'pix_qrcode'
      | 'pix_expiration_date'
    > & {
        card?: Maybe<
          { __typename?: 'Card' } & Pick<Card, 'last_digits' | 'brand'>
        >;
      };
  };
  onPress: () => void;
  onPress1: () => void;
  onPress2: () => void;
  onPress3: () => void;
}) {
  return (
    <>
      {(findPayment.is_paid || findPayment.status === 'waiting_payment') &&
        !findPayment.bill_link &&
        !findPayment.pix_qrcode && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
          >
            <Image
              style={{ width: 149, height: 149 }}
              source={require('../images/success.png')}
            />
            <TitleText style={{ textAlign: 'center' }}>
              Inscrição realizada com sucesso
            </TitleText>
            <Text style={{ textAlign: 'center' }}>
              Sua inscrição foi confirmada com sucesso.
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Fique atento a data de liberação de atividades e detone neste
              desafio.
            </Text>
          </View>
        )}

      {findPayment.pix_qrcode ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: '#FFC502',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <Icons name="clock" color="#FFF" height={40} width={40} />
          </View>

          <TitleText style={{ textAlign: 'center' }}>Aguardando PIX</TitleText>
          <Text style={{ textAlign: 'center' }}>
            A chave PIX ficará disponível por 30 minutos e depois será
            automaticamente cancelada. O banco poderá levar até 1 dia útil para
            confirmar o pagamento.
          </Text>
        </View>
      ) : null}

      {findPayment.bill_link && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Image
            style={{ width: 149, height: 149 }}
            source={require('../images/success.png')}
          />
          <TitleText style={{ textAlign: 'center' }}>
            Inscrição realizada com sucesso
          </TitleText>
          <Text style={{ textAlign: 'center' }}>
            Sua inscrição foi confirmada com sucesso.
          </Text>
          <Text style={{ textAlign: 'center' }}>
            Fique atento a data de liberação de atividades e detone neste
            desafio.
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ textAlign: 'center' }}>
              {findPayment.bill_barcode}
            </Text>

            <TouchableOpacity
              style={{
                marginBottom: 12,
                backgroundColor: '#0564ff',
                borderRadius: 32,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={onPress}
            >
              <Text style={{ color: '#FFF' }}>Copiar linha digitável</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderColor: '#0564ff',
                borderWidth: 1,
                borderRadius: 32,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={onPress1}
            >
              <Text>Visualizar Boleto</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {(findPayment.declined || findPayment.status === 'refused') && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Image
            style={{ width: 149, height: 149 }}
            source={require('../images/error.png')}
          />
          <TitleText style={{ textAlign: 'center' }}>
            Não foi possivel realizar o pagamento da inscrição
          </TitleText>
          <Text style={{ textAlign: 'center' }}>
            {findPayment.humanized_message}
          </Text>
        </View>
      )}
      {findPayment.bill_link && (
        <View
          style={{
            paddingHorizontal: 32,
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: '#0564ff',
              borderWidth: 1,
              borderRadius: 32,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onPress2}
          >
            <Text>Ir para o desafio</Text>
          </TouchableOpacity>
        </View>
      )}

      {findPayment.pix_qrcode ? (
        <View
          style={{
            paddingHorizontal: 32,
            paddingBottom: 20,
          }}
        >
          <Button name="Ver chave PIX novamente" onPress={onPress3} />

          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              marginTop: 20,
              backgroundColor: '#0565ff11',
              borderRadius: 24,
            }}
            onPress={onPress2}
          >
            <Text style={{ color: '#0564ff' }}>Ir para o desafio</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {(findPayment.is_paid ||
        (findPayment.status === 'waiting_payment' && !findPayment.bill_link)) &&
        !findPayment.pix_qrcode && (
          <View
            style={{
              paddingHorizontal: 32,
              paddingBottom: 20,
            }}
          >
            <TouchableOpacity
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                marginTop: 20,
                backgroundColor: '#0565ff11',
                borderRadius: 24,
              }}
              onPress={onPress2}
            >
              <Text style={{ color: '#0564ff' }}>Ir para o desafio</Text>
            </TouchableOpacity>
          </View>
        )}
      {(findPayment.declined || findPayment.status === 'refused') && (
        <View
          style={{
            paddingHorizontal: 32,
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              marginTop: 20,
              backgroundColor: '#0565ff11',
              borderRadius: 24,
            }}
            onPress={onPress2}
          >
            <Text style={{ color: '#0564ff' }}>Ir para o desafio</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
