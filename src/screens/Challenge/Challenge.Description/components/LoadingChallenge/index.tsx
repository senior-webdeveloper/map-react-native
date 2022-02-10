import React from 'react';
import { ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Icons } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

interface Props {
  navigation: ChallengeDescriptionNavigationProp;
}

export default function LoadingChallenge({ navigation }: Props): JSX.Element {
  return (
    <SkeletonPlaceholder position="absolute" top={0}>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={widthPercentageToDP('100')}
          height={438}
          borderRadius={16}
        />

        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          width={widthPercentageToDP('100')}
          marginTop={16}
          paddingHorizontal={16}
        >
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item height={21} width={80} borderRadius={4} />

            <SkeletonPlaceholder.Item
              height={21}
              width={119}
              borderRadius={4}
              marginLeft={23}
            />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item height={21} width={21} borderRadius={4} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          width={widthPercentageToDP('100')}
          marginTop={32}
          paddingHorizontal={16}
        >
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={32}
              width={164}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              height={32}
              width={210}
              borderRadius={4}
              marginTop={16}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item height={56} width={56} borderRadius={8} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      <SkeletonPlaceholder.Item
        justifyContent="space-between"
        alignItems="flex-start"
        width={widthPercentageToDP('100')}
        marginTop={16}
        paddingHorizontal={16}
      >
        <SkeletonPlaceholder.Item
          height={24}
          width={widthPercentageToDP('100') - 32}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          height={24}
          width={widthPercentageToDP('90') - 32}
          borderRadius={4}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}
