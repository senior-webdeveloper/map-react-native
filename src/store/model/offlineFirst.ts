import { Action, action } from 'easy-peasy';
import { ChallengeShowCaseResponse } from '~/graphql/autogenerate/schemas';

export interface IOfflineFirstModel {
  exploreChallenges: ChallengeShowCaseResponse[] | undefined | null;
  setExploreChallenges: Action<IOfflineFirstModel, ChallengeShowCaseResponse[]>;
}
const offlineFirst: IOfflineFirstModel = {
  exploreChallenges: [],
  setExploreChallenges: action((state, payload) => {
    state.exploreChallenges = payload;
  }),

};

export default offlineFirst;
