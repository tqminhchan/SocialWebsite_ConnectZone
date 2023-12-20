import React, { useContext, useState } from 'react';
import { CiMail, CiLock, CiUser } from 'react-icons/ci';
import { MdToday } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import authApi from '../../api/authApi';
import bgSignup from '../../assets/imgs/signup-bg.jpg'
import config from "../../config/index";
import { AuthContext } from '../../contexts/AuthContext';
import HandleAuthToken from '../../utils/HandleAuthToken';
const Register = () => {
  const [loading, setLoading] = useState(false)
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const schema = yup
    .object()
    .shape({
      fullName: yup.string().required("Họ tên không được để trống"),
      email: yup.string().required("Email không được để trống").email('Vui lòng nhập đúng email'),
      password: yup.string().required("Mật khẩu không được để trống").min(8, "Mật khẩu có tối thiểu 8 kí tự"),
      dateOfBirth: yup.string().required("Ngày sinh không được để trống"),
      gender: yup.string().required("Hãy chọn giới tính của bạn")
    })
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  })

  const handleRegister = async (data) => {
    setLoading(!loading)
    if (!data) {
      return
    }
    try {
      const res = await authApi.register(data)
      if (!res.data.success) {
        toast.error(res.data.message);
        reset({
          password: ''
        })
      }
      localStorage.setItem('accessToken', JSON.stringify(res?.data?.accessToken))
      localStorage.setItem('currentUserId', JSON.stringify(res?.data?.user?.id))

      HandleAuthToken(res?.data?.accessToken);
      toast.success(res?.data?.message)
      dispatch({ type: 'REGISTER_SUCCESS', payload: res?.data?.user })
      setLoading(!loading)
      navigate('/')

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex items-center flex-row ">
      <div className="hidden desktop:block basis-3/7 min-h-screen xl:hidden ">
        <img className="min-h-screen" src={bgSignup} />
      </div>
      <div className="basis-4/7 mx-auto lg:my-auto h-screen flex items-center sm:px-4">
        <div>
          <h2 className="text-4xl font-bold">Tạo tài khoản</h2>
          <form onSubmit={handleSubmit(handleRegister)} className='min-w-[500px]'>
            <div className={`relative flex items-center border-2 mt-9 rounded-lg overflow-hidden`}>
              <CiUser className='absolute  ml-2.5' fontSize={22} />
              <input
                type="text"
                placeholder="Họ và tên"
                {...register('fullName')}
                className='px-2.5 py-3.5 pl-10 w-full outline-primary text-lg'
              />
            </div>
            {errors?.fullName && <span className={`absolute ${errors.fullName ? 'text-red' : ''}`}>{errors.fullName.message}</span>}

            <div className={`relative flex items-center border-2 mt-9 rounded-lg overflow-hidden`}>
              <CiMail className='absolute  ml-2.5' fontSize={22} />
              <input
                type="text"
                placeholder="Email"
                {...register('email')}
                className='px-2.5 py-[14px] pl-[40px] w-full outline-primary text-lg'
              />
            </div>
            {errors?.email && <span className={`absolute ${errors.email ? 'text-red' : ''}`}>{errors.email.message}</span>}
            <div className={`relative flex items-center  border-2 mt-9 rounded-lg overflow-hidden`}>
              <CiLock className='absolute  ml-2.5' fontSize={22} />
              <input
                type="password"
                placeholder="Mật khẩu"
                {...register('password')}
                className=' px-2.5 py-[14px] pl-[40px] w-full outline-primary text-lg'
              />
            </div>
            <span className={`absolute ${errors.password ? 'text-red' : ''}`}>{errors.password?.message}</span>

            <div className={`relative flex items-center  border-2 mt-9 rounded-lg overflow-hidden`}>
              <MdToday className='absolute  ml-2.5' fontSize={22} />
              <input
                type="date"
                placeholder="date"
                {...register('dateOfBirth')}
                className='px-2.5 py-3.5 pl-10 w-full outline-primary text-lg'
              />
            </div>
            {errors?.dateOfBirth && <span className={`absolute ${errors.dateOfBirth ? 'text-red' : ''}`}>{errors.dateOfBirth.message}</span>}

            <div className={`relative grid grid-cols-3 gap-x-9 mt-9 justify-start 
            `}>
              <label className="flex items-center justify-between px-3 py-2.5  border rounded-lg overflow-hidden cursor-pointer ">
                <span className="text-lg">Nam</span>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="male"
                  {...register('gender')}
                  className='w-4 h-4'
                />
              </label>
              <label className="flex items-center justify-between px-3 py-2.5  border rounded-lg overflow-hidden cursor-pointer ">
                <span className="text-lg">Nữ</span>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="female"
                  {...register('gender')}
                  className='w-4 h-4'
                />
              </label>
              <label className="flex items-center justify-between px-3 py-2.5  border rounded-lg overflow-hidden cursor-pointer">
                <span className="text-lg">Khác</span>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="other"
                  {...register('gender')}
                  className='w-4 h-4'
                />
              </label>
            </div>
            {errors?.gender && <span className={`absolute ${errors.gender ? 'text-red' : ''}`}>{errors.gender.message}</span>}
            <div className="mt-2.5">
              <button type="submit" className="w-full text-white bg-black py-3.5 
              mt-8 text-lg font-semibold rounded-lg">Đăng kí</button>
              <h6 className="mt-2">
                Đã có tài khoản
                <Link to={config.routes.login} className='ml-2.5 text-primary font-bold text-base'>Đăng nhập</Link>
              </h6>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Register;
