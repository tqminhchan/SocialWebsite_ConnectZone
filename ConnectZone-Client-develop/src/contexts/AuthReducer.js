const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        user: null,
        isLoading: true,
        error: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: false,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isLoading: false,
        error: true,
      }
    case 'REGISTER_START':
      return {
        ...state,
        user: null,
        isFetching: true,
        error: false,
      }
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      }
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isFetching: false,
        error: true,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      }
    case 'UPDATE_PROPERTY_USER':
      return {
        ...state,
        user: {
          ...state.user,
          [action.payload.key]: action.payload.value,
        },
        isFetching: false,
        error: false,
      }
    case 'UPDATE_PROPERTY_POST':
      return {
        ...state,
        updatePost: {
          ...state.updatePost,
          [action.payload.key]: action.payload.value,
        },
        isFetching: false,
        error: false,
      }

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isFetching: false,
        error: false,
      }
    case 'GET_POST':
      return {
        ...state,
        post: action.payload,
      }
    case 'CLOSE_POST':
      return {
        ...state,
        post: null,
      }
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notifications: action.payload,
      }
    case 'SET_LIST_CHAT_UNREAD':
      return {
        ...state,
        listChatUnread: [...action.payload],
      }
    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChatMessage: action.payload,
      }

    default:
      return state
  }
}
export default AuthReducer
