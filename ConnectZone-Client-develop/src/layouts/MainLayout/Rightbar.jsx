import React, { useContext, useState, useEffect } from 'react'
import { FaUserEdit } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import Avatar from '../../components/Avatar/Avatar'
import { AuthContext } from '../../contexts/AuthContext'
import ChatCard from '../../components/ChatCard/ChatCard'
import chatApi from '../../api/chatApi'
import { SocketContext } from '../../contexts/SocketContext'
import Button from '../../components/Button/Button'

const Rightbar = () => {
  const { user } = useContext(AuthContext)
  const [showChatCard, setShowChatCard] = useState(false)
  const [currentChat, setCurrentChat] = useState()
  const [showMenu, setShowMenu] = useState(false)
  const [showListFriend, setShowListFriend] = useState(false)
  const [newMessage, setNewMessage] = useState()

  const { socket } = useContext(SocketContext)




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
      <div className='relative py-2  bg-white rounded-lg border border-borderColor'>
        <div className='relative px-4 flex items-center justify-between '>
          <p className='text-xl font-semibold'>Người liên hệ</p>
          <div
            className='flex items-center p-3 rounded-full hover:bg-hoverColor cursor-pointer'
            onClick={() => setShowMenu(!showMenu)}
          >
            <span >
              <BsThreeDots fontSize={24} />
            </span>
          </div>
          {showMenu && (
            <div className='absolute right-0 top-11 w-80 border border-borderColor rounded-xl bg-white m-2'>
              <div className='px-2 py-2 mx-2 border-b border-borderColor'>
                <b className='py-2 text-xl font-semibold'>Cài đặt chat</b>
                <p className='py-2'>Tuỳ chỉnh trên Messenger</p>
              </div>
              <span onClick={() => {
                setShowListFriend((prev) => !prev)
                setShowMenu(false)
              }} className='flex items-center justify-between py-2 hover:bg-hoverColor cursor-pointer px-2 rounded-lg  my-1.5 mx-2'>
                <div className='flex items-center'>
                  <FaUserEdit />
                  <p className='text-lg ml-2'>Hiển thị danh bạ</p>
                </div>
                <div className={`${showListFriend ? "bg-primary" : "bg-textDelete"} p-3 rounded-full`}></div>
              </span>
            </div>
          )}
        </div>

        {showListFriend ? (
          <div>
            {user && user.friends && user.friends.length > 0 && user.friends.map((friend) => (
              <div
                key={friend?.id}
                onClick={() => handleOpenChatWithFriend(friend?.id)}
                className='px-3 mx-1 flex items-center py-2 hover:bg-hoverColor cursor-pointer rounded-lg'
              >
                <Avatar className='w-10 h-10 rounded-full object-cover' user={friend} />
                <p className='ml-5 text-lg'>{friend?.fullName}</p>
              </div>

            ))}
          </div>
        ) : (
          <Button
            className='bg-bgColor text-black font-medium flex justify-center w-[96%] mx-auto rounded-lg mt-5'
            onClick={() => setShowListFriend(true)}
          >
            Xem tất cả {"("} {user?.friends?.length} {")"}
          </Button>
        )}

        {showChatCard && (
          <ChatCard
            currentChat={currentChat}
            showChatCard={showChatCard}
            setShowChatCard={setShowChatCard}
            newMessage={newMessage}
          />
        )}

      </div >



    </>
  )
}

export default Rightbar