import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineEdit, AiOutlineClose } from 'react-icons/ai'
import { AiOutlineVideoCamera, AiOutlineCamera } from 'react-icons/ai'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import { GrDown } from 'react-icons/gr'
import { CiFaceSmile } from 'react-icons/ci'
import { FaFolderPlus, FaRegPlayCircle, FaPen, FaUserFriends, FaLock, FaChevronDown } from 'react-icons/fa'
import { BsImages } from 'react-icons/bs'
import { BiWorld } from 'react-icons/bi'
import { IoMdPersonAdd } from 'react-icons/io'
import { HiLocationMarker, HiFolderAdd, HiOutlineChevronDown } from 'react-icons/hi'
import { TbGif } from 'react-icons/tb'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ClipLoader } from 'react-spinners'
import TextareaAutosize from 'react-textarea-autosize'

import ReactPlayer from 'react-player'
import Image from '../Image/Image'
import Button from '../Button/Button'
import MyModal from '../MyModal/MyModal'
import config from '../../config'
import postApi from '../../api/postApi'
import checkAuth from '../../utils/checkAuth'
import { AuthContext } from '../../contexts/AuthContext'
import ChangeAllPicture from '../ChangeAllPicture/ChangeAllPicture'
import Video from '../Video/Video'
import Avatar from '../Avatar/Avatar'
import malePic from '../../assets/imgs/male.png'
import femalePic from '../../assets/imgs/female.jpg'
import OutsideClickWrapper from '../OutsideClickWrapper'

