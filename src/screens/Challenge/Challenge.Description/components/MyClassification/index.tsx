import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PUBLIC_STORAGE } from '@env';

import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { useStoreState } from '~/store';
import { Icons, Box, TitleText, Text } from '~/components';
import {
  BoxShadow,
  Wrapper,
  Avatar,
  AlignCrown,
  ClassificationText,
  FooterWrapper,
  ParagraphMargin,
} from './styles';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

interface Props {
  onPress: () => void;
  count_subscribe: number;
  classification: number | null | undefined;
  isCompleted: boolean;
}

export default function MyClassification({
  count_subscribe,
  classification,
  onPress,
  isCompleted,
}: Props): JSX.Element {
  const userProfile = useStoreState((state) => state.profile.payload);

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        variant="shadow"
        justifyContent="space-between"
        paddingBottom={20}
        paddingTop={3}
        paddingX={16}
        marginTop={24}
      >
        <Box>
          <TitleText style={{ color: '#4595EC' }}>Classificação</TitleText>
          <Text
            style={{
              color: 'rgba(22, 28, 37, 0.56)',
              fontFamily: 'NeuzeitGro-Lig',
              fontSize: 14,
              lineHeight: 16,
              width: '60%',
            }}
          >
            Confira os destaques e o ranking de todos participantes.
          </Text>

          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={24}
          >
            <Box flexDirection="row" alignItems="center">
              <Text>{classification ? `${classification}º` : '-'}</Text>
              <Avatar
                style={{ marginLeft: 16 }}
                source={{
                  uri: `${PUBLIC_STORAGE}/${userProfile?.getProfile.profile_avatar}`,
                }}
              />
              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'NeuzeitGro-Lig',
                  width: widthPercentageToDP('40'),
                }}
                numberOfLines={1}
              >
                {`${userProfile.getProfile.user.firstname} ${userProfile.getProfile.user.lastname}`}
              </Text>
            </Box>

            <Box>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={onPress}
              >
                <Text
                  style={{
                    marginRight: 8,
                    fontFamily: 'NeuzeitGro-Lig',
                    fontSize: 14,
                    color: '#4595EC',
                  }}
                >
                  Ver tudo
                </Text>
                <Icons name="chevron-right" color="#4595EC" />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
