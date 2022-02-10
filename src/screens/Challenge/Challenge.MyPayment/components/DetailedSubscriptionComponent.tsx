import { format, isFuture, isPast } from 'date-fns';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, Icons, Text, TitleText } from '~/components';
import { lightTheme } from '~/global/themes';
import locale from '~/helpers/dateLocale';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { useStoreState } from '~/store';

export function DetailedSubscriptionComponent(props: {
  params: Readonly<{
    user_challenge_id: string;
    challenge_id: string;
    physical_event: boolean;
    data: GetChallengeDetailQuery;
    last_payment_id?: string | null;
    categorySelected?: string;
  }>;
  userinfoStore: any;
  onPress: () => void;
  onPress1: () => void;
  profile: any;
}) {
  const categorySelected = useStoreState(
    (actions) => actions.challenge.categorySelected,
  );
  return (
    <Box width={1} px={16}>
      <Box mt={24}>
        <TitleText style={{ fontSize: 20 }}>
          {props.params.data.getChallengeDetail.name}
        </TitleText>

        <Box mt={2}>
          {props.params.data.getChallengeDetail.user_challenges[0]?.category ? (
            <Box
              borderBottomWidth={1}
              borderBottomColor="rgba(223, 232, 237, 0.6)"
              paddingVertical={16}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Icons
                  name="bike"
                  height={15}
                  width={20}
                  style={{ marginRight: 8 }}
                />
                <Text>Categoria</Text>
              </Box>

              <Box flexDirection="row" alignItems="center">
                <Text style={{ color: lightTheme.colors.blue100 }}>
                  {props.params.data.getChallengeDetail.challenge_categories
                    .filter((el) => el.id === categorySelected)
                    .map((el) => el.name)}
                  {/* { */}
                  {/*  props.params.data.getChallengeDetail.user_challenges[0] */}
                  {/*    ?.category.name */}
                  {/* } */}
                </Text>

                {props.userinfoStore?.getProfile.user.staff ||
                (props.params.data.getChallengeDetail.has_categories &&
                  !isPast(
                    new Date(
                      props.params.data.getChallengeDetail.end_date_registration,
                    ),
                  ) &&
                  !isFuture(
                    new Date(
                      props.params.data.getChallengeDetail.start_date_registration,
                    ),
                  ) &&
                  !isPast(
                    new Date(
                      props.params.data.getChallengeDetail.configuration?.deadline_category_change,
                    ),
                  ) &&
                  props.params.data.getChallengeDetail.configuration
                    ?.allows_category_change) ? (
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    hitSlop={{
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10,
                    }}
                    onPress={props.onPress}
                  >
                    <Icons name="dots-vertical" />
                  </TouchableOpacity>
                ) : null}
              </Box>
            </Box>
          ) : null}

          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="calendar" width={20} style={{ marginRight: 8 }} />
              <Text>Data do evento</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {format(
                  new Date(props.params.data.getChallengeDetail.start_date),
                  'P',
                  { locale },
                )}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={48}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TitleText style={{ fontSize: 20 }}>Meus dados</TitleText>

          <TouchableOpacity onPress={props.onPress1}>
            <Text style={{ color: lightTheme.colors.blue100 }}>Editar</Text>
          </TouchableOpacity>
        </Box>

        <Box mt={2}>
          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons
                name="calendar"
                height={15}
                width={20}
                style={{ marginRight: 8 }}
              />
              <Text>Data de Nascimento</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {format(
                  new Date(props.profile?.getProfile.user.date_of_birth),
                  'P',
                  { locale },
                )}
              </Text>
            </Box>
          </Box>

          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="identity" width={20} style={{ marginRight: 8 }} />
              <Text>CPF / CNPJ</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {props.profile?.getProfile.user.legal_registry_number.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  '$1.$2.$3-$4',
                )}
              </Text>
            </Box>
          </Box>

          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="single-user" width={20} style={{ marginRight: 8 }} />
              <Text>Gênero</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {props.profile?.getProfile.user.gender === 'M'
                  ? 'Masculino'
                  : null}
                {props.profile?.getProfile.user.gender === 'F'
                  ? 'Feminino'
                  : null}
                {props.profile?.getProfile.user.gender === 'O' ? 'Outro' : null}
              </Text>
            </Box>
          </Box>

          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="call-phone" width={20} style={{ marginRight: 8 }} />
              <Text>Contato</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {props.profile?.getProfile.user.phone.replace(
                  /(\d{2})(\d{2})(\d{1})(\d{4})(\d{3})/,
                  '$1 ($2) $3 $4-$5',
                )}
              </Text>
            </Box>
          </Box>

          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="team" width={20} style={{ marginRight: 8 }} />
              <Text>Equipe</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {props.profile?.getProfile.user.team_name}
              </Text>
            </Box>
          </Box>

          <Box
            borderBottomWidth={1}
            borderBottomColor="rgba(223, 232, 237, 0.6)"
            paddingVertical={16}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="calendar" width={20} style={{ marginRight: 8 }} />
              <Text>Data de inscrição</Text>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Text style={{ color: lightTheme.colors.blue100 }}>
                {format(
                  new Date(
                    props.params.data?.getChallengeDetail.user_challenges[0].created_at,
                  ),
                  'P',
                  { locale },
                )}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
