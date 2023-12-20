import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BsChatSquareQuote, BsThreeDots } from 'react-icons/bs'
import { FiMessageSquare } from 'react-icons/fi'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import vi from '../../../utils/formatDate'
import Avatar from '../../../components/Avatar/Avatar'
import config from '../../../config'
import chatApi from '../../../api/chatApi'

import { AuthContext } from '../../../contexts/AuthContext'
import { SocketContext } from '../../../contexts/SocketContext'
import OutsideClickWrapper from '../../../components/OutsideClickWrapper'

const IconMessage = ({ listChatUnread, fetchMyChat = () => { }, listChat }) => {
  const { user, dispatch } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const [showListMessage, setShowListMessage] = useState(false)

  const handleShowListMessage = () => {
    setShowListMessage((prev) => !prev)
  }

  useEffect(() => {
    fetchMyChat()
  }, [showListMessage])

  return (
    <OutsideClickWrapper onClickOutside={() => setShowListMessage(false)}>
      <div
        className="relative p-3 mx-6 rounded-full cursor-pointer select-none bg-bgColor"
        onClick={() => {
          handleShowListMessage()
          dispatch({ type: 'SET_LIST_CHAT_UNREAD', payload: [] })
        }}
      >
        {listChatUnread && listChatUnread.length > 0 && (
          <span className="absolute flex items-center justify-center w-6 h-6 text-sm text-white border rounded-full bg-red border-borderColor -top-2 -right-2">
            {listChatUnread.length}
          </span>
        )}
        <FiMessageSquare fontSize={24} />
        {showListMessage && (
          <div className="absolute right-0 py-3 bg-white border top-[60px] w-96 border-borderColor rounded-xl">
            <div className="flex items-center justify-between px-3">
              <p className="text-xl font-medium">Chat</p>
              <div className="flex items-center">
                <span className="flex items-center justify-center p-3 rounded-full cursor-pointer bg-bg-color hover:bg-hoverColor">
                  <BsThreeDots fontSize={24} />
                </span>
                <Link to={config.routes.messenger}>
                  <span className="flex items-center justify-center p-3 mx-3 rounded-full cursor-pointer bg-bg-color hover:bg-hoverColor">
                    <BsChatSquareQuote fontSize={20} />
                  </span>
                </Link>
                <span className="flex items-center justify-center p-3 rounded-full cursor-pointer bg-bg-color hover:bg-hoverColor">
                  <HiOutlinePencilAlt fontSize={24} />
                </span>
              </div>
            </div>
            <div className="flex items-center px-4 py-3 mx-3 mb-3 rounded-full bg-bgColor">
              <AiOutlineSearch className="" fontSize={24} />
              <input
                type="text"
                className="outline-none ml-1.5 w-full text-lg bg-bgColor"
                alt=""
                placeholder="Tìm kiếm"
              />
            </div>
            <div className="mx-2 ">
              {listChat &&
                listChat.length > 0 &&
                listChat.map((chatItem) => (
                  <Link
                    key={chatItem?.id}
                    to={`/nhan-tin/${chatItem?.id}`}
                    className="flex items-center hover:bg-hoverColor rounded-lg px-2.5 py-1.5"
                  >
                    <Avatar
                      user={user?.id !== chatItem?.users[0].id ? chatItem?.users[0] : chatItem?.users[1]}
                      className="w-16 h-16 "
                    />
                    <div className="ml-3 w-[80%]">
                      <h1 className="mb-1 text-xl leading-none">
                        {user?.id !== chatItem?.users[0].id
                          ? chatItem?.users[0]?.fullName
                          : chatItem?.users[1]?.fullName}
                      </h1>
                      <span className="flex items-center">
                        <div className="truncate w-[60%]">
                          {chatItem?.latestMessage &&
                            chatItem.latestMessage.content.map((item, index) => (
                              <div key={index}>
                                {item.includes('/image/upload') && (
                                  <p className={`py-1 rounded-3xl text-[15px] font-extralight  text-black`}>Có 1 ảnh</p>
                                )}
                                {item.includes('/video/upload') && (
                                  <p className={`py-1 rounded-3xl text-[15px] font-extralight  text-black`}>
                                    Có 1 video
                                  </p>
                                )}
                                {!item.includes('/image') && !item.includes('/video') && (
                                  <p
                                    className={`py-1 rounded-3xl text-[15px] font-extralight text-black text-ellipsis ${item.length > 20 && 'w-[100%] truncate mr-auto'
                                      }`}
                                  >
                                    {item}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                        {chatItem && chatItem.latestMessage !== null && (
                          <h3 className="ml-1 text-sm "> . {format(chatItem?.latestMessage?.createdAt, 'vi')}</h3>
                        )}
                        {chatItem?.latestMessage === null && <div>Chưa có tin nhắn</div>}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </OutsideClickWrapper>
  )
}

export default IconMessage
