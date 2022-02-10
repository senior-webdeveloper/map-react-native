import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import {
  ProductType,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';
import { RootStackParamList } from '~/routes.types';
import {
  HeaderContainer,
  Container,
  FooterContainer,
  AwardImage,
  FooterText,
  AwardContainer,
  AwardNameContainer,
  AwardWrapper,
  HeaderTitle,
  SubtitleOpacity,
} from './styles';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { Box, Text, TitleText } from '~/components';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

interface Props {
  products: ProductType[];
  navigation: ChallengeDescriptionNavigationProp;
  isPhysical: boolean;
  subscribe: () => Promise<void>;
  showSubscribe: boolean;
  showBuyMore: boolean;
  hasClickedOnSubscribe: boolean;
  isPaid: boolean;
  data: GetChallengeDetailQuery;
  extraordinaryActions?: UserEventExtraordinaryActionType;
}

export default function ProductsShowcase({
  products,
  navigation,
  isPhysical,
  subscribe,
  showSubscribe,
  showBuyMore,
  hasClickedOnSubscribe,
  isPaid,
  data,
  extraordinaryActions,
}: Props): JSX.Element {
  return (
    <Container>
      <HeaderContainer>
        <Box>
          <TitleText style={{ color: '#4595EC' }}>Extras</TitleText>
          <Text
            style={{
              color: 'rgba(22, 28, 37, 0.56)',
              fontFamily: 'NeuzeitGro-Lig',
              fontSize: 14,
              lineHeight: 16,
              width: '60%',
            }}
          >
            Opções extras que podem ser adicionadas junto da inscrição.
          </Text>
        </Box>
      </HeaderContainer>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products &&
          products.length > 0 &&
          products.slice(0, 10).map((product, index) => (
            <AwardContainer key={product.id.toString()}>
              <TouchableOpacity
                // disabled
                onPress={() =>
                  navigation.navigate('Products.Description', {
                    product,
                    title: 'Extras',
                    subscribe,
                    showSubscribe,
                    hasClickedOnSubscribe,
                    isPaid,
                    award_index: index,
                    showBuyMore,
                    data,
                  })
                }
              >
                <AwardWrapper index={index} length={products.length}>
                  <AwardImage
                    source={{
                      uri:
                        product.images && product.images.length > 0
                          ? `${PUBLIC_STORAGE}/${product.images[0].link}`
                          : `${PUBLIC_STORAGE}/miscellaneous/product.jpg`,
                    }}
                  />

                  <AwardNameContainer>
                    <Styled.ParagraphText>{product.name}</Styled.ParagraphText>
                  </AwardNameContainer>
                </AwardWrapper>
              </TouchableOpacity>
            </AwardContainer>
          ))}
      </ScrollView>

      <FooterContainer>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Products.Showcase', {
              products,
              title: 'Extras',
              subscribe,
              showSubscribe,
              hasClickedOnSubscribe,
              isPaid,
              showBuyMore,
              data,
              extraordinaryActions,
            })
          }
        >
          <FooterText>Ver {`todos (${products.length})`}</FooterText>
        </TouchableOpacity>
      </FooterContainer>
    </Container>
  );
}
