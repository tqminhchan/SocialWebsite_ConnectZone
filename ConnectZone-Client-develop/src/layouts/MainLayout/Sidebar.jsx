import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import { HiUsers } from 'react-icons/hi'
import Avatar from '../../components/Avatar/Avatar'
import { AuthContext } from '../../contexts/AuthContext'
import config from '../../config'
const Sidebar = () => {
  const { user } = useContext(AuthContext)
  return (
    <>
      <div
        className="bg-white border rounded-lg laptop:px-4 laptop:py-2 tablet:px-0 tablet:py-1 border-borderColor"
      >
        <Link
          to="/"
          className="flex items-center px-3 py-2 mx-1 rounded-lg cursor-pointer hover:bg-hoverColor"
        >
          <span className="flex items-center justify-center w-10 h-10">
            <AiFillHome fontSize={24} />
          </span>
          <p className="laptop:ml-5 tablet:ml-2 laptop:text-lg tablet:text-base">Trang chủ</p>
        </Link>
        <Link
          to={`/profile/${user?._id}`}
          className="flex items-center px-3 py-2 mx-1 rounded-lg cursor-pointer hover:bg-hoverColor"
        >
          <Avatar user={user} className="w-10 h-10 shrink-0" />
          <p className="laptop:ml-5 tablet:ml-2 laptop:text-lg tablet:text-base">{user?.fullName}</p>
        </Link>
        <Link
          to={config.routes.suggestFriends}
          className="flex items-center px-3 py-2 mx-1 rounded-lg cursor-pointer hover:bg-hoverColor"
        >
          <span className="flex items-center justify-center w-10 h-10">
            <HiUsers fontSize={24} />
          </span>
          <p className="laptop:ml-5 tablet:ml-2 laptop:text-lg tablet:text-base">Gợi ý kết bạn</p>
        </Link>
      </div>
    </>
  )
}

export default Sidebar
