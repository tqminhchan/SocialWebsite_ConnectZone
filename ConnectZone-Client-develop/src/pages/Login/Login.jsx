import React, { useState, useContext } from 'react'
import queryString from 'query-string'
import { CiMail, CiLock } from 'react-icons/ci'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import authApi from '../../api/authApi'
import bglogin from '../../assets/imgs/login-bg.jpg'
import config from '../../config/index'
import HandleAuthToken from '../../utils/HandleAuthToken'
import { AuthContext } from '../../contexts/AuthContext'
import notiApi from '../../api/notiApi'
const Login = () => {
  const [loading, setLoading] = useState(false)
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const schema = yup.object().shape({
    email: yup.string().required('Email không được để trống').email('Vui lòng nhập đúng email'),
    password: yup.string().required('Mật khẩu không được để trống').min(8, 'Mật khẩu có tối thiểu 8 kí tự'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })
  const handleLogin = async (data) => {
    setLoading(true)
    if (!data) {
      return
    }
    try {
      dispatch({ type: 'LOGIN_START' })
      const res = await authApi.login(data)
      if (!res.data.success) {
        toast.error('Đăng nhập thất bại')
      }
      localStorage.setItem('currentUserId', JSON.stringify(res?.data?.user?.id))
      localStorage.setItem('accessToken', JSON.stringify(res?.data?.accessToken))
      HandleAuthToken(res?.data?.accessToken)

      toast.success(res.data.message || 'Đăng nhập thành công')
      dispatch({ type: 'LOGIN_SUCCESS', payload: res?.data.user })
      const resNotification = await notiApi.getAllNotification()
      dispatch({ type: 'SET_NOTIFICATION', payload: resNotification.data.notifications })
      const redirect = queryString.parse(location.search)?.redirect
      if (redirect) {
        navigate(redirect)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Đăng nhập thất bại, Vui lòng thử lại sau')
      dispatch({ type: 'LOGIN_FAILURE' })
    }
    setLoading(false)
  }
  return (
    <div className="flex flex-row items-center min-h-screen">
      <div className="hidden desktop:block laptop:basis-3/7 ">
        <img className="min-h-screen" src={bglogin} />
      </div>
      <div className="flex items-center justify-center mx-auto basis-4/7 lg:my-auto sm:px-4">
        <div>
          <h2 className="text-4xl font-bold">Đăng nhập vào tài khoản</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className={`relative flex items-center border-2 mt-[35px] rounded-lg overflow-hidden`}>
              <CiMail className="absolute  ml-2.5" fontSize={22} />
              <input
                type="text"
                placeholder="Email"
                {...register('email')}
                className="px-2.5 py-3.5 pl-10 w-full outline-primary text-lg"
              />
            </div>
            {errors.email && (
              <span className={`absolute ${errors?.email ? 'text-red' : 'text-black'}`}>{errors.email?.message}</span>
            )}
            <div className={`relative flex items-center  border-[2px] mt-9 rounded-lg overflow-hidden`}>
              <CiLock className="absolute  ml-2.5" fontSize={22} />
              <input
                type="password"
                placeholder="Mật khẩu"
                {...register('password')}
                className=" px-2.5 py-3.5 pl-10 w-full outline-primary text-lg"
              />
            </div>
            <span className={`absolute ${errors?.password ? 'text-red' : 'text-black'}`}>
              {errors.password?.message}
            </span>
            <div>
              <button type="submit" className="w-full py-4 text-lg font-semibold text-white bg-black rounded-lg mt-9">
                Đăng nhập
              </button>
              <h6 className="mt-2">
                Chưa có tài khoản
                <Link to={config.routes.register} className="ml-2.5 text-primary font-bold text-base">
                  Đăng kí
                </Link>
              </h6>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
