import { Action, action } from 'easy-peasy';
import { WithdrawalAddress as LocalWithdrawalAddress } from '~/graphql/autogenerate/schemas';

export interface IWithdrawModel {
  payload?: LocalWithdrawalAddress;
  createWithdraw: Action<IWithdrawModel, LocalWithdrawalAddress>;
  reset: Action<IWithdrawModel>;
}
const withdrawalAddress: IWithdrawModel = {
  payload: undefined,
  createWithdraw: action((state, payload) => {
    state.payload = payload;
  }),
  reset: action((state) => {
    state.payload = undefined;
  }),
};

export default withdrawalAddress;
