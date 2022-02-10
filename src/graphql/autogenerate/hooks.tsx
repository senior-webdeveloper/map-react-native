import * as Types from './operations';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export const PaymentFragmentFragmentDoc = gql`
    fragment PaymentFragment on Payment {
  id
  resource_payment_id
  origin_payment_id
  payment_processor_id
  country_id
  bill_expiration_date
  value
  is_paid
  declined
  returned
  entrance
  processed
  processed
  profile_id
  user_id
  status
  installments
  bill_link
  created_at
  updated_at
  card {
    last_digits
    brand
  }
}
    `;
export const CreateMonitorActivityDocument = gql`
    mutation CreateMonitorActivity($data: CreateMonitorActivityInput!) {
  createMonitorActivity(data: $data) {
    id
    name
  }
}
    `;
export type CreateMonitorActivityMutationFn = Apollo.MutationFunction<Types.CreateMonitorActivityMutation, Types.CreateMonitorActivityMutationVariables>;

/**
 * __useCreateMonitorActivityMutation__
 *
 * To run a mutation, you first call `useCreateMonitorActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMonitorActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMonitorActivityMutation, { data, loading, error }] = useCreateMonitorActivityMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateMonitorActivityMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateMonitorActivityMutation, Types.CreateMonitorActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateMonitorActivityMutation, Types.CreateMonitorActivityMutationVariables>(CreateMonitorActivityDocument, options);
      }
export type CreateMonitorActivityMutationHookResult = ReturnType<typeof useCreateMonitorActivityMutation>;
export type CreateMonitorActivityMutationResult = Apollo.MutationResult<Types.CreateMonitorActivityMutation>;
export type CreateMonitorActivityMutationOptions = Apollo.BaseMutationOptions<Types.CreateMonitorActivityMutation, Types.CreateMonitorActivityMutationVariables>;
export const SendActivityToProviderDocument = gql`
    mutation SendActivityToProvider($data: SendActivityToProviderInput!) {
  sendActivityToProvider(data: $data) {
    status
    message
  }
}
    `;
export type SendActivityToProviderMutationFn = Apollo.MutationFunction<Types.SendActivityToProviderMutation, Types.SendActivityToProviderMutationVariables>;

/**
 * __useSendActivityToProviderMutation__
 *
 * To run a mutation, you first call `useSendActivityToProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendActivityToProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendActivityToProviderMutation, { data, loading, error }] = useSendActivityToProviderMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSendActivityToProviderMutation(baseOptions?: Apollo.MutationHookOptions<Types.SendActivityToProviderMutation, Types.SendActivityToProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.SendActivityToProviderMutation, Types.SendActivityToProviderMutationVariables>(SendActivityToProviderDocument, options);
      }
export type SendActivityToProviderMutationHookResult = ReturnType<typeof useSendActivityToProviderMutation>;
export type SendActivityToProviderMutationResult = Apollo.MutationResult<Types.SendActivityToProviderMutation>;
export type SendActivityToProviderMutationOptions = Apollo.BaseMutationOptions<Types.SendActivityToProviderMutation, Types.SendActivityToProviderMutationVariables>;
export const BuyAwardUserAlreadySubscribedDocument = gql`
    mutation BuyAwardUserAlreadySubscribed($shipping_address_id: String, $products_purchased: [ProductPurchasedInput!], $award_data: ChallengePaymentInput, $payment_data: PaymentInput, $data: SubscribeUserChallengeInput!) {
  buyAwardUserAlreadySubscribed(
    shipping_address_id: $shipping_address_id
    products_purchased: $products_purchased
    award_data: $award_data
    payment_data: $payment_data
    data: $data
  ) {
    id
    challenge_id
    user_id
    payment_id
  }
}
    `;
export type BuyAwardUserAlreadySubscribedMutationFn = Apollo.MutationFunction<Types.BuyAwardUserAlreadySubscribedMutation, Types.BuyAwardUserAlreadySubscribedMutationVariables>;

/**
 * __useBuyAwardUserAlreadySubscribedMutation__
 *
 * To run a mutation, you first call `useBuyAwardUserAlreadySubscribedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuyAwardUserAlreadySubscribedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buyAwardUserAlreadySubscribedMutation, { data, loading, error }] = useBuyAwardUserAlreadySubscribedMutation({
 *   variables: {
 *      shipping_address_id: // value for 'shipping_address_id'
 *      products_purchased: // value for 'products_purchased'
 *      award_data: // value for 'award_data'
 *      payment_data: // value for 'payment_data'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useBuyAwardUserAlreadySubscribedMutation(baseOptions?: Apollo.MutationHookOptions<Types.BuyAwardUserAlreadySubscribedMutation, Types.BuyAwardUserAlreadySubscribedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.BuyAwardUserAlreadySubscribedMutation, Types.BuyAwardUserAlreadySubscribedMutationVariables>(BuyAwardUserAlreadySubscribedDocument, options);
      }
export type BuyAwardUserAlreadySubscribedMutationHookResult = ReturnType<typeof useBuyAwardUserAlreadySubscribedMutation>;
export type BuyAwardUserAlreadySubscribedMutationResult = Apollo.MutationResult<Types.BuyAwardUserAlreadySubscribedMutation>;
export type BuyAwardUserAlreadySubscribedMutationOptions = Apollo.BaseMutationOptions<Types.BuyAwardUserAlreadySubscribedMutation, Types.BuyAwardUserAlreadySubscribedMutationVariables>;
export const ListChallengeAwardWinnersDocument = gql`
    query ListChallengeAwardWinners($challenge_id: String!) {
  listChallengeAwardWinners(challenge_id: $challenge_id) {
    user {
      id
      firstname
      lastname
      legal_registry_number
      zip_code
      city {
        name
        state {
          abbreviation
        }
      }
      address_line_one
      address_line_two
      email
      phone
      profile {
        id
        username
        profile_avatar
      }
    }
    award {
      name
      awardsImages {
        link
      }
    }
  }
}
    `;

/**
 * __useListChallengeAwardWinnersQuery__
 *
 * To run a query within a React component, call `useListChallengeAwardWinnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListChallengeAwardWinnersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListChallengeAwardWinnersQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useListChallengeAwardWinnersQuery(baseOptions: Apollo.QueryHookOptions<Types.ListChallengeAwardWinnersQuery, Types.ListChallengeAwardWinnersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ListChallengeAwardWinnersQuery, Types.ListChallengeAwardWinnersQueryVariables>(ListChallengeAwardWinnersDocument, options);
      }
export function useListChallengeAwardWinnersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ListChallengeAwardWinnersQuery, Types.ListChallengeAwardWinnersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ListChallengeAwardWinnersQuery, Types.ListChallengeAwardWinnersQueryVariables>(ListChallengeAwardWinnersDocument, options);
        }
export type ListChallengeAwardWinnersQueryHookResult = ReturnType<typeof useListChallengeAwardWinnersQuery>;
export type ListChallengeAwardWinnersLazyQueryHookResult = ReturnType<typeof useListChallengeAwardWinnersLazyQuery>;
export type ListChallengeAwardWinnersQueryResult = Apollo.QueryResult<Types.ListChallengeAwardWinnersQuery, Types.ListChallengeAwardWinnersQueryVariables>;
export const AddFavoriteChallegeDocument = gql`
    mutation AddFavoriteChallege($data: FavoriteUserChallengeInput!) {
  addfavoriteChallenge(data: $data) {
    challenge_id
  }
}
    `;
export type AddFavoriteChallegeMutationFn = Apollo.MutationFunction<Types.AddFavoriteChallegeMutation, Types.AddFavoriteChallegeMutationVariables>;

/**
 * __useAddFavoriteChallegeMutation__
 *
 * To run a mutation, you first call `useAddFavoriteChallegeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFavoriteChallegeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFavoriteChallegeMutation, { data, loading, error }] = useAddFavoriteChallegeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddFavoriteChallegeMutation(baseOptions?: Apollo.MutationHookOptions<Types.AddFavoriteChallegeMutation, Types.AddFavoriteChallegeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.AddFavoriteChallegeMutation, Types.AddFavoriteChallegeMutationVariables>(AddFavoriteChallegeDocument, options);
      }
export type AddFavoriteChallegeMutationHookResult = ReturnType<typeof useAddFavoriteChallegeMutation>;
export type AddFavoriteChallegeMutationResult = Apollo.MutationResult<Types.AddFavoriteChallegeMutation>;
export type AddFavoriteChallegeMutationOptions = Apollo.BaseMutationOptions<Types.AddFavoriteChallegeMutation, Types.AddFavoriteChallegeMutationVariables>;
export const ChangeSubscriptionCategoryDocument = gql`
    mutation changeSubscriptionCategory($data: ChangeSubscriptionCategoryInput!) {
  changeSubscriptionCategory(data: $data) {
    id
  }
}
    `;
export type ChangeSubscriptionCategoryMutationFn = Apollo.MutationFunction<Types.ChangeSubscriptionCategoryMutation, Types.ChangeSubscriptionCategoryMutationVariables>;

/**
 * __useChangeSubscriptionCategoryMutation__
 *
 * To run a mutation, you first call `useChangeSubscriptionCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeSubscriptionCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeSubscriptionCategoryMutation, { data, loading, error }] = useChangeSubscriptionCategoryMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeSubscriptionCategoryMutation(baseOptions?: Apollo.MutationHookOptions<Types.ChangeSubscriptionCategoryMutation, Types.ChangeSubscriptionCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.ChangeSubscriptionCategoryMutation, Types.ChangeSubscriptionCategoryMutationVariables>(ChangeSubscriptionCategoryDocument, options);
      }
export type ChangeSubscriptionCategoryMutationHookResult = ReturnType<typeof useChangeSubscriptionCategoryMutation>;
export type ChangeSubscriptionCategoryMutationResult = Apollo.MutationResult<Types.ChangeSubscriptionCategoryMutation>;
export type ChangeSubscriptionCategoryMutationOptions = Apollo.BaseMutationOptions<Types.ChangeSubscriptionCategoryMutation, Types.ChangeSubscriptionCategoryMutationVariables>;
export const CreateClapDocument = gql`
    mutation createClap($data: CreateClapInput!) {
  createClap(data: $data) {
    count
  }
}
    `;
export type CreateClapMutationFn = Apollo.MutationFunction<Types.CreateClapMutation, Types.CreateClapMutationVariables>;

/**
 * __useCreateClapMutation__
 *
 * To run a mutation, you first call `useCreateClapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClapMutation, { data, loading, error }] = useCreateClapMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateClapMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateClapMutation, Types.CreateClapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateClapMutation, Types.CreateClapMutationVariables>(CreateClapDocument, options);
      }
export type CreateClapMutationHookResult = ReturnType<typeof useCreateClapMutation>;
export type CreateClapMutationResult = Apollo.MutationResult<Types.CreateClapMutation>;
export type CreateClapMutationOptions = Apollo.BaseMutationOptions<Types.CreateClapMutation, Types.CreateClapMutationVariables>;
export const CreateCommentClapDocument = gql`
    mutation CreateCommentClap($data: CreateCommentClapInput!) {
  createCommentClap(data: $data) {
    challenge_comment_id
    profile_id
    count
  }
}
    `;
export type CreateCommentClapMutationFn = Apollo.MutationFunction<Types.CreateCommentClapMutation, Types.CreateCommentClapMutationVariables>;

/**
 * __useCreateCommentClapMutation__
 *
 * To run a mutation, you first call `useCreateCommentClapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentClapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentClapMutation, { data, loading, error }] = useCreateCommentClapMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCommentClapMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateCommentClapMutation, Types.CreateCommentClapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateCommentClapMutation, Types.CreateCommentClapMutationVariables>(CreateCommentClapDocument, options);
      }
export type CreateCommentClapMutationHookResult = ReturnType<typeof useCreateCommentClapMutation>;
export type CreateCommentClapMutationResult = Apollo.MutationResult<Types.CreateCommentClapMutation>;
export type CreateCommentClapMutationOptions = Apollo.BaseMutationOptions<Types.CreateCommentClapMutation, Types.CreateCommentClapMutationVariables>;
export const CreateUserPassageAtSupportPointDocument = gql`
    mutation CreateUserPassageAtSupportPoint($passages_registered: [CreateUserEventSupportPointInput!]!) {
  createUserPassageAtSupportPoint(passages_registered: $passages_registered) {
    status
    message
  }
}
    `;
export type CreateUserPassageAtSupportPointMutationFn = Apollo.MutationFunction<Types.CreateUserPassageAtSupportPointMutation, Types.CreateUserPassageAtSupportPointMutationVariables>;

/**
 * __useCreateUserPassageAtSupportPointMutation__
 *
 * To run a mutation, you first call `useCreateUserPassageAtSupportPointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserPassageAtSupportPointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserPassageAtSupportPointMutation, { data, loading, error }] = useCreateUserPassageAtSupportPointMutation({
 *   variables: {
 *      passages_registered: // value for 'passages_registered'
 *   },
 * });
 */
export function useCreateUserPassageAtSupportPointMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateUserPassageAtSupportPointMutation, Types.CreateUserPassageAtSupportPointMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateUserPassageAtSupportPointMutation, Types.CreateUserPassageAtSupportPointMutationVariables>(CreateUserPassageAtSupportPointDocument, options);
      }
export type CreateUserPassageAtSupportPointMutationHookResult = ReturnType<typeof useCreateUserPassageAtSupportPointMutation>;
export type CreateUserPassageAtSupportPointMutationResult = Apollo.MutationResult<Types.CreateUserPassageAtSupportPointMutation>;
export type CreateUserPassageAtSupportPointMutationOptions = Apollo.BaseMutationOptions<Types.CreateUserPassageAtSupportPointMutation, Types.CreateUserPassageAtSupportPointMutationVariables>;
export const DeleteChallengeProgressActivityV2Document = gql`
    mutation deleteChallengeProgressActivityV2($data: DeleteUserChallengeActivityInput!) {
  deleteChallengeProgressActivityV2(data: $data)
}
    `;
export type DeleteChallengeProgressActivityV2MutationFn = Apollo.MutationFunction<Types.DeleteChallengeProgressActivityV2Mutation, Types.DeleteChallengeProgressActivityV2MutationVariables>;

