import React, { useContext, useEffect, useMemo, useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import { AuthContext } from '../../contexts/AuthContext'
import chatApi from '../../api/chatApi'
import { SocketContext } from '../../contexts/SocketContext'
import ChatCard from '../ChatCard/ChatCard'
const FriendsUser = ({ currentUser }) => {
  const [currentUserIdHover, setCurrentUserIdHover] = useState('')
  const [isLoadingCalculateMutualFriends, setIsLoadingCalculateMutualFriends] = useState(false)
  const params = useParams()
  const { socket } = useContext(SocketContext)
  const { user } = useContext(AuthContext)
  const [currentChat, setCurrentChat] = useState()
  const [newMessage, setNewMessage] = useState()
  const [showChatCard, setShowChatCard] = useState(false)



  const myMutualFriends = useMemo(() => {
    if (!currentUser.friends) {
      return []
    }
    if (currentUser.id === user.id) {
      return []
    }
    const mutualFriends = []
    if (currentUser && user) {
      for (const myFriend of user.friends) {
        for (const yourFriend of currentUser?.friends) {
          if (myFriend.id === yourFriend.id) {
            mutualFriends.push(myFriend)
          }
        }
      }
    }

    return mutualFriends
  }, [currentUser])


  const mutualFriends = useMemo(() => {
    setIsLoadingCalculateMutualFriends(true)
    const newMutualFriends = []
    if (currentUser.friends) {
      const currentFriend = currentUser.friends.find((friend) => friend.id === currentUserIdHover)
      if (currentFriend) {
        for (const userIdFriend of currentFriend.friends) {
          for (const myFriend of currentUser.friends) {
            if (userIdFriend === myFriend.id) {
              newMutualFriends.push(myFriend)
            }
          }
        }
      }
    }
    setIsLoadingCalculateMutualFriends(false)
    return newMutualFriends
  }, [currentUserIdHover, currentUser])


  const handleOpenChatWithFriend = async (friendId) => {
    setShowChatCard(true)
    const res = await chatApi.getChatByUserId({
      params: {
        userId: friendId
      }
    })
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
    })
  }, [])
  useEffect(() => {
    if (!showChatCard) {
      setCurrentChat()
    }
  }, [showChatCard])

  const renderPreview = (myFriend) => {
    const isFriend = user?.friends?.some((item) => item?.id === myFriend.id)

    return (
      <div className="hidden laptop:block laptop:w-[350px] border border-borderColor rounded-xl bg-white px-5 py-5">
        <div className="flex">
          <Avatar user={myFriend} className="w-20 h-20 border rounded-full" />
          <div className="flex flex-col ml-5">
            <h1 className="mb-2 text-xl font-bold">{myFriend?.fullName}</h1>
            {!isLoadingCalculateMutualFriends && mutualFriends.length > 0 && (
              <span>Có {mutualFriends.length} bạn chung</span>
            )}
            <p>Giới tính: {myFriend?.gender === 'male' ? 'Nam' : myFriend?.gender === 'female' ? 'Nữ' : 'Khác'}</p>

          </div>
        </div>
        <div className="flex items-center justify-end mt-4">
          {isFriend && (
            <Button type="button" className="text-white px-3 py-1.5 bg-primary rounded-xl mx-3">
              Bạn bè{' '}
            </Button>

          )}
          {myFriend?.id !== user?.id && (
            <Button
              type="button"
              className="text-black px-3 py-1.5 rounded-xl bg-bgColor"
              onClick={() => handleOpenChatWithFriend(myFriend?.id)}
            >
              Nhắn tin{' '}
            </Button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col p-3 tablet:p-5 mt-0 tablet:mt-5 bg-white rounded-none tablet:rounded-2xl border border-borderColor min-h-0  left-bar mb-0 tablet:mb-[100px]">
      <div className="flex justify-between items-center">

        <strong className="text-xl tablet:text-2xl font-semibold">Bạn bè</strong>
        <Link to={`/profile/${currentUser?.id}/friends`}>
          <span className="cursor-pointer">Xem tất cả</span>
        </Link>
      </div>
      <>
        {currentUser && currentUser?.friends && currentUser.friends.length > 0 && (
          <span className="text-xl font-normal pb-2.5 flex items-center">
            {currentUser.friends.length} Người bạn
            {myMutualFriends && myMutualFriends.length > 0 && (
              <p className="ml-1.5">
                {'('} {myMutualFriends.length} Bạn chung {')'}
              </p>
            )}
          </span>
        )}

      </>

      <div className="grid grid-cols-3 gap-x-3  tablet:gap-x-5 gap-y-3 tablet:gap-y-5 ">
        {currentUser &&
          currentUser.friends &&
          currentUser.friends.length > 0 &&
          currentUser.friends.slice(0, 9).map((friend, index) => (
            <Tippy render={() => renderPreview(friend)} tabIndex={index} interactive placement="bottom-start">
              <Link to={`/profile/${friend?.id}`} onMouseOver={() => setCurrentUserIdHover(friend?.id)}>
                <img src={friend?.avatar?.url} alt="" className="w-full h-[120px] tablet:h-[140px] object-cover rounded-lg shadow-md" />
                <h3 className="mt-3 text-sm tablet:text-lg font-medium leading-none whitespace-nowrap text-ellipsis truncate">{friend?.fullName}</h3>
              </Link>
            </Tippy>
          ))}
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
  )
}

export default FriendsUser
