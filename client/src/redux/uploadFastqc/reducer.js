import uploadFastqcActions from './actions';

const initState = {
};

export default function todoReducer(state = initState, action) {
  switch (action.type) {
    case uploadFastqcActions.CHANGE_COMPLETED:
      console.log('reducee')
      return {
        ...state
      };
    default:
      return state;
  }
}