/**
 * __useDeleteChallengeProgressActivityV2Mutation__
 *
 * To run a mutation, you first call `useDeleteChallengeProgressActivityV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChallengeProgressActivityV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChallengeProgressActivityV2Mutation, { data, loading, error }] = useDeleteChallengeProgressActivityV2Mutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteChallengeProgressActivityV2Mutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteChallengeProgressActivityV2Mutation, Types.DeleteChallengeProgressActivityV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteChallengeProgressActivityV2Mutation, Types.DeleteChallengeProgressActivityV2MutationVariables>(DeleteChallengeProgressActivityV2Document, options);
      }
export type DeleteChallengeProgressActivityV2MutationHookResult = ReturnType<typeof useDeleteChallengeProgressActivityV2Mutation>;
export type DeleteChallengeProgressActivityV2MutationResult = Apollo.MutationResult<Types.DeleteChallengeProgressActivityV2Mutation>;
export type DeleteChallengeProgressActivityV2MutationOptions = Apollo.BaseMutationOptions<Types.DeleteChallengeProgressActivityV2Mutation, Types.DeleteChallengeProgressActivityV2MutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($id: String!) {
  deleteComment(id: $id) {
    id
  }
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<Types.DeleteCommentMutation, Types.DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteCommentMutation, Types.DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteCommentMutation, Types.DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<Types.DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<Types.DeleteCommentMutation, Types.DeleteCommentMutationVariables>;
export const DeleteFavoriteChallengeDocument = gql`
    mutation deleteFavoriteChallenge($data: FavoriteUserChallengeInput!) {
  deleteFavoriteChallenge(data: $data)
}
    `;
export type DeleteFavoriteChallengeMutationFn = Apollo.MutationFunction<Types.DeleteFavoriteChallengeMutation, Types.DeleteFavoriteChallengeMutationVariables>;

/**
 * __useDeleteFavoriteChallengeMutation__
 *
 * To run a mutation, you first call `useDeleteFavoriteChallengeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFavoriteChallengeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFavoriteChallengeMutation, { data, loading, error }] = useDeleteFavoriteChallengeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteFavoriteChallengeMutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteFavoriteChallengeMutation, Types.DeleteFavoriteChallengeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteFavoriteChallengeMutation, Types.DeleteFavoriteChallengeMutationVariables>(DeleteFavoriteChallengeDocument, options);
      }
export type DeleteFavoriteChallengeMutationHookResult = ReturnType<typeof useDeleteFavoriteChallengeMutation>;
export type DeleteFavoriteChallengeMutationResult = Apollo.MutationResult<Types.DeleteFavoriteChallengeMutation>;
export type DeleteFavoriteChallengeMutationOptions = Apollo.BaseMutationOptions<Types.DeleteFavoriteChallengeMutation, Types.DeleteFavoriteChallengeMutationVariables>;
export const ExploreChallengesV2Document = gql`
    query exploreChallengesV2($profile_id: String!, $page: Float!) {
  exploreChallengesV2(profile_id: $profile_id, page: $page) {
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
    items {
      name
      key
      type
      content {
        id
        eligible_spotlight
        name
        image_avatar
        image_cover
        physical_event
        configuration {
          is_paid
        }
      }
    }
  }
}
    `;

/**
 * __useExploreChallengesV2Query__
 *
 * To run a query within a React component, call `useExploreChallengesV2Query` and pass it any options that fit your needs.
 * When your component renders, `useExploreChallengesV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExploreChallengesV2Query({
 *   variables: {
 *      profile_id: // value for 'profile_id'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useExploreChallengesV2Query(baseOptions: Apollo.QueryHookOptions<Types.ExploreChallengesV2Query, Types.ExploreChallengesV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ExploreChallengesV2Query, Types.ExploreChallengesV2QueryVariables>(ExploreChallengesV2Document, options);
      }
export function useExploreChallengesV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ExploreChallengesV2Query, Types.ExploreChallengesV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ExploreChallengesV2Query, Types.ExploreChallengesV2QueryVariables>(ExploreChallengesV2Document, options);
        }
export type ExploreChallengesV2QueryHookResult = ReturnType<typeof useExploreChallengesV2Query>;
export type ExploreChallengesV2LazyQueryHookResult = ReturnType<typeof useExploreChallengesV2LazyQuery>;
export type ExploreChallengesV2QueryResult = Apollo.QueryResult<Types.ExploreChallengesV2Query, Types.ExploreChallengesV2QueryVariables>;
export const FindAllUsersCurrentPointDocument = gql`
    query FindAllUsersCurrentPoint($challenge_id: String!) {
  findAllUsersCurrentPoint(challenge_id: $challenge_id) {
    check_time
    event_support_point_id
    support_point {
      name
    }
    subscription {
      athlete_identification
      short_id
      category {
        id
        order
        name
      }
      user {
        firstname
        lastname
        profile {
          profile_avatar
        }
      }
    }
  }
}
    `;

/**
 * __useFindAllUsersCurrentPointQuery__
 *
 * To run a query within a React component, call `useFindAllUsersCurrentPointQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllUsersCurrentPointQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllUsersCurrentPointQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useFindAllUsersCurrentPointQuery(baseOptions: Apollo.QueryHookOptions<Types.FindAllUsersCurrentPointQuery, Types.FindAllUsersCurrentPointQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.FindAllUsersCurrentPointQuery, Types.FindAllUsersCurrentPointQueryVariables>(FindAllUsersCurrentPointDocument, options);
      }
export function useFindAllUsersCurrentPointLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.FindAllUsersCurrentPointQuery, Types.FindAllUsersCurrentPointQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.FindAllUsersCurrentPointQuery, Types.FindAllUsersCurrentPointQueryVariables>(FindAllUsersCurrentPointDocument, options);
        }
export type FindAllUsersCurrentPointQueryHookResult = ReturnType<typeof useFindAllUsersCurrentPointQuery>;
export type FindAllUsersCurrentPointLazyQueryHookResult = ReturnType<typeof useFindAllUsersCurrentPointLazyQuery>;
export type FindAllUsersCurrentPointQueryResult = Apollo.QueryResult<Types.FindAllUsersCurrentPointQuery, Types.FindAllUsersCurrentPointQueryVariables>;
export const FindEventSupportPointsDocument = gql`
    query FindEventSupportPoints($challenge_id: String!) {
  findEventSupportPoints(challenge_id: $challenge_id) {
    id
    name
    latitude
    longitude
  }
}
    `;

/**
 * __useFindEventSupportPointsQuery__
 *
 * To run a query within a React component, call `useFindEventSupportPointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindEventSupportPointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindEventSupportPointsQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useFindEventSupportPointsQuery(baseOptions: Apollo.QueryHookOptions<Types.FindEventSupportPointsQuery, Types.FindEventSupportPointsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.FindEventSupportPointsQuery, Types.FindEventSupportPointsQueryVariables>(FindEventSupportPointsDocument, options);
      }
export function useFindEventSupportPointsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.FindEventSupportPointsQuery, Types.FindEventSupportPointsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.FindEventSupportPointsQuery, Types.FindEventSupportPointsQueryVariables>(FindEventSupportPointsDocument, options);
        }
export type FindEventSupportPointsQueryHookResult = ReturnType<typeof useFindEventSupportPointsQuery>;
export type FindEventSupportPointsLazyQueryHookResult = ReturnType<typeof useFindEventSupportPointsLazyQuery>;
export type FindEventSupportPointsQueryResult = Apollo.QueryResult<Types.FindEventSupportPointsQuery, Types.FindEventSupportPointsQueryVariables>;
export const GetActiveUserChallengesDocument = gql`
    query GetActiveUserChallenges($pagination: PaginationInput!, $user_id: String, $profile_id: String!) {
  getActiveUserChallenges(
    pagination: $pagination
    profile_id: $profile_id
    user_id: $user_id
  ) {
    id
    name
    challenge_type
    id
    creator_id
    image_avatar
    image_cover
    isFavorite
    creator {
      profile {
        profile_avatar
      }
    }
  }
}
    `;

/**
 * __useGetActiveUserChallengesQuery__
 *
 * To run a query within a React component, call `useGetActiveUserChallengesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveUserChallengesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveUserChallengesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      user_id: // value for 'user_id'
 *      profile_id: // value for 'profile_id'
 *   },
 * });
 */
export function useGetActiveUserChallengesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetActiveUserChallengesQuery, Types.GetActiveUserChallengesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetActiveUserChallengesQuery, Types.GetActiveUserChallengesQueryVariables>(GetActiveUserChallengesDocument, options);
      }
export function useGetActiveUserChallengesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetActiveUserChallengesQuery, Types.GetActiveUserChallengesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetActiveUserChallengesQuery, Types.GetActiveUserChallengesQueryVariables>(GetActiveUserChallengesDocument, options);
        }
export type GetActiveUserChallengesQueryHookResult = ReturnType<typeof useGetActiveUserChallengesQuery>;
export type GetActiveUserChallengesLazyQueryHookResult = ReturnType<typeof useGetActiveUserChallengesLazyQuery>;
export type GetActiveUserChallengesQueryResult = Apollo.QueryResult<Types.GetActiveUserChallengesQuery, Types.GetActiveUserChallengesQueryVariables>;
export const GetActivityDetailDocument = gql`
    query GetActivityDetail($id: String!) {
  getActivityDetail(id: $id) {
    name
    distance
    resource_state
    external_id
    third_party_data_source_slug
    upload_id
    total_elevation_gain
    distance
    moving_time_seconds
    id
    activity_sent_third_party {
      third_party_data_source_id
      done
    }
    average_speed
    suspicious
    duplicated
    calories
    start_date
    start_date_local
    elapsed_time_seconds
    polyline
    bounds
    summary_polyline
    challenges {
      id
      name
      image_avatar
    }
    user {
      id
      firstname
      lastname
      profile {
        id
        username
        profile_avatar
      }
    }
  }
}
    `;

