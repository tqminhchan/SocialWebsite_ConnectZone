import React, { Fragment, useContext, useEffect, useRef } from 'react'
import Routers from './routes/Routers'
import { AuthContext } from './contexts/AuthContext'
import handleLocalStorage from './utils/handleLocalStorage'
import { SocketContext } from './contexts/SocketContext'
import { useLocation } from 'react-router-dom';
function App() {
  const { dispatch, user, notifications } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const userRef = useRef(user)
  const notificationsRef = useRef(notifications)
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search, location.pathname]);

  useEffect(() => {
    if (user) {
      handleLocalStorage.set('user', user)
      userRef.current = user
    }
  }, [user])

  useEffect(() => {
    if (notifications) {
      notificationsRef.current = notifications
    }
  }, [notifications])

  const handleSetNoti = (data) => {
    if (data.receiver?.id === userRef.current.id) {
      dispatch({ type: 'SET_NOTIFICATION', payload: [data?.notification, ...notificationsRef.current] })
      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'friendRequests',
          value: data?.receiver?.friendRequests,
        },
      })
      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'notificationUnread',
          value: userRef.current.notificationUnread + 1,
        },
      })
    }
  }

  const handleSetNotiCancelSentFriendRequest = (data) => {
    if (data.receiver?.id === userRef.current.id) {
      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'friendRequests',
          value: data?.receiver?.friendRequests,
        },
      })
    }
  }

  const handleSetNotiAcceptedFriendRequest = (data) => {
    console.log(data)
    if (data.receiverAccepted.id === userRef.current.id) {
      dispatch({ type: 'SET_NOTIFICATION', payload: [data?.notification, ...notificationsRef.current] })
      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'friendRequestsSent',
          value: data?.receiverAccepted?.friendRequestsSent,
        },
      })
      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'friends',
          value: data?.receiverAccepted?.friends,
        },
      })
      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'notificationUnread',
          value: userRef.current.notificationUnread + 1,
        },
      })
    }
  }

  useEffect(() => {
    socket.on('sendNotiFriend', (data) => {
      handleSetNoti(data)
    })
    socket.on('sendNotiCancelSentFriendRequest', (data) => {
      handleSetNotiCancelSentFriendRequest(data)
    })
    socket.on('sendNotiFriendAccepted', (data) => {
      handleSetNotiAcceptedFriendRequest(data)
    })
  }, [])

  return (
    <Fragment>
      <Routers />
    </Fragment>
  )
}

export default App
