import { Action, action } from 'easy-peasy';

interface IPayload {
  coverage_array: string[];
  pass_faster: boolean;
  first_to_complete: boolean;
  accumulation: boolean;
  altimetry_goal_value: number;
  distance_goal_value: number;
  max_time_goal_value: number;
  min_time_goal_value: number;
  unique_ride: boolean;
  is_draw: boolean;
  is_win_prizes: boolean;
  award_at_address: boolean;
  automatic_draw: boolean;
}
interface ICreateChallengeConfigurtion {
  item: keyof IPayload;
  value: string | boolean | Date | number | null;
}
export interface IChallengeConfigurationModel {
  payload: IPayload;
  createChallengeConfiguration: Action<
    IChallengeConfigurationModel,
    ICreateChallengeConfigurtion
  >;
  addItemsToCoverage: Action<IChallengeConfigurationModel, string>;
  deleteItemOnCoverage: Action<IChallengeConfigurationModel, number>;
  removeAllItemsOfCoverage: Action<IChallengeConfigurationModel>;
  reset: Action<IChallengeConfigurationModel>;
}

const challengeConfiguration: IChallengeConfigurationModel = {
  payload: {
    coverage_array: [],
    pass_faster: false,
    first_to_complete: false,
    accumulation: false,
    altimetry_goal_value: 0,
    distance_goal_value: 0,
    max_time_goal_value: 0,
    min_time_goal_value: 0,
    unique_ride: false,
    is_draw: false,
    is_win_prizes: false,
    award_at_address: false,
    automatic_draw: false,
  },
  createChallengeConfiguration: action((state, payload) => {
    // @ts-ignore
    state.payload[payload.item] = payload.value;
  }),
  addItemsToCoverage: action((state, payload) => {
    const existSelected = state.payload.coverage_array.filter(
      (item) => item === payload,
    );
    if (existSelected && existSelected?.length === 0)
      state.payload.coverage_array?.push(payload);
  }),
  deleteItemOnCoverage: action((state, payload) => {
    state.payload.coverage_array.splice(payload, 1);
  }),
  removeAllItemsOfCoverage: action((state) => {
    state.payload.coverage_array = [];
  }),
  reset: action((state) => {
    state.payload = {
      coverage_array: [],
      pass_faster: false,
      first_to_complete: false,
      accumulation: false,
      altimetry_goal_value: 0,
      distance_goal_value: 0,
      max_time_goal_value: 0,
      min_time_goal_value: 0,
      unique_ride: false,
      is_draw: false,
      is_win_prizes: false,
      award_at_address: false,
      automatic_draw: false,
    };
  }),
};

export default challengeConfiguration;