/**
 * __useGetActivityDetailQuery__
 *
 * To run a query within a React component, call `useGetActivityDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActivityDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActivityDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetActivityDetailQuery(baseOptions: Apollo.QueryHookOptions<Types.GetActivityDetailQuery, Types.GetActivityDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetActivityDetailQuery, Types.GetActivityDetailQueryVariables>(GetActivityDetailDocument, options);
      }
export function useGetActivityDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetActivityDetailQuery, Types.GetActivityDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetActivityDetailQuery, Types.GetActivityDetailQueryVariables>(GetActivityDetailDocument, options);
        }
export type GetActivityDetailQueryHookResult = ReturnType<typeof useGetActivityDetailQuery>;
export type GetActivityDetailLazyQueryHookResult = ReturnType<typeof useGetActivityDetailLazyQuery>;
export type GetActivityDetailQueryResult = Apollo.QueryResult<Types.GetActivityDetailQuery, Types.GetActivityDetailQueryVariables>;
export const AllChallengeAttachedFilesDocument = gql`
    query allChallengeAttachedFiles($pagination: PaginationInput!, $challenge_id: String!) {
  allChallengeAttachedFiles(pagination: $pagination, challenge_id: $challenge_id) {
    id
    name
    description
    extension
    link
  }
}
    `;

/**
 * __useAllChallengeAttachedFilesQuery__
 *
 * To run a query within a React component, call `useAllChallengeAttachedFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllChallengeAttachedFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllChallengeAttachedFilesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useAllChallengeAttachedFilesQuery(baseOptions: Apollo.QueryHookOptions<Types.AllChallengeAttachedFilesQuery, Types.AllChallengeAttachedFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.AllChallengeAttachedFilesQuery, Types.AllChallengeAttachedFilesQueryVariables>(AllChallengeAttachedFilesDocument, options);
      }
export function useAllChallengeAttachedFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.AllChallengeAttachedFilesQuery, Types.AllChallengeAttachedFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.AllChallengeAttachedFilesQuery, Types.AllChallengeAttachedFilesQueryVariables>(AllChallengeAttachedFilesDocument, options);
        }
export type AllChallengeAttachedFilesQueryHookResult = ReturnType<typeof useAllChallengeAttachedFilesQuery>;
export type AllChallengeAttachedFilesLazyQueryHookResult = ReturnType<typeof useAllChallengeAttachedFilesLazyQuery>;
export type AllChallengeAttachedFilesQueryResult = Apollo.QueryResult<Types.AllChallengeAttachedFilesQuery, Types.AllChallengeAttachedFilesQueryVariables>;
export const GetCommentsDocument = gql`
    query getComments($challenge_id: String!, $pagination: PaginationInput!) {
  getChallengeComments(challenge_id: $challenge_id, pagination: $pagination) {
    id
    challenge_id
    claps_count
    profile {
      id
      username
      profile_avatar
    }
    childComments {
      id
      text
      created_at
      claps_count
      profile {
        id
        username
        profile_avatar
      }
      claps {
        profile_id
        count
      }
    }
    claps {
      profile_id
      count
    }
    created_at
    text
  }
}
    `;

/**
 * __useGetCommentsQuery__
 *
 * To run a query within a React component, call `useGetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetCommentsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetCommentsQuery, Types.GetCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetCommentsQuery, Types.GetCommentsQueryVariables>(GetCommentsDocument, options);
      }
export function useGetCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetCommentsQuery, Types.GetCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetCommentsQuery, Types.GetCommentsQueryVariables>(GetCommentsDocument, options);
        }
export type GetCommentsQueryHookResult = ReturnType<typeof useGetCommentsQuery>;
export type GetCommentsLazyQueryHookResult = ReturnType<typeof useGetCommentsLazyQuery>;
export type GetCommentsQueryResult = Apollo.QueryResult<Types.GetCommentsQuery, Types.GetCommentsQueryVariables>;
export const GetChallengeImagesDocument = gql`
    query getChallengeImages($challenge_id: String!) {
  getChallengeImages(challenge_id: $challenge_id) {
    id
    link
    order
  }
}
    `;

/**
 * __useGetChallengeImagesQuery__
 *
 * To run a query within a React component, call `useGetChallengeImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeImagesQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useGetChallengeImagesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeImagesQuery, Types.GetChallengeImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeImagesQuery, Types.GetChallengeImagesQueryVariables>(GetChallengeImagesDocument, options);
      }
export function useGetChallengeImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeImagesQuery, Types.GetChallengeImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeImagesQuery, Types.GetChallengeImagesQueryVariables>(GetChallengeImagesDocument, options);
        }
export type GetChallengeImagesQueryHookResult = ReturnType<typeof useGetChallengeImagesQuery>;
export type GetChallengeImagesLazyQueryHookResult = ReturnType<typeof useGetChallengeImagesLazyQuery>;
export type GetChallengeImagesQueryResult = Apollo.QueryResult<Types.GetChallengeImagesQuery, Types.GetChallengeImagesQueryVariables>;
export const GetChallengeRankInformationDocument = gql`
    query GetChallengeRankInformation($challenge_id: String!) {
  getChallengeRankInformation(challenge_id: $challenge_id) {
    subscribed_highlights {
      highlight_by_greater_distance {
        total_distance
        user {
          firstname
          lastname
          profile {
            profile_avatar
            username
            user_id
          }
        }
      }
      highlight_by_greater_altimetry {
        total_altimetry
        user {
          firstname
          lastname
          profile {
            profile_avatar
            username
            user_id
          }
        }
      }
      highlight_by_greater_ride {
        user {
          firstname
          lastname
          profile {
            profile_avatar
            username
            user_id
          }
        }
        activities {
          activity {
            name
            distance
          }
        }
      }
      highlight_by_greater_total_time {
        total_time_seconds
        user {
          firstname
          lastname
          profile {
            profile_avatar
            username
            user_id
          }
        }
      }
    }
    challenge_statistics {
      total_distance
      total_altimetry
      total_time_ride
      total_rides
    }
    participants_statistics {
      count_subscribers
      count_followed_by_me
      count_who_followe_me
      count_gender_male
      count_gender_female
    }
  }
}
    `;

/**
 * __useGetChallengeRankInformationQuery__
 *
 * To run a query within a React component, call `useGetChallengeRankInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeRankInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeRankInformationQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useGetChallengeRankInformationQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeRankInformationQuery, Types.GetChallengeRankInformationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeRankInformationQuery, Types.GetChallengeRankInformationQueryVariables>(GetChallengeRankInformationDocument, options);
      }
export function useGetChallengeRankInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeRankInformationQuery, Types.GetChallengeRankInformationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeRankInformationQuery, Types.GetChallengeRankInformationQueryVariables>(GetChallengeRankInformationDocument, options);
        }
export type GetChallengeRankInformationQueryHookResult = ReturnType<typeof useGetChallengeRankInformationQuery>;
export type GetChallengeRankInformationLazyQueryHookResult = ReturnType<typeof useGetChallengeRankInformationLazyQuery>;
export type GetChallengeRankInformationQueryResult = Apollo.QueryResult<Types.GetChallengeRankInformationQuery, Types.GetChallengeRankInformationQueryVariables>;
export const GetChallengeRanksDocument = gql`
    query getChallengeRanks($pagination: PaginationInput!, $data: GetRanksInput!) {
  getChallengeRanks(data: $data, pagination: $pagination) {
    id
    user_id
    registration_date
    end_date
    total_time_seconds
    total_distance
    total_altimetry
    total_rides
    classification
    user {
      id
      firstname
      lastname
      profile {
        id
        username
        profile_avatar
      }
    }
    completed
  }
}
    `;

/**
 * __useGetChallengeRanksQuery__
 *
 * To run a query within a React component, call `useGetChallengeRanksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeRanksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeRanksQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetChallengeRanksQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeRanksQuery, Types.GetChallengeRanksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeRanksQuery, Types.GetChallengeRanksQueryVariables>(GetChallengeRanksDocument, options);
      }
export function useGetChallengeRanksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeRanksQuery, Types.GetChallengeRanksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeRanksQuery, Types.GetChallengeRanksQueryVariables>(GetChallengeRanksDocument, options);
        }
export type GetChallengeRanksQueryHookResult = ReturnType<typeof useGetChallengeRanksQuery>;
export type GetChallengeRanksLazyQueryHookResult = ReturnType<typeof useGetChallengeRanksLazyQuery>;
export type GetChallengeRanksQueryResult = Apollo.QueryResult<Types.GetChallengeRanksQuery, Types.GetChallengeRanksQueryVariables>;
export const GetChallengeSubscriptionsDocument = gql`
    query GetChallengeSubscriptions($challenge_id: String!) {
  getChallengeSubscriptions(challenge_id: $challenge_id) {
    user {
      id
      firstname
      lastname
      profile {
        id
        username
        profile_avatar
      }
    }
    registration_date
  }
}
    `;

/**
 * __useGetChallengeSubscriptionsQuery__
 *
 * To run a query within a React component, call `useGetChallengeSubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeSubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeSubscriptionsQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useGetChallengeSubscriptionsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeSubscriptionsQuery, Types.GetChallengeSubscriptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeSubscriptionsQuery, Types.GetChallengeSubscriptionsQueryVariables>(GetChallengeSubscriptionsDocument, options);
      }
export function useGetChallengeSubscriptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeSubscriptionsQuery, Types.GetChallengeSubscriptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeSubscriptionsQuery, Types.GetChallengeSubscriptionsQueryVariables>(GetChallengeSubscriptionsDocument, options);
        }
export type GetChallengeSubscriptionsQueryHookResult = ReturnType<typeof useGetChallengeSubscriptionsQuery>;
export type GetChallengeSubscriptionsLazyQueryHookResult = ReturnType<typeof useGetChallengeSubscriptionsLazyQuery>;
export type GetChallengeSubscriptionsQueryResult = Apollo.QueryResult<Types.GetChallengeSubscriptionsQuery, Types.GetChallengeSubscriptionsQueryVariables>;
export const GetChallengeWithdrawalAddressesDocument = gql`
    query GetChallengeWithdrawalAddresses($data: FindWithdrawalAddressesInput!) {
  getChallengeWithdrawalAddresses(data: $data) {
    name
    id
    zip_code
    address_line_one
    address_line_two
    reference_point
    city_id
    city {
      name
      state {
        abbreviation
      }
    }
  }
}
    `;

/**
 * __useGetChallengeWithdrawalAddressesQuery__
 *
 * To run a query within a React component, call `useGetChallengeWithdrawalAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeWithdrawalAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeWithdrawalAddressesQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetChallengeWithdrawalAddressesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeWithdrawalAddressesQuery, Types.GetChallengeWithdrawalAddressesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeWithdrawalAddressesQuery, Types.GetChallengeWithdrawalAddressesQueryVariables>(GetChallengeWithdrawalAddressesDocument, options);
      }
export function useGetChallengeWithdrawalAddressesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeWithdrawalAddressesQuery, Types.GetChallengeWithdrawalAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeWithdrawalAddressesQuery, Types.GetChallengeWithdrawalAddressesQueryVariables>(GetChallengeWithdrawalAddressesDocument, options);
        }
export type GetChallengeWithdrawalAddressesQueryHookResult = ReturnType<typeof useGetChallengeWithdrawalAddressesQuery>;
export type GetChallengeWithdrawalAddressesLazyQueryHookResult = ReturnType<typeof useGetChallengeWithdrawalAddressesLazyQuery>;
export type GetChallengeWithdrawalAddressesQueryResult = Apollo.QueryResult<Types.GetChallengeWithdrawalAddressesQuery, Types.GetChallengeWithdrawalAddressesQueryVariables>;
export const GetChallengeDetailDocument = gql`
    query GetChallengeDetail($data: GetChallengeDetailInput!) {
  getChallengeDetail(data: $data) {
    id
    name
    creator_id
    start_date_registration
    end_date_registration
    temporarily_unavailable
    start_date
    end_date
    description
    challenge_type
    image_avatar
    image_cover
    claps_count
    count_comments
    count_subscribe
    count_view
    physical_event
    date_for_drawn
    user_extraordinary_actions {
      id
      user_id
      bonus_subscription
      buy_after_registration_closes
    }
    subscription_prices {
      id
      challenge_id
      value
      date_initial
      active
      created_at
      updated_at
    }
    support_points {
      id
      name
      latitude
      longitude
    }
    products {
      id
      only_award
      awards_products {
        award_id
      }
      name
      description
      date_initial
      date_end
      available
      order
      has_cost
      allow_buy_without_subscription
      free_field
      only_award
      active
      prices {
        value
        date_initial
        active
      }
      images {
        link
        order
        active
      }
      challenge_id
      variations {
        id
        product_id
        text
        description
        available_quantity
        available
        order
        active
        prices {
          value
          date_initial
          active
        }
        images {
          link
          order
          active
        }
      }
    }
    challenge_images {
      id
      link
      order
    }
    has_categories
    challenge_categories {
      id
      name
      description
      category_configuration {
        max_altimetry_goal_value
        altimetry_goal_value
        max_distance_goal_value
        distance_goal_value
      }
    }
    company {
      id
      fantasy_name
      profile {
        profile_avatar
      }
    }
    configuration {
      altimetry_goal_value
      max_altimetry_goal_value
      distance_goal_value
      max_distance_goal_value
      unique_ride
      accumulation
      is_paid
      classification_by_award
      max_time_goal_value
      min_time_goal_value
      allows_category_change
      has_paid_kit
      deadline_category_change
    }
    claps {
      profile_id
      count
    }
    user_challenges {
      id
      user_id
      completed
      registration_date
      classification
      paid
      amount_paid
      amount_to_pay
      ready_to_withdraw
      withdrawal_date
      short_id
      created_at
      subscription_status {
        status_description {
          id
          code
          name
          description
          translations {
            language_code
            name
            description
          }
        }
      }
      products_bought {
        id
        value
        quantity
        free_value
        user_challenge_id
        related_payment {
          payment {
            is_paid
          }
        }
        product {
          id
          name
        }
        variation {
          id
          images {
            id
            link
            active
          }
          text
          description
        }
      }
      withdrawal_address {
        id
        name
        challenge_id
        zip_code
        address_line_one
        address_line_two
        reference_point
      }
      last_payment_id
      category {
        id
        name
        description
        category_configuration {
          max_altimetry_goal_value
          altimetry_goal_value
          max_distance_goal_value
          distance_goal_value
          maximum_time_goal_value
          minimum_time_goal_value
        }
      }
    }
    awards {
      id
      position
      name
      description
      price
      quantity
      only_for_draw
      awards_products {
        product {
          name
          images {
            link
            order
          }
        }
      }
      award_volumes {
        id
        height
        width
        weight
        depth
      }
      awardsImages {
        order
        link
      }
    }
    winners {
      award {
        name
        awardsImages {
          link
        }
      }
      user {
        firstname
        lastname
        id
        profile {
          profile_avatar
        }
      }
    }
    challenges_attached_files {
      id
      name
      description
      extension
      link
    }
    challenges_external_links_attached {
      id
      name
      description
      favicon_image_link
      link
    }
    isFavorite
    summary {
      count_subscribe
      count_claps
      count_comments
    }
    temporarily_unavailable
    company {
      zip_code
    }
    products_purchased_without_subscription {
      id
      product_id
      value
      free_value
      product_variation_id
      canceled
      quantity
      related_payment {
        payment {
          id
          created_at
          resource_payment_id
          origin_payment_id
          payment_processor_id
          country_id
          bill_expiration_date
          value
          is_paid
          declined
          pix_qrcode
          pix_expiration_date
          returned
          entrance
          processed
          profile_id
          user_id
          bill_barcode
          bill_link
          status
          created_at
          updated_at
          humanized_message
          installments
          card {
            last_digits
            brand
          }
        }
      }
      product {
        name
        description
      }
      variation {
        id
        text
        description
        images {
          id
          link
          order
        }
      }
    }
  }
}
    `;

/**
 * __useGetChallengeDetailQuery__
 *
 * To run a query within a React component, call `useGetChallengeDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeDetailQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetChallengeDetailQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeDetailQuery, Types.GetChallengeDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeDetailQuery, Types.GetChallengeDetailQueryVariables>(GetChallengeDetailDocument, options);
      }
export function useGetChallengeDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeDetailQuery, Types.GetChallengeDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeDetailQuery, Types.GetChallengeDetailQueryVariables>(GetChallengeDetailDocument, options);
        }
export type GetChallengeDetailQueryHookResult = ReturnType<typeof useGetChallengeDetailQuery>;
export type GetChallengeDetailLazyQueryHookResult = ReturnType<typeof useGetChallengeDetailLazyQuery>;
export type GetChallengeDetailQueryResult = Apollo.QueryResult<Types.GetChallengeDetailQuery, Types.GetChallengeDetailQueryVariables>;
export const GetDetailedSubscriptionDocument = gql`
    query getDetailedSubscription($data: GetDetailedSubscriptionInput!) {
  getDetailedSubscription(data: $data) {
    id
    user_id
    challenge_category_id
    short_id
    paid
    amount_paid
    last_payment_id
    amount_to_pay
    created_at
    subscription_status {
      status_description {
        translations {
          name
        }
      }
    }
    products_bought {
      id
      value
      quantity
      free_value
      product {
        id
        name
      }
      variation {
        id
        images {
          id
          link
          active
        }
        text
        description
      }
    }
    award_subscription_references {
      award {
        name
        price
      }
    }
    last_payment {
      id
      interest_free_amount
      pix_qrcode
      pix_expiration_date
      created_at
      resource_payment_id
      origin_payment_id
      payment_processor_id
      country_id
      bill_expiration_date
      value
      is_paid
      declined
      returned
      entrance
      processed
      processed
      origin_resource_id
      profile_id
      user_id
      status
      installments
      bill_link
      created_at
      updated_at
      card {
        last_digits
        brand
      }
    }
    products_bought {
      id
      value
      quantity
      variation {
        text
        images {
          id
          link
        }
      }
      product {
        name
        images {
          id
          link
        }
      }
    }
    last_payment {
      value
    }
    category {
      id
      name
      order
    }
    user {
      id
      firstname
      lastname
      date_of_birth
      legal_registry_number
      team_name
      gender
      phone
      city {
        name
        state {
          name
        }
      }
      profile {
        profile_avatar
      }
    }
  }
}
    `;

/**
 * __useGetDetailedSubscriptionQuery__
 *
 * To run a query within a React component, call `useGetDetailedSubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDetailedSubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDetailedSubscriptionQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetDetailedSubscriptionQuery(baseOptions: Apollo.QueryHookOptions<Types.GetDetailedSubscriptionQuery, Types.GetDetailedSubscriptionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetDetailedSubscriptionQuery, Types.GetDetailedSubscriptionQueryVariables>(GetDetailedSubscriptionDocument, options);
      }
export function useGetDetailedSubscriptionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetDetailedSubscriptionQuery, Types.GetDetailedSubscriptionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetDetailedSubscriptionQuery, Types.GetDetailedSubscriptionQueryVariables>(GetDetailedSubscriptionDocument, options);
        }
export type GetDetailedSubscriptionQueryHookResult = ReturnType<typeof useGetDetailedSubscriptionQuery>;
export type GetDetailedSubscriptionLazyQueryHookResult = ReturnType<typeof useGetDetailedSubscriptionLazyQuery>;
export type GetDetailedSubscriptionQueryResult = Apollo.QueryResult<Types.GetDetailedSubscriptionQuery, Types.GetDetailedSubscriptionQueryVariables>;
export const GetSubscriptionPaymentsDocument = gql`
    query getSubscriptionPayments($challenge_id: String!) {
  getSubscriptionPayments(challenge_id: $challenge_id) {
    id
    payment_id
    award_id
    payment {
      id
      resource_payment_id
      origin_payment_id
      payment_processor_id
      country_id
      bill_expiration_date
      value
      is_paid
      declined
      returned
      entrance
      processed
      processed
      origin_resource_id
      profile_id
      user_id
      status
      installments
      bill_link
      created_at
      updated_at
      card {
        last_digits
        brand
      }
    }
    award {
      id
      name
      description
      price
      challenge_id
      awardsImages {
        link
      }
    }
  }
}
    `;

/**
 * __useGetSubscriptionPaymentsQuery__
 *
 * To run a query within a React component, call `useGetSubscriptionPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubscriptionPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubscriptionPaymentsQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useGetSubscriptionPaymentsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetSubscriptionPaymentsQuery, Types.GetSubscriptionPaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetSubscriptionPaymentsQuery, Types.GetSubscriptionPaymentsQueryVariables>(GetSubscriptionPaymentsDocument, options);
      }
export function useGetSubscriptionPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetSubscriptionPaymentsQuery, Types.GetSubscriptionPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetSubscriptionPaymentsQuery, Types.GetSubscriptionPaymentsQueryVariables>(GetSubscriptionPaymentsDocument, options);
        }
export type GetSubscriptionPaymentsQueryHookResult = ReturnType<typeof useGetSubscriptionPaymentsQuery>;
export type GetSubscriptionPaymentsLazyQueryHookResult = ReturnType<typeof useGetSubscriptionPaymentsLazyQuery>;
export type GetSubscriptionPaymentsQueryResult = Apollo.QueryResult<Types.GetSubscriptionPaymentsQuery, Types.GetSubscriptionPaymentsQueryVariables>;
export const GetSubscriptionProgressDocument = gql`
    query GetSubscriptionProgress($data: GetUserChallengeProgressInput!) {
  getSubscriptionProgress(data: $data) {
    id
    challenge_id
    classification
    completed
    total_time_seconds
    total_distance
    total_altimetry
    total_rides
    paid
    category {
      id
      category_configuration {
        altimetry_goal_value
        distance_goal_value
        maximum_time_goal_value
        minimum_time_goal_value
      }
    }
    user {
      id
      firstname
      lastname
      profile {
        id
        username
        profile_avatar
      }
    }
    activities {
      activity {
        id
        third_party_data_source_slug
        name
        distance
        start_date_local
        start_date
        elapsed_time_seconds
        total_elevation_gain
        calories
        user_id
      }
    }
    challenge {
      name
      image_avatar
      start_date
      end_date
      challenge_type
      configuration {
        distance_goal_value
        altimetry_goal_value
      }
    }
  }
}
    `;

/**
 * __useGetSubscriptionProgressQuery__
 *
 * To run a query within a React component, call `useGetSubscriptionProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubscriptionProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubscriptionProgressQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetSubscriptionProgressQuery(baseOptions: Apollo.QueryHookOptions<Types.GetSubscriptionProgressQuery, Types.GetSubscriptionProgressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetSubscriptionProgressQuery, Types.GetSubscriptionProgressQueryVariables>(GetSubscriptionProgressDocument, options);
      }
export function useGetSubscriptionProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetSubscriptionProgressQuery, Types.GetSubscriptionProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetSubscriptionProgressQuery, Types.GetSubscriptionProgressQueryVariables>(GetSubscriptionProgressDocument, options);
        }
export type GetSubscriptionProgressQueryHookResult = ReturnType<typeof useGetSubscriptionProgressQuery>;
export type GetSubscriptionProgressLazyQueryHookResult = ReturnType<typeof useGetSubscriptionProgressLazyQuery>;
export type GetSubscriptionProgressQueryResult = Apollo.QueryResult<Types.GetSubscriptionProgressQuery, Types.GetSubscriptionProgressQueryVariables>;
export const GetSubscriptionsOfAChallengeDocument = gql`
    query getSubscriptionsOfAChallenge($pagination: PaginationInput!, $data: ListChallengeSubscriptionsInput!) {
  getSubscriptionsOfAChallenge(pagination: $pagination, data: $data) {
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
    subscriptions {
      id
      paid
      short_id
      last_payment {
        status
      }
      user {
        id
        profile {
          profile_avatar
        }
        firstname
        lastname
        city {
          name
          state {
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetSubscriptionsOfAChallengeQuery__
 *
 * To run a query within a React component, call `useGetSubscriptionsOfAChallengeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubscriptionsOfAChallengeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubscriptionsOfAChallengeQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetSubscriptionsOfAChallengeQuery(baseOptions: Apollo.QueryHookOptions<Types.GetSubscriptionsOfAChallengeQuery, Types.GetSubscriptionsOfAChallengeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetSubscriptionsOfAChallengeQuery, Types.GetSubscriptionsOfAChallengeQueryVariables>(GetSubscriptionsOfAChallengeDocument, options);
      }
export function useGetSubscriptionsOfAChallengeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetSubscriptionsOfAChallengeQuery, Types.GetSubscriptionsOfAChallengeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetSubscriptionsOfAChallengeQuery, Types.GetSubscriptionsOfAChallengeQueryVariables>(GetSubscriptionsOfAChallengeDocument, options);
        }
export type GetSubscriptionsOfAChallengeQueryHookResult = ReturnType<typeof useGetSubscriptionsOfAChallengeQuery>;
export type GetSubscriptionsOfAChallengeLazyQueryHookResult = ReturnType<typeof useGetSubscriptionsOfAChallengeLazyQuery>;
export type GetSubscriptionsOfAChallengeQueryResult = Apollo.QueryResult<Types.GetSubscriptionsOfAChallengeQuery, Types.GetSubscriptionsOfAChallengeQueryVariables>;
export const GetUserChallengeProgressDocument = gql`
    query GetUserChallengeProgress($data: GetUserChallengeProgressInput!) {
  getUserChallengeProgress(data: $data) {
    challenge_id
    classification
    completed
    total_time_seconds
    total_distance
    total_altimetry
    total_rides
    category {
      id
      category_configuration {
        altimetry_goal_value
        distance_goal_value
        maximum_time_goal_value
        minimum_time_goal_value
      }
    }
    user {
      id
      firstname
      lastname
      profile {
        id
        username
        profile_avatar
      }
    }
    activities {
      activity {
        id
        third_party_data_source_slug
        name
        distance
        start_date_local
        start_date
        elapsed_time_seconds
        total_elevation_gain
        calories
        user_id
      }
    }
    challenge {
      name
      image_avatar
      start_date
      end_date
      challenge_type
      configuration {
        distance_goal_value
        altimetry_goal_value
      }
    }
  }
}
    `;

/**
 * __useGetUserChallengeProgressQuery__
 *
 * To run a query within a React component, call `useGetUserChallengeProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserChallengeProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserChallengeProgressQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetUserChallengeProgressQuery(baseOptions: Apollo.QueryHookOptions<Types.GetUserChallengeProgressQuery, Types.GetUserChallengeProgressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetUserChallengeProgressQuery, Types.GetUserChallengeProgressQueryVariables>(GetUserChallengeProgressDocument, options);
      }
export function useGetUserChallengeProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetUserChallengeProgressQuery, Types.GetUserChallengeProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetUserChallengeProgressQuery, Types.GetUserChallengeProgressQueryVariables>(GetUserChallengeProgressDocument, options);
        }
export type GetUserChallengeProgressQueryHookResult = ReturnType<typeof useGetUserChallengeProgressQuery>;
export type GetUserChallengeProgressLazyQueryHookResult = ReturnType<typeof useGetUserChallengeProgressLazyQuery>;
export type GetUserChallengeProgressQueryResult = Apollo.QueryResult<Types.GetUserChallengeProgressQuery, Types.GetUserChallengeProgressQueryVariables>;
export const MarkSubscriptionAsWithdrawnDocument = gql`
    mutation markSubscriptionAsWithdrawn($data: MarkSubscriptionAsWithdrawnInput!) {
  markSubscriptionAsWithdrawn(data: $data) {
    id
    withdrawal_date
  }
}
    `;
export type MarkSubscriptionAsWithdrawnMutationFn = Apollo.MutationFunction<Types.MarkSubscriptionAsWithdrawnMutation, Types.MarkSubscriptionAsWithdrawnMutationVariables>;

/**
 * __useMarkSubscriptionAsWithdrawnMutation__
 *
 * To run a mutation, you first call `useMarkSubscriptionAsWithdrawnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkSubscriptionAsWithdrawnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markSubscriptionAsWithdrawnMutation, { data, loading, error }] = useMarkSubscriptionAsWithdrawnMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMarkSubscriptionAsWithdrawnMutation(baseOptions?: Apollo.MutationHookOptions<Types.MarkSubscriptionAsWithdrawnMutation, Types.MarkSubscriptionAsWithdrawnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.MarkSubscriptionAsWithdrawnMutation, Types.MarkSubscriptionAsWithdrawnMutationVariables>(MarkSubscriptionAsWithdrawnDocument, options);
      }
export type MarkSubscriptionAsWithdrawnMutationHookResult = ReturnType<typeof useMarkSubscriptionAsWithdrawnMutation>;
export type MarkSubscriptionAsWithdrawnMutationResult = Apollo.MutationResult<Types.MarkSubscriptionAsWithdrawnMutation>;
export type MarkSubscriptionAsWithdrawnMutationOptions = Apollo.BaseMutationOptions<Types.MarkSubscriptionAsWithdrawnMutation, Types.MarkSubscriptionAsWithdrawnMutationVariables>;
export const RemoveActivityFromAllChallengeProgressDocument = gql`
    mutation removeActivityFromAllChallengeProgress($data: DeleteUserChallengeActivityInput!) {
  removeActivityFromAllChallengeProgress(data: $data)
}
    `;
export type RemoveActivityFromAllChallengeProgressMutationFn = Apollo.MutationFunction<Types.RemoveActivityFromAllChallengeProgressMutation, Types.RemoveActivityFromAllChallengeProgressMutationVariables>;

/**
 * __useRemoveActivityFromAllChallengeProgressMutation__
 *
 * To run a mutation, you first call `useRemoveActivityFromAllChallengeProgressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveActivityFromAllChallengeProgressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeActivityFromAllChallengeProgressMutation, { data, loading, error }] = useRemoveActivityFromAllChallengeProgressMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRemoveActivityFromAllChallengeProgressMutation(baseOptions?: Apollo.MutationHookOptions<Types.RemoveActivityFromAllChallengeProgressMutation, Types.RemoveActivityFromAllChallengeProgressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RemoveActivityFromAllChallengeProgressMutation, Types.RemoveActivityFromAllChallengeProgressMutationVariables>(RemoveActivityFromAllChallengeProgressDocument, options);
      }
export type RemoveActivityFromAllChallengeProgressMutationHookResult = ReturnType<typeof useRemoveActivityFromAllChallengeProgressMutation>;
export type RemoveActivityFromAllChallengeProgressMutationResult = Apollo.MutationResult<Types.RemoveActivityFromAllChallengeProgressMutation>;
export type RemoveActivityFromAllChallengeProgressMutationOptions = Apollo.BaseMutationOptions<Types.RemoveActivityFromAllChallengeProgressMutation, Types.RemoveActivityFromAllChallengeProgressMutationVariables>;
export const ShowAllChallengesV2Document = gql`
    query showAllChallengesV2($pagination: PaginationInput!, $data: ShowAllChallengesInput!) {
  showAllChallengesV2(pagination: $pagination, data: $data) {
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
    items {
      id
      eligible_spotlight
      name
      image_avatar
      image_cover
      physical_event
      configuration {
        is_paid
      }
    }
  }
}
    `;

/**
 * __useShowAllChallengesV2Query__
 *
 * To run a query within a React component, call `useShowAllChallengesV2Query` and pass it any options that fit your needs.
 * When your component renders, `useShowAllChallengesV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShowAllChallengesV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useShowAllChallengesV2Query(baseOptions: Apollo.QueryHookOptions<Types.ShowAllChallengesV2Query, Types.ShowAllChallengesV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ShowAllChallengesV2Query, Types.ShowAllChallengesV2QueryVariables>(ShowAllChallengesV2Document, options);
      }
export function useShowAllChallengesV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ShowAllChallengesV2Query, Types.ShowAllChallengesV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ShowAllChallengesV2Query, Types.ShowAllChallengesV2QueryVariables>(ShowAllChallengesV2Document, options);
        }
export type ShowAllChallengesV2QueryHookResult = ReturnType<typeof useShowAllChallengesV2Query>;
export type ShowAllChallengesV2LazyQueryHookResult = ReturnType<typeof useShowAllChallengesV2LazyQuery>;
export type ShowAllChallengesV2QueryResult = Apollo.QueryResult<Types.ShowAllChallengesV2Query, Types.ShowAllChallengesV2QueryVariables>;
export const SubscribeUserChallengeDocument = gql`
    mutation subscribeUserChallenge($award_data: ChallengePaymentInput, $payment_data: PaymentInput, $challenge_award_requests: [ChallengeAwardAdditionalRequestInput!], $data: SubscribeUserChallengeInput!, $products_purchased: [ProductPurchasedInput!]) {
  subscribeUserChallenge(
    award_data: $award_data
    payment_data: $payment_data
    challenge_award_requests: $challenge_award_requests
    data: $data
    products_purchased: $products_purchased
  ) {
    registration_date
    payment_id
  }
}
    `;
export type SubscribeUserChallengeMutationFn = Apollo.MutationFunction<Types.SubscribeUserChallengeMutation, Types.SubscribeUserChallengeMutationVariables>;

/**
 * __useSubscribeUserChallengeMutation__
 *
 * To run a mutation, you first call `useSubscribeUserChallengeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeUserChallengeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeUserChallengeMutation, { data, loading, error }] = useSubscribeUserChallengeMutation({
 *   variables: {
 *      award_data: // value for 'award_data'
 *      payment_data: // value for 'payment_data'
 *      challenge_award_requests: // value for 'challenge_award_requests'
 *      data: // value for 'data'
 *      products_purchased: // value for 'products_purchased'
 *   },
 * });
 */
