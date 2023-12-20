import React, {Fragment, useContext, useEffect} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import config from '../config'
import {AuthContext} from '../contexts/AuthContext'
import {toast} from 'react-toastify'
const ProtectedRoute = ({children}) => {
  const {user, isLoading} = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !isLoading) {
      toast.info('Bạn cần đăng nhập để tiếp tục')
      navigate(`${config.routes.login}?redirect=${window.location.pathname}`)
    }
  }, [user, isLoading, navigate])
  return <Fragment>{user && children}</Fragment>
}

export default ProtectedRoute
