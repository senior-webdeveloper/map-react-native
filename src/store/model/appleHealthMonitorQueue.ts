import { Action, action } from 'easy-peasy';
import { CreateActivityInput } from '~/generated/graphql';

type Status = 'standby' | 'loading' | 'completed';

export interface IAppleHealthMonitorQueue {
  status: Status;
  queue: CreateActivityInput[] | null | undefined;
  setStates: Action<IAppleHealthMonitorQueue, Status>;
  setQueue: Action<IAppleHealthMonitorQueue, CreateActivityInput>;
  removeElementFromQueue: Action<IAppleHealthMonitorQueue>;
  syncLoading: boolean;
  setSyncLoading: Action<IAppleHealthMonitorQueue, boolean>;
}
const appleHealthQueue: IAppleHealthMonitorQueue = {
  status: 'standby',
  queue: null,
  syncLoading: false,
  setSyncLoading: action((state, payload) => {
    state.syncLoading = payload;
  }),
  setStates: action((state, payload) => {
    state.status = payload;
  }),
  setQueue: action((state, payload) => {
    if (state.queue && state.queue.length > 0) {
      state.queue = [...state.queue, payload];
    } else {
      state.queue = [payload];
    }
  }),
  removeElementFromQueue: action((state, payload) => {
    if (state.queue) {
      delete state.queue;
    }
  }),
};

export default appleHealthQueue;
