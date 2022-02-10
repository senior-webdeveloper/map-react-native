import { addDays, format, isFuture, isPast } from 'date-fns';
import { View } from 'react-native';
import React from 'react';
import { Button } from '~/components';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import {
  Challenge,
  ChallengeAwards,
  City,
  Maybe,
  Payment,
  Profile,
  Scalars,
  SubscriptionPayment,
  UsersCompanies,
} from '~/graphql/autogenerate/schemas';
import {
  AwaitTitle,
  Description,
  DescriptionBold,
  InfoContainer,
  InfoDescription,
  InfoTitle,
  InnerStatsContainer,
  PaymentStatusContainer,
  StatsCard,
} from '~/screens/Challenge/Challenge.MyPayment/components/Styles';

export function BillLinkPaymentComponent({
  onPress,
  onPress1,
  onPress2,
  params: { data, isAdmin, lastPayment, payment_historic },
  userinfo,
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
  userinfo: {
    __typename?: 'User' | undefined;
    id: Scalars['ID'] | undefined;
    name?: Maybe<Scalars['String']> | undefined;
    firstname?: Maybe<Scalars['String']> | undefined;
    lastname?: Maybe<Scalars['String']> | undefined;
    email?: Maybe<Scalars['String']> | undefined;
    gender?: Maybe<Scalars['String']> | undefined;
    stature?: Maybe<Scalars['Float']> | undefined;
    weight?: Maybe<Scalars['Float']> | undefined;
    phone?: Maybe<Scalars['String']> | undefined;
    date_of_birth?: Maybe<Scalars['CacheDate']> | undefined;
    has_social_login: Scalars['Boolean'] | undefined;
    city_id?: Maybe<Scalars['String']> | undefined;
    city?: Maybe<City> | undefined;
    active: Scalars['Boolean'] | undefined;
    address_line_one?: Maybe<Scalars['String']> | undefined;
    address_line_two?: Maybe<Scalars['String']> | undefined;
    street_number?: Maybe<Scalars['String']> | undefined;
    legal_registry_number?: Maybe<Scalars['String']> | undefined;
    zip_code?: Maybe<Scalars['String']> | undefined;
    strava_permission_activities: Scalars['Boolean'] | undefined;
    staff: Scalars['Boolean'] | undefined;
    blacklist: Scalars['Boolean'] | undefined;
    team_name?: Maybe<Scalars['String']> | undefined;
    companies: Array<UsersCompanies> | undefined;
    payments: Array<Payment> | undefined;
    created_at: Scalars['DateTime'] | undefined;
    updated_at: Scalars['DateTime'] | undefined;
    profile?: Maybe<Profile> | undefined;
    last_challenge?: Maybe<Challenge> | undefined;
    count_challenges_participates?: Maybe<Scalars['Float']> | undefined;
    activities_count?: Maybe<Scalars['Float']> | undefined;
  };
  onPress1: () => void;
  onPress2: () => void;
}) {
  return (
    <>
      {lastPayment.status === 'waiting_payment' && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#FFC502">
            <InnerStatsContainer>
              <AwaitTitle color="#FFC502">Aguardando pagamento</AwaitTitle>
              <Description>
                Pague{' '}
                <DescriptionBold>
                  R${' '}
                  {String(lastPayment.value.toFixed(2))
                    .replace()
                    .replace('.', ',')}
                </DescriptionBold>{' '}
                via boleto antes do seu vencimento{' '}
                <DescriptionBold>
                  (
                  {format(
                    new Date(lastPayment.bill_expiration_date),
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
                      new Date(lastPayment.bill_expiration_date),
                      "dd'/'MM'/'yyyy",
                    )}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de vencimento</InfoTitle>
                  <InfoDescription>
                    {format(
                      new Date(lastPayment.bill_expiration_date),
                      "dd'/'MM'/'yyyy",
                    )}
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
          {!isAdmin ? (
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 28,
              }}
            >
              {isFuture(
                addDays(
                  new Date(payment_historic[0].payment.bill_expiration_date),
                  1,
                ),
              ) ? (
                <Button name="Visualizar Boleto" onPress={onPress} />
              ) : (
                <>
                  {userinfo?.staff ||
                  !isPast(
                    new Date(data.getChallengeDetail.end_date_registration),
                  ) ? (
                    <Button
                      name="Novo boleto ou trocar pagamento"
                      disabled={
                        userinfo?.staff
                          ? false
                          : isPast(
                              new Date(
                                data.getChallengeDetail.end_date_registration,
                              ),
                            )
                      }
                      onPress={onPress1}
                    />
                  ) : null}
                </>
              )}
            </View>
          ) : null}
        </PaymentStatusContainer>
      )}

      {lastPayment.status === 'paid' && (
        <PaymentStatusContainer color="#FFF">
          <StatsCard color="#009D33">
            <InnerStatsContainer>
              <AwaitTitle color="#009D33">Pagamento confirmado</AwaitTitle>
              <Description>
                Seu pagamento foi aprovado dia 02/06/21. Agora basta pedalar e
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
                      new Date(lastPayment.bill_expiration_date),
                      "dd'/'MM'/'yyyy",
                    )}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de vencimento</InfoTitle>
                  <InfoDescription>
                    {format(
                      new Date(lastPayment.bill_expiration_date),
                      "dd'/'MM'/'yyyy",
                    )}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer style={{ borderBottomWidth: 0 }}>
                  <InfoTitle>Valor</InfoTitle>
                  <InfoDescription>
                    R$ {String(lastPayment.value.toFixed(2)).replace('.', ',')}
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
              <AwaitTitle color="#FF2525">Pagamento Recusado</AwaitTitle>
              <Description>
                Seu boleto de R${' '}
                {String(lastPayment.value.toFixed(2)).replace('.', ',')} venceu,
                gere um novo para se increver.
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
                      new Date(lastPayment.bill_expiration_date),
                      "dd'/'MM'/'yyyy",
                    )}
                  </InfoDescription>
                </InfoContainer>

                <InfoContainer>
                  <InfoTitle>Data de vencimento</InfoTitle>
                  <InfoDescription>
                    {format(
                      new Date(lastPayment.bill_expiration_date),
                      "dd'/'MM'/'yyyy",
                    )}
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
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 28,
                }}
              >
                {userinfo?.staff ||
                !isPast(
                  new Date(data.getChallengeDetail.end_date_registration),
                ) ? (
                  <Button
                    name="Novo boleto ou trocar pagamento"
                    disabled={
                      userinfo?.staff
                        ? false
                        : isPast(
                            new Date(
                              data.getChallengeDetail.end_date_registration,
                            ),
                          )
                    }
                    onPress={onPress2}
                  />
                ) : null}
              </View>
            </InnerStatsContainer>
          </StatsCard>
        </PaymentStatusContainer>
      )}
    </>
  );
}