export function useSubscribeUserChallengeMutation(baseOptions?: Apollo.MutationHookOptions<Types.SubscribeUserChallengeMutation, Types.SubscribeUserChallengeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.SubscribeUserChallengeMutation, Types.SubscribeUserChallengeMutationVariables>(SubscribeUserChallengeDocument, options);
      }
export type SubscribeUserChallengeMutationHookResult = ReturnType<typeof useSubscribeUserChallengeMutation>;
export type SubscribeUserChallengeMutationResult = Apollo.MutationResult<Types.SubscribeUserChallengeMutation>;
export type SubscribeUserChallengeMutationOptions = Apollo.BaseMutationOptions<Types.SubscribeUserChallengeMutation, Types.SubscribeUserChallengeMutationVariables>;
export const SubscriptionsWithAwardAlreadyWithdrawnDocument = gql`
    query SubscriptionsWithAwardAlreadyWithdrawn($pagination: PaginationInput!, $challenge_id: String!) {
  subscriptionsWithAwardAlreadyWithdrawn(
    pagination: $pagination
    challenge_id: $challenge_id
  ) {
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
    subscriptions {
      withdrawal_date
      athlete_identification
      short_id
      category {
        id
        order
        name
      }
      user {
        firstname
        lastname
        profile {
          profile_avatar
        }
      }
    }
  }
}
    `;

