import React, {useContext, useState} from 'react'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {AuthContext} from '../../contexts/AuthContext'
import {MdKeyboardArrowDown, MdToday} from 'react-icons/md'
import OutsideClickWrapper from './../../components/OutsideClickWrapper'
import userApi from '../../api/userApi'
import {toast} from 'react-toastify'

const genderOptions = [
  {
    label: 'Nam',
    value: 'male',
  },
  {
    label: 'Nữ',
    value: 'female',
  },
  {
    label: 'Khác',
    value: 'other',
  },
]

const MyInfo = () => {
  const {user} = useContext(AuthContext)
  const [gender, setGender] = useState(user.gender)
  const [showGenderOption, setShowGenderOption] = useState(false)

  const {dispatch} = useContext(AuthContext)

  const schema = yup.object().shape({
    email: yup.string().required('Email không được để trống').email('Vui lòng nhập đúng email'),
    fullName: yup.string().required('Họ tên không được để trống'),
    dateOfBirth: yup.string().required('Ngày sinh không được để trống'),
  })
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleUpdateUser = async (values) => {
    const newUserInfo = {
      ...values,
      gender,
    }
    try {
      const res = await userApi.updateUser(newUserInfo)
      dispatch({type: 'UPDATE_USER', payload: res.data.user})
      toast.success('Cập nhật thông tin thành công')
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại, Vui lòng thử lại sau')
    }
  }

  const formatDate = (dateOfBirthString) => {
    const dateOfBirth = new Date(dateOfBirthString)
    let month = dateOfBirth.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }

    let day = dateOfBirth.getDate()
    if (day < 10) {
      day = `0${day}`
    }
    const year = dateOfBirth.getFullYear()
    return `${year}-${month}-${day}`
  }

  return (
    <div>
      <div className="bg-primary h-[84px] rounded-md"></div>
      <div className="flex flex-col items-center justify-center py-8 bg-white shadow-xl">
        <div className="mb-5 text-2xl font-bold">Thông tin cá nhân</div>
        <div className="flex flex-col items-center justify-center mb-8 text-center max-w-[50%] laptop:max-w-[50%]">
          <div className="mb-3">
            <img src={user?.avatar?.url} alt={user?.fullName} className="w-[100px] h-[100px] rounded-md object-cover" />
          </div>
          <div className="text-lg font-bold">{user.fullName}</div>
        </div>
        <form onSubmit={handleSubmit(handleUpdateUser)} className="w-full px-3 laptop:px-5 desktop:px-8">
          <div className="flex flex-col items-center justify-between gap-5 mb-5 desktop:flex-row">
            <div className="w-full">
              <label htmlFor="email" className="block mb-1.5 text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="w-full desktop:max-w-[300px] h-[40px] px-4 py-2 border-2 border-[#ccc] rounded-md outline-none focus:border-primary"
                defaultValue={user?.email}
                placeholder="Nhập email"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red">{errors.email?.message}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="fullName" className="block mb-1.5 text-sm font-bold text-gray-700">
                Họ tên
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full desktop:max-w-[300px] h-[40px] px-4 py-2 border-2 border-[#ccc] rounded-md outline-none focus:border-primary"
                defaultValue={user?.fullName}
                placeholder="Nhập họ tên"
                {...register('fullName')}
              />
              {errors.fullName && <p className="text-sm text-red">{errors.fullName?.message}</p>}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-5 mb-5 desktop:flex-row">
            <div className="w-full">
              <label htmlFor="address" className="block mb-1.5 text-sm font-bold text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full desktop:max-w-[300px] h-[40px] px-4 py-2 border-2 border-[#ccc] rounded-md outline-none focus:border-primary"
                defaultValue={user?.address}
                placeholder="Nhập địa chỉ"
                {...register('address')}
              />
              {errors.address && <p className="text-sm text-red">{errors.address?.message}</p>}
            </div>
            <div className="w-full">
              <label htmlFor="gender" className="block mb-1.5 text-sm font-bold text-gray-700">
                Giới tính
              </label>
              <OutsideClickWrapper onClickOutside={() => setShowGenderOption(false)}>
                <div className="w-full desktop:max-w-[300px] h-[40px] border-2 border-[#ccc] rounded-md cursor-pointer">
                  <div
                    className="flex items-center justify-between h-full px-4"
                    onClick={() => setShowGenderOption((pre) => !pre)}
                  >
                    <div className="select-none">{gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác'}</div>
                    <div className="cursor-pointer">
                      <MdKeyboardArrowDown size={24} />
                    </div>
                  </div>

                  {showGenderOption && (
                    <div className="relative z-10 pt-1 rounded-md shadow-xl">
                      {genderOptions.map((item) => (
                        <div
                          key={item.value}
                          onClick={() => {
                            setGender(item.value)
                            setShowGenderOption(false)
                          }}
                          className="bg-white py-1.5 w-full px-4 select-none border-b border-borderColor"
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </OutsideClickWrapper>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-5 mb-5 desktop:flex-row">
            <div className="w-full">
              <label htmlFor="address" className="block mb-1.5 text-sm font-bold text-gray-700">
                Ngày sinh
              </label>
              <div
                className={`flex items-center border-2 border-[#ccc] rounded-md overflow-hidden w-full desktop:max-w-[300px] h-[40px]`}
              >
                <MdToday className="absolute ml-2.5" fontSize={22} />
                <input
                  type="date"
                  placeholder="date"
                  {...register('dateOfBirth')}
                  defaultValue={formatDate(user.dateOfBirth)}
                  className="px-2.5 py-3.5 pl-10 w-full outline-none"
                />
              </div>
              {errors.dateOfBirth && <p className="text-sm text-red">{errors.dateOfBirth?.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full desktop:w-[250px] text-white bg-primary py-3.5 mt-8 text-lg font-semibold rounded-lg hover:opacity-80"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MyInfo
