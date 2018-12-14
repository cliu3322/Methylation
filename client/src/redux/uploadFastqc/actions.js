const uploadFastqcActions = {
  CHANGE_COMPLETED: 'CHANGE_COMPLETED',

  changeCompleted: () => {
    //console.log('asdfasdf');
    return (dispatch, getState) => {
      console.log('getState().entity');
      const newTask = {
      };
      //const todos = [newTask, ...getState().entity];
      dispatch({
        type: uploadFastqcActions.CHANGE_COMPLETED,
        //todos
      });
    };
  }
};
export default uploadFastqcActions;