const CreatePost = ({ setListPosts = () => { } }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModalChangeAllPic, setIsOpenModalChangeAllPic] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [emoji, setEmoji] = useState(null)
  const [showAddImage, setShowAddImage] = useState(true)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('public')
  const [isShowListStatus, setIsShowListStatus] = useState(false)
  const [fileList, setFileList] = useState([])
  const [imageUrlList, setImageUrlList] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, dispatch } = useContext(AuthContext)

  const handleOpenModal = () => {
    setIsOpen((prev) => !prev)
  }
  const handleCloseModal = () => {
    setIsOpen((prev) => !prev)
  }

  const handleDrop = (e) => {
    e.preventDefault()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e) => {
    const mediaFiles = Array.from(e.target.files)
    setFileList([...fileList, ...mediaFiles])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading((prev) => !prev)
    let newPost = {
      content: content,
      status: status,
    }
    try {
      const formdata = new FormData()
      for (let i = 0; i < fileList?.length; i++) {
        formdata.append('media', fileList[i])
      }
      if (checkAuth()) {
        const res = await postApi.createPost(newPost)
        formdata.append('postId', res?.data?.post?._id)
        const result = await postApi.uploadMultimediaFiles(formdata)
        let post = res?.data?.post
        post = { ...post, media: result?.data?.media }
        setListPosts((prev) => [post, ...prev])
        setLoading((prev) => !prev)
      }
    } catch (error) { }
    setFileList([])
    setIsOpen((prev) => !prev)
    setContent('')
    setStatus('public')
  }
  const handleChangeAllPicture = (e) => {
    e.preventDefault()
    setIsOpen(!isOpen)
    setIsOpenModalChangeAllPic((prev) => !prev)
  }
  const clonedFileList = [...fileList]
  const renderListFiles = clonedFileList.slice(0, 4)
  let numberHide = fileList.length - 3

  return (
    <>
      <div
        className={`tablet:w-full  p-3 pt-2 pb-2  tablet:mb-5 bg-white border-y-4 tablet:border border-borderColor 
        tablet:rounded-2xl `}
      >
        <div className="flex gap-x-3 gr items-center tablet:border-b border-borderColor tablet:pt-2  py-1 tablet:pb-3.5">
          <Link className="block w-14 h-14 shrink-0" to={`/profile/${user._id}`}>
            <Avatar user={user} alt="" className="" />
          </Link>
          <div
            onClick={handleOpenModal}
            className="w-full h-full py-3 pl-4 pr-2 text-lg outline-none cursor-pointer rounded-3xl leading-0 bg-bgColor hover:bg-hoverColor"
          >
            Bạn đang nghĩ gì?
          </div>
        </div>
        <div className="items-center justify-between hidden mt-2 tablet:flex ">
          <div className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-hoverColor lg:px-1 lg:py-2 tablet:px-3 tablet:py-3 desktop:px-2 desktop:py-2">
            <AiOutlineVideoCamera fontSize={24} color="red" />
            <span className="ml-4 text-lg font-semibold lg:text-base lg:font-medium tablet:text-base tablet:ml-2 desktop:text-base desktop:ml-2">
              Video trực tiếp
            </span>
          </div>
          <div
            className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-hoverColor lg:px-1 lg:py-2 tablet:px-3 tablet:py-3 desktop:px-2 desktop:py-2"
            onClick={() => setIsOpen(true)}
          >
            <MdOutlinePhotoSizeSelectActual fontSize={24} color="green" />
            <span className="ml-4 text-lg font-semibold lg:text-base lg:font-medium tablet:text-base tablet:ml-2 desktop:text-base desktop:ml-2">
              Ảnh/video
            </span>
          </div>
          <div className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-hoverColor lg:px-1 lg:py-2 tablet:px-3 tablet:py-3 desktop:px-2 desktop:py-2">
            <AiOutlineCamera fontSize={24} color="orange" />
            <span className="ml-4 text-lg font-semibold lg:text-base lg:font-medium tablet:text-base tablet:ml-2 desktop:text-base desktop:ml-2">
              Cảm xúc/hoạt động
            </span>
          </div>
        </div>

        <div>
          <MyModal isOpen={isOpen} handleClose={handleCloseModal}>
            <form className="w-[650px] bg-white px-2" onSubmit={handleSubmit}>
              <div className="relative flex items-center justify-center py-5 mb-5 border-b border-borderColor">
                <p className="text-3xl font-semibold">Tạo bài viết</p>
                <span
                  className="absolute right-0 p-3 rounded-full cursor-pointer bg-borderColor"
                  onClick={handleCloseModal}
                >
                  <AiOutlineClose fontSize={24} />
                </span>
              </div>
              <div className="flex items-center mb-5">
                <Link to={`/profile/${user._id}`}>
                  <Avatar user={user} alt="" className="w-14 h-14" />
                </Link>
                <div className="flex flex-col ml-3">
                  <Link to={`/profile/${user._id}`}>
                    <h2 className="text-xl font-medium ">{user?.fullName}</h2>
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
                  <div
                    className="relative w-full min-h-[276px] mt-5 border border-borderColor bg-white p-2.5 rounded-2xl"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
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
                              {item?.type.startsWith('image') ? (
                                <div className="h-[232px]">
                                  <Image
                                    className="rounded-lg pointer-events-none"
                                    src={URL.createObjectURL(item)}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className="relative">
                                  <Video
                                    height="100%"
                                    width="100%"
                                    url={URL.createObjectURL(item)}
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
                              {item?.type.startsWith('image') ? (
                                <div className="h-[232px]">
                                  <Image
                                    className="rounded-lg pointer-events-none"
                                    src={URL.createObjectURL(item)}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className="relative ">
                                  <Video
                                    height="232px"
                                    width="100%"
                                    url={URL.createObjectURL(item)}
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
                              {item?.type.startsWith('image') ? (
                                <div className="h-[232px]">
                                  <Image
                                    className="rounded-lg pointer-events-none"
                                    src={URL.createObjectURL(item)}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className="relative">
                                  <Video
                                    height="232px"
                                    width="100%"
                                    url={URL.createObjectURL(item)}
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
                              {item?.type.startsWith('image') ? (
                                <div className="h-[232px]">
                                  <Image
                                    className="rounded-none pointer-events-none"
                                    src={URL.createObjectURL(item)}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className="relative">
                                  <Video height="232px" width="100%" url={URL.createObjectURL(item)} controls={false} />
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
                        {renderListFiles &&
                          renderListFiles.length > 0 &&
                          renderListFiles.map((item, index) => (
                            <div key={index}>
                              {item?.type.startsWith('image') ? (
                                <div className={`h-[232px]`}>
                                  <Image
                                    className={`rounded-none pointer-events-none `}
                                    src={URL.createObjectURL(item)}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className="relative">
                                  <Video height="232px" width="100%" url={URL.createObjectURL(item)} controls={false} />
                                  <span className="absolute top-1/2 translate-x-[-50%] translate-y-[-50%] left-1/2 rounded-full bg-iconColor">
                                    <FaRegPlayCircle fontSize={100} color="white" />
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        {renderListFiles[renderListFiles.length - 1] && (
                          <p className="absolute bottom-1/4 right-1/4 translate-x-[50%] text-white font-semibold text-5xl">
                            + {numberHide}
                          </p>
                        )}
                      </div>
                    )}

                    {fileList.length > 0 && (
                      <span
                        className="absolute top-0 right-0 p-3 mt-5 mr-5 bg-white border rounded-full cursor-pointer border-borderColor hover:bg-hoverColor"
                        onClick={() => {
                          setShowAddImage(true)
                          setFileList([])
                        }}
                      >
                        <AiOutlineClose />
                      </span>
                    )}
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
                          onClick={handleChangeAllPicture}
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
                  {loading ? <ClipLoader color="#36d7b7" /> : 'Đăng'}
                </Button>
              </div>
            </form>
          </MyModal>
        </div>
      </div>
      {isOpenModalChangeAllPic && (
        <ChangeAllPicture
          isOpenModal={isOpenModalChangeAllPic}
          setIsOpenModal={setIsOpenModalChangeAllPic}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fileList={fileList}
          setFileList={setFileList}
        />
      )}
    </>
  )
}

export default CreatePost
