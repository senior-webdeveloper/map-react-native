import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  FieldMergeFunction,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import AsyncStorage from '@react-native-community/async-storage';
import { API, APP_VERSION } from '@env';
import * as RNLocalize from 'react-native-localize';
import { useRef, useState } from 'react';
import publicIP from 'react-native-public-ip';
import * as Sentry from '@sentry/react-native';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { useCurrentPosition } from './useCurrentPosition';

export function useApolloLink(): {
  client: ApolloClient<NormalizedCacheObject>;
} {
  const authorizationToken = useRef<string>();
  const refreshToken = useRef<string>();
  const user_ip = useRef<string>();
  const user_id = useRef<string>();
  const [hasToken, setHasToken] = useState(false);
  const { coords } = useCurrentPosition();
  const httpLink = createHttpLink({
    uri: `${API}/graphql`,
  });

  const linkError = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          Sentry.captureMessage(
            `Houve um erro na query: ${operation.operationName}, erro: ${err.message}`,
          );
          switch (err.message) {
            case 'Too many request, please try again after moments':
              return forward(operation);
            case 'jwt expired':
              return forward(operation);
            case 'JWT is missing':
              return forward(operation);
            case 'jwt malformed':
              return forward(operation);
            default:
              return forward(operation);
          }
        }
      }
      if (networkError) {
        Sentry.captureMessage(
          `Houve um erro network: ${operation.operationName}, erro: ${networkError.message}`,
        );
      }
    },
  );

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: (count, operation, error) => {
      return !!error && operation.operationName !== 'specialCase';
    },
  });

  const getToken = async () => {
    // if (
    // user_id.current !== undefined &&
    // authorizationToken.current !== undefined &&
    // refreshToken.current !== undefined &&
    // user_ip.current !== undefined
    // ) {
    /// / setHasToken((prevState) => !prevState);
    // return;
    // }

    const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

    if (userIdAsync) {
      user_id.current = userIdAsync;
    }

    const acesstoken = await AsyncStorage.getItem(
      `@riderize::${userIdAsync}:acesstoken:`,
    );

    if (acesstoken) {
      authorizationToken.current = acesstoken;
    }

    const refreshtoken = await AsyncStorage.getItem(
      `@riderize::${userIdAsync}:refreshtoken:`,
    );

    if (refreshtoken) {
      refreshToken.current = refreshtoken;
    }

    const ip = await publicIP();

    if (ip && user_ip.current === undefined) {
      user_ip.current = ip;
    }

    if (!authorizationToken.current && !refreshToken.current) {
      if (userIdAsync && refreshtoken) {
        setHasToken((prevState) => !prevState);
      }
    }
  };

  const authMiddleware = new ApolloLink(async (operation, forward) => {
    console.log(`🚀 ${operation.operationName}`);
    await getToken();

    let authorizations = {};
    if (authorizationToken?.current && refreshToken?.current) {
      authorizations = {
        Authorization: `Bearer ${authorizationToken?.current?.trim()}`,
        'x-refresh-token': `Bearer ${refreshToken?.current?.trim()}`,
      };
    }

    console.log({
      ...authorizations,
      LanguageCode: 'pt-BR',
      timezone: RNLocalize.getTimeZone(),
      longitude: String(coords?.longitude || ''),
      latitude: String(coords?.latitude || ''),
      'app-version': APP_VERSION,
      ip: user_ip.current,
    });
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...authorizations,
        LanguageCode: 'pt-BR',
        timezone: RNLocalize.getTimeZone(),
        longitude: String(coords?.longitude || ''),
        latitude: String(coords?.latitude || ''),
        'app-version': APP_VERSION,
        ip: user_ip.current,
      },
    }));

    return forward(operation).map((response) => {
      const context = operation.getContext();
      const authHeader = context.response.headers.get('authorization');
      const refreshHeader = context.response.headers.get('x-refresh-token');
      // We would see this log in the SSR logs in the terminal
      // but in the browser console it would always be null!
      if (authHeader && authHeader !== null) {
        // cut off the 'Bearer ' part from the header
        const authToken = authHeader.replace('Bearer ', '');

        if (authToken && authToken !== null && authToken.length > 0) {
          authorizationToken.current = authToken;
        }
      }
      if (refreshHeader && refreshHeader !== null && authHeader.length > 0) {
        const refreshToken2 = refreshHeader.replace('Bearer ', '');

        if (refreshToken2 && refreshToken2 !== null) {
          refreshToken.current = refreshToken2;
        }
      }

      // console.log('response', response);

      return response;
    });
  });

  const client = new ApolloClient({
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
    link: from([authMiddleware, linkError, retryLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getCards: {
              keyArgs: [],
              merge(existing, incoming) {
                return incoming;
              },
            },
            getChallengeRanks: {
              keyArgs: [],
              merge(
                existing,
                incoming,
                {
                  args: {
                    pagination: { page },
                  },
                },
              ) {
                if (page !== 1) {
                  if (incoming && existing) {
                    const challenges = [
                      ...existing,
                      ...incoming.filter((n) => !existing.some((p) => p === n)),
                    ];
                    return challenges;
                  }

                  return incoming;
                }

                return incoming;
              },
            },
            exploreChallengesV2: {
              keyArgs: [],
              merge(existing, incoming, { args: { page } }) {
                if (page !== 1) {
                  if (incoming && existing) {
                    const challenges = {
                      ...incoming,
                      items: [
                        ...existing.items,
                        ...incoming.items.filter(
                          (n) => !existing.items.some((p) => p.key === n.key),
                        ),
                      ],
                    };
                    return challenges;
                  }

                  return incoming;
                }
                return incoming;
              },
            },
            showAllChallengesV2: {
              keyArgs: [],
              merge(existing, incoming, { args: { pagination } }) {
                if (pagination && pagination.page !== 1) {
                  if (incoming && existing) {
                    const challenges = {
                      ...incoming.page_info,
                      items: [...existing.items, ...incoming.items],
                    };

                    return challenges;
                  }

                  return incoming;
                }
              },
            },
            getUserNotifications: {
              keyArgs: [],
              merge(
                existing,
                incoming,
                {
                  args: {
                    pagination: { page },
                  },
                },
              ) {
                if (page !== 1) {
                  if (incoming && existing) {
                    const notifications = [
                      ...existing.notifications,
                      ...incoming.notifications.filter(
                        (n) => !existing.notifications.some((p) => p === n),
                      ),
                    ];

                    return {
                      actualpage: page,
                      __typename: 'NotificationScalar',
                      date: incoming.date,
                      notifications,
                      unread_notifications_count:
                        incoming.unread_notifications_count,
                    };
                  }

                  return incoming;
                }
                return incoming;
              },
            },

            getChallengeComments: {
              keyArgs: [],
              merge(
                existing,
                incoming,
                {
                  args: {
                    pagination: { page, offset },
                  },
                },
              ): boolean | FieldMergeFunction<any, any> | undefined {
                // Slicing is necessary because the existing data is
                // immutable, and frozen in development.
                const merged = existing ? existing.slice(0) : [];
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
                return merged;
              },
            },
          },
        },
      },
    }),
  });

  return { client };
}
