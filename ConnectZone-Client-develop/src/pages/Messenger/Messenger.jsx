import React, { useState, useEffect, Fragment, useContext, useRef, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BsThreeDots, BsChatSquareQuote, BsSendFill } from 'react-icons/bs'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import { useInView } from 'react-intersection-observer'
import { format } from 'timeago.js'
import vi from '../../utils/formatDate'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Link } from 'react-router-dom'
import { CiFaceSmile } from 'react-icons/ci'
import TextareaAutosize from 'react-textarea-autosize'
import Message from '../../components/Message/Message'
import chatApi from '../../api/chatApi'
import messageApi from '../../api/messageApi'
import Avatar from '../../components/Avatar/Avatar'
import { ClipLoader } from 'react-spinners'
import { AuthContext } from '../../contexts/AuthContext'
import { IoMdImages } from 'react-icons/io'
import Image from '../../components/Image/Image'
import Video from '../../components/Video/Video'

import { FaRegPlayCircle } from 'react-icons/fa'
import { SocketContext } from '../../contexts/SocketContext'
import { twMerge } from 'tailwind-merge'
import OutsideClickWrapper from '../../components/OutsideClickWrapper'

const Messenger = () => {
  const [showPicker, setShowPicker] = useState(false)
  const [emoji, setEmoji] = useState(null)
  const [listChat, setListChat] = useState([])
  const [listMessage, setListMessage] = useState([])
  const [message, setMessage] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const { user } = useContext(AuthContext)
  const [currentChat, setCurrentChat] = useState()
  const [listFileMedia, setListFileMedia] = useState([])
  const [loadingUploadFileMediaChat, setLoadingUploadFileMediaChat] = useState(false)
  const [showPreviewListMediaChat, setShowPreviewListMediaChat] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [isFirst, setIsFirst] = useState(false)
  const [heightTextArea, setHeightTextArea] = useState(62)
  const params = useParams()

  const { socket } = useContext(SocketContext)
  const { currentChatMessage } = useContext(AuthContext)

  const refChats = useRef(listChat)
  const refScroll = useRef()
  const textAreaRef = useRef()

  const handleKeyDown = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      handleSendMessage(e)
    }
  }

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      if (textAreaRef && textAreaRef.current) {
        textAreaRef.current.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [textAreaRef.current, message])

  const fetchAllChat = async () => {
    const res = await chatApi.getAllChat()
    setListChat(res?.data?.chats)
    const crrChat = res?.data?.chats.find((item) => item?.id === params?.id)
    setCurrentChat(crrChat)

    for (let chat of res?.data?.chats) {
      socket.emit('joinChat', chat?.id)
    }
  }
  useEffect(() => {
    fetchAllChat()
  }, [])

  useEffect(() => {
    refChats.current = listChat
  }, [listChat])

  useEffect(() => {
    socket.on('notijoinchat', (data) => { })
  })

  const handleSetLatestMessage = (chatId, message) => {
    let newListChat = [...refChats.current]
    console.log(newListChat)
    let indexChat
    newListChat = newListChat.map((chat, index) => {
      if (chat?.id === chatId) {
        chat.latestMessage = message
        indexChat = index
      }
      return chat
    })
    if (indexChat) {
      const newChat = newListChat[indexChat]
      newListChat.splice(indexChat, 1)
      newListChat.unshift(newChat)
    }
    setListChat(newListChat)
  }

  const handleReceiveMessage = (data) => {
    handleSetLatestMessage(data.chatId, data.message)
    setListMessage((prev) => [...prev, data?.message])
  }

  useEffect(() => {
    socket.on('receiveMessage', handleReceiveMessage)
  }, [])

  const handleGetChatMessage = async (pageParam) => {
    let currentPage = page
    if (pageParam) {
      currentPage = pageParam
    }
    setLoadingMessage(true)
    try {
      const res = await messageApi.getMessageByChatId({
        params: {
          page: currentPage,
          chatId: params?.id,
        },
      })

      setIsFirst(true)
      let renderData = res?.data?.messages
      renderData = renderData.reverse()
      setListMessage((prev) => [...renderData, ...prev])
      setTotalPages(res?.data?.metadata?.totalPages)
    } catch (error) { }
    setLoadingMessage(false)
  }

  const handleScrollToBottom = () => {
    if (refScroll && refScroll.current) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight
      setShouldScroll(false)
    }
  }

  useEffect(() => {
    if (page !== 1) {
      handleGetChatMessage()
    }
  }, [page, params?.id])

  useEffect(() => {
    setPage(1)
    setListMessage([])
    handleGetChatMessage(1)
    if (listChat.length > 0) {
      const crrChat = listChat.find((item) => item?.id === params?.id)
      setCurrentChat(crrChat)
    }
    setIsFirst(false)
  }, [params?.id])

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView) {
      if (page < totalPages) {
        setPage((prev) => {
          return prev + 1
        })
      }
    }
  }, [inView])

  const handleChangeMessage = (e) => {
    const msg = e.target.value
    setMessage(msg)
    if (msg.length > 0) {
      setIsTyping(true)
      socket.emit('isTyping', params?.id)
    }
  }
  const handleChangeFileChatMessage = async (e) => {
    setLoadingUploadFileMediaChat(true)
    setShowPreviewListMediaChat(true)
    try {
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      }
      const mediaFile = e.target.files[0]
      const data = new FormData()
      data.append('singleMedia', mediaFile)

      const res = await messageApi.uploadSingleFile(data, { config })

      setListFileMedia([...listFileMedia, res?.data?.singleMedia?.url])
      setLoadingUploadFileMediaChat(false)
    } catch (error) { }
  }
  const handleDeleteImagePreview = (index) => {
    const newListFileMedia = listFileMedia.filter((item, i) => i !== index)
    setListFileMedia(newListFileMedia)
  }
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (message.trim() === '') return
    try {
      const res = await messageApi.createMessage({
        chatId: params?.id,
        message: message,
        media: listFileMedia,
      })
      socket.emit('stopTyping', params?.id)
      setIsTyping(false)
      setShouldScroll(true)

      socket.emit('sendMessage', res?.data?.message, params?.id)
      handleSetLatestMessage(params?.id, res?.data?.message)
      setListMessage((prev) => [...prev, res?.data?.message])
      setShowPreviewListMediaChat(false)
    } catch (error) { }
    setMessage('')
    setListFileMedia([])
  }
  useEffect(() => {
    if (shouldScroll) {
      handleScrollToBottom()
    }
  }, [shouldScroll])

  useLayoutEffect(() => {
    if (isFirst) {
      handleScrollToBottom()
    }
  }, [isFirst])

  useEffect(() => {
    if (page === 1) {
      handleScrollToBottom()
    }
  }, [listMessage, params?.id])

  return (
    <div className="grid grid-cols-8 px-5 gap-x-5 ">
      <div className="fixed left-0 w-1/4 col-span-2">
        <div className="p-3 bg-white border border-borderColor ">
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">Chat</p>
            <div className="flex items-center">
              <span className="flex items-center justify-center p-3 rounded-full cursor-pointer bg-bg-color hover:bg-hoverColor">
                <BsThreeDots fontSize={24} />
              </span>
              <span className="flex items-center justify-center p-3 mx-3 rounded-full cursor-pointer bg-bg-color hover:bg-hoverColor">
                <BsChatSquareQuote fontSize={20} />
              </span>
              <span className="flex items-center justify-center p-3 rounded-full cursor-pointer bg-bg-color hover:bg-hoverColor">
                <HiOutlinePencilAlt fontSize={24} />
              </span>
            </div>
          </div>
          <div className="flex items-center px-4 py-3 rounded-full bg-bgColor">
            <AiOutlineSearch className="" fontSize={24} />
            <input
              type="text"
              className="outline-none ml-1.5 w-full text-lg bg-bgColor"
              alt=""
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="max-h-screen">
            {listChat &&
              listChat.length > 0 &&
              listChat.map((chatItem) => (
                <Link
                  to={`/nhan-tin/${chatItem?.id}`}
                  key={chatItem.id}
                  className="flex items-center px-3 py-3 mt-4 border-t cursor-pointer hover:bg-hoverColor border-borderColor rounded-xl"
                >
                  {chatItem?.users.map((friend) => {
                    if (friend?.id !== user?.id) {
                      return <Avatar user={friend} className="object-cover rounded-full w-14 h-14" key={friend.id} />
                    }
                  })}
                  <div className="flex flex-col ml-3 truncate w-[80%]">
                    {chatItem?.users.map((friend) => {
                      if (friend?.id !== user?.id) {
                        return <h1 className="text-lg font-medium leading-7">{friend?.fullName}</h1>
                      }
                    })}

                    <div className="flex items-center ">
                      {chatItem?.latestMessage &&
                        chatItem.latestMessage.content.map((item, index) => (
                          <div key={index} className="w-[70%]">
                            {item.includes('/image/upload') && (
                              <p className={`py-1 rounded-3xl text-[15px] font-extralight  text-black`}>Có 1 ảnh</p>
                            )}
                            {item.includes('/video/upload') && (
                              <p className={`py-1 rounded-3xl text-[15px] font-extralight  text-black`}>Có 1 video</p>
                            )}
                            {!item.includes('/image') && !item.includes('/video') && (
                              <p
                                className={`py-1 rounded-3xl text-[15px] font-extralight text-black text-ellipsis overflow-hidden ${item.length > 30 && 'w-[70%] truncate'
                                  }`}
                              >
                                {item}
                              </p>
                            )}
                          </div>
                        ))}
                      {chatItem && chatItem.latestMessage !== null && (
                        <span className="ml-2 text-sm">{format(chatItem?.latestMessage?.createdAt, 'vi')}</span>
                      )}
                      {chatItem?.latestMessage === null && <div>Chưa có tin nhắn</div>}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="fixed w-1/2 h-screen col-span-4 pt-1 -translate-x-1/2 bg-white border border-borderColor left-1/2">
        <div
          className="px-3.5 w-full overflow-y-auto"
          ref={refScroll}
          style={{
            height: `calc(100% - 100px - ${heightTextArea}px)`,
          }}
        >
          <Fragment>
            {loadingMessage && (
              <div className="flex items-center justify-center py-3 bg-white">
                <ClipLoader />
              </div>
            )}

            {listMessage.length > 0 &&
              listMessage.map((item, index) => (
                <div key={index} className="mb-3.5">
                  <Message key={item?.id} message={item} setListMessage={setListMessage} />
                  {index === 0 && <div ref={ref}></div>}
                </div>
              ))}
          </Fragment>
        </div>

        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="min-w-full flex items-center justify-between pt-2.5 overflow-visible relative"
        >
          {listFileMedia <= 0 && (
            <label className="flex items-center justify-center cursor-pointer">
              <span className="p-2.5 ml-2.5 rounded-full hover:bg-bgColor cursor-pointer">
                <IoMdImages fontSize={24} />
              </span>
              <input
                style={{ display: 'none' }}
                type="file"
                id="file"
                name="file"
                onChange={handleChangeFileChatMessage}
                multiple
              />
            </label>
          )}

          <span
            className={twMerge(
              'relative flex items-center justify-between w-full px-3 py-2 mx-5 bg-bgColor rounded-3xl',
              heightTextArea && `h-[${heightTextArea}px] max-h-[120px] overflow-auto`,
            )}
          >
            <TextareaAutosize
              type="text"
              placeholder="Aa"
              value={message}
              onChange={(e) => handleChangeMessage(e)}
              className="w-full pr-12 text-lg text-black outline-none bg-bgColor"
              onHeightChange={(height) => {
                if (height + 34 > 120 + 28) return
                setHeightTextArea(height + 34)
              }}
              ref={(tag) => {
                if (tag) {
                  textAreaRef.current = tag
                }
              }}
              autoFocus
            />
            <div
              className="absolute cursor-pointer bottom-1 right-4"
              onClick={() => setShowPicker(!showPicker)}
              onBlur={() => setShowPicker(false)}
            >
              <CiFaceSmile fontSize={36} />
            </div>
          </span>
          {showPicker && (
            <OutsideClickWrapper onClickOutside={() => setShowPicker(false)}>
              <div className="absolute bottom-[80%] right-0 z-[51] border rounded-lg border-borderColor">
                <Picker
                  theme="light"
                  searchPosition="none"
                  previewPosition="none"
                  emojiSize="30"
                  perLine="8"
                  navPosition="bottom"
                  data={data}
                  onEmojiSelect={(e) => {
                    setEmoji(e.native)
                    setMessage(message + e.native)
                  }}
                />
              </div>
            </OutsideClickWrapper>
          )}
          {showPreviewListMediaChat && listFileMedia.length > 0 && (
            <div className="w-full overflow-x-auto flex items-center absolute py-2.5 bottom-[100%] rounded-xl border border-borderColor z-50 bg-white">
              <label className="cursor-pointer ">
                <span className="p-3.5 ml-2.5 bg-bgColor flex items-center justify-center rounded-2xl hover:bg-borderColor cursor-pointer">
                  <IoMdImages fontSize={20} />
                </span>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleChangeFileChatMessage}
                  multiple
                />
              </label>
              <div className="flex items-center ">
                {listFileMedia &&
                  listFileMedia.length > 0 &&
                  listFileMedia.map((item, index) => (
                    <div key={index}>
                      <div key={index} className="relative mx-2 my-3">
                        <span
                          className="absolute -right-3.5 -top-3 w-7 h-7 rounded-full bg-white border border-borderColor flex justify-center items-center hover:bg-hoverColor cursor-pointer z-50"
                          onClick={() => handleDeleteImagePreview(index)}
                        >
                          <AiOutlineClose fontSize={18} />
                        </span>
                        {item?.includes('image') ? (
                          <div className="cursor-auto w-14 h-14">
                            <Image className="object-cover pointer-events-none rounded-2xl" src={item} alt="" />
                          </div>
                        ) : (
                          <div className="relative cursor-pointer w-14 h-14 rounded-2xl">
                            <Video width="100%" url={item} className="rounded-2xl" controls={false} />
                            <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                              <FaRegPlayCircle fontSize={20} color="white" />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <button type="submit" className=" p-2 mr-2.5 hover:bg-hoverColor cursor-pointer rounded-full">
            <BsSendFill fontSize={20} />
          </button>
        </form>
      </div>

      <div className="col-span-2 w-1/4 border border-borderColor fixed right-0 top-[100px] pt-10 bottom-0 ">
        <div className="flex flex-col items-center">
          {currentChat?.users.map((friend) => {
            if (friend?.id !== user?.id) {
              return (
                <>
                  <Avatar user={friend} className="object-cover rounded-full w-28 h-28" key={friend.id} />
                  <h1 className="mt-3 text-xl font-medium">{friend?.fullName}</h1>
                </>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Messenger
