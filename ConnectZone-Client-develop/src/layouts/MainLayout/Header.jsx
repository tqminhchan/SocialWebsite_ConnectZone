import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { GoSignOut } from 'react-icons/go'
import Search from '../../components/Search/Search'
import { BsBell, BsThreeDots, BsChatSquareQuote } from 'react-icons/bs'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import { FiMessageSquare } from 'react-icons/fi'
import Tippy from '@tippyjs/react/headless'
import { format } from 'timeago.js'
import vi from '../../utils/formatDate'
import Image from '../../components/Image/Image'
import { AuthContext } from '../../contexts/AuthContext'
import handleLocalStorage from '../../utils/handleLocalStorage'
import HandleAuthToken from '../../utils/HandleAuthToken'
import OutsideClickWrapper from '../../components/OutsideClickWrapper'
import IconMessage from './components/IconMessage'
import { FaUserAlt } from 'react-icons/fa'
import routes from '../../config/routes'
import { SocketContext } from '../../contexts/SocketContext'
import chatApi from '../../api/chatApi'
import Avatar from '../../components/Avatar/Avatar'
import SearchMobile from '../../components/Search/SearchMobile'
import notiApi from '../../api/notiApi'
import userApi from '../../api/userApi'
import { twMerge } from 'tailwind-merge'
const Header = () => {
  const { user, dispatch, notifications, listChatUnread } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()
  const [showListMessage, setShowListMessage] = useState(false)
  const [showInfoUser, setShowInfoUser] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [listChat, setListChat] = useState([])
  const [showInputMessage, setShowInputMessage] = useState(false)
  const handleSignOut = () => {
    handleLocalStorage.delete('accessToken')
    HandleAuthToken()
    dispatch({ type: 'LOGOUT' })
    navigate('/dang-nhap')
  }

  const handleShowNotification = async () => {
    setShowNotifications(!showNotifications)
    if (user.notificationUnread > 0) {
      await notiApi.readNotification()
      dispatch({ type: 'SET_NOTIFICATION_UNREAD', payload: 0 })
    }
  }

  const handleUpdateListChatUnread = (chatId) => {
    if (!chatId) return
    const chat = listChatUnread.find((item) => item === chatId)
    if (chat) return
    dispatch({ type: 'SET_LIST_CHAT_UNREAD', payload: [...listChatUnread, chatId] })
  }

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      handleUpdateListChatUnread(data.chatId)
    })
  }, [])

  const fetchMyChat = async () => {
    const res = await chatApi.getAllChat()
    setListChat(res?.data?.chats)
    for (let chat of res?.data?.chats) {
      socket.emit('joinChat', chat?.id)
    }
  }

  useEffect(() => {
    fetchMyChat()
  }, [])
  const handleShowInputMessage = () => {
    setShowInputMessage((prev) => !prev)
  }

  const handleReadNotification = async (notificationId) => {
    try {
      await notiApi.readNotification({
        notificationId: notificationId,
      })
      const newNotifications = notifications.map((item) => {
        if (item._id === notificationId) {
          return { ...item, status: 'read' }
        }
        return item
      })
      dispatch({ type: 'SET_NOTIFICATION', payload: newNotifications })
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateUnreadNotification = async () => {
    if (user.notificationUnread > 0) {
      try {
        await userApi.readAllNotifications()
        dispatch({
          type: 'UPDATE_PROPERTY_USER',
          payload: {
            key: 'notificationUnread',
            value: 0,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      {showInputMessage ? (
        <SearchMobile setShowInputMessage={setShowInputMessage} />
      ) : (
        <div className="sticky top-0 z-20 flex flex-row items-center justify-between px-3 py-3 tablet:py-6 bg-white border-b laptop:px-6 border-borderColor">
          <div className="basis-1/4 mr-3 tablet:mr-0">
            <Link to="/">
              <h1 className="text-2xl font-extrabold cursor-pointer laptop:text-3xl text-primary">ConnectZone</h1>
            </Link>
          </div>
          <div className="hidden basis-1/2 tablet:block">
            <Search />
          </div>
          <div className="items-center justify-end hidden basis-1/4 tablet:flex">
            <OutsideClickWrapper onClickOutside={() => setShowNotifications(false)}>
              <div className="relative">
                <div
                  className="relative p-3 rounded-full cursor-pointer bg-bgColor "
                  onClick={() => {
                    handleUpdateUnreadNotification()
                    handleShowNotification()
                  }}
                >
                  <BsBell fontSize={24} />
                  {notifications.length > 0 && user.notificationUnread > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white rounded-full bg-red">
                      {user.notificationUnread}
                    </span>
                  )}
                </div>

                {showNotifications && notifications && notifications.length > 0 && (
                  <div className="w-[450px] pt-3 border border-borderColor bg-white rounded-xl absolute right-0 top-[calc(100%+8px)] z-40 max-h-[50vh] overflow-auto">
                    <div className="px-4 pb-3">
                      <p className="text-2xl font-bold">Thông báo</p>
                    </div>
                    {notifications &&
                      notifications.map((item, index) => {
                        const isRead = item.status === 'read'
                        let path = ''
                        if (item.type === 'friendRequest' || item.type === 'friendRequestAccepted') {
                          path = `/profile/${item?.sender.id}`
                        }

                        if (item.type === 'likePost' || item.type === 'comment' || item.type === 'replyComment') {
                          path = `/chi-tiet-bai-viet/${item?.post}`
                        }

                        return (
                          <Link
                            key={index}
                            to={path}
                            className="flex items-center p-4 cursor-pointer hover:bg-hoverColor justify-between"
                            onClick={() => handleReadNotification(item?._id)}
                          >
                            <div className="flex items-center max-w-[90%]">
                              <Avatar user={item?.sender} className="rounded-full w-14 h-14 shrink-0" />
                              <div className="ml-4">
                                <span className={twMerge('leading-none text-black', isRead ? '' : 'font-semibold')}>
                                  {item?.content}
                                </span>
                                <p className={twMerge('text-sm', isRead ? 'text-black' : 'text-primary font-semibold')}>
                                  {format(item?.createdAt, 'vi')}
                                </p>
                              </div>
                            </div>
                            {!isRead && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                          </Link>
                        )
                      })}
                  </div>
                )}
              </div>
            </OutsideClickWrapper>
            <IconMessage listChatUnread={listChatUnread} fetchMyChat={fetchMyChat} listChat={listChat} />
            <div className="relative">
              <OutsideClickWrapper onClickOutside={() => setShowInfoUser(false)}>
                <div>
                  <div className="w-12 h-12 cursor-pointer " onClick={() => setShowInfoUser((pre) => !pre)}>
                    <Image src={user?.avatar?.url} alt="" className="" />
                  </div>
                  <span className="absolute w-20 h-5 bg-white top-[100%] right-0"></span>
                  {showInfoUser && (
                    <div className="top-[100%] right-0 absolute">
                      <div className="bg-white rounded-lg z-40 border border-borderColor w-[400px] mt-2 pb-1 pt-3 shadow-2xl">
                        <div className="mx-4 rounded-lg">
                          <Link
                            to={`/profile/${user?._id}`}
                            className="flex items-center p-3.5 rounded-lg hover:bg-hoverColor mb-1"
                          >
                            <Image src={user?.avatar?.url} alt="" className="object-cover w-10 h-10 rounded-full" />
                            <span className="text-xl font-medium ml-2.5 select-none">{user?.fullName}</span>
                          </Link>
                          <hr className="text-[#ccc]" />
                        </div>
                        <ul tabIndex="-1" className="mx-2 mt-5 cursor-pointer">
                          <li className="px-4 py-3 rounded-lg hover:bg-hoverColor">
                            <Link to={routes.me} className="flex items-center">
                              <div className="p-2.5 bg-borderColor rounded-full mr-3">
                                <FaUserAlt className="" fontSize={26} />
                              </div>
                              <span className="text-lg font-medium">Thông tin người dùng</span>
                            </Link>
                          </li>
                          <li className="px-4 py-3 rounded-lg hover:bg-hoverColor">
                            <Link to={routes.changePassword} className="flex items-center">
                              <div className="p-2.5 bg-borderColor rounded-full mr-3">
                                <RiLockPasswordLine className="" fontSize={26} />
                              </div>
                              <span className="text-lg font-medium">Thay đổi mật khẩu</span>
                            </Link>
                          </li>
                          <li className="px-4 py-3 rounded-lg hover:bg-hoverColor" onClick={handleSignOut}>
                            <Link className="flex items-center">
                              <div className="p-2.5 bg-borderColor rounded-full mr-3">
                                <GoSignOut fontSize={26} className="" />
                              </div>
                              <span className="text-lg font-medium">Đăng xuất</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </OutsideClickWrapper>
            </div>
          </div>
          <div className="flex items-center justify-end basis-1/2 tablet:hidden">
            <span className="p-3 rounded-full cursor-pointer bg-bgColor" onClick={handleShowInputMessage}>
              <AiOutlineSearch fontSize={24} />
            </span>
            <IconMessage listChatUnread={listChatUnread} fetchMyChat={fetchMyChat} listChat={listChat} />
          </div>
        </div>
      )}
    </>
  )
}

export default Header