/**
 * __useSubscriptionsWithAwardAlreadyWithdrawnQuery__
 *
 * To run a query within a React component, call `useSubscriptionsWithAwardAlreadyWithdrawnQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionsWithAwardAlreadyWithdrawnQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionsWithAwardAlreadyWithdrawnQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useSubscriptionsWithAwardAlreadyWithdrawnQuery(baseOptions: Apollo.QueryHookOptions<Types.SubscriptionsWithAwardAlreadyWithdrawnQuery, Types.SubscriptionsWithAwardAlreadyWithdrawnQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.SubscriptionsWithAwardAlreadyWithdrawnQuery, Types.SubscriptionsWithAwardAlreadyWithdrawnQueryVariables>(SubscriptionsWithAwardAlreadyWithdrawnDocument, options);
      }
export function useSubscriptionsWithAwardAlreadyWithdrawnLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.SubscriptionsWithAwardAlreadyWithdrawnQuery, Types.SubscriptionsWithAwardAlreadyWithdrawnQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.SubscriptionsWithAwardAlreadyWithdrawnQuery, Types.SubscriptionsWithAwardAlreadyWithdrawnQueryVariables>(SubscriptionsWithAwardAlreadyWithdrawnDocument, options);
        }
export type SubscriptionsWithAwardAlreadyWithdrawnQueryHookResult = ReturnType<typeof useSubscriptionsWithAwardAlreadyWithdrawnQuery>;
export type SubscriptionsWithAwardAlreadyWithdrawnLazyQueryHookResult = ReturnType<typeof useSubscriptionsWithAwardAlreadyWithdrawnLazyQuery>;
export type SubscriptionsWithAwardAlreadyWithdrawnQueryResult = Apollo.QueryResult<Types.SubscriptionsWithAwardAlreadyWithdrawnQuery, Types.SubscriptionsWithAwardAlreadyWithdrawnQueryVariables>;
export const UnsubscribeUserChallengeDocument = gql`
    mutation unsubscribeUserChallenge($challenge_id: String!) {
  unsubscribeUserChallenge(challenge_id: $challenge_id)
}
    `;
export type UnsubscribeUserChallengeMutationFn = Apollo.MutationFunction<Types.UnsubscribeUserChallengeMutation, Types.UnsubscribeUserChallengeMutationVariables>;

/**
 * __useUnsubscribeUserChallengeMutation__
 *
 * To run a mutation, you first call `useUnsubscribeUserChallengeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeUserChallengeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeUserChallengeMutation, { data, loading, error }] = useUnsubscribeUserChallengeMutation({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useUnsubscribeUserChallengeMutation(baseOptions?: Apollo.MutationHookOptions<Types.UnsubscribeUserChallengeMutation, Types.UnsubscribeUserChallengeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UnsubscribeUserChallengeMutation, Types.UnsubscribeUserChallengeMutationVariables>(UnsubscribeUserChallengeDocument, options);
      }
export type UnsubscribeUserChallengeMutationHookResult = ReturnType<typeof useUnsubscribeUserChallengeMutation>;
export type UnsubscribeUserChallengeMutationResult = Apollo.MutationResult<Types.UnsubscribeUserChallengeMutation>;
export type UnsubscribeUserChallengeMutationOptions = Apollo.BaseMutationOptions<Types.UnsubscribeUserChallengeMutation, Types.UnsubscribeUserChallengeMutationVariables>;
export const UpdateSubscriptionDocument = gql`
    mutation UpdateSubscription($data: UpdateSubscriptionInput!) {
  updateSubscription(data: $data) {
    status
    message
    subscription {
      user {
        firstname
        lastname
      }
    }
  }
}
    `;
export type UpdateSubscriptionMutationFn = Apollo.MutationFunction<Types.UpdateSubscriptionMutation, Types.UpdateSubscriptionMutationVariables>;

/**
 * __useUpdateSubscriptionMutation__
 *
 * To run a mutation, you first call `useUpdateSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSubscriptionMutation, { data, loading, error }] = useUpdateSubscriptionMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateSubscriptionMutation, Types.UpdateSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateSubscriptionMutation, Types.UpdateSubscriptionMutationVariables>(UpdateSubscriptionDocument, options);
      }
export type UpdateSubscriptionMutationHookResult = ReturnType<typeof useUpdateSubscriptionMutation>;
export type UpdateSubscriptionMutationResult = Apollo.MutationResult<Types.UpdateSubscriptionMutation>;
export type UpdateSubscriptionMutationOptions = Apollo.BaseMutationOptions<Types.UpdateSubscriptionMutation, Types.UpdateSubscriptionMutationVariables>;
export const UpdateWithdrawalAddressDocument = gql`
    mutation UpdateWithdrawalAddress($data: UpdateSubscriptionWithdrawalAddressInput!) {
  updateWithdrawalAddress(data: $data) {
    id
  }
}
    `;
export type UpdateWithdrawalAddressMutationFn = Apollo.MutationFunction<Types.UpdateWithdrawalAddressMutation, Types.UpdateWithdrawalAddressMutationVariables>;

/**
 * __useUpdateWithdrawalAddressMutation__
 *
 * To run a mutation, you first call `useUpdateWithdrawalAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWithdrawalAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWithdrawalAddressMutation, { data, loading, error }] = useUpdateWithdrawalAddressMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateWithdrawalAddressMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateWithdrawalAddressMutation, Types.UpdateWithdrawalAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateWithdrawalAddressMutation, Types.UpdateWithdrawalAddressMutationVariables>(UpdateWithdrawalAddressDocument, options);
      }
export type UpdateWithdrawalAddressMutationHookResult = ReturnType<typeof useUpdateWithdrawalAddressMutation>;
export type UpdateWithdrawalAddressMutationResult = Apollo.MutationResult<Types.UpdateWithdrawalAddressMutation>;
export type UpdateWithdrawalAddressMutationOptions = Apollo.BaseMutationOptions<Types.UpdateWithdrawalAddressMutation, Types.UpdateWithdrawalAddressMutationVariables>;
export const AssociateUserToCompanyDocument = gql`
    mutation AssociateUserToCompany($data: AssociateUserWithCompanyInput!) {
  associateUserToCompany(data: $data) {
    creator
    company_id
    user_id
    company_function_id
  }
}
    `;
export type AssociateUserToCompanyMutationFn = Apollo.MutationFunction<Types.AssociateUserToCompanyMutation, Types.AssociateUserToCompanyMutationVariables>;

/**
 * __useAssociateUserToCompanyMutation__
 *
 * To run a mutation, you first call `useAssociateUserToCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssociateUserToCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [associateUserToCompanyMutation, { data, loading, error }] = useAssociateUserToCompanyMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAssociateUserToCompanyMutation(baseOptions?: Apollo.MutationHookOptions<Types.AssociateUserToCompanyMutation, Types.AssociateUserToCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.AssociateUserToCompanyMutation, Types.AssociateUserToCompanyMutationVariables>(AssociateUserToCompanyDocument, options);
      }
export type AssociateUserToCompanyMutationHookResult = ReturnType<typeof useAssociateUserToCompanyMutation>;
export type AssociateUserToCompanyMutationResult = Apollo.MutationResult<Types.AssociateUserToCompanyMutation>;
export type AssociateUserToCompanyMutationOptions = Apollo.BaseMutationOptions<Types.AssociateUserToCompanyMutation, Types.AssociateUserToCompanyMutationVariables>;
export const DeleteAssociationUserWithCompanyDocument = gql`
    mutation DeleteAssociationUserWithCompany($data: DeleteAssociationUserWithCompanyInput!) {
  deleteAssociationUserWithCompany(data: $data)
}
    `;
export type DeleteAssociationUserWithCompanyMutationFn = Apollo.MutationFunction<Types.DeleteAssociationUserWithCompanyMutation, Types.DeleteAssociationUserWithCompanyMutationVariables>;

/**
 * __useDeleteAssociationUserWithCompanyMutation__
 *
 * To run a mutation, you first call `useDeleteAssociationUserWithCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAssociationUserWithCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAssociationUserWithCompanyMutation, { data, loading, error }] = useDeleteAssociationUserWithCompanyMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteAssociationUserWithCompanyMutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteAssociationUserWithCompanyMutation, Types.DeleteAssociationUserWithCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteAssociationUserWithCompanyMutation, Types.DeleteAssociationUserWithCompanyMutationVariables>(DeleteAssociationUserWithCompanyDocument, options);
      }
export type DeleteAssociationUserWithCompanyMutationHookResult = ReturnType<typeof useDeleteAssociationUserWithCompanyMutation>;
export type DeleteAssociationUserWithCompanyMutationResult = Apollo.MutationResult<Types.DeleteAssociationUserWithCompanyMutation>;
export type DeleteAssociationUserWithCompanyMutationOptions = Apollo.BaseMutationOptions<Types.DeleteAssociationUserWithCompanyMutation, Types.DeleteAssociationUserWithCompanyMutationVariables>;
export const ListCompanyUsersDocument = gql`
    query ListCompanyUsers($company_id: String!) {
  listCompanyUsers(company_id: $company_id) {
    creator
    user_id
    user {
      firstname
      lastname
      profile {
        profile_avatar
      }
    }
  }
}
    `;

/**
 * __useListCompanyUsersQuery__
 *
 * To run a query within a React component, call `useListCompanyUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListCompanyUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListCompanyUsersQuery({
 *   variables: {
 *      company_id: // value for 'company_id'
 *   },
 * });
 */
export function useListCompanyUsersQuery(baseOptions: Apollo.QueryHookOptions<Types.ListCompanyUsersQuery, Types.ListCompanyUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.ListCompanyUsersQuery, Types.ListCompanyUsersQueryVariables>(ListCompanyUsersDocument, options);
      }
export function useListCompanyUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.ListCompanyUsersQuery, Types.ListCompanyUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.ListCompanyUsersQuery, Types.ListCompanyUsersQueryVariables>(ListCompanyUsersDocument, options);
        }
export type ListCompanyUsersQueryHookResult = ReturnType<typeof useListCompanyUsersQuery>;
export type ListCompanyUsersLazyQueryHookResult = ReturnType<typeof useListCompanyUsersLazyQuery>;
export type ListCompanyUsersQueryResult = Apollo.QueryResult<Types.ListCompanyUsersQuery, Types.ListCompanyUsersQueryVariables>;
export const GetCityDocument = gql`
    query getCity($data: CitiesInput!, $pagination: PaginationInput!) {
  getCity(data: $data, pagination: $pagination) {
    id
    name
  }
}
    `;

/**
 * __useGetCityQuery__
 *
 * To run a query within a React component, call `useGetCityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCityQuery({
 *   variables: {
 *      data: // value for 'data'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetCityQuery(baseOptions: Apollo.QueryHookOptions<Types.GetCityQuery, Types.GetCityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetCityQuery, Types.GetCityQueryVariables>(GetCityDocument, options);
      }
export function useGetCityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetCityQuery, Types.GetCityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetCityQuery, Types.GetCityQueryVariables>(GetCityDocument, options);
        }
export type GetCityQueryHookResult = ReturnType<typeof useGetCityQuery>;
export type GetCityLazyQueryHookResult = ReturnType<typeof useGetCityLazyQuery>;
export type GetCityQueryResult = Apollo.QueryResult<Types.GetCityQuery, Types.GetCityQueryVariables>;
export const GetAllStatesDocument = gql`
    query getAllStates($pagination: PaginationInput!) {
  getStates(pagination: $pagination) {
    id
    name
    abbreviation
  }
}
    `;

/**
 * __useGetAllStatesQuery__
 *
 * To run a query within a React component, call `useGetAllStatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllStatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllStatesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetAllStatesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAllStatesQuery, Types.GetAllStatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAllStatesQuery, Types.GetAllStatesQueryVariables>(GetAllStatesDocument, options);
      }
export function useGetAllStatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAllStatesQuery, Types.GetAllStatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAllStatesQuery, Types.GetAllStatesQueryVariables>(GetAllStatesDocument, options);
        }
export type GetAllStatesQueryHookResult = ReturnType<typeof useGetAllStatesQuery>;
export type GetAllStatesLazyQueryHookResult = ReturnType<typeof useGetAllStatesLazyQuery>;
export type GetAllStatesQueryResult = Apollo.QueryResult<Types.GetAllStatesQuery, Types.GetAllStatesQueryVariables>;
export const RegisterAppleUserDocument = gql`
    mutation RegisterAppleUser($data: CreateAppleUserInput!) {
  registerAppleUser(data: $data) {
    user {
      id
      staff
      firstname
      lastname
      email
    }
    profile {
      id
      profile_avatar
    }
    accessToken
    refreshToken
  }
}
    `;
export type RegisterAppleUserMutationFn = Apollo.MutationFunction<Types.RegisterAppleUserMutation, Types.RegisterAppleUserMutationVariables>;

/**
 * __useRegisterAppleUserMutation__
 *
 * To run a mutation, you first call `useRegisterAppleUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterAppleUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerAppleUserMutation, { data, loading, error }] = useRegisterAppleUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterAppleUserMutation(baseOptions?: Apollo.MutationHookOptions<Types.RegisterAppleUserMutation, Types.RegisterAppleUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RegisterAppleUserMutation, Types.RegisterAppleUserMutationVariables>(RegisterAppleUserDocument, options);
      }
export type RegisterAppleUserMutationHookResult = ReturnType<typeof useRegisterAppleUserMutation>;
export type RegisterAppleUserMutationResult = Apollo.MutationResult<Types.RegisterAppleUserMutation>;
export type RegisterAppleUserMutationOptions = Apollo.BaseMutationOptions<Types.RegisterAppleUserMutation, Types.RegisterAppleUserMutationVariables>;
export const LoginEmailLoginDocument = gql`
    mutation loginEmailLogin($data: LoginUserInput!) {
  login(data: $data) {
    user {
      id
      firstname
      lastname
      email
      profile {
        id
        profile_avatar
      }
      staff
    }
    accessToken
    refreshToken
  }
}
    `;
export type LoginEmailLoginMutationFn = Apollo.MutationFunction<Types.LoginEmailLoginMutation, Types.LoginEmailLoginMutationVariables>;

/**
 * __useLoginEmailLoginMutation__
 *
 * To run a mutation, you first call `useLoginEmailLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginEmailLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginEmailLoginMutation, { data, loading, error }] = useLoginEmailLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginEmailLoginMutation(baseOptions?: Apollo.MutationHookOptions<Types.LoginEmailLoginMutation, Types.LoginEmailLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.LoginEmailLoginMutation, Types.LoginEmailLoginMutationVariables>(LoginEmailLoginDocument, options);
      }
export type LoginEmailLoginMutationHookResult = ReturnType<typeof useLoginEmailLoginMutation>;
export type LoginEmailLoginMutationResult = Apollo.MutationResult<Types.LoginEmailLoginMutation>;
export type LoginEmailLoginMutationOptions = Apollo.BaseMutationOptions<Types.LoginEmailLoginMutation, Types.LoginEmailLoginMutationVariables>;
export const RegisterFacebookUserDocument = gql`
    mutation registerFacebookUser($data: CreateFacebookUserInput!) {
  registerFacebookUser(data: $data) {
    user {
      id
      staff
      firstname
      lastname
      email
    }
    profile {
      id
      profile_avatar
      profile_cover
    }
    accessToken
    refreshToken
  }
}
    `;
export type RegisterFacebookUserMutationFn = Apollo.MutationFunction<Types.RegisterFacebookUserMutation, Types.RegisterFacebookUserMutationVariables>;

/**
 * __useRegisterFacebookUserMutation__
 *
 * To run a mutation, you first call `useRegisterFacebookUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterFacebookUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerFacebookUserMutation, { data, loading, error }] = useRegisterFacebookUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterFacebookUserMutation(baseOptions?: Apollo.MutationHookOptions<Types.RegisterFacebookUserMutation, Types.RegisterFacebookUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RegisterFacebookUserMutation, Types.RegisterFacebookUserMutationVariables>(RegisterFacebookUserDocument, options);
      }
export type RegisterFacebookUserMutationHookResult = ReturnType<typeof useRegisterFacebookUserMutation>;
export type RegisterFacebookUserMutationResult = Apollo.MutationResult<Types.RegisterFacebookUserMutation>;
export type RegisterFacebookUserMutationOptions = Apollo.BaseMutationOptions<Types.RegisterFacebookUserMutation, Types.RegisterFacebookUserMutationVariables>;
export const RegisterGoogleUserDocument = gql`
    mutation RegisterGoogleUser($data: CreateGoogleUserInput!) {
  registerGoogleUser(data: $data) {
    user {
      id
      staff
      firstname
      lastname
      email
    }
    profile {
      id
      profile_avatar
      profile_cover
    }
    accessToken
    refreshToken
  }
}
    `;
export type RegisterGoogleUserMutationFn = Apollo.MutationFunction<Types.RegisterGoogleUserMutation, Types.RegisterGoogleUserMutationVariables>;

/**
 * __useRegisterGoogleUserMutation__
 *
 * To run a mutation, you first call `useRegisterGoogleUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterGoogleUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerGoogleUserMutation, { data, loading, error }] = useRegisterGoogleUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterGoogleUserMutation(baseOptions?: Apollo.MutationHookOptions<Types.RegisterGoogleUserMutation, Types.RegisterGoogleUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.RegisterGoogleUserMutation, Types.RegisterGoogleUserMutationVariables>(RegisterGoogleUserDocument, options);
      }
export type RegisterGoogleUserMutationHookResult = ReturnType<typeof useRegisterGoogleUserMutation>;
export type RegisterGoogleUserMutationResult = Apollo.MutationResult<Types.RegisterGoogleUserMutation>;
export type RegisterGoogleUserMutationOptions = Apollo.BaseMutationOptions<Types.RegisterGoogleUserMutation, Types.RegisterGoogleUserMutationVariables>;
export const BuyProductDocument = gql`
    mutation buyProduct($payment_data: PaymentInput!, $user_data: ChallengeUserDataInput!, $products_chosen: [BuyProductInput!]!) {
  buyProduct(
    payment_data: $payment_data
    user_data: $user_data
    products_chosen: $products_chosen
  ) {
    message
    status
    payment_id
  }
}
    `;
export type BuyProductMutationFn = Apollo.MutationFunction<Types.BuyProductMutation, Types.BuyProductMutationVariables>;

/**
 * __useBuyProductMutation__
 *
 * To run a mutation, you first call `useBuyProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuyProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buyProductMutation, { data, loading, error }] = useBuyProductMutation({
 *   variables: {
 *      payment_data: // value for 'payment_data'
 *      user_data: // value for 'user_data'
 *      products_chosen: // value for 'products_chosen'
 *   },
 * });
 */
export function useBuyProductMutation(baseOptions?: Apollo.MutationHookOptions<Types.BuyProductMutation, Types.BuyProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.BuyProductMutation, Types.BuyProductMutationVariables>(BuyProductDocument, options);
      }
export type BuyProductMutationHookResult = ReturnType<typeof useBuyProductMutation>;
export type BuyProductMutationResult = Apollo.MutationResult<Types.BuyProductMutation>;
export type BuyProductMutationOptions = Apollo.BaseMutationOptions<Types.BuyProductMutation, Types.BuyProductMutationVariables>;
export const CalculateFreightQuoteDocument = gql`
    mutation calculateFreightQuote($data: CreateFreightQuoteInput!) {
  calculateFreightQuote(data: $data) {
    value
  }
}
    `;
export type CalculateFreightQuoteMutationFn = Apollo.MutationFunction<Types.CalculateFreightQuoteMutation, Types.CalculateFreightQuoteMutationVariables>;

