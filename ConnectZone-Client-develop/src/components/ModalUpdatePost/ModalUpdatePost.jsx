import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
import { CiFaceSmile } from 'react-icons/ci'
import { FaFolderPlus, FaRegPlayCircle, FaPen, FaLock, FaUserFriends, FaChevronDown } from 'react-icons/fa'
import { BsImages } from 'react-icons/bs'
import { IoMdPersonAdd } from 'react-icons/io'
import { HiLocationMarker, HiFolderAdd } from 'react-icons/hi'
import { TbGif } from 'react-icons/tb'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import TextareaAutosize from 'react-textarea-autosize'
import { ClipLoader } from 'react-spinners'
import Image from '../Image/Image'
import Button from '../Button/Button'
import MyModal from '../MyModal/MyModal'
import ModalUpdateAllPic from '../ModalUpdateAllPic/ModalUpdateAllPic'
import Video from '../Video/Video'
import { AuthContext } from '../../contexts/AuthContext'
import postApi from '../../api/postApi'

import { twMerge } from 'tailwind-merge'
import OutsideClickWrapper from '../OutsideClickWrapper'
import { BiWorld } from 'react-icons/bi'

const ModalUpdatePost = ({ post, isOpen, setIsOpen, handleClose, listPost, setListPost = () => { } }) => {
  const { user } = useContext(AuthContext)
  const [showPicker, setShowPicker] = useState(false)
  const [emoji, setEmoji] = useState(null)
  const [showAddImage, setShowAddImage] = useState(true)
  const [content, setContent] = useState(post?.content)
  const [loading, setLoading] = useState(false)
  const [isOpenModalUpdatePic, setIsOpenModalUpdatePic] = useState(false)
  const [fileList, setFileList] = useState(post?.media)
  const [filesDelete, setFilesDelete] = useState([])

  const [status, setStatus] = useState(post?.status)
  const [isShowListStatus, setIsShowListStatus] = useState(false)

  const handleFileInputChange = (e) => {
    const mediaFiles = Array.from(e.target.files)
    setFileList([...fileList, ...mediaFiles])
  }

  const handleUpdateAllPicture = () => {
    setIsOpenModalUpdatePic(true)
    setIsOpen((prev) => !prev)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let newProfilePosts = [...listPost]
    setLoading((prev) => !prev)
    const fileLocal = fileList.filter((item) => item.public_id === undefined)
    const formdata = new FormData()
    for (let i = 0; i < fileLocal.length; i++) {
      formdata.append('media', fileLocal[i])
    }
    formdata.append('listFileDelete', JSON.stringify(filesDelete))
    formdata.append('content', content)
    formdata.append('status', status)
    const res = await postApi.updateSinglePost(post._id, formdata)
    console.log(res)
    listPost.forEach((item, index) => {
      if (item?.id === res?.data?.post?.id) {
        newProfilePosts[index] = res?.data?.post
      }
    })
    setListPost(newProfilePosts)
    if (res?.data?.success) {
      setLoading((prev) => !prev)
      setIsOpen((prev) => !prev)
      setFileList(res?.data?.post?.media)
      setIsOpenModalUpdatePic(false)
    }
  }
  const handleDeleteAllFile = (fileList) => {
    fileList.map((item) => {
      if (item?.public_id) {
        setFilesDelete((prev) => [...prev, item])
      } else {
        setFileList([])
      }
    })
  }
  const clonedFileList = [...post?.media]
  const renderFour = clonedFileList.slice(0, 4)
  const numberHide = post?.media.length - 3

  return (
    <React.Fragment>
      <MyModal isOpen={isOpen} handleClose={handleClose}>
        <form className="w-[650px] bg-white px-2" onSubmit={handleSubmit}>
          <div className="relative flex items-center justify-center py-5 mb-5 border-b border-borderColor">
            <p className="text-3xl font-semibold">Cập nhật bài viết</p>
            <span className="absolute right-0 p-3 rounded-full cursor-pointer bg-borderColor" onClick={handleClose}>
              <AiOutlineClose fontSize={24} />
            </span>
          </div>
          <div className="flex items-center mb-5">
            <Link to={`/profile/${user._id}`}>
              <Image src={user?.avatar?.url} alt="" className="w-14 h-14" />
            </Link>
            <div className="flex flex-col ml-3">
              <Link to={`/profile/${user._id}`}>
                <h2 className="ml-3 text-xl font-medium ">{user.fullName}</h2>
              </Link>
              <OutsideClickWrapper onClickOutside={() => setIsShowListStatus(false)}>
                <div className="relative min-w-">
                  <p
                    className="relative flex items-center justify-between px-2 py-1 cursor-pointer select-none rounded-xl bg-borderColor"
                    onClick={() => setIsShowListStatus((prev) => !prev)}
                  >
                    {status === 'public' && (
                      <div className="flex items-center">
                        <span className="mr-1.5">
                          <BiWorld />
                        </span>
                        Công khai
                      </div>
                    )}
                    {status === 'friend' && (
                      <div className="flex items-center">
                        <span className="mr-1.5">
                          <FaUserFriends />
                        </span>
                        Bạn bè
                      </div>
                    )}
                    {status === 'private' && (
                      <div className="flex items-center">
                        <span className="mr-1.5">
                          {' '}
                          <FaLock />
                        </span>
                        Chỉ mình tôi
                      </div>
                    )}

                    <span>
                      <FaChevronDown />
                    </span>
                  </p>
                  {isShowListStatus && (
                    <ul className="absolute z-30 w-full py-1 rounded-lg top-9 bg-bgColor">
                      <li
                        onClick={() => {
                          setStatus('public')
                          setIsShowListStatus((prev) => !prev)
                        }}
                        className="flex items-center px-2 py-1 cursor-pointer hover:bg-hoverColor"
                      >
                        <span>
                          <BiWorld />
                        </span>
                        <p className="pl-2">Công khai</p>
                      </li>
                      <li
                        onClick={() => {
                          setStatus('friend')
                          setIsShowListStatus((prev) => !prev)
                        }}
                        className="flex items-center px-2 py-1 cursor-pointer hover:bg-hoverColor"
                      >
                        <span>
                          <FaUserFriends />
                        </span>
                        <p className="pl-2">Bạn bè</p>
                      </li>
                      <li
                        onClick={() => {
                          setStatus('private')
                          setIsShowListStatus((prev) => !prev)
                        }}
                        className="flex items-center px-2 py-1 cursor-pointer hover:bg-hoverColor"
                      >
                        <span>
                          <FaLock />
                        </span>
                        <p className="pl-2">Chỉ mình tôi</p>
                      </li>
                    </ul>
                  )}
                </div>
              </OutsideClickWrapper>
            </div>
          </div>
          <div className="max-h-[405px] overflow-y-auto custom-scrollbar">
            <span className="relative flex items-center justify-between mt-5">
              <TextareaAutosize
                type="text"
                value={content}
                placeholder="Bạn đang nghĩ gì thế?"
                className="pt-3 pb-3 pr-3 py-2.5 outline-none text-xl w-full max-h-[150px] overflow-auto custom-scrollbar"
                onChange={(e) => {
                  setContent(e.target.value)
                }}
                onBlur={() => setShowPicker(false)}
                onFocus={() => setShowPicker(false)}
                minRows={1}
              />

              <div
                className="cursor-pointer"
                onClick={() => setShowPicker(!showPicker)}
                onBlur={() => setShowPicker(false)}
              >
                <CiFaceSmile fontSize={36} />
              </div>

              {showPicker && (
                <div className="absolute right-0 z-50 border rounded-lg top-12 border-borderColor">
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
                      setContent(content + e.native)
                    }}
                  />
                </div>
              )}
            </span>

            {showAddImage && (
              <div className="relative w-full min-h-[276px] mt-10 border border-borderColor bg-white p-2.5 rounded-2xl">
                {fileList.length === 0 && (
                  <label className="flex flex-col items-center justify-center p-6 cursor-pointer rounded-2xl bg-bgColor">
                    <p className="flex items-center justify-center p-4 rounded-full mt-14 bg-borderColor">
                      <FaFolderPlus fontSize={34} />
                    </p>
                    <span className="pt-3 pb-10 ml-1 text-2xl font-medium">Thêm ảnh/video</span>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileInputChange}
                      multiple
                    />
                  </label>
                )}
                {fileList && fileList.length === 1 && (
                  <div className="grid justify-between w-full grid-cols-1">
                    {fileList &&
                      fileList.length > 0 &&
                      fileList.map((item, index) => (
                        <div key={index} className="">
                          {item?.resource_type?.startsWith('image') || item?.type?.startsWith('image') ? (
                            <div className="h-[232px]">
                              <Image
                                className="rounded-lg pointer-events-none"
                                src={item?.url ? item.url : URL.createObjectURL(item)}
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Video
                                height="100%"
                                width="100%"
                                url={item?.url ? item.url : URL.createObjectURL(item)}
                                className=""
                                controls={false}
                              />
                              <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                                <FaRegPlayCircle fontSize={100} color="white" />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {fileList && fileList.length === 2 && (
                  <div className="justify-between w-full">
                    {fileList &&
                      fileList.length > 0 &&
                      fileList.map((item, index) => (
                        <div key={index} className="h-[232px] ">
                          {item?.resource_type?.startsWith('image') || item?.type?.startsWith('image') ? (
                            <div className="h-[232px]">
                              <Image
                                className="rounded-lg pointer-events-none"
                                src={item?.url ? item.url : URL.createObjectURL(item)}
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="relative ">
                              <Video
                                height="232px"
                                width="100%"
                                url={item?.url ? item.url : URL.createObjectURL(item)}
                                className=""
                                controls={false}
                              />
                              <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                                <FaRegPlayCircle fontSize={100} color="white" />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {fileList && fileList.length === 3 && (
                  <div className="grid justify-between w-full grid-cols-2 gap-1">
                    {fileList &&
                      fileList.length > 0 &&
                      fileList.map((item, index) => (
                        <div key={index} className={`${index === 0 ? 'col-span-2 ' : ''}`}>
                          {item?.resource_type?.startsWith('image') || item?.type?.startsWith('image') ? (
                            <div className="h-[232px]">
                              <Image
                                className="rounded-lg pointer-events-none"
                                src={item?.url ? item.url : URL.createObjectURL(item)}
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Video
                                height="232px"
                                width="100%"
                                url={item?.url ? item.url : URL.createObjectURL(item)}
                                className=""
                                controls={false}
                              />
                              <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                                <FaRegPlayCircle fontSize={100} color="white" />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {fileList && fileList.length === 4 && (
                  <div className="grid justify-between w-full grid-cols-2 gap-1">
                    {fileList &&
                      fileList.length > 0 &&
                      fileList.map((item, index) => (
                        <div key={index}>
                          {item?.resource_type?.startsWith('image') || item?.type?.startsWith('image') ? (
                            <div className="h-[232px]">
                              <Image
                                className="rounded-none pointer-events-none"
                                src={item?.url ? item.url : URL.createObjectURL(item)}
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Video
                                height="232px"
                                width="100%"
                                url={item?.url ? item.url : URL.createObjectURL(item)}
                                controls={false}
                              />
                              <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                                <FaRegPlayCircle fontSize={100} color="white" />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {fileList && fileList.length >= 5 && (
                  <div className="grid justify-between w-full grid-cols-2 gap-1">
                    {renderFour.length > 0 &&
                      renderFour.map((item, index) => (
                        <div key={index}>
                          {item?.resource_type?.startsWith('image') || item?.type?.startsWith('image') ? (
                            <div className={`h-[232px]`}>
                              <Image
                                className={`rounded-none pointer-events-none `}
                                src={item?.url ? item.url : URL.createObjectURL(item)}
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Video
                                height="232px"
                                width="100%"
                                url={item?.url ? item.url : URL.createObjectURL(item)}
                                controls={false}
                              />
                              <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                                <FaRegPlayCircle fontSize={100} color="white" />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    {renderFour[renderFour.length - 1] && (
                      <p className="absolute bottom-1/4 right-1/4 translate-x-[50%] text-white font-semibold text-5xl">
                        + {numberHide}
                      </p>
                    )}
                  </div>
                )}

                <span
                  className="absolute top-0 right-0 p-3 mt-5 mr-5 bg-white border rounded-full cursor-pointer border-borderColor hover:bg-hoverColor"
                  onClick={() => handleDeleteAllFile(fileList)}
                >
                  <AiOutlineClose />
                </span>
                {fileList.length > 0 && (
                  <div className="absolute z-20 flex top-5 left-5 ">
                    <label className="flex items-center justify-center px-4 mr-4 text-lg font-medium bg-white rounded-lg cursor-pointer">
                      <span className="mr-2">
                        <HiFolderAdd fontSize={24} />
                      </span>
                      <span className="text-black ">Thêm ảnh/video</span>
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleFileInputChange}
                        multiple
                      />
                    </label>
                    <Button
                      className="text-black px-4 py-2.5 rounded-lg bg-white mr-3"
                      onClick={handleUpdateAllPicture}
                    >
                      <span className="mr-2">
                        <FaPen fontSize={22} />
                      </span>
                      Chỉnh sửa tất cả
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-5 mt-5 border border-borderColor rounded-xl">
            <p className="text-xl font-medium">Thêm vào bài viết của bạn</p>
            <ul className="flex items-center">
              <li
                className="ml-3.5 p-4 rounded-full cursor-pointer hover:bg-hoverColor "
                onClick={() => setShowAddImage(true)}
              >
                <BsImages color="green" fontSize={30} />
              </li>
              <li className="ml-3.5 p-4 rounded-full cursor-pointer hover:bg-hoverColor ">
                <IoMdPersonAdd color="blue" fontSize={30} />
              </li>
              <li className="ml-3.5 p-4 rounded-full cursor-pointer hover:bg-hoverColor ">
                <HiLocationMarker color="orange" fontSize={30} />
              </li>
              <li className="ml-3.5 p-4 rounded-full cursor-pointer hover:bg-hoverColor ">
                <TbGif fontSize={30} />
              </li>
            </ul>
          </div>
          <div className="my-3">
            <Button
              type="submit"
              className={`flex justify-center items-center text-xl font-medium rounded-md mt-5 w-full 
              ${content === '' ? ' bg-borderColor pointer-events-none cursor-not-allowed' : 'bg-primary'}`}
            >
              {loading ? <ClipLoader color="#36d7b7" /> : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </MyModal>
      {isOpenModalUpdatePic === true && (
        <ModalUpdateAllPic
          post={post}
          setFilesDelete={setFilesDelete}
          isOpen={isOpenModalUpdatePic}
          setIsOpen={setIsOpenModalUpdatePic}
          fileList={fileList}
          setFileList={setFileList}
          setIsOpenModalUpdate={setIsOpen}
        />
      )}
    </React.Fragment>
  )
}

export default ModalUpdatePost
