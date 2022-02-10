import React from 'react';
import { addHours, format, formatDistance, isFuture, isPast } from 'date-fns';
import ptbr from '~/helpers/dateLocale';
import {
  BoxShadow,
  SmallText,
  CommomView,
  CommonText,
  DateInformationTextOpacity,
  InfoBoxShadow,
  PaddingWrapper,
  InfoWrapper,
  Title,
} from './styles';

interface ChallengeDatesProps {
  startDate: string;
  endDate: string;
  title: string;
  isActivities?: boolean;
  isDrawn?: boolean;
  dateForDrawn: string;
}

export default function ChallengeDates({
  startDate,
  endDate,
  title,
  isActivities = false,
  isDrawn = false,
  dateForDrawn,
  ...props
}: ChallengeDatesProps): JSX.Element {
  return (
    <BoxShadow isActivities={isActivities || isDrawn} {...props}>
      <PaddingWrapper>
        <Title>{title}</Title>
        {!isDrawn ? (
          <>
            <DateInformationTextOpacity>
              {format(addHours(new Date(startDate), 0), "d 'de' MMM", {
                locale: ptbr,
              })}{' '}
              até{' '}
            </DateInformationTextOpacity>
            <DateInformationTextOpacity>
              {format(addHours(new Date(endDate), 0), "d 'de' MMM 'de' RRR", {
                locale: ptbr,
              })}
            </DateInformationTextOpacity>
          </>
        ) : (
          <DateInformationTextOpacity>
            {format(
              addHours(new Date(dateForDrawn), 0),
              "d 'de' MMM 'de' RRR '-' kk'h'mm",
              {
                locale: ptbr,
              },
            )}
          </DateInformationTextOpacity>
        )}
      </PaddingWrapper>
      {!isDrawn && (
        <>
          {isPast(addHours(new Date(startDate), 0)) &&
            isFuture(addHours(new Date(endDate), 0)) && (
              <InfoBoxShadow color={isActivities ? '#009D33' : '#0564FF'}>
                <InfoWrapper>
                  <>
                    <CommonText>
                      {isActivities ? 'Pronto para pedalar' : 'Abertas'}
                    </CommonText>
                    <SmallText>
                      Restam{' '}
                      {formatDistance(
                        addHours(new Date(endDate), 0),
                        new Date(),
                        {
                          locale: ptbr,
                        },
                      )}
                    </SmallText>
                  </>
                </InfoWrapper>
              </InfoBoxShadow>
            )}
        </>
      )}

      {!isDrawn ? (
        <>
          {isFuture(new Date(startDate)) && (
            <CommomView color="rgba(9, 16, 28, 0.09)">
              <InfoWrapper>
                <>
                  <CommonText color="#979797">Começa em</CommonText>
                  <SmallText color="#979797">
                    {formatDistance(
                      addHours(new Date(startDate), 0),
                      new Date(),
                      {
                        locale: ptbr,
                      },
                    )}
                  </SmallText>
                </>
              </InfoWrapper>
            </CommomView>
          )}

          {isPast(new Date(endDate)) && (
            <InfoBoxShadow color="rgba(9, 16, 28, 0.08)">
              <InfoWrapper>
                <>
                  <CommonText
                    color="#979797"
                    style={{
                      lineHeight: 30,
                    }}
                  >
                    Encerradas
                  </CommonText>
                </>
              </InfoWrapper>
            </InfoBoxShadow>
          )}
        </>
      ) : (
        <>
          {isFuture(new Date(dateForDrawn)) && (
            <CommomView color="#FFC502">
              <InfoWrapper>
                <>
                  <CommonText>Acontece em</CommonText>
                  <SmallText>
                    {formatDistance(new Date(dateForDrawn), new Date(), {
                      locale: ptbr,
                    })}
                  </SmallText>
                </>
              </InfoWrapper>
            </CommomView>
          )}

          {isPast(new Date(dateForDrawn)) && (
            <InfoBoxShadow color="rgba(9, 16, 28, 0.08)">
              <InfoWrapper>
                <>
                  <CommonText
                    style={{
                      color: '#979797',
                      lineHeight: 30,
                    }}
                  >
                    Encerradas
                  </CommonText>
                </>
              </InfoWrapper>
            </InfoBoxShadow>
          )}
        </>
      )}
    </BoxShadow>
  );
}
