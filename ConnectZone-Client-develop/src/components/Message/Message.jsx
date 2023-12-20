import React, { Fragment, useContext } from 'react'
import { format } from 'timeago.js'
import vi from '../../utils/formatDate'
import Tippy from '@tippyjs/react/headless'
import { AuthContext } from '../../contexts/AuthContext'
import Video from '../Video/Video'
import { FaRegPlayCircle } from 'react-icons/fa'
import Image from '../Image/Image'

import { BsThreeDotsVertical } from 'react-icons/bs'
import { useState } from 'react'
import messageApi from '../../api/messageApi'
import OutsideClickWrapper from '../OutsideClickWrapper'
import useHover from '../../hook/useHover'
import { twMerge } from 'tailwind-merge'

const Message = ({ message, className = '', setListMessage }) => {
  const { user } = useContext(AuthContext)
  const [showIconDeleteMessage, setShowIconDeleteMessage] = useState(false)
  const [statusMessage, setStatusMessage] = useState(message?.status)
  const [showMenu, setShowMenu] = useState(false)
  const [ref, isHovered] = useHover({
    onMouseLeave: () => setShowMenu(false),
  })
  const renderPreview = (message) => {
    return (
      <div className="px-2.5 py-1.5 bg-black opacity-80 text-white rounded-xl text-sm">
        {format(message?.createdAt, 'vi')}
      </div>
    )
  }
  const handleShowIconDeleteMessage = () => {
    setShowIconDeleteMessage(true)
  }
  const handleHideIconDeleteMessage = () => {
    setShowIconDeleteMessage(false)
  }

  const handleDeleteMessage = async () => {
    const res = await messageApi.deleteMessageById(message?.id)
    console.log(res)
    setListMessage((prev) => {
      return prev.map((item) => {
        if (item?.id === res?.data?.message?.id) {
          return { ...item, status: res?.data?.message?.status }
        }
        return item
      })
    })
  }
  const renderPreviewDeleteMessage = () => {
    return (
      <Fragment>
        <div className="absolute w-[150px] bottom-[calc(100%+0px)] p-2 shadow-md rounded-md border border-borderColor z-40 bg-bgColor">
          <div className="p-2 cursor-pointer hover:bg-hoverColor" onClick={handleDeleteMessage}>
            Xoá, gỡ
          </div>
        </div>
      </Fragment>

    )
  }
  return (
    <div ref={ref} className={`flex items-center ${user?.id === message?.sender?.id && 'justify-end '}`}>
      {user?.id === message?.sender?.id && message?.status === "active" && (
        <Tippy render={() => renderPreviewDeleteMessage()} interactive placement="left-end">
          <div
            className={`${isHovered ? 'visible' : 'invisible'}   flex items-center justify-end relative p-2 rounded-full bg-bgColor cursor-pointer`}
            onClick={() => setShowMenu((pre) => !pre)}
          >
            <BsThreeDotsVertical fontSize={20} />
          </div>
        </Tippy>


      )}

      <div
        ref={ref}
        className={twMerge('flex items-center ', user?.id === message?.sender?.id && 'justify-end ', className)}
      >
        {user?.id === message?.sender?.id ? (
          ''
        ) : (
          <img src={message?.sender?.avatar?.url} className="w-8 h-8 object-cover rounded-full mr-1.5" />
        )}
        <div className={`${user?.id === message?.sender?.id && 'justify-end'}`}>
          {message?.status === 'deleted' ? (
            <div className="px-2.5 py-1.5 rounded-3xl border border-borderColor bg-bgColor">Tin nhắn đã bị thu hồi</div>
          ) : (
            <Fragment>
              {message.content.map((item, index) => {

                return (
                  <div>
                    <div
                      key={index}
                      className={`break-all flex items-center ${user?.id === message?.sender?.id ? 'justify-end ml-10' : 'mr-10'
                        }`}
                    >
                      <div>
                        <div className="flex flex-row items-center">
                          {item.includes('/chat/image') && (
                            <div className="w-full h-full cursor-auto">
                              <Image className="object-cover pointer-events-none  rounded-2xl" src={item} alt="" />
                            </div>
                          )}
                          {item.includes('/chat/video') && (
                            <div className="relative w-full h-full cursor-pointer rounded-2xl">
                              <Video width="100%" url={item} className="rounded-2xl" controls={true} />
                            </div>
                          )}
                        </div>
                        {!item.includes('/chat/image') && !item.includes('/chat/video') && (
                          <h2
                            className={`px-3 py-1.5 rounded-3xl bg-borderColor text-black ${user?.id === message?.sender?.id && 'bg-primary text-white'
                              }`}
                          >
                            {item}
                          </h2>
                        )}
                      </div>
                    </div>
                  </div>
                )

              })}
            </Fragment>
          )}

        </div>
      </div>

    </div >
  )
}

export default Message