/**
 * __useCalculateFreightQuoteMutation__
 *
 * To run a mutation, you first call `useCalculateFreightQuoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCalculateFreightQuoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [calculateFreightQuoteMutation, { data, loading, error }] = useCalculateFreightQuoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCalculateFreightQuoteMutation(baseOptions?: Apollo.MutationHookOptions<Types.CalculateFreightQuoteMutation, Types.CalculateFreightQuoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CalculateFreightQuoteMutation, Types.CalculateFreightQuoteMutationVariables>(CalculateFreightQuoteDocument, options);
      }
export type CalculateFreightQuoteMutationHookResult = ReturnType<typeof useCalculateFreightQuoteMutation>;
export type CalculateFreightQuoteMutationResult = Apollo.MutationResult<Types.CalculateFreightQuoteMutation>;
export type CalculateFreightQuoteMutationOptions = Apollo.BaseMutationOptions<Types.CalculateFreightQuoteMutation, Types.CalculateFreightQuoteMutationVariables>;
export const CalculateInstallmentsDocument = gql`
    query CalculateInstallments($data: InstallmentsInput!) {
  calculateInstallments(data: $data) {
    installments
  }
}
    `;

/**
 * __useCalculateInstallmentsQuery__
 *
 * To run a query within a React component, call `useCalculateInstallmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalculateInstallmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalculateInstallmentsQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCalculateInstallmentsQuery(baseOptions: Apollo.QueryHookOptions<Types.CalculateInstallmentsQuery, Types.CalculateInstallmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.CalculateInstallmentsQuery, Types.CalculateInstallmentsQueryVariables>(CalculateInstallmentsDocument, options);
      }
export function useCalculateInstallmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.CalculateInstallmentsQuery, Types.CalculateInstallmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.CalculateInstallmentsQuery, Types.CalculateInstallmentsQueryVariables>(CalculateInstallmentsDocument, options);
        }
export type CalculateInstallmentsQueryHookResult = ReturnType<typeof useCalculateInstallmentsQuery>;
export type CalculateInstallmentsLazyQueryHookResult = ReturnType<typeof useCalculateInstallmentsLazyQuery>;
export type CalculateInstallmentsQueryResult = Apollo.QueryResult<Types.CalculateInstallmentsQuery, Types.CalculateInstallmentsQueryVariables>;
export const GetPaymentsOfASubscriptionDocument = gql`
    query getPaymentsOfASubscription($data: RetrieveSubscriptionPaymentsInput!) {
  getPaymentsOfASubscription(data: $data) {
    id
    payment_id
    award_id
    payment {
      id
      interest_free_amount
      pix_qrcode
      pix_expiration_date
      created_at
      resource_payment_id
      origin_payment_id
      payment_processor_id
      country_id
      bill_expiration_date
      value
      is_paid
      declined
      returned
      entrance
      processed
      processed
      origin_resource_id
      profile_id
      user_id
      status
      installments
      bill_link
      created_at
      updated_at
      card {
        last_digits
        brand
      }
    }
    award {
      id
      name
      description
      price
      challenge_id
      awardsImages {
        link
      }
    }
  }
}
    `;

/**
 * __useGetPaymentsOfASubscriptionQuery__
 *
 * To run a query within a React component, call `useGetPaymentsOfASubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentsOfASubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentsOfASubscriptionQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetPaymentsOfASubscriptionQuery(baseOptions: Apollo.QueryHookOptions<Types.GetPaymentsOfASubscriptionQuery, Types.GetPaymentsOfASubscriptionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetPaymentsOfASubscriptionQuery, Types.GetPaymentsOfASubscriptionQueryVariables>(GetPaymentsOfASubscriptionDocument, options);
      }
export function useGetPaymentsOfASubscriptionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetPaymentsOfASubscriptionQuery, Types.GetPaymentsOfASubscriptionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetPaymentsOfASubscriptionQuery, Types.GetPaymentsOfASubscriptionQueryVariables>(GetPaymentsOfASubscriptionDocument, options);
        }
export type GetPaymentsOfASubscriptionQueryHookResult = ReturnType<typeof useGetPaymentsOfASubscriptionQuery>;
export type GetPaymentsOfASubscriptionLazyQueryHookResult = ReturnType<typeof useGetPaymentsOfASubscriptionLazyQuery>;
export type GetPaymentsOfASubscriptionQueryResult = Apollo.QueryResult<Types.GetPaymentsOfASubscriptionQuery, Types.GetPaymentsOfASubscriptionQueryVariables>;
export const GetProductsByChallengeIdDocument = gql`
    query getProductsByChallengeId($challenge_id: String!) {
  getProductsByChallengeId(challenge_id: $challenge_id) {
    id
    name
    description
    date_initial
    date_end
    available
    order
    has_cost
    allow_buy_without_subscription
    free_field
    active
    challenge_id
    variations {
      id
      product_id
      text
      description
      available_quantity
      available
      order
      active
      prices {
        value
        date_initial
        active
      }
      images {
        link
        order
        active
      }
    }
  }
}
    `;

/**
 * __useGetProductsByChallengeIdQuery__
 *
 * To run a query within a React component, call `useGetProductsByChallengeIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsByChallengeIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsByChallengeIdQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useGetProductsByChallengeIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProductsByChallengeIdQuery, Types.GetProductsByChallengeIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProductsByChallengeIdQuery, Types.GetProductsByChallengeIdQueryVariables>(GetProductsByChallengeIdDocument, options);
      }
export function useGetProductsByChallengeIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProductsByChallengeIdQuery, Types.GetProductsByChallengeIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProductsByChallengeIdQuery, Types.GetProductsByChallengeIdQueryVariables>(GetProductsByChallengeIdDocument, options);
        }
export type GetProductsByChallengeIdQueryHookResult = ReturnType<typeof useGetProductsByChallengeIdQuery>;
export type GetProductsByChallengeIdLazyQueryHookResult = ReturnType<typeof useGetProductsByChallengeIdLazyQuery>;
export type GetProductsByChallengeIdQueryResult = Apollo.QueryResult<Types.GetProductsByChallengeIdQuery, Types.GetProductsByChallengeIdQueryVariables>;
export const GetChallengeProductsPurchasedDocument = gql`
    query getChallengeProductsPurchased($pagination: PaginationInput!, $data: ListAllChallengeProductsPurchasedInput!) {
  getChallengeProductsPurchased(pagination: $pagination, data: $data) {
    productsPurchased {
      user_challenge_id
      id
      product_id
      value
      free_value
      product_variation_id
      canceled
      user_id
      user_challenge_id
      quantity
      variation {
        id
        text
      }
      product {
        name
        images {
          link
        }
      }
      created_at
      user {
        id
        name
        firstname
        lastname
        email
        gender
        stature
        weight
        phone
        date_of_birth
        legal_registry_number
        phone
        team_name
      }
      subscription {
        id
        created_at
        challenge_id
        user_id
        challenge_category_id
        short_id
        registration_date
        end_date
        classification
        total_time
        total_distance
        total_altimetry
        total_friends
        total_rides
        drawn
        completed
        paid
        start_time_first_activity
        amount_paid
        amount_to_pay
        amount_freight
        payment_id
        last_payment_id
        challenge_withdrawal_address_id
        withdrawal_date
        ready_to_withdraw
        user_marked_withdrawn
        bonus_subscription
        total_time_seconds
        athlete_identification
        created_at
        updated_at
        subscription_status {
          id
          user_challenge_id
          subscription_status_id
          status_description {
            id
            code
            name
            description
            translations {
              language_code
              name
              description
            }
          }
        }
        last_payment {
          ...PaymentFragment
        }
      }
      created_at
      updated_at
      related_payment {
        payment {
          ...PaymentFragment
        }
      }
    }
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
  }
}
    ${PaymentFragmentFragmentDoc}`;

/**
 * __useGetChallengeProductsPurchasedQuery__
 *
 * To run a query within a React component, call `useGetChallengeProductsPurchasedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeProductsPurchasedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeProductsPurchasedQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetChallengeProductsPurchasedQuery(baseOptions: Apollo.QueryHookOptions<Types.GetChallengeProductsPurchasedQuery, Types.GetChallengeProductsPurchasedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetChallengeProductsPurchasedQuery, Types.GetChallengeProductsPurchasedQueryVariables>(GetChallengeProductsPurchasedDocument, options);
      }
export function useGetChallengeProductsPurchasedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetChallengeProductsPurchasedQuery, Types.GetChallengeProductsPurchasedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetChallengeProductsPurchasedQuery, Types.GetChallengeProductsPurchasedQueryVariables>(GetChallengeProductsPurchasedDocument, options);
        }
export type GetChallengeProductsPurchasedQueryHookResult = ReturnType<typeof useGetChallengeProductsPurchasedQuery>;
export type GetChallengeProductsPurchasedLazyQueryHookResult = ReturnType<typeof useGetChallengeProductsPurchasedLazyQuery>;
export type GetChallengeProductsPurchasedQueryResult = Apollo.QueryResult<Types.GetChallengeProductsPurchasedQuery, Types.GetChallengeProductsPurchasedQueryVariables>;
export const GetProductsAcquiredDocument = gql`
    query getProductsAcquired($data: GetProductsAcquiredInput!) {
  getProductsAcquired(data: $data) {
    id
    product_id
    value
    free_value
    product_variation_id
    canceled
    quantity
    related_payment {
      payment {
        id
        created_at
        resource_payment_id
        origin_payment_id
        payment_processor_id
        country_id
        bill_expiration_date
        value
        is_paid
        declined
        returned
        entrance
        processed
        profile_id
        user_id
        bill_barcode
        bill_link
        status
        created_at
        updated_at
        humanized_message
        installments
        card {
          last_digits
          brand
        }
      }
    }
    product {
      name
      description
    }
    variation {
      id
      text
      description
      images {
        id
        link
        order
      }
    }
  }
}
    `;

/**
 * __useGetProductsAcquiredQuery__
 *
 * To run a query within a React component, call `useGetProductsAcquiredQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsAcquiredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsAcquiredQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetProductsAcquiredQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProductsAcquiredQuery, Types.GetProductsAcquiredQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProductsAcquiredQuery, Types.GetProductsAcquiredQueryVariables>(GetProductsAcquiredDocument, options);
      }
export function useGetProductsAcquiredLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProductsAcquiredQuery, Types.GetProductsAcquiredQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProductsAcquiredQuery, Types.GetProductsAcquiredQueryVariables>(GetProductsAcquiredDocument, options);
        }
export type GetProductsAcquiredQueryHookResult = ReturnType<typeof useGetProductsAcquiredQuery>;
export type GetProductsAcquiredLazyQueryHookResult = ReturnType<typeof useGetProductsAcquiredLazyQuery>;
export type GetProductsAcquiredQueryResult = Apollo.QueryResult<Types.GetProductsAcquiredQuery, Types.GetProductsAcquiredQueryVariables>;
export const ChangeHealthConnectionsDocument = gql`
    mutation changeHealthConnections($data: ChangeHealthConnectionsInput!) {
  changeHealthConnections(data: $data) {
    _id
    user_id
    integrated_with_google_fit
    integrated_with_apple_health
    integrated_with_garmin
    integrated_with_polar
    has_company
    last_upload_google_fit
    last_upload_apple_health
  }
}
    `;
export type ChangeHealthConnectionsMutationFn = Apollo.MutationFunction<Types.ChangeHealthConnectionsMutation, Types.ChangeHealthConnectionsMutationVariables>;

/**
 * __useChangeHealthConnectionsMutation__
 *
 * To run a mutation, you first call `useChangeHealthConnectionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeHealthConnectionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeHealthConnectionsMutation, { data, loading, error }] = useChangeHealthConnectionsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeHealthConnectionsMutation(baseOptions?: Apollo.MutationHookOptions<Types.ChangeHealthConnectionsMutation, Types.ChangeHealthConnectionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.ChangeHealthConnectionsMutation, Types.ChangeHealthConnectionsMutationVariables>(ChangeHealthConnectionsDocument, options);
      }
export type ChangeHealthConnectionsMutationHookResult = ReturnType<typeof useChangeHealthConnectionsMutation>;
export type ChangeHealthConnectionsMutationResult = Apollo.MutationResult<Types.ChangeHealthConnectionsMutation>;
export type ChangeHealthConnectionsMutationOptions = Apollo.BaseMutationOptions<Types.ChangeHealthConnectionsMutation, Types.ChangeHealthConnectionsMutationVariables>;
export const UserCompaniesDocument = gql`
    query userCompanies {
  userCompanies {
    id
    fantasy_name
    site
    profile {
      id
      profile_avatar
      profile_cover
    }
  }
}
    `;

/**
 * __useUserCompaniesQuery__
 *
 * To run a query within a React component, call `useUserCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserCompaniesQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserCompaniesQuery(baseOptions?: Apollo.QueryHookOptions<Types.UserCompaniesQuery, Types.UserCompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.UserCompaniesQuery, Types.UserCompaniesQueryVariables>(UserCompaniesDocument, options);
      }
export function useUserCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.UserCompaniesQuery, Types.UserCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.UserCompaniesQuery, Types.UserCompaniesQueryVariables>(UserCompaniesDocument, options);
        }
export type UserCompaniesQueryHookResult = ReturnType<typeof useUserCompaniesQuery>;
export type UserCompaniesLazyQueryHookResult = ReturnType<typeof useUserCompaniesLazyQuery>;
export type UserCompaniesQueryResult = Apollo.QueryResult<Types.UserCompaniesQuery, Types.UserCompaniesQueryVariables>;
export const CreateActivityV2Document = gql`
    mutation createActivityV2($activities_data: [CreateActivityInput!]!) {
  createActivityV2(activities_data: $activities_data) {
    status
    message
  }
}
    `;
export type CreateActivityV2MutationFn = Apollo.MutationFunction<Types.CreateActivityV2Mutation, Types.CreateActivityV2MutationVariables>;

/**
 * __useCreateActivityV2Mutation__
 *
 * To run a mutation, you first call `useCreateActivityV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateActivityV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createActivityV2Mutation, { data, loading, error }] = useCreateActivityV2Mutation({
 *   variables: {
 *      activities_data: // value for 'activities_data'
 *   },
 * });
 */
export function useCreateActivityV2Mutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateActivityV2Mutation, Types.CreateActivityV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateActivityV2Mutation, Types.CreateActivityV2MutationVariables>(CreateActivityV2Document, options);
      }
export type CreateActivityV2MutationHookResult = ReturnType<typeof useCreateActivityV2Mutation>;
export type CreateActivityV2MutationResult = Apollo.MutationResult<Types.CreateActivityV2Mutation>;
export type CreateActivityV2MutationOptions = Apollo.BaseMutationOptions<Types.CreateActivityV2Mutation, Types.CreateActivityV2MutationVariables>;
export const CreateActivityFromCrawlerDocument = gql`
    mutation CreateActivityFromCrawler($activityKey: String!) {
  createActivityFromCrawler(activityKey: $activityKey) {
    status
    message
  }
}
    `;
export type CreateActivityFromCrawlerMutationFn = Apollo.MutationFunction<Types.CreateActivityFromCrawlerMutation, Types.CreateActivityFromCrawlerMutationVariables>;

/**
 * __useCreateActivityFromCrawlerMutation__
 *
 * To run a mutation, you first call `useCreateActivityFromCrawlerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateActivityFromCrawlerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createActivityFromCrawlerMutation, { data, loading, error }] = useCreateActivityFromCrawlerMutation({
 *   variables: {
 *      activityKey: // value for 'activityKey'
 *   },
 * });
 */
export function useCreateActivityFromCrawlerMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateActivityFromCrawlerMutation, Types.CreateActivityFromCrawlerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateActivityFromCrawlerMutation, Types.CreateActivityFromCrawlerMutationVariables>(CreateActivityFromCrawlerDocument, options);
      }
export type CreateActivityFromCrawlerMutationHookResult = ReturnType<typeof useCreateActivityFromCrawlerMutation>;
export type CreateActivityFromCrawlerMutationResult = Apollo.MutationResult<Types.CreateActivityFromCrawlerMutation>;
export type CreateActivityFromCrawlerMutationOptions = Apollo.BaseMutationOptions<Types.CreateActivityFromCrawlerMutation, Types.CreateActivityFromCrawlerMutationVariables>;
export const CreateCardDocument = gql`
    mutation createCard($data: CreateCardInput!) {
  createCard(data: $data) {
    id
    name
    brand
    last_digits
    external_id
    brand
    holder_name
    first_digits
    valid
    expiration_date
    main
    legal_holder_number
  }
}
    `;
export type CreateCardMutationFn = Apollo.MutationFunction<Types.CreateCardMutation, Types.CreateCardMutationVariables>;

