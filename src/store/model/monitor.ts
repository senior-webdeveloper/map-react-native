import { Action, action } from 'easy-peasy';

type MonitorType = 'running' | 'stopped' | 'paused';

export interface IMonitorModel {
  status: MonitorType;
  currentAcitivity: number;
  setStates: Action<IMonitorModel, MonitorType>;
  syncLoading: boolean;
  setSyncLoading: Action<IMonitorModel, boolean>;
  setCurrentActivity: Action<IMonitorModel, number>;
}
const monitor: IMonitorModel = {
  status: 'stopped',
  syncLoading: false,
  currentAcitivity: 0,
  setSyncLoading: action((state, payload) => {
    state.syncLoading = payload;
  }),
  setStates: action((state, payload) => {
    state.status = payload;
  }),
  setCurrentActivity: action((state, payload) => {
    state.currentAcitivity = payload;
    console.log(
      '🚀 ~ file: monitor.ts ~ line 25 ~ setCurrentActivity:action ~ state.currentAcitivity',
      state.currentAcitivity,
    );
  }),
};

export default monitor;
