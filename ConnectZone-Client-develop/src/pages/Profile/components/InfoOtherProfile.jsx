import React, {Fragment, useEffect, useState} from 'react'
import {MdLocationOn} from 'react-icons/md'
import {FaUserAlt} from 'react-icons/fa'
import {BsClockFill} from 'react-icons/bs'
import hobbyApi from '../../../api/hobbyApi'

const InfoOtherProfile = ({currentUser}) => {
  const [hobbyUser, setHobbyUser] = useState([])

  const fetchHobbyUser = async () => {
    const res = await hobbyApi.getHobbiesUser({
      params: {
        userId: currentUser?.id,
      },
    })
    setHobbyUser(res?.data?.hobbies)
  }

  useEffect(() => {
    fetchHobbyUser()
  }, [currentUser])

  const date = new Date(currentUser.createdAt)
  return (
    <div className="flex flex-col px-5 py-5 bg-white border rounded-2xl border-borderColor">
      <strong className="text-[26px] font-semibold ">Giới thiệu</strong>
      {currentUser.bio && (
        <Fragment>
          <div className="flex flex-col items-center">
            <span className="pt-1 text-lg font-normal text-center">{currentUser.bio}</span>
          </div>
          <hr className="text-[#ccc]" />
        </Fragment>
      )}
      <ul className="mt-5">
        <li className="flex items-center px-4 mt-2">
          <FaUserAlt className="" fontSize={23} />
          <span className="ml-3 text-lg font-normal">
            Giới tính: {currentUser?.gender === 'male' ? 'Nam' : currentUser?.gender === 'female' ? 'Nữ' : 'Khác'}
          </span>
        </li>
        {currentUser?.address && (
          <li className="flex items-center px-4 mt-2">
            <MdLocationOn className="" fontSize={23} />
            <span className="ml-3 text-lg font-normal">Đến từ: {currentUser?.address}</span>
          </li>
        )}
        <li className="flex items-center px-4 mt-2">
          <BsClockFill className="" fontSize={23} />
          <span className="ml-3 text-lg font-normal">
            Tham gia từ tháng {date.getMonth() + 1} năm {date.getFullYear()}
          </span>
        </li>
        {hobbyUser.length > 0 && (
          <li className="flex mt-3.5 px-4 flex-wrap gap-3">
            {hobbyUser.map((item) => (
              <div key={item?.id} className="px-3 py-1.5 rounded-3xl border border-borderColor">
                {item?.content}
              </div>
            ))}
          </li>
        )}
      </ul>
    </div>
  )
}

export default InfoOtherProfile