/**
 * __useCreateCardMutation__
 *
 * To run a mutation, you first call `useCreateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardMutation, { data, loading, error }] = useCreateCardMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCardMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateCardMutation, Types.CreateCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateCardMutation, Types.CreateCardMutationVariables>(CreateCardDocument, options);
      }
export type CreateCardMutationHookResult = ReturnType<typeof useCreateCardMutation>;
export type CreateCardMutationResult = Apollo.MutationResult<Types.CreateCardMutation>;
export type CreateCardMutationOptions = Apollo.BaseMutationOptions<Types.CreateCardMutation, Types.CreateCardMutationVariables>;
export const DeleteCardDocument = gql`
    mutation deleteCard($id: String!) {
  deleteCard(id: $id)
}
    `;
export type DeleteCardMutationFn = Apollo.MutationFunction<Types.DeleteCardMutation, Types.DeleteCardMutationVariables>;

/**
 * __useDeleteCardMutation__
 *
 * To run a mutation, you first call `useDeleteCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCardMutation, { data, loading, error }] = useDeleteCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCardMutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteCardMutation, Types.DeleteCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteCardMutation, Types.DeleteCardMutationVariables>(DeleteCardDocument, options);
      }
export type DeleteCardMutationHookResult = ReturnType<typeof useDeleteCardMutation>;
export type DeleteCardMutationResult = Apollo.MutationResult<Types.DeleteCardMutation>;
export type DeleteCardMutationOptions = Apollo.BaseMutationOptions<Types.DeleteCardMutation, Types.DeleteCardMutationVariables>;
export const DisconnectGarminDocument = gql`
    mutation disconnectGarmin($data: DisconnectThirdPartyProviderInput!) {
  disconnectGarmin(data: $data)
}
    `;
export type DisconnectGarminMutationFn = Apollo.MutationFunction<Types.DisconnectGarminMutation, Types.DisconnectGarminMutationVariables>;

/**
 * __useDisconnectGarminMutation__
 *
 * To run a mutation, you first call `useDisconnectGarminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisconnectGarminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disconnectGarminMutation, { data, loading, error }] = useDisconnectGarminMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDisconnectGarminMutation(baseOptions?: Apollo.MutationHookOptions<Types.DisconnectGarminMutation, Types.DisconnectGarminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DisconnectGarminMutation, Types.DisconnectGarminMutationVariables>(DisconnectGarminDocument, options);
      }
export type DisconnectGarminMutationHookResult = ReturnType<typeof useDisconnectGarminMutation>;
export type DisconnectGarminMutationResult = Apollo.MutationResult<Types.DisconnectGarminMutation>;
export type DisconnectGarminMutationOptions = Apollo.BaseMutationOptions<Types.DisconnectGarminMutation, Types.DisconnectGarminMutationVariables>;
export const DisconnectPolarDocument = gql`
    mutation DisconnectPolar($data: DisconnectThirdPartyProviderInput!) {
  disconnectPolar(data: $data)
}
    `;
export type DisconnectPolarMutationFn = Apollo.MutationFunction<Types.DisconnectPolarMutation, Types.DisconnectPolarMutationVariables>;

/**
 * __useDisconnectPolarMutation__
 *
 * To run a mutation, you first call `useDisconnectPolarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisconnectPolarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disconnectPolarMutation, { data, loading, error }] = useDisconnectPolarMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDisconnectPolarMutation(baseOptions?: Apollo.MutationHookOptions<Types.DisconnectPolarMutation, Types.DisconnectPolarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DisconnectPolarMutation, Types.DisconnectPolarMutationVariables>(DisconnectPolarDocument, options);
      }
export type DisconnectPolarMutationHookResult = ReturnType<typeof useDisconnectPolarMutation>;
export type DisconnectPolarMutationResult = Apollo.MutationResult<Types.DisconnectPolarMutation>;
export type DisconnectPolarMutationOptions = Apollo.BaseMutationOptions<Types.DisconnectPolarMutation, Types.DisconnectPolarMutationVariables>;
export const FindPaymentDocument = gql`
    query findPayment($id: String!) {
  findPayment(id: $id) {
    id
    resource_payment_id
    origin_payment_id
    payment_processor_id
    country_id
    bill_expiration_date
    value
    is_paid
    declined
    returned
    entrance
    processed
    profile_id
    user_id
    bill_barcode
    bill_link
    status
    created_at
    updated_at
    humanized_message
    installments
    pix_qrcode
    pix_expiration_date
    card {
      last_digits
      brand
    }
  }
}
    `;

/**
 * __useFindPaymentQuery__
 *
 * To run a query within a React component, call `useFindPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFindPaymentQuery(baseOptions: Apollo.QueryHookOptions<Types.FindPaymentQuery, Types.FindPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.FindPaymentQuery, Types.FindPaymentQueryVariables>(FindPaymentDocument, options);
      }
export function useFindPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.FindPaymentQuery, Types.FindPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.FindPaymentQuery, Types.FindPaymentQueryVariables>(FindPaymentDocument, options);
        }
export type FindPaymentQueryHookResult = ReturnType<typeof useFindPaymentQuery>;
export type FindPaymentLazyQueryHookResult = ReturnType<typeof useFindPaymentLazyQuery>;
export type FindPaymentQueryResult = Apollo.QueryResult<Types.FindPaymentQuery, Types.FindPaymentQueryVariables>;
export const FollowProfileDocument = gql`
    mutation FollowProfile($data: FollowProfileInput!) {
  followProfile(data: $data) {
    _id
  }
}
    `;
export type FollowProfileMutationFn = Apollo.MutationFunction<Types.FollowProfileMutation, Types.FollowProfileMutationVariables>;

/**
 * __useFollowProfileMutation__
 *
 * To run a mutation, you first call `useFollowProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followProfileMutation, { data, loading, error }] = useFollowProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useFollowProfileMutation(baseOptions?: Apollo.MutationHookOptions<Types.FollowProfileMutation, Types.FollowProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.FollowProfileMutation, Types.FollowProfileMutationVariables>(FollowProfileDocument, options);
      }
export type FollowProfileMutationHookResult = ReturnType<typeof useFollowProfileMutation>;
export type FollowProfileMutationResult = Apollo.MutationResult<Types.FollowProfileMutation>;
export type FollowProfileMutationOptions = Apollo.BaseMutationOptions<Types.FollowProfileMutation, Types.FollowProfileMutationVariables>;
export const GetAwardSubscriptionPaymentDocument = gql`
    query getAwardSubscriptionPayment($data: GetAwardSubscriptionInput!) {
  getAwardSubscriptionPayment(data: $data) {
    award_id
    award {
      id
      name
      description
      price
      awardsImages {
        id
        link
      }
      challenge_award_additional_requests {
        additional_request {
          id
          request
          image_reference
          has_cost
          price_request
        }
        possible_request_response {
          id
          response
          image_reference
          price
        }
      }
    }
  }
}
    `;

/**
 * __useGetAwardSubscriptionPaymentQuery__
 *
 * To run a query within a React component, call `useGetAwardSubscriptionPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAwardSubscriptionPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAwardSubscriptionPaymentQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetAwardSubscriptionPaymentQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAwardSubscriptionPaymentQuery, Types.GetAwardSubscriptionPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAwardSubscriptionPaymentQuery, Types.GetAwardSubscriptionPaymentQueryVariables>(GetAwardSubscriptionPaymentDocument, options);
      }
export function useGetAwardSubscriptionPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAwardSubscriptionPaymentQuery, Types.GetAwardSubscriptionPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAwardSubscriptionPaymentQuery, Types.GetAwardSubscriptionPaymentQueryVariables>(GetAwardSubscriptionPaymentDocument, options);
        }
export type GetAwardSubscriptionPaymentQueryHookResult = ReturnType<typeof useGetAwardSubscriptionPaymentQuery>;
export type GetAwardSubscriptionPaymentLazyQueryHookResult = ReturnType<typeof useGetAwardSubscriptionPaymentLazyQuery>;
export type GetAwardSubscriptionPaymentQueryResult = Apollo.QueryResult<Types.GetAwardSubscriptionPaymentQuery, Types.GetAwardSubscriptionPaymentQueryVariables>;
export const GetCardsDocument = gql`
    query getCards($pagination: PaginationInput!, $user_id: String!) {
  getCards(pagination: $pagination, user_id: $user_id) {
    id
    name
    brand
    last_digits
    external_id
    brand
    holder_name
    first_digits
    valid
    expiration_date
    main
    legal_holder_number
  }
}
    `;

/**
 * __useGetCardsQuery__
 *
 * To run a query within a React component, call `useGetCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCardsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useGetCardsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetCardsQuery, Types.GetCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetCardsQuery, Types.GetCardsQueryVariables>(GetCardsDocument, options);
      }
export function useGetCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetCardsQuery, Types.GetCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetCardsQuery, Types.GetCardsQueryVariables>(GetCardsDocument, options);
        }
export type GetCardsQueryHookResult = ReturnType<typeof useGetCardsQuery>;
export type GetCardsLazyQueryHookResult = ReturnType<typeof useGetCardsLazyQuery>;
export type GetCardsQueryResult = Apollo.QueryResult<Types.GetCardsQuery, Types.GetCardsQueryVariables>;
export const GetCompaniesDocument = gql`
    query getCompanies($pagination: PaginationInput!, $search_text: String!) {
  getCompanies(pagination: $pagination, search_text: $search_text) {
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
    companies {
      id
    }
  }
}
    `;

/**
 * __useGetCompaniesQuery__
 *
 * To run a query within a React component, call `useGetCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      search_text: // value for 'search_text'
 *   },
 * });
 */
export function useGetCompaniesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetCompaniesQuery, Types.GetCompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetCompaniesQuery, Types.GetCompaniesQueryVariables>(GetCompaniesDocument, options);
      }
export function useGetCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetCompaniesQuery, Types.GetCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetCompaniesQuery, Types.GetCompaniesQueryVariables>(GetCompaniesDocument, options);
        }
export type GetCompaniesQueryHookResult = ReturnType<typeof useGetCompaniesQuery>;
export type GetCompaniesLazyQueryHookResult = ReturnType<typeof useGetCompaniesLazyQuery>;
export type GetCompaniesQueryResult = Apollo.QueryResult<Types.GetCompaniesQuery, Types.GetCompaniesQueryVariables>;
export const GetProfileDocument = gql`
    query getProfile($data: GetProfileDetailInput!) {
  getProfile(data: $data) {
    id
    user_id
    username
    followers_count
    following_count
    official
    profile_avatar
    profile_cover
    description
    is_follower
    user {
      phone
      street_number
      id
      email
      staff
      city {
        id
        name
        state {
          abbreviation
          id
        }
      }
      count_challenges_participates
      last_challenge {
        name
      }
      activities_count
      firstname
      lastname
      gender
      stature
      date_of_birth
      weight
      address_line_one
      address_line_two
      legal_registry_number
      zip_code
      has_social_login
      blacklist
      team_name
    }
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProfileQuery, Types.GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProfileQuery, Types.GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProfileQuery, Types.GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProfileQuery, Types.GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<Types.GetProfileQuery, Types.GetProfileQueryVariables>;
export const GetSubscriptionActivitiesDocument = gql`
    query GetSubscriptionActivities($data: RetrieveSubscriptionActivitiesInput!) {
  getSubscriptionActivities(data: $data) {
    activity_id
    activity {
      id
      name
      distance
      total_elevation_gain
      start_date_local
      start_date
      suspicious
      start_date_local
      duplicated
      moving_time_seconds
      elapsed_time_seconds
      third_party_data_source_slug
    }
  }
}
    `;

/**
 * __useGetSubscriptionActivitiesQuery__
 *
 * To run a query within a React component, call `useGetSubscriptionActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubscriptionActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubscriptionActivitiesQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetSubscriptionActivitiesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetSubscriptionActivitiesQuery, Types.GetSubscriptionActivitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetSubscriptionActivitiesQuery, Types.GetSubscriptionActivitiesQueryVariables>(GetSubscriptionActivitiesDocument, options);
      }
export function useGetSubscriptionActivitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetSubscriptionActivitiesQuery, Types.GetSubscriptionActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetSubscriptionActivitiesQuery, Types.GetSubscriptionActivitiesQueryVariables>(GetSubscriptionActivitiesDocument, options);
        }
export type GetSubscriptionActivitiesQueryHookResult = ReturnType<typeof useGetSubscriptionActivitiesQuery>;
export type GetSubscriptionActivitiesLazyQueryHookResult = ReturnType<typeof useGetSubscriptionActivitiesLazyQuery>;
export type GetSubscriptionActivitiesQueryResult = Apollo.QueryResult<Types.GetSubscriptionActivitiesQuery, Types.GetSubscriptionActivitiesQueryVariables>;
export const GetUserActivitiesV2Document = gql`
    query getUserActivitiesV2($pagination: PaginationInput!) {
  getUserActivitiesV2(pagination: $pagination) {
    activities {
      id
      name
      distance
      total_elevation_gain
      start_date_local
      suspicious
      start_date_local
      duplicated
      moving_time_seconds
      elapsed_time_seconds
      third_party_data_source_slug
      bounds
      summary_polyline
      min_bounds
      max_bounds
      thumbnail
      processing
    }
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
  }
}
    `;

/**
 * __useGetUserActivitiesV2Query__
 *
 * To run a query within a React component, call `useGetUserActivitiesV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetUserActivitiesV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserActivitiesV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetUserActivitiesV2Query(baseOptions: Apollo.QueryHookOptions<Types.GetUserActivitiesV2Query, Types.GetUserActivitiesV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetUserActivitiesV2Query, Types.GetUserActivitiesV2QueryVariables>(GetUserActivitiesV2Document, options);
      }
export function useGetUserActivitiesV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetUserActivitiesV2Query, Types.GetUserActivitiesV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetUserActivitiesV2Query, Types.GetUserActivitiesV2QueryVariables>(GetUserActivitiesV2Document, options);
        }
export type GetUserActivitiesV2QueryHookResult = ReturnType<typeof useGetUserActivitiesV2Query>;
export type GetUserActivitiesV2LazyQueryHookResult = ReturnType<typeof useGetUserActivitiesV2LazyQuery>;
export type GetUserActivitiesV2QueryResult = Apollo.QueryResult<Types.GetUserActivitiesV2Query, Types.GetUserActivitiesV2QueryVariables>;
export const GetUserChallengeActivitiesDocument = gql`
    query GetUserChallengeActivities($challenge_id: String!) {
  getUserChallengeActivities(challenge_id: $challenge_id) {
    activity_id
    activity {
      id
      name
      distance
      total_elevation_gain
      start_date_local
      start_date
      suspicious
      start_date_local
      duplicated
      moving_time_seconds
      elapsed_time_seconds
      third_party_data_source_slug
    }
  }
}
    `;

/**
 * __useGetUserChallengeActivitiesQuery__
 *
 * To run a query within a React component, call `useGetUserChallengeActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserChallengeActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserChallengeActivitiesQuery({
 *   variables: {
 *      challenge_id: // value for 'challenge_id'
 *   },
 * });
 */
export function useGetUserChallengeActivitiesQuery(baseOptions: Apollo.QueryHookOptions<Types.GetUserChallengeActivitiesQuery, Types.GetUserChallengeActivitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetUserChallengeActivitiesQuery, Types.GetUserChallengeActivitiesQueryVariables>(GetUserChallengeActivitiesDocument, options);
      }
export function useGetUserChallengeActivitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetUserChallengeActivitiesQuery, Types.GetUserChallengeActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetUserChallengeActivitiesQuery, Types.GetUserChallengeActivitiesQueryVariables>(GetUserChallengeActivitiesDocument, options);
        }
