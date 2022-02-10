import { Action, action } from 'easy-peasy';
import { Comment } from '~/graphql/autogenerate/schemas';

export interface ChallengeCommentsModel {
  comments: Array<Comment>;
  seedComments: Action<ChallengeCommentsModel, Array<Comment>>;
  createClap: Action<
    ChallengeCommentsModel,
    { index: number; claps_count: number }
  >;
  createClapChildren: Action<
    ChallengeCommentsModel,
    { index: number; indexChildren: number; claps_count: number }
  >;
  reset: Action<ChallengeCommentsModel>;
}
const challengesComments: ChallengeCommentsModel = {
  comments: [],
  seedComments: action((state, payload) => {
    state.comments = payload;
  }),
  createClap: action((state, payload) => {
    if (!state.comments[payload.index].my_claps) {
      console.log('1');
      if (state.comments[payload.index].claps.length > 0) {
        state.comments[payload.index] = {
          ...state.comments[payload.index],
          my_claps: payload.claps_count,
        };
        console.log('1.2', state.comments[payload.index].my_claps);
      } else {
        console.log('1.3');
        state.comments[payload.index] = {
          ...state.comments[payload.index],
          my_claps: payload.claps_count,
        };
      }
    } else {
      console.log('2');
      state.comments[payload.index] = {
        ...state.comments[payload.index],
        my_claps: state.comments[payload.index].my_claps + payload.claps_count,
      };
    }
  }),

  createClapChildren: action((state, payload) => {
    if (
      !state.comments[payload.index].childComments[payload.indexChildren]
        .my_claps
    ) {
      if (
        state.comments[payload.index].childComments[payload.indexChildren].claps
          .length > 0
      ) {
        state.comments[payload.index].childComments[payload.indexChildren] = {
          ...state.comments[payload.index].childComments[payload.indexChildren],
          my_claps: payload.claps_count,
        };
      } else {
        state.comments[payload.index].childComments[payload.indexChildren] = {
          ...state.comments[payload.index].childComments[payload.indexChildren],
          my_claps: payload.claps_count,
        };
      }
    } else {
      state.comments[payload.index].childComments[payload.indexChildren] = {
        ...state.comments[payload.index].childComments[payload.indexChildren],
        my_claps:
          state.comments[payload.index].childComments[payload.indexChildren]
            .my_claps + payload.claps_count,
      };
    }
  }),
  reset: action((state) => {
    state.comments = [];
  }),
};

export default challengesComments;
