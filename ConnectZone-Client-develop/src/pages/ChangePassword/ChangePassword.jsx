import React, {useContext} from 'react'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {AuthContext} from '../../contexts/AuthContext'
import userApi from '../../api/userApi'
import {toast} from 'react-toastify'

const ChangePassword = () => {
  const {user} = useContext(AuthContext)

  const schema = yup.object().shape({
    password: yup.string().required('Mật khẩu không được để trống'),
    newPassword: yup.string().required('Mật khẩu mới không được để trống'),
    confirmPassword: yup
      .string()
      .required('Mật khẩu không được để trống')
      .oneOf([yup.ref('newPassword'), null], 'Mật khẩu không trùng khớp'),
  })
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleChangePassword = async (values) => {
    try {
      await userApi.changePassword({
        password: values.password,
        newPassword: values.newPassword,
      })
      toast.success('Thay đổi mật khẩu thành công')
      reset({
        password: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error(error.response.data.message || 'Thay đổi mật khẩu thất bại, Vui lòng thử lại sau')
    }
  }

  return (
    <div>
      <div className="bg-primary h-[84px] rounded-md"></div>
      <div className="flex flex-col items-center justify-center py-8 bg-white shadow-xl">
        <div className="mb-5 text-2xl font-bold">Thay đổi mật khẩu</div>
        <div className="flex flex-col items-center justify-center mb-8 text-center max-w-[50%] laptop:max-w-[50%]">
          <div className="mb-3">
            <img src={user?.avatar?.url} alt={user?.fullName} className="w-[100px] h-[100px] rounded-md" />
          </div>
          <div className="text-lg font-bold">{user.fullName}</div>
        </div>
        <form onSubmit={handleSubmit(handleChangePassword)} className="w-full px-3 laptop:px-5 desktop:px-8">
          <div className="flex flex-col items-center justify-center gap-5 mb-5">
            <div className="w-full tablet:w-auto">
              <label htmlFor="password" className="block mb-1.5 text-sm font-bold text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="w-full tablet:w-[400px] laptop:w-[350px] h-[40px] px-4 py-2 border-2 border-[#ccc] rounded-md outline-none focus:border-primary"
                placeholder="Nhập mật khẩu"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red">{errors.password?.message}</p>}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 mb-5">
            <div className="w-full tablet:w-auto">
              <label htmlFor="newPassword" className="block mb-1.5 text-sm font-bold text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full tablet:w-[400px] laptop:w-[350px] h-[40px] px-4 py-2 border-2 border-[#ccc] rounded-md outline-none focus:border-primary"
                placeholder="Nhập mật khẩu mới"
                {...register('newPassword')}
              />
              {errors.newPassword && <p className="text-sm text-red">{errors.newPassword?.message}</p>}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 mb-5">
            <div className="w-full tablet:w-auto">
              <label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-bold text-gray-700">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full tablet:w-[400px] laptop:w-[350px] h-[40px] px-4 py-2 border-2 border-[#ccc] rounded-md outline-none focus:border-primary"
                placeholder="Nhập lại mật khẩu"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-sm text-red">{errors.confirmPassword?.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full tablet:w-[250px] text-white bg-primary py-3.5 mt-8 text-lg font-semibold rounded-lg hover:opacity-80"
            >
              Thay đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
