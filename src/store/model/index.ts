import awards, { IAwardModel } from '~/store/model/award';
import segments, { ISegmentModel } from '~/store/model/segments';
import cities, { ICityModel } from '~/store/model/cities';
import states, { IStateModel } from '~/store/model/states';
import challenge, { IChallengeModel } from '~/store/model/challenge';
import userInfoCompiled, {
  UserInfoCompiledModel,
} from '~/store/model/userInfoCompiled';
import compiledData, { ICompiledData } from './compiledData';
import challengeConfiguration, {
  IChallengeConfigurationModel,
} from '~/store/model/challengeConfiguration';
import userInfoModel, { IUserInfoModel } from '~/store/model/user';
import challengeComments, {
  ChallengeCommentsModel,
} from '~/store/model/challengeComments';
import chart, { ChartModel } from '~/store/model/chart';
import profile, { IProfileInfoModel } from '~/store/model/profile';
import withdrawalAddress, { IWithdrawModel } from './withdrawAddress';
import monitor, { IMonitorModel } from './monitor';
import network, { INetworkStatusModel } from './network';
import offlineFirst, { IOfflineFirstModel } from './offlineFirst';
import appleHealthQueue, {
  IAppleHealthMonitorQueue,
} from './appleHealthMonitorQueue';

export interface IStoreModel {
  appleHealthQueue: IAppleHealthMonitorQueue;
  offlineFirst: IOfflineFirstModel;
  monitor: IMonitorModel;
  network: INetworkStatusModel;
  compiledData: ICompiledData;
  withdrawalAddress: IWithdrawModel;
  awards: IAwardModel;
  segments: ISegmentModel;
  cities: ICityModel;
  states: IStateModel;
  challenge: IChallengeModel;
  challengeConfiguration: IChallengeConfigurationModel;
  userInfoModel: IUserInfoModel;
  userInfoCompiled: UserInfoCompiledModel;
  challengeComments: ChallengeCommentsModel;
  chart: ChartModel;
  profile: IProfileInfoModel;
}

const model: IStoreModel = {
  network,
  appleHealthQueue,
  monitor,
  offlineFirst,
  withdrawalAddress,
  compiledData,
  awards,
  segments,
  cities,
  states,
  challenge,
  challengeConfiguration,
  userInfoModel,
  userInfoCompiled,
  challengeComments,
  chart,
  profile,
};

export default model;