export type GetUserChallengeActivitiesQueryHookResult = ReturnType<typeof useGetUserChallengeActivitiesQuery>;
export type GetUserChallengeActivitiesLazyQueryHookResult = ReturnType<typeof useGetUserChallengeActivitiesLazyQuery>;
export type GetUserChallengeActivitiesQueryResult = Apollo.QueryResult<Types.GetUserChallengeActivitiesQuery, Types.GetUserChallengeActivitiesQueryVariables>;
export const GetUserDataCompiledDocument = gql`
    query GetUserDataCompiled {
  getUserDataCompiled {
    data_compiled {
      _id
      user_id
      integrated_with_apple_health
      integrated_with_google_fit
      integrated_with_garmin
      integrated_with_polar
      has_company
      last_upload_google_fit
      last_upload_apple_health
      last_upload_polar
      last_upload_garmin
      view_welcome_screen
      integrated_with_strava
    }
    third_party_data {
      id_data_source
      third_party_data_source {
        slug
      }
    }
  }
}
    `;

/**
 * __useGetUserDataCompiledQuery__
 *
 * To run a query within a React component, call `useGetUserDataCompiledQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataCompiledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataCompiledQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserDataCompiledQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetUserDataCompiledQuery, Types.GetUserDataCompiledQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetUserDataCompiledQuery, Types.GetUserDataCompiledQueryVariables>(GetUserDataCompiledDocument, options);
      }
export function useGetUserDataCompiledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetUserDataCompiledQuery, Types.GetUserDataCompiledQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetUserDataCompiledQuery, Types.GetUserDataCompiledQueryVariables>(GetUserDataCompiledDocument, options);
        }
export type GetUserDataCompiledQueryHookResult = ReturnType<typeof useGetUserDataCompiledQuery>;
export type GetUserDataCompiledLazyQueryHookResult = ReturnType<typeof useGetUserDataCompiledLazyQuery>;
export type GetUserDataCompiledQueryResult = Apollo.QueryResult<Types.GetUserDataCompiledQuery, Types.GetUserDataCompiledQueryVariables>;
export const GetUserDataFromCrawledActivityDocument = gql`
    query GetUserDataFromCrawledActivity($url: String!) {
  getUserDataFromCrawledActivity(url: $url) {
    name
    avatar
    type
    distance
    time
    elevation
    date
    address
    person_name
    key
  }
}
    `;

/**
 * __useGetUserDataFromCrawledActivityQuery__
 *
 * To run a query within a React component, call `useGetUserDataFromCrawledActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataFromCrawledActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataFromCrawledActivityQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useGetUserDataFromCrawledActivityQuery(baseOptions: Apollo.QueryHookOptions<Types.GetUserDataFromCrawledActivityQuery, Types.GetUserDataFromCrawledActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetUserDataFromCrawledActivityQuery, Types.GetUserDataFromCrawledActivityQueryVariables>(GetUserDataFromCrawledActivityDocument, options);
      }
export function useGetUserDataFromCrawledActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetUserDataFromCrawledActivityQuery, Types.GetUserDataFromCrawledActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetUserDataFromCrawledActivityQuery, Types.GetUserDataFromCrawledActivityQueryVariables>(GetUserDataFromCrawledActivityDocument, options);
        }
export type GetUserDataFromCrawledActivityQueryHookResult = ReturnType<typeof useGetUserDataFromCrawledActivityQuery>;
export type GetUserDataFromCrawledActivityLazyQueryHookResult = ReturnType<typeof useGetUserDataFromCrawledActivityLazyQuery>;
export type GetUserDataFromCrawledActivityQueryResult = Apollo.QueryResult<Types.GetUserDataFromCrawledActivityQuery, Types.GetUserDataFromCrawledActivityQueryVariables>;
export const GetUserNotificationsDocument = gql`
    query GetUserNotifications($pagination: PaginationInput!, $data: ListUserNotificationsInput!) {
  getUserNotifications(data: $data, pagination: $pagination) {
    date
    unread_notifications_count
    notifications {
      _id
      recipient_id
      notification_content
      sender_username
      sender_profile_avatar
      read
      deep_linking
      media_url
      created_at
    }
  }
}
    `;

/**
 * __useGetUserNotificationsQuery__
 *
 * To run a query within a React component, call `useGetUserNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNotificationsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetUserNotificationsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetUserNotificationsQuery, Types.GetUserNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetUserNotificationsQuery, Types.GetUserNotificationsQueryVariables>(GetUserNotificationsDocument, options);
      }
export function useGetUserNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetUserNotificationsQuery, Types.GetUserNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetUserNotificationsQuery, Types.GetUserNotificationsQueryVariables>(GetUserNotificationsDocument, options);
        }
export type GetUserNotificationsQueryHookResult = ReturnType<typeof useGetUserNotificationsQuery>;
export type GetUserNotificationsLazyQueryHookResult = ReturnType<typeof useGetUserNotificationsLazyQuery>;
export type GetUserNotificationsQueryResult = Apollo.QueryResult<Types.GetUserNotificationsQuery, Types.GetUserNotificationsQueryVariables>;
export const MarkNotificationsAsReadDocument = gql`
    mutation markNotificationsAsRead($data: ListUserNotificationsInput!) {
  markNotificationsAsRead(data: $data) {
    push_title
    read
  }
}
    `;
export type MarkNotificationsAsReadMutationFn = Apollo.MutationFunction<Types.MarkNotificationsAsReadMutation, Types.MarkNotificationsAsReadMutationVariables>;

/**
 * __useMarkNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationsAsReadMutation, { data, loading, error }] = useMarkNotificationsAsReadMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMarkNotificationsAsReadMutation(baseOptions?: Apollo.MutationHookOptions<Types.MarkNotificationsAsReadMutation, Types.MarkNotificationsAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.MarkNotificationsAsReadMutation, Types.MarkNotificationsAsReadMutationVariables>(MarkNotificationsAsReadDocument, options);
      }
export type MarkNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkNotificationsAsReadMutation>;
export type MarkNotificationsAsReadMutationResult = Apollo.MutationResult<Types.MarkNotificationsAsReadMutation>;
export type MarkNotificationsAsReadMutationOptions = Apollo.BaseMutationOptions<Types.MarkNotificationsAsReadMutation, Types.MarkNotificationsAsReadMutationVariables>;
export const ReattemptSubscriptionPaymentDocument = gql`
    mutation reattemptSubscriptionPayment($award_data: ChallengePaymentInput!, $payment_data: PaymentInput!) {
  reattemptSubscriptionPayment(
    award_data: $award_data
    payment_data: $payment_data
  ) {
    title
    message
    payment_id
  }
}
    `;
export type ReattemptSubscriptionPaymentMutationFn = Apollo.MutationFunction<Types.ReattemptSubscriptionPaymentMutation, Types.ReattemptSubscriptionPaymentMutationVariables>;

/**
 * __useReattemptSubscriptionPaymentMutation__
 *
 * To run a mutation, you first call `useReattemptSubscriptionPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReattemptSubscriptionPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reattemptSubscriptionPaymentMutation, { data, loading, error }] = useReattemptSubscriptionPaymentMutation({
 *   variables: {
 *      award_data: // value for 'award_data'
 *      payment_data: // value for 'payment_data'
 *   },
 * });
 */
export function useReattemptSubscriptionPaymentMutation(baseOptions?: Apollo.MutationHookOptions<Types.ReattemptSubscriptionPaymentMutation, Types.ReattemptSubscriptionPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.ReattemptSubscriptionPaymentMutation, Types.ReattemptSubscriptionPaymentMutationVariables>(ReattemptSubscriptionPaymentDocument, options);
      }
export type ReattemptSubscriptionPaymentMutationHookResult = ReturnType<typeof useReattemptSubscriptionPaymentMutation>;
export type ReattemptSubscriptionPaymentMutationResult = Apollo.MutationResult<Types.ReattemptSubscriptionPaymentMutation>;
export type ReattemptSubscriptionPaymentMutationOptions = Apollo.BaseMutationOptions<Types.ReattemptSubscriptionPaymentMutation, Types.ReattemptSubscriptionPaymentMutationVariables>;
export const SearchUsersDocument = gql`
    query SearchUsers($pagination: PaginationInput!, $search_text: String!) {
  searchUsers(pagination: $pagination, search_text: $search_text) {
    users {
      id
      firstname
      lastname
      email
      gender
      stature
      weight
      phone
      date_of_birth
      has_social_login
      city_id
      city {
        id
        name
        slug
        status
        id_locale
        state {
          abbreviation
        }
      }
      active
      address_line_one
      address_line_two
      street_number
      legal_registry_number
      zip_code
      strava_permission_activities
      staff
      blacklist
      team_name
      created_at
      updated_at
      profile {
        id
        username
        followers_count
        following_count
        official
        profile_avatar
        profile_cover
        description
        user_id
        is_follower
      }
      count_challenges_participates
      activities_count
    }
    page_info {
      current_page
      offset
      total_item_count
      has_next_page
      has_previous_page
    }
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      search_text: // value for 'search_text'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<Types.SearchUsersQuery, Types.SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.SearchUsersQuery, Types.SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.SearchUsersQuery, Types.SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.SearchUsersQuery, Types.SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<Types.SearchUsersQuery, Types.SearchUsersQueryVariables>;
export const SendMailDocument = gql`
    mutation sendMail($data: SendEmailInput!) {
  sendMail(data: $data)
}
    `;
export type SendMailMutationFn = Apollo.MutationFunction<Types.SendMailMutation, Types.SendMailMutationVariables>;

/**
 * __useSendMailMutation__
 *
 * To run a mutation, you first call `useSendMailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMailMutation, { data, loading, error }] = useSendMailMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSendMailMutation(baseOptions?: Apollo.MutationHookOptions<Types.SendMailMutation, Types.SendMailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.SendMailMutation, Types.SendMailMutationVariables>(SendMailDocument, options);
      }
export type SendMailMutationHookResult = ReturnType<typeof useSendMailMutation>;
export type SendMailMutationResult = Apollo.MutationResult<Types.SendMailMutation>;
export type SendMailMutationOptions = Apollo.BaseMutationOptions<Types.SendMailMutation, Types.SendMailMutationVariables>;
export const UnfollowProfileDocument = gql`
    mutation unfollowProfile($data: FollowProfileInput!) {
  unfollowProfile(data: $data)
}
    `;
export type UnfollowProfileMutationFn = Apollo.MutationFunction<Types.UnfollowProfileMutation, Types.UnfollowProfileMutationVariables>;

/**
 * __useUnfollowProfileMutation__
 *
 * To run a mutation, you first call `useUnfollowProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowProfileMutation, { data, loading, error }] = useUnfollowProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUnfollowProfileMutation(baseOptions?: Apollo.MutationHookOptions<Types.UnfollowProfileMutation, Types.UnfollowProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UnfollowProfileMutation, Types.UnfollowProfileMutationVariables>(UnfollowProfileDocument, options);
      }
export type UnfollowProfileMutationHookResult = ReturnType<typeof useUnfollowProfileMutation>;
export type UnfollowProfileMutationResult = Apollo.MutationResult<Types.UnfollowProfileMutation>;
export type UnfollowProfileMutationOptions = Apollo.BaseMutationOptions<Types.UnfollowProfileMutation, Types.UnfollowProfileMutationVariables>;
export const UpdateCardDocument = gql`
    mutation UpdateCard($data: UpdateCardInput!, $id: String!) {
  updateCard(data: $data, id: $id) {
    id
    name
  }
}
    `;
export type UpdateCardMutationFn = Apollo.MutationFunction<Types.UpdateCardMutation, Types.UpdateCardMutationVariables>;

/**
 * __useUpdateCardMutation__
 *
 * To run a mutation, you first call `useUpdateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardMutation, { data, loading, error }] = useUpdateCardMutation({
 *   variables: {
 *      data: // value for 'data'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateCardMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateCardMutation, Types.UpdateCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateCardMutation, Types.UpdateCardMutationVariables>(UpdateCardDocument, options);
      }
export type UpdateCardMutationHookResult = ReturnType<typeof useUpdateCardMutation>;
export type UpdateCardMutationResult = Apollo.MutationResult<Types.UpdateCardMutation>;
export type UpdateCardMutationOptions = Apollo.BaseMutationOptions<Types.UpdateCardMutation, Types.UpdateCardMutationVariables>;
export const UpdateProfilePersonalDocument = gql`
    mutation updateProfilePersonal($data: UpdateProfilePersonalInput!) {
  updateProfilePersonal(data: $data) {
    id
    username
    description
  }
}
    `;
export type UpdateProfilePersonalMutationFn = Apollo.MutationFunction<Types.UpdateProfilePersonalMutation, Types.UpdateProfilePersonalMutationVariables>;

/**
 * __useUpdateProfilePersonalMutation__
 *
 * To run a mutation, you first call `useUpdateProfilePersonalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfilePersonalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfilePersonalMutation, { data, loading, error }] = useUpdateProfilePersonalMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProfilePersonalMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateProfilePersonalMutation, Types.UpdateProfilePersonalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateProfilePersonalMutation, Types.UpdateProfilePersonalMutationVariables>(UpdateProfilePersonalDocument, options);
      }
export type UpdateProfilePersonalMutationHookResult = ReturnType<typeof useUpdateProfilePersonalMutation>;
export type UpdateProfilePersonalMutationResult = Apollo.MutationResult<Types.UpdateProfilePersonalMutation>;
export type UpdateProfilePersonalMutationOptions = Apollo.BaseMutationOptions<Types.UpdateProfilePersonalMutation, Types.UpdateProfilePersonalMutationVariables>;
export const UpdateUserDataCompiledDocument = gql`
    mutation updateUserDataCompiled($data: UpdateUserDataCompiledInput!) {
  updateUserDataCompiled(data: $data) {
    _id
  }
}
    `;
export type UpdateUserDataCompiledMutationFn = Apollo.MutationFunction<Types.UpdateUserDataCompiledMutation, Types.UpdateUserDataCompiledMutationVariables>;

/**
 * __useUpdateUserDataCompiledMutation__
 *
 * To run a mutation, you first call `useUpdateUserDataCompiledMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserDataCompiledMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserDataCompiledMutation, { data, loading, error }] = useUpdateUserDataCompiledMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateUserDataCompiledMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateUserDataCompiledMutation, Types.UpdateUserDataCompiledMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateUserDataCompiledMutation, Types.UpdateUserDataCompiledMutationVariables>(UpdateUserDataCompiledDocument, options);
      }
export type UpdateUserDataCompiledMutationHookResult = ReturnType<typeof useUpdateUserDataCompiledMutation>;
export type UpdateUserDataCompiledMutationResult = Apollo.MutationResult<Types.UpdateUserDataCompiledMutation>;
export type UpdateUserDataCompiledMutationOptions = Apollo.BaseMutationOptions<Types.UpdateUserDataCompiledMutation, Types.UpdateUserDataCompiledMutationVariables>;
export const VerifyEmailCodeDocument = gql`
    mutation verifyEmailCode($data: VerifyEmailInput!) {
  verifyEmailCode(data: $data) {
    email
  }
}
    `;
export type VerifyEmailCodeMutationFn = Apollo.MutationFunction<Types.VerifyEmailCodeMutation, Types.VerifyEmailCodeMutationVariables>;

/**
 * __useVerifyEmailCodeMutation__
 *
 * To run a mutation, you first call `useVerifyEmailCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailCodeMutation, { data, loading, error }] = useVerifyEmailCodeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useVerifyEmailCodeMutation(baseOptions?: Apollo.MutationHookOptions<Types.VerifyEmailCodeMutation, Types.VerifyEmailCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.VerifyEmailCodeMutation, Types.VerifyEmailCodeMutationVariables>(VerifyEmailCodeDocument, options);
      }
export type VerifyEmailCodeMutationHookResult = ReturnType<typeof useVerifyEmailCodeMutation>;
export type VerifyEmailCodeMutationResult = Apollo.MutationResult<Types.VerifyEmailCodeMutation>;
export type VerifyEmailCodeMutationOptions = Apollo.BaseMutationOptions<Types.VerifyEmailCodeMutation, Types.VerifyEmailCodeMutationVariables>;