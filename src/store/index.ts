import { createStore, action, createTypedHooks, persist } from 'easy-peasy';
import AsyncStorage from '@react-native-community/async-storage';
import model, { IStoreModel } from '~/store/model';

const { useStoreActions, useStoreState } = createTypedHooks<IStoreModel>();
export { useStoreState, useStoreActions };

const store = createStore(model);

export default store;
