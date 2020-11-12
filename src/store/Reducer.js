const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VIDEOS':
      return {
        ...state,
        response: action.payload
      }
    case 'ADD_VIDEO':
      return {
        ...state,
        response: state.response.concat(action.payload)
      }
    case 'REMOVE_VIDEO':
      return {
        ...state,
        response: state.response.filter(item => item._id !== action.payload.id)
      }
    case 'SET_INDEX':
      return {
        ...state,
        playIndex: action.payload
      }
    case 'SET_PLAYING':
      return {
        ...state,
        playing: action.payload
      }
    case 'SET_TIME':
      return {
        ...state,
        time: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        noData: action.payload
      }
    case 'SET_MINI':
      return {
        ...state,
        mini: action.payload
      }
    default:
      return state;
  }
}

export default Reducer;
