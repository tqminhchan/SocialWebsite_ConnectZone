import React, { Fragment, useEffect, useState, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import { useInView } from 'react-intersection-observer'
import { AiOutlineClose, AiOutlineLine } from 'react-icons/ai'
import { IoMdImages } from 'react-icons/io'
import { CiFaceSmile } from 'react-icons/ci'
import { ClipLoader, SyncLoader } from 'react-spinners'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Message from '../Message/Message'
import { BsSendFill, BsThreeDotsVertical } from 'react-icons/bs'
import Avatar from '../Avatar/Avatar'
import messageApi from '../../api/messageApi'
import { AuthContext } from '../../contexts/AuthContext'
import Video from '../Video/Video'
import { FaRegPlayCircle } from 'react-icons/fa'
import Image from '../Image/Image'
import { SocketContext } from '../../contexts/SocketContext'
import config from '../../config'
import { Link } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { twMerge } from 'tailwind-merge'
import OutsideClickWrapper from '../OutsideClickWrapper'
import useHover from '../../hook/useHover'
import { useLayoutEffect } from 'react'
const ChatCard = ({ currentChat, showChatCard, setShowChatCard = () => { }, newMessage }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [emoji, setEmoji] = useState(null)
  const [message, setMessage] = useState('')
  const [listMessage, setListMessage] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [loadingUploadFileMediaChat, setLoadingUploadFileMediaChat] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [listFileMedia, setListFileMedia] = useState([])
  const [listMessageUnread, setListMessageUnread] = useState([])
  const [shouldScroll, setShouldScroll] = useState(false)
  const [heightTextArea, setHeightTextArea] = useState(57)
  const { user, dispatch } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)

  const currentChatRef = useRef(currentChat)

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


  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      console.log(currentChatRef.current?.id)
      console.log(data?.chatId === currentChatRef.current?.id)
      if (data?.chatId === currentChatRef.current?.id) {
        setListMessage((prev) => [...prev, data?.message])

      }
    })
    socket.on('isTyping', (data) => {
      setIsTyping(true)
    })
    socket.on('stopTyping', (data) => {
      setIsTyping(false)
    })
  }, [])

  useEffect(() => {
    if (refScroll && refScroll.current && page === 1) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight
    }
  }, [listMessage])

  const fetchMessage = async (page) => {
    setLoadingMessage(true)
    try {
      const res = await messageApi.getMessageByChatId({
        params: {
          page,
          chatId: currentChat.id,
        },
      })
      let renderData = res?.data?.messages
      renderData = renderData.reverse()
      setListMessage((prev) => [...renderData, ...prev])
      setTotalPages(res?.data?.metadata.totalPages)
    } catch (error) { }
    setLoadingMessage(false)
  }

  useEffect(() => {
    currentChatRef.current = currentChat
  }, [currentChat])

  useEffect(() => {
    setPage(1)
    setListMessage([])
    fetchMessage()
  }, [currentChat?.id])


  const handleScrollToBottom = () => {
    if (refScroll && refScroll.current) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight + 10000
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (message.trim() === '') return
    try {
      const res = await messageApi.createMessage({ chatId: currentChat.id, message: message, media: listFileMedia })
      socket.emit('stopTyping', currentChat.id)
      setShouldScroll(true)

      socket.emit('sendMessage', res?.data?.message, currentChat.id)
      setListMessage((prev) => [...prev, res?.data?.message])
      handleScrollToBottom()
    } catch (error) { }
    setMessage('')
    setListFileMedia([])
  }

  useEffect(() => {
    if (shouldScroll) {
      handleScrollToBottom()
    }
  }, [shouldScroll])
  const { ref, inView } = useInView({
    threshold: 0,
  })
  useEffect(() => {
    if (inView) {
      if (page < totalPages) {
        setPage((prev) => {
          fetchMessage(prev + 1)
          return prev + 1
        })
      }
    }
  }, [inView])


  const handleChangeMessage = (e) => {
    const msg = e.target.value
    setMessage(msg)
    setIsTyping(true)
    if (msg.length === 0) {
      socket.emit('stopTyping', currentChat.id)
    } else {
      socket.emit('isTyping', currentChat.id, user?.id)
    }
  }
  const handleChangeFileChatMessage = async (e) => {
    setLoadingUploadFileMediaChat(true)
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
      console.log(res)
      setListFileMedia([...listFileMedia, res?.data?.singleMedia?.url])
      setLoadingUploadFileMediaChat(false)
    } catch (error) { }
  }

  const handleDeleteImagePreview = (index) => {
    const newListFileMedia = listFileMedia.filter((item, i) => i !== index)
    setListFileMedia(newListFileMedia)
  }

  return (
    <>
      {currentChat && (
        <div className="fixed bottom-0 right-10 z-50 w-[350px] h-[500px] border border-borderColor bg-white rounded-xl">
          <div className="flex items-center justify-between absolute top-0 right-0 left-0 h-14 pr-1 pl-0.5 border-b border-borderColor">
            <Link
              to={`/nhan-tin/${currentChat?.id}`}
              className="flex items-center w-full py-2 pl-2 rounded-md cursor-pointer hover:bg-hoverColor"
              onClick={() => {
                dispatch({ type: 'SET_CURRENT_CHAT', payload: currentChat })
              }}
            >
              <Avatar
                user={user?.id !== currentChat?.users[0].id ? currentChat?.users[0] : currentChat?.users[1]}
                className="w-8 h-8"
              />
              <h1 className="text-black ml-1.5 font-medium text-lg">
                {user?.id !== currentChat?.users[0].id
                  ? currentChat?.users[0]?.fullName
                  : currentChat?.users[1]?.fullName}
              </h1>
            </Link>

            <div className="flex items-center">
              <span
                className="p-2 rounded-full hover:bg-hoverColor ml-0.5 cursor-pointer"
                onClick={() => {
                  setShowChatCard((prev) => !prev)
                  socket.emit('stopTyping', currentChat?.id)
                }}
              >
                <AiOutlineClose fontSize={18} />
              </span>
            </div>
          </div>

          <div
            ref={refScroll}
            className="w-full px-2 pt-1 overflow-y-auto mt-14"
            style={{
              height: `calc(100% - 56px - ${heightTextArea}px)`,
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
                  <div className="mb-3.5" key={index}>
                    <Message key={item?.id} message={item} className="" setListMessage={setListMessage} />
                    {index === 0 && <div ref={ref}></div>}
                  </div>
                ))}

              {isTyping ? (
                <div className="absolute right-3 ">
                  <SyncLoader size={6} speedMultiplier={0.7} color="black" margin={1} />
                </div>
              ) : (
                ''
              )}
            </Fragment>
          </div>
          <div
            className={twMerge(
              'absolute left-0 right-0 h-14',
              heightTextArea && `bottom-[calc(${heightTextArea - 60})]`,
            )}
          >
            <form
              onSubmit={(e) => handleSendMessage(e)}
              className="relative flex items-center justify-between bg-white border-t border-borderColor"
            >
              {listFileMedia <= 0 && (
                <label className="flex items-center justify-center cursor-pointer">
                  <span className="p-2.5 ml-2.5 rounded-full hover:bg-bgColor cursor-pointer">
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
              )}

              <span
                className={twMerge(
                  'relative flex items-center justify-between w-full px-2 py-2 mx-2 mt-3 bg-bgColor rounded-3xl',
                  heightTextArea && `h-[${heightTextArea}px] max-h-[100px] overflow-auto`,
                )}
              >
                <TextareaAutosize
                  type="text"
                  placeholder="Aa"
                  value={message}
                  onChange={(e) => handleChangeMessage(e)}
                  className="w-full pr-10 text-lg text-black outline-none bg-bgColor"
                  onHeightChange={(height) => {
                    if (height + 29 > 100 + 28) return
                    setHeightTextArea(height + 29)
                  }}
                  ref={(tag) => {
                    if (tag) {
                      textAreaRef.current = tag
                    }
                  }}
                  autoFocus
                />
                <div
                  className="cursor-pointer absolute bottom-2.5 right-4"
                  onClick={() => setShowPicker(!showPicker)}
                  onBlur={() => setShowPicker(false)}
                >
                  <CiFaceSmile fontSize={26} />
                </div>
              </span>
              {showPicker && (
                <div className="absolute right-0 z-[51] border rounded-lg bottom-[60%] border-borderColor">
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
              )}
              {/* hien thi anh preview trong doan chat */}
              {listFileMedia && listFileMedia.length > 0 && (
                <div className="w-full overflow-x-auto  bg-white flex items-center absolute bottom-[100%] py-2.5  rounded-xl border border-borderColor z-50">
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
                        <div>
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
        </div>
      )}
    </>
  )
}

export default ChatCard
