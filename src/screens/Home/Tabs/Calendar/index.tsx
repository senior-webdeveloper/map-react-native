/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import { format, getDate, getYear } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { gql, useQuery } from '@apollo/client';
import { PUBLIC_STORAGE } from '@env';
import { Icons, SafeAreaView, TitleText, Text } from '~/components';
import { Query, QueryGetScheduleArgs } from '~/generated/graphql';
import { useUserToken } from '~/hooks';
import { getSchedule } from './constant';

const GET_SCHEDULE = gql`
  query getSchedule($profile_id: String!, $pagination: PaginationInput!) {
    getSchedule(profile_id: $profile_id, pagination: $pagination) {
      _id
      date_occurrence
      title
      image_link
    }
  }
`;
interface DataProps {
  getSchedule: Query['getSchedule'];
}

export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 54px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
  color: #161c25;
`;

interface ItemComponentProps {
  isSelected: boolean;
  isNow: boolean;
}
export const ItemContainer = styled.View<ItemComponentProps>`
  background-color: ${({ isSelected, isNow, theme }) =>
    isNow
      ? theme.colors.blue
      : isSelected
      ? 'rgba(90, 114, 153, 0.08)'
      : 'transparent'};
  height: 120px;
`;
export const ItemWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 20px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const ItemTitle = styled(TitleText)<ItemComponentProps>`
  font-size: 16px;
  line-height: 20px;
  width: 80%;
  color: ${({ isSelected, isNow, theme }) =>
    isNow ? '#fff' : isSelected ? theme.colors.blue : theme.colors.text};
`;
export const ItemDescription = styled(Text)<ItemComponentProps>`
  font-size: 16px;
  color: ${({ isSelected, isNow, theme }) =>
    isNow ? '#fff' : isSelected ? theme.colors.blue : theme.colors.text};
`;
export const DateContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 23%;
`;
export const DateNumberText = styled(Text)<ItemComponentProps>`
  font-size: 36px;
  line-height: 42.19px;
  color: ${({ isSelected, isNow, theme }) =>
    isNow ? '#fff' : isSelected ? theme.colors.blue : theme.colors.text};
`;
export const MonthDateText = styled(Text)<ItemComponentProps>`
  color: ${({ isSelected, isNow, theme }) =>
    isNow ? '#fff' : isSelected ? theme.colors.blue : theme.colors.text};
`;
export const Image = styled.Image`
  margin-right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 8px;
`;
export const RightWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 70%;
`;
export const YearText = styled(Text)`
  font-size: 40px;
  line-height: 47px;
  margin-right: 7px;
`;
export const YearNumber = styled(Text)`
font-family: ${({ theme }) => theme.fontFamily.light}
  font-size: 40px;
  opacity: 0.3;
  line-height: 47px;
`;
export const YearContainer = styled.View`
  flex-direction: row;
  padding: 24px;
`;
export const ContentWrapper = styled.View``;

const LOCK_SCROLL_DELAY_DURATION = 200;
const Calendar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState(String(getYear(new Date())));
  const { profileID } = useUserToken();
  const actualDay = getDate(new Date());
  const carrousel = useRef<Carousel<GetScheduleProps>>();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const SLIDER_WIDTH = windowWidth;
  const ITEM_WIDTH = windowWidth;
  const SLIDER_HEIGHT = (windowHeight * 70) / 100;

  const navigation = useNavigation();
  const { data, loading } = useQuery<DataProps, QueryGetScheduleArgs>(
    GET_SCHEDULE,
    {
      variables: {
        pagination: { offset: 15, page: 1 },
        profile_id: profileID,
      },
      onError: (error) => console.log(`ERROR ON CALENDAR : ${error.message}`),
    },
  );

  const renderItem = ({ item, index }) => {
    const itemDay = getDate(new Date(item.date_occurrence));
    const isNow = itemDay === actualDay;

    const isSelected = currentIndex === index;

    const source = {
      uri:
        item?.image_link.length > 0
          ? `${PUBLIC_STORAGE}/${item?.image_link}`
          : `${PUBLIC_STORAGE}/logos/Quadrada-branca-roxa.png`,
    };

    return (
      <ItemContainer isSelected={isSelected} isNow={isNow}>
        <ItemWrapper>
          <DateContainer>
            <DateNumberText isSelected={isSelected} isNow={isNow}>
              {format(new Date(item.date_occurrence), 'dd', {
                locale: ptbr,
              })}
            </DateNumberText>
            <MonthDateText isSelected={isSelected} isNow={isNow}>
              {format(new Date(item.date_occurrence), 'MMMM', {
                locale: ptbr,
              })}
            </MonthDateText>
          </DateContainer>
          <RightWrapper>
            <Image source={{ uri: `${PUBLIC_STORAGE}/${item?.image_link}` }} />
            <ContentWrapper>
              <ItemTitle isSelected={isSelected} isNow={isNow}>
                {item.title}
              </ItemTitle>
              <ItemDescription isSelected={isSelected} isNow={isNow}>
                {format(new Date(item.date_occurrence), "iiii',' dd '", {
                  locale: ptbr,
                })}
              </ItemDescription>
            </ContentWrapper>
          </RightWrapper>
        </ItemWrapper>
      </ItemContainer>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <Header>
        <Title>Agenda</Title>
      </Header>
      <YearContainer>
        <YearText>Ano</YearText>
        <YearNumber>{selectedYear ?? ''}</YearNumber>
      </YearContainer>
      {data && data?.getSchedule.length > 0 && (
        <Carousel
          ref={carrousel}
          data={data?.getSchedule}
          // data={getSchedule}
          renderItem={renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          itemHeight={166}
          sliderHeight={SLIDER_HEIGHT}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          enableSnap
          swipeThreshold={0}
          // enableMomentum
          onScroll={() => {
            setCurrentIndex(carrousel.current?.currentIndex);
            // setSelectedYear(
            //   format(
            //     new Date(data?.getSchedule[currentIndex].date_occurrence),
            //     'yyyy',
            //     {
            //       locale: ptbr,
            //     },
            //   ),
            // );
          }}
          // keyboardShouldPersistTaps="always"
          lockScrollWhileSnapping
          lockScrollTimeoutDuration={LOCK_SCROLL_DELAY_DURATION}
          getItemLayout={(_, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
          snapToInterval={120}
          vertical
        />
      )}
    </SafeAreaView>
  );
};

export default Calendar;
