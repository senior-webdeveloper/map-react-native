import { Action, action } from 'easy-peasy';

interface IPayload {
  __typename: string;
  name: string;
  distance: number;
  total_elevation_gain: number;
  polyline: string;
}

export interface ISegmentModel {
  payload: IPayload[];
  selectSegment: Action<ISegmentModel, IPayload>;
  deleteSegment: Action<ISegmentModel, number>;
}
const segments: ISegmentModel = {
  payload: [],
  selectSegment: action((state, payload) => {
    const existSegmentSelected = state.payload.filter(
      (item) => item.name === payload.name,
    );
    if (existSegmentSelected.length === 0) state.payload.push(payload);
  }),
  deleteSegment: action((state, payload) => {
    state.payload.splice(payload, 1);
  }),
};

export default segments;
