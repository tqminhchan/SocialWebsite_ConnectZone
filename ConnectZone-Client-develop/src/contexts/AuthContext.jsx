import { createContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthReducer from './AuthReducer'
import handleLocalStorage from '../utils/handleLocalStorage'
import checkAuth from '../utils/checkAuth'
import config from '../config'
import authApi from '../api/authApi'
import notiApi from './../api/notiApi'
const INITIAL_STATE = {
  user: null,
  isLoading: true,
  error: false,
  post: null,
  notifications: [],
  listChatUnread: [],
  currentChatMessage: {},
  postUpdate: null
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ type: 'LOGIN_START' })
      try {
        const res = await authApi.getCurrentUser()
        localStorage.setItem('currentUserId', JSON.stringify(res?.data?.user?.id))
        dispatch({ type: 'LOGIN_SUCCESS', payload: res?.data?.user })
        const resNotification = await notiApi.getAllNotification()
        dispatch({ type: 'SET_NOTIFICATION', payload: resNotification.data.notifications })
      } catch (error) {
        console.log(error)
        dispatch({ type: 'LOGIN_FAILURE' })
        navigate(config.routes.login)
      }
    }
    const isLoggedIn = checkAuth()

    if (!isLoggedIn) {
      navigate(config.routes.login)
    } else {
      fetchUser()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        post: state.post,
        notifications: state.notifications,
        listChatUnread: state.listChatUnread,
        currentChatMessage: state.currentChatMessage,
        postUpdate: state.postUpdate,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
