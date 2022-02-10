import { Action, action } from 'easy-peasy';

interface IPayload {
  name: string;
  challenge_type: string;
  start_date: Date;
  end_date: Date;
  has_achievement: boolean;
  start_date_registration: Date;
  creator_id: string;
  end_date_registration: Date;
  prestart_visibility: boolean;
  launch_date: Date;
  description: string;
  image_avatar: string;
  image_cover: string;
  rank: boolean;
}
interface ICreateChallenge {
  item: keyof IPayload;
  value: string | boolean | Date;
}
export interface IChallengeModel {
  payload: IPayload;
  createChallenge: Action<IChallengeModel, ICreateChallenge>;
  reset: Action<IChallengeModel>;
  withdrawAward: boolean;
  setWithdrawAward: Action<IChallengeModel, boolean>;
  categorySelected: string | null;
  setCategorySelected: Action<IChallengeModel, string>;
  withdrawDate: string | null;
  setWithdrawDate: Action<IChallengeModel, string>;
  hasClickedOnSubscribe: boolean;
  userHasSubscribed: boolean;
  setUserHasSubscribed: Action<IChallengeModel, boolean>;
  setHasClickedOnSubscribe: Action<IChallengeModel, boolean>;
}
const challenge: IChallengeModel = {
  hasClickedOnSubscribe: false,
  setHasClickedOnSubscribe: action((state, payload) => {
    state.hasClickedOnSubscribe = payload;
  }),
  userHasSubscribed: false,
  setUserHasSubscribed: action((state, payload) => {
    state.userHasSubscribed = payload;
  }),
  withdrawAward: false,
  categorySelected: null,
  setCategorySelected: action((state, payload) => {
    state.categorySelected = payload;
  }),
  setWithdrawAward: action((state, payload) => {
    state.withdrawAward = payload;
  }),
  setWithdrawDate: action((state, payload) => {
    state.withdrawDate = payload;
  }),
  payload: {
    name: 'Exemplo de Nome',
    challenge_type: '',
    start_date_registration: new Date(),
    start_date: new Date(),
    end_date_registration: new Date(),
    end_date: new Date(),
    has_achievement: false,
    prestart_visibility: false,
    launch_date: new Date(),
    creator_id: '',
    description: 'Aqui deve ser feita uma breve descricao do desafio.',
    image_avatar:
      'http://public-storage.riderize.com/logos/Quadrada-branca-roxa.png',
    image_cover:
      'http://public-storage.riderize.com/logos/Quadrada-branca-roxa.png',
    rank: false,
  },
  createChallenge: action((state, payload) => {
    // @ts-ignore
    state.payload[payload.item] = payload.value;
  }),
  reset: action((state) => {
    state.payload = {
      name: 'Exemplo de Nome',
      challenge_type: '',
      start_date_registration: new Date(),
      start_date: new Date(),
      end_date_registration: new Date(),
      end_date: new Date(),
      has_achievement: false,
      prestart_visibility: false,
      launch_date: new Date(),
      creator_id: '',
      description: 'Aqui deve ser feita uma breve descricao do desafio.',
      image_avatar:
        'http://public-storage.riderize.com/logos/Quadrada-branca-roxa.png',
      image_cover:
        'http://public-storage.riderize.com/logos/Quadrada-branca-roxa.png',
      rank: false,
    };
  }),
};

export default challenge;
