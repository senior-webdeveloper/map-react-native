import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { NetworkStatus } from '@apollo/client';
import { setUser } from '@sentry/react-native';
import {
  Checkbox,
  Icons,
  SafeAreaView,
  Text,
  TitleText,
  ImageZoom,
  Box,
  Typography,
} from '~/components';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import {
  AdvancedFiltersToFindSubscriptionsInput,
  ProductsPurchasedPaginated,
  SubscriptionsPaginatedResponse,
  UserChallenges,
} from '~/graphql/autogenerate/schemas';
import {
  useGetChallengeProductsPurchasedLazyQuery,
  usegetChallengeProductsPurchasedLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { clearUndefinedOrEmpty } from '~/helpers/clearUndefinedOrEmpty';
import networkStatus from '~/store/model/network';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  AdvancedFiltersToFindProductsPurchasedInput,
  ProductPurchasedType,
} from '~/generated/graphql';
import challenge from '~/store/model/challenge';

export const Container = styled.ScrollView`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  background-color: transparent;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const Title = styled(TitleText)``;
export const Subtitle = styled(TitleText)`
  font-size: 20px;
  line-height: 20px;
`;
export const SeeAllText = styled(Text)`
  text-transform: uppercase;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  color: rgba(22, 28, 37, 0.5);
`;
export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 16px;
`;
export const MenuItemWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export const MenuItemBox = styled.View`
  background: #ffffff;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  width: 100px;
  height: 100px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;
export const MenuItem = styled.View`
  margin-top: 24px;
  align-items: center;
`;
export const MenuItemText = styled(Text)`
  font-size: 12px;
  margin-top: 12px;
`;
export const FeedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const FeedItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 30px 10px;
  padding: 12px 10px;
  background: #ffffff;
  border-radius: 16px;

  box-shadow: -40px 20px 40px rgba(255, 255, 255, 0.235522);
`;
export const FeedItemName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const FeedDescritionText = styled(Text)``;
export const FeedTimeText = styled(Text)`
  color: rgba(22, 28, 37, 0.6);
`;
export const FeedTextContainer = styled.View``;
export const FeedWrapper = styled.View`
  align-items: flex-start;
  flex-direction: row;
`;
export const Avatar = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  margin-right: 10px;
`;
export const FeedChalengeImage = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 8px;
`;
export const EventsItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 30px;
  padding: 17px 24px 22px 24px;
  background: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 16px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;

export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  border-radius: 8px;
  max-height: 40%;
  align-items: center;
  padding: 8%;
  justify-content: space-between;
`;
export const ModalButton = styled.View`
  background: #0564ff;
  border-radius: 3px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
`;
export const ModalHeaderText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
`;
export const ModalDescriptionText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;
export const ModalButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: ${({ theme }) => theme.colors.textWhite};
  text-align: center;
