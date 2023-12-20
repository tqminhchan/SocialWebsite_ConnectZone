import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserCheck } from 'react-icons/fa'
import { BiUserX } from 'react-icons/bi'
import { FiUserX } from 'react-icons/fi'
import { BsMessenger } from 'react-icons/bs'
import { HiUserAdd } from 'react-icons/hi'
import { ClipLoader } from 'react-spinners'
import Image from '../../../components/Image/Image'
import Avatar from '../../../components/Avatar/Avatar'
import coverPic from '../../../assets/imgs/coverPic.jpg'
import Button from '../../../components/Button/Button'

import { AuthContext } from '../../../contexts/AuthContext'
import userApi from '../../../api/userApi'
import { SocketContext } from '../../../contexts/SocketContext'
import OutsideClickWrapper from '../../../components/OutsideClickWrapper'
import ChatCard from '../../../components/ChatCard/ChatCard'
import chatApi from '../../../api/chatApi'

const BackgroundOtherProfile = ({ currentUser }) => {
  const { socket } = useContext(SocketContext)
  const { user, dispatch } = useContext(AuthContext)
  const [showDeleteFriend, setShowDeleteFriend] = useState(false)
  const [showChatCard, setShowChatCard] = useState(false)
  const [currentChat, setCurrentChat] = useState()
  const [showMenu, setShowMenu] = useState(false)
  const [newMessage, setNewMessage] = useState()

  console.log(currentUser)

  const isFriend = user?.friends?.some((item) => {
    return item?.id === currentUser?.id
  })

  const isSentRequest = user?.friendRequestsSent?.some((item) => {
    return item?.id === currentUser?.id
  })

  const isReceiveRequest = user?.friendRequests?.some((item) => {
    return item?.id === currentUser?.id
  })

  const handleSendFriendRequest = async (myId, friendId) => {
    try {
      const data = {
        userId: myId,
        friendId: friendId,
      }
      const res = await userApi.sendFriendRequest(data)
      socket.emit('sendFriendRequest', { user: res?.data?.sender, friendSend: res?.data?.receiver })

      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'friendRequestsSent',
          value: res?.data?.sender?.friendRequestsSent,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleAcceptFriendRequest = async (myId, friendId) => {
    const data = {
      userId: myId,
      friendId: friendId,
    }
    const res = await userApi.sendFriendAccept(data)
    socket.emit('acceptFriendRequest', { user: res?.data?.senderAccept, friendAccepted: res?.data?.receiverAccept })
    dispatch({
      type: 'UPDATE_PROPERTY_USER',
      payload: {
        key: 'friendRequests',
        value: res?.data?.senderAccept?.friendRequests,
      },
    })
    dispatch({
      type: 'UPDATE_PROPERTY_USER',
      payload: {
        key: 'friends',
        value: res?.data?.senderAccept?.friends,
      },
    })
  }

  const handleCancelFriendRequest = async (myId, friendId) => {
    const data = {
      userId: myId,
      friendId: friendId,
    }
    const res = await userApi.cancelFriendRequest(data)
    socket.emit('cancelSentFriendRequest', { user: res?.data?.sender, friendRequest: res?.data?.receiver })
    dispatch({
      type: 'UPDATE_PROPERTY_USER',
      payload: {
        key: 'friendRequestsSent',
        value: res?.data?.sender?.friendRequestsSent,
      },
    })
  }

  const handleDeleteFriend = async (myId, friendId) => {
    const data = {
      userId: myId,
      friendId: friendId,
    }
    const res = await userApi.deleteFriend(data)
    setShowDeleteFriend(false)
    dispatch({
      type: 'UPDATE_PROPERTY_USER',
      payload: {
        key: 'friends',
        value: res?.data?.sender?.friends,
      },
    })
  }

  const handleOpenChatWithFriend = async (friendId) => {
    setShowChatCard(true)
    const res = await chatApi.getChatByUserId({
      params: {
        userId: friendId
      }
    })
    // console.log(res)
    socket.emit("joinChat", res?.data?.chat?.id)
    setCurrentChat(res?.data?.chat)

  }
  useEffect(() => {
    socket.on("notijoinchat", (data) => {
      // console.log(data)
    })
    socket.on("isTyping", (data) => {
      console.log(data)
    })
    socket.on("stopTyping", (data) => {
      // console.log(data)
    })
    socket.on("receiveMessage", (data) => {
      setNewMessage(data?.message)
      // console.log(data)
    })
  }, [])

  useEffect(() => {
    if (!showChatCard) {
      setCurrentChat()
    }
  }, [showChatCard])

  return (
    <>
      <div className="p-4 bg-white mb-7 rounded-2xl">
        <div>
          <Image
            className="h-[348px] w-full rounded-2xl pointer-events-none"
            src={currentUser?.background?.url || coverPic}
          />
        </div>
        <div className="relative flex justify-between">
          <Avatar
            user={currentUser}
            className="absolute opacity-100 w-[168px] h-[168px] object-cover left-8 -translate-y-1/3"
          />
          <h3 className="text-4xl font-bold ml-[220px] translate-y-5">{currentUser?.fullName}</h3>

          <div className="flex pt-10">
            {isSentRequest && (
              <Button
                className="mx-1.5 text-white bg-primary rounded-xl hover:opacity-80"
                onClick={() => handleCancelFriendRequest(user?.id, currentUser?.id)}
              >
                <span className="mr-2">
                  <FiUserX />
                </span>
                Huỷ lời mời
              </Button>
            )}
            {isReceiveRequest && (
              <Button
                className="mx-1.5 text-black bg-hoverColor rounded-xl hover:opacity-80"
                onClick={() => handleAcceptFriendRequest(user?.id, currentUser?.id)}
              >
                <span className="flex items-center mr-2">
                  <HiUserAdd fontSize={24} />
                </span>
                Chấp nhận kết bạn
              </Button>
            )}
            {!isFriend && !isSentRequest && !isReceiveRequest && (
              <Button
                className="flex items-center mx-1.5 bg-primary rounded-xl hover:opacity-80"
                onClick={() => handleSendFriendRequest(user?.id, currentUser?.id)}
              >
                <span className="flex items-center mr-2">
                  <HiUserAdd fontSize={24} />
                </span>
                Kết bạn
              </Button>
            )}

            {isFriend && (
              <OutsideClickWrapper onClickOutside={() => setShowDeleteFriend(false)}>
                <div className="relative">
                  <Button
                    className="mx-1.5 text-black bg-hoverColor rounded-xl hover:opacity-80"
                    onClick={() => setShowDeleteFriend((pre) => !pre)}
                  >
                    <span className="flex items-center mr-2">
                      <FaUserCheck /> <p className="ml-2.5">Bạn bè</p>
                    </span>
                  </Button>
                  {showDeleteFriend && (
                    <div className="absolute top-[100%] w-[200px] border border-borderColor rounded-md p-1.5 shadow-xl bg-white">
                      <div
                        className="p-2 hover:bg-hoverColor cursor-pointer flex items-center"
                        onClick={() => handleDeleteFriend(user.id, currentUser.id)}
                      >
                        <span className="mr-2">
                          <BiUserX fontSize={22} />
                        </span>
                        Hủy kết bạn
                      </div>
                    </div>
                  )}
                </div>
              </OutsideClickWrapper>
            )}

            <Button
              className="mx-1.5 text-black bg-hoverColor rounded-xl hover:opacity-80 "
              onClick={() => handleOpenChatWithFriend(currentUser?.id)}
            >
              <span className="flex items-center mr-2">
                <BsMessenger />{' '}
              </span>{' '}
              Nhắn tin
            </Button>
          </div>
        </div>
        <div className="pt-2 mt-12 border-t-2 border-borderColor">
          <ul className="flex">
            <Link to={`/profile/${currentUser?.id}`} className="px-1.5 tablet:px-4 py-1.5 tablet:py-3 rounded-xl cursor-pointer hover:bg-hoverColor ">
              <p className="text-base tablet:text-lg text-black font-medium">Bài viết</p>
            </Link>
            <Link to={`/profile/${currentUser?.id}/friends`} className="px-1.5 tablet:px-4 py-1.5 tablet:py-3 rounded-xl cursor-pointer hover:bg-hoverColor ">
              <p className="text-base tablet:text-lg text-black font-medium">Bạn bè</p>
            </Link>

          </ul>
        </div>
        {showChatCard && (
          <ChatCard
            currentChat={currentChat}
            showChatCard={showChatCard}
            setShowChatCard={setShowChatCard}
            newMessage={newMessage}
          />
        )}
      </div>

    </>
  )
}

export default BackgroundOtherProfile
