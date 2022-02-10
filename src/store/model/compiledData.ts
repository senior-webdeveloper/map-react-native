import { Action, action } from 'easy-peasy';
import { DataCompiled } from '~/graphql/autogenerate/schemas';

export interface ICompiledData {
  dataCompiled?: DataCompiled;
  saveDataCompiled: Action<ICompiledData, DataCompiled>;
}
const compiledData: ICompiledData = {
  dataCompiled: undefined,
  saveDataCompiled: action((state, payload) => {
    state.dataCompiled = payload;
  }),
};

export default compiledData;