`;
export const CompanyButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
export const CompanyAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  margin-right: 15px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsers'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ListUsers'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const genders = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
];

const paymentMethods = [
  { label: 'Crédito', value: '953da191-c7c4-44c7-ab40-0298278f9b2b' },
  { label: 'Boleto', value: 'f9bb7843-957f-44b8-b7b3-af4a586f02e8' },
  { label: 'Pix', value: 'ec0c0e26-9e79-46f9-8065-caa4f21a50ec' },
];

const subscriptionStatus = [
  { label: 'Inscrito', value: '893dc59f-bd99-4e96-ba2e-98ad5c5ab59e' },
  {
    label: 'Pagamento não Confirmado',
    value: '1d2eac13-c853-4484-9f79-6417e4429078',
  },
  {
    label: 'Cancelada com Cupom',
    value: '2d0775b5-84fb-419c-8668-684a43444d06',
  },
  {
    label: 'Cancelada sem Devolução',
    value: '53de12ba-706f-43a6-9cec-120fec56a0fb',
  },
  { label: 'Devolvida', value: '6f8ec117-26d1-4b32-896a-7de475e8ad4e' },
  {
    label: 'Aguardando Pagamento',
    value: 'a613efac-4803-4797-ba07-bb8db12fe9e3',
  },
  {
    label: 'Confirmada com Abono',
    value: 'ade3a89f-5756-420b-806b-7ff931c289da',
  },
  {
    label: 'Cancelada Evento Gratuito',
    value: 'ba941623-416f-4ab7-aee4-caaed72481cf',
  },
  { label: 'Confirmada', value: 'df92c6f4-7dd1-4546-9c05-297b0473a3a3' },
];

const PAYMENT_STATUS_FILTERS = [
  { label: 'Pago', value: 'paid' },
  { label: 'Recusado', value: 'refused' },
  { label: 'EstornadaEstornada', value: 'refunded' },
  { label: 'Reembolsado', value: 'chargedback' },
  { label: 'Aguardando', value: 'waiting_payment' },
];

type CheckBoxGroupElementType = {
  id: string;
  name: string;
  content: {
    label: string;
    value: string;
  }[];
};

const { width } = Dimensions.get('window');
const ViewTypes = {
  FULL: 0,
};
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 66;
    },
  );

type FiltersType =
  | 'payment_statuses'
  | 'origin_payment_ids'
  | 'genders'
  | 'category_ids'
  | 'subscription_status_ids'
  | 'award_ids';

function CheckboxGroup({
  formValues,
  setFieldValue,
  checkBoxValues,
  handleSubmit,
  setShowFilters,
  setFilterTypes,
}: {
  formValues: string[];
  setFilterTypes: React.Dispatch<React.SetStateAction<FiltersType | undefined>>;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
  checkBoxValues: CheckBoxGroupElementType;
}) {
  console.log(
    '🚀 ~ file: Challenge.Administration.ListUsersForStaff.screen.tsx ~ line 308 ~ setShowFilters',
    setShowFilters,
  );
  const handleToggle = (id: string) => {
    if (formValues && formValues.length > 0) {
      const filteredElements = formValues.filter((el) => el === id);

      if (filteredElements.length > 0) {
        const oddElements = formValues.filter((el) => el !== id);

        setFieldValue(checkBoxValues.id, [...oddElements]);
      } else {
        setFieldValue(checkBoxValues.id, [...formValues, id]);
      }
    } else {
      setFieldValue(checkBoxValues.id, [id]);
    }
  };

  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 16, width: '100%' }}>
      <Subtitle style={{ marginBottom: 10 }}>{checkBoxValues.name}</Subtitle>

      <View>
        {checkBoxValues.content.map((el) => (
          <CheckboxElement
            element={el}
            handleToggle={handleToggle}
            formValues={formValues}
          />
        ))}
      </View>
      <Box flexDirection="row" alignItems="center" width={1}>
        <Box width={widthPercentageToDP('70')} backgroundColor="red" />
        <TouchableOpacity
          onPress={() => {
            setShowFilters(false);
            setFilterTypes();
            handleSubmit();
          }}
        >
          <Box
            backgroundColor="#4595EC"
            flexDirection="row"
            alignItems="center"
            px={2}
            py={1}
            borderRadius={22}
          >
            <Text style={{ color: 'white', marginRight: 5 }}>Filtrar</Text>

            <Icons name="arrow-right" height={10} color="white" />
          </Box>
        </TouchableOpacity>
      </Box>
    </View>
  );
}

function CheckboxElement({
  element,
  handleToggle,
  formValues,
}: HandleFiltersProps) {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (formValues && formValues.length > 0) {
      setState(formValues.some((el) => el === element.value));
    }
  }, []);

  function toggleValue(e) {
    setState(e);
    handleToggle(element.value);
  }

  return (
    <Checkbox
      value={state}
      onChange={(e) => toggleValue(e)}
      title={element.label}
      style={{ marginBottom: 10 }}
    />
  );
}

function ListProducts({ route, navigation }: Props): JSX.Element {
  const [showFilters, setShowFilters] = useState(false);
  const [filterTypes, setFilterTypes] = useState<FiltersType>();
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const [productsPurchased, setProductsPurchased] =
    useState<ProductsPurchasedPaginated>();

  const [fetch, { data, loading, error }] =
    useGetChallengeProductsPurchasedLazyQuery({
      onCompleted: (e) => console.log(e),
      onError: (e) => console.log(e),
    });
  const [searchText, setSearchText] = useState('');

  const products = route.params.data.getChallengeDetail.products.map(
    (product) => ({
      label: product.name,
      value: product.id,
    }),
  );

  const paymentStatuses = [
    { label: 'Pago', value: 'paid' },
    { label: 'Aguardando Pagamento', value: 'waiting_payment' },
    { label: 'Recusado', value: 'refused' },
    { label: 'Reembolsado', value: 'refunded' },
  ];

  const isSubscribed = [{ label: 'Esta Inscrito?', value: 'isSubscribed' }];

  const elements = {
    origin_payment_ids: {
      id: 'origin_payment_ids',
      name: 'Métodos de pagamento',
      content: paymentMethods,
    },
    payment_statuses: {
      id: 'payment_statuses',
      name: 'Status de Pagamento',
      content: paymentStatuses,
    },
    genders: { id: 'genders', name: 'Genero', content: genders },
    product_ids: { id: 'product_ids', name: 'Produtos', content: products },
    is_subscribed: {
      id: 'is_subscribed',
      name: 'Com Inscrição',
      content: isSubscribed,
    },
  };

  const elementsInFilters = [
    {
      id: 'origin_payment_ids',
      name: 'Métodos de pagamento',
      content: paymentMethods,
    },
    { id: 'is_subscribed', name: 'Com Inscrição', content: isSubscribed },
    {
      id: 'payment_statuses',
      name: 'Status de Pagamento',
      content: paymentStatuses,
    },
    { id: 'genders', name: 'Genero', content: genders },
    { id: 'product_ids', name: 'Produtos', content: products },
  ];
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    if (modalizeRef.current) {
      modalizeRef.current?.open();
    }
  };

  const initialValues: AdvancedFiltersToFindProductsPurchasedInput = {
    genders: [],
    origin_payment_ids: [],
    product_ids: [],
    is_subscribed: undefined,
  };

  useEffect(() => {
    if (data?.getChallengeProductsPurchased) {
      if (
        productsPurchased &&
        productsPurchased.productsPurchased &&
        data?.getChallengeProductsPurchased.page_info.current_page > 1
      ) {
        if (
          data.getChallengeProductsPurchased.page_info.current_page >
          productsPurchased.page_info.current_page
        ) {
          setProductsPurchased({
            page_info: data.getChallengeProductsPurchased.page_info,
            productsPurchased: [
              ...productsPurchased.productsPurchased,
              ...data.getChallengeProductsPurchased.productsPurchased,
            ],
          });
          setDataProvider(
            dataProviderMaker([
              ...productsPurchased.productsPurchased,
              ...data.getChallengeProductsPurchased.productsPurchased,
            ]),
          );
        }
      } else if (
        !productsPurchased ||
        data.getChallengeProductsPurchased.page_info.current_page === 1
      ) {
        console.log('Buscando a pagina 1');
        setProductsPurchased(data?.getChallengeProductsPurchased);
        setDataProvider(
          dataProviderMaker(
            data.getChallengeProductsPurchased.productsPurchased,
          ),
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (productsPurchased?.productsPurchased) {
      setDataProvider(dataProviderMaker(productsPurchased?.productsPurchased));
    }
  }, [productsPurchased]);

  useEffect(() => {
    if (route.params.challenge_id) {
      fetch({
        variables: {
          pagination: {
            page: 1,
            offset: 20,
          },
          data: {
            challenge_id: route.params.challenge_id,
            search_text: '',
          },
        },
      });
    }
  }, [route.params]);

  const handleSearch = async (
    values: AdvancedFiltersToFindSubscriptionsInput,
  ) => {
    const filtered = clearUndefinedOrEmpty(values);
    let newElements = filtered;
    if (filtered.is_subscribed) {
      newElements = {
        ...filtered,
        is_subscribed: true,
      };
    }

    console.log('newElements: ', newElements);

    await fetch({
      variables: {
        pagination: {
          page: 1,
          offset: 20,
        },
        data: {
          challenge_id: route.params.challenge_id,
          advanced_filters: newElements,
          search_text: searchText.trim(),
        },
      },
    });
    modalizeRef.current?.close();
  };

  const onEndReached = async (
    values: AdvancedFiltersToFindSubscriptionsInput,
  ) => {
    const filtered = clearUndefinedOrEmpty(values);
    const newElements = filtered;
    if (
      data?.getChallengeProductsPurchased.page_info.has_next_page &&
      productsPurchased &&
      productsPurchased?.page_info.current_page >= 1
    ) {
      console.log('entrou aqui');
      fetch({
        variables: {
          pagination: {
            page:
              data?.getChallengeProductsPurchased.page_info.current_page + 1,
            offset: 20,
          },
          data: {
            challenge_id: route.params.challenge_id,
            advanced_filters: newElements,
            search_text: searchText,
          },
        },
      });
    }
  };

  const handlePaymentStatus = (status): string =>
    status === 'paid'
      ? 'Pago'
      : status === 'refused'
      ? 'Recusado'
      : status === 'refunded'
      ? 'Estornado'
      : 'Aguardando Pagamento';

  const RenderItemCall = (type, el: ProductPurchasedType, index) => {
    return (
      <Box paddingLeft={2}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Challenge.Administration.ProductInformation', {
              ...route.params,
              product: el,
            });
          }}
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box>
            <ImageZoom
              source={{
                uri: `${PUBLIC_STORAGE}/${el.product.images[0].link}`,
              }}
              uri={{
                uri: `${PUBLIC_STORAGE}/${el.product.images[0].link}`,
              }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </Box>
          <Box
            ml={15}
            flexDirection="row"
            justifyContent="space-between"
            width={widthPercentageToDP(75)}
          >
            <Box>
              <Typography
                type="h4"
                style={{
                  width: widthPercentageToDP('70'),
                }}
                numberOfLines={1}
              >
                {el.product.name}
              </Typography>
              <Typography
                type="small"
                style={{
                  width: widthPercentageToDP('70'),
                }}
                numberOfLines={1}
              >
                {el.user.firstname} {el.user.lastname} -{' '}
                {el.user_challenge_id
                  ? handlePaymentStatus(el?.subscription?.last_payment?.status)
                  : handlePaymentStatus(el?.related_payment?.payment.status)}
              </Typography>
            </Box>

            <Box flexDirection="row" alignItems="center">
              <Icons name="chevron-right" />
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <Formik
      onSubmit={(values) => handleSearch(values)}
      initialValues={initialValues}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <SafeAreaView style={{ backgroundColor: '#F8FAFB', flex: 1 }}>
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor="transparent"
          />

          <HeaderContainer>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icons name="arrow-left" />
            </TouchableOpacity>

            <Subtitle>Produtos Vendidos</Subtitle>

            <Box width={11} />
          </HeaderContainer>

          <Box>
            <Box
              paddingHorizontal={16}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Icons name="search" color="#4595EC" />
              <TextInput
                onChangeText={(e) => setSearchText(e)}
                value={searchText}
                allowFontScaling={false}
                placeholder="Procure por Nome/CPF/Email/Telefone"
                placeholderTextColor="#161c2561"
                onSubmitEditing={() => handleSubmit()}
                style={{
                  width: widthPercentageToDP('80'),
                  paddingVertical: Platform.OS === 'ios' ? 18 : 10,
                  paddingHorizontal: 10,
                }}
              />

              <TouchableOpacity
                disabled={loading}
                style={{ alignItems: 'center', flexDirection: 'row' }}
                onPress={() => handleSubmit()}
              >
                {loading ? (
                  <ActivityIndicator color="#4595EC" />
                ) : (
                  <Icons name="arrow-right" color="#4595EC" />
                )}
              </TouchableOpacity>
            </Box>
          </Box>

          <Box paddingHorizontal={16}>
            <Box borderColor="#DFE8ED" borderWidth={1} />
          </Box>

          <Box paddingVertical={16}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {elementsInFilters.map((el, index) => (
                <TouchableOpacity
                  onPress={() => {
                    if (showFilters && filterTypes === el.id) {
                      setShowFilters(false);
                      setFilterTypes();
                    } else if (showFilters && filterTypes !== el.id) {
                      setFilterTypes();
                      setShowFilters(false);

                      setTimeout(() => {
                        setFilterTypes(el.id);
                        setShowFilters(true);
                      });
                    } else if (!showFilters) {
                      setFilterTypes(el.id);
                      setShowFilters(true);
                    }
                  }}
                >
                  <Box
                    backgroundColor={
                      values && values[el.id] && values[el.id].length > 0
                        ? '#4595EC'
                        : showFilters && filterTypes === el.id
                        ? '#4595EC'
                        : '#E8ECEF'
                    }
                    py={2}
                    px={13}
                    borderRadius={29}
                    flexDirection="row"
                    alignItems="center"
                    key={el.id}
                    ml={index === 0 ? 16 : 2}
                    mr={index === elementsInFilters.length - 1 ? 16 : 0}
                  >
                    <Text
                      style={{
                        marginRight: 5,
                        color:
                          values && values[el.id] && values[el.id].length > 0
                            ? '#FFFFFF'
                            : showFilters && filterTypes === el.id
                            ? '#FFFFFF'
                            : '#161C25',
                      }}
                    >
                      {el.name}
                    </Text>
                    <Icons
                      name={
                        showFilters && filterTypes === el.id
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      color={
                        values && values[el.id] && values[el.id].length > 0
                          ? '#FFFFFF'
                          : showFilters && filterTypes === el.id
                          ? '#FFFFFF'
                          : 'rgba(22, 28, 37, 0.56)'
                      }
                    />
                  </Box>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {showFilters ? (
              <>
                {filterTypes ? (
                  <CheckboxGroup
                    checkBoxValues={elements[filterTypes]}
                    formValues={values[elements[filterTypes].id]}
                    setFieldValue={setFieldValue}
                    setShowFilters={setShowFilters}
                    setFilterTypes={(e) => setFilterTypes(e)}
                    handleSubmit={handleSubmit}
                  />
                ) : null}
              </>
            ) : null}
          </Box>

          <Box paddingLeft={3}>
            <Typography>
              Exibindo{' '}
              {productsPurchased?.productsPurchased?.length
                ? productsPurchased?.productsPurchased?.length
                : 0}{' '}
              de{' '}
              {productsPurchased?.page_info.total_item_count
                ? productsPurchased?.page_info.total_item_count
                : 0}{' '}
              resultados.
            </Typography>
          </Box>

          <Box paddingHorizontal={16} mb={29}>
            <Box borderColor="#DFE8ED" borderWidth={1} />
          </Box>

          {loading && !productsPurchased?.productsPurchased ? (
            <ActivityIndicator color="#0564FF" size="large" />
          ) : (
            <RecyclerListView
              layoutProvider={layoutProvider}
              dataProvider={dataProvider}
              rowRenderer={RenderItemCall}
              onEndReached={() => onEndReached(values)}
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl refreshing={loading} onRefresh={() => {}} />
                ),
                contentContainerStyle: {
                  paddingHorizontal: 8,
                },
              }}
            />
          )}
          {/* </Container> */}

          <Modalize
            ref={modalizeRef}
            HeaderComponent={() => (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingTop: 20,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: 60 }} />
                <Subtitle>Filtros</Subtitle>
                <TouchableOpacity
                  style={{ alignItems: 'center', flexDirection: 'row' }}
                  onPress={() => handleSubmit()}
                >
                  <Text style={{ color: '#0564FF', marginRight: 5 }}>
                    Buscar
                  </Text>
                  <Icons name="search" color="#0564FF" />
                </TouchableOpacity>
              </View>
            )}
          >
            <>
              <View
                style={{
                  paddingHorizontal: 16,
                }}
              >
                <TextInput
                  style={{
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: '#161c2561',
                    paddingVertical: 10,
                  }}
                  onChangeText={(e) => setSearchText(e)}
                  value={searchText}
                  allowFontScaling={false}
                  placeholder="Procure por Nome/CPF/Email/Telefone"
                  placeholderTextColor="#161c2561"
                />
              </View>
              {elementsInFilters.map((el) => {
                return (
                  <CheckboxGroup
                    checkBoxValues={el}
                    formValues={values[el.id]}
                    setFieldValue={setFieldValue}
                  />
                );
              })}
            </>
          </Modalize>
        </SafeAreaView>
      )}
    </Formik>
  );
}

type HandleFiltersProps = {
  element: { label: string; value: string };
  handleToggle: (id: string) => void;
  formValues: string[];
};

export default ListProducts;
