import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'timeago.js'
import vi from '../../utils/formatDate'
import { AiOutlineLike, AiFillLike, AiOutlineClose } from 'react-icons/ai'
import { HiLockClosed } from 'react-icons/hi'
import { BiWorld, BiLockAlt } from 'react-icons/bi'
import { FaRegComment, FaUserFriends } from 'react-icons/fa'
import { GoKebabHorizontal } from 'react-icons/go'
import { BsTrash3, BsPencil } from 'react-icons/bs'
import { TbShare3 } from 'react-icons/tb'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import Image from '../Image/Image'
import Button from '../Button/Button'
import Video from '../Video/Video'
import { AuthContext } from '../../contexts/AuthContext'
import checkAuth from '../../utils/checkAuth'
import postApi from '../../api/postApi'
import MyModal from '../MyModal/MyModal'
import ModalUpdatePost from '../ModalUpdatePost/ModalUpdatePost'
import malePic from '../../assets/imgs/male.png'
import femalePic from '../../assets/imgs/female.jpg'
import ModalUpdateStatus from '../ModalUpdateStatus/ModalUpdateStatus'
import Avatar from '../Avatar/Avatar'
import FormCreateComment from '../FormCreateComment/FormCreateComment'
import CommentContainer from '../CommentContainer'
import { SocketContext } from '../../contexts/SocketContext'

const Post = ({ post, profilePosts, setProfilePosts = () => { }, currentUser }) => {
  const { user, notifications, dispatch } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const [showMenu, setShowMenu] = useState(false)
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
  const [isOpenModalUpdateStatus, setIsOpenModalUpdateStatus] = useState(false)
  const [comments, setComments] = useState(() => {
    const comments = post.comments.filter((c) => !c.commentParent)
    return comments.reverse()
  })
  const [likes, setLikes] = useState(post?.likes)

  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState(post?.media)
  const navigate = useNavigate()
  const [loadPage, setLoadPage] = useState(false)

  const handleDeleteAPost = async (id) => {
    setLoading(true)
    try {
      if (checkAuth()) {
        const res = await postApi.deleteMultipleImages({
          params: {
            postId: id,
          },
        })
        profilePosts = profilePosts.filter((post) => post.id !== id)
        setProfilePosts(profilePosts)
        const result = await postApi.deletePost(id)
        setIsOpenModalDelete((prev) => !prev)
        setLoading(false)
      } else {
        toast.warning('Bạn không thể xoá bài viết này!')
      }
    } catch (error) { }
  }
  const handleShowMenuPost = () => {
    setShowMenu((prev) => !prev)
  }
  const handleOpenModalDelete = () => {
    setIsOpenModalDelete((prev) => !prev)
    setShowMenu((prev) => !prev)
  }
  const handleCancelDelete = () => {
    setIsOpenModalDelete((prev) => !prev)
    setShowMenu(false)
  }

  const handleOpenModalUpdate = () => {
    setIsOpenModalUpdate(!isOpenModalUpdate)
    setShowMenu((prev) => !prev)
  }
  const handleCancelUpdate = () => {
    setIsOpenModalUpdate((prev) => !prev)
    setShowMenu(false)
  }

  let renderListFiles
  let numberHide
  if (post?.media?.length >= 5) {
    const clonedFileList = [...post.media]
    renderListFiles = clonedFileList.slice(0, 4)
    numberHide = post?.media.length - 3
  }
  const handleOpenAPost = async (postId) => {
    try {
      setLoadPage((prev) => !prev)
      const res = await postApi.getAPostById(postId)
      if (res?.data?.success) {
        dispatch({ type: 'GET_POST', payload: res?.data?.post })
        navigate(`/photo/${res?.data?.post?._id}`)
      }
    } catch (error) { }
  }
  const handleOpenModalUpdateStatus = () => {
    setIsOpenModalUpdateStatus(!isOpenModalUpdateStatus)
  }
  const handleCloseModalUpdateStatus = () => {
    setIsOpenModalUpdateStatus((prev) => !prev)
    setShowMenu(false)
  }

  const onLikePost = (data) => {
    if (data?.post?._id === post?._id) {
      setLikes(data?.post?.likes)
      if (data.notification && post.user._id === user._id) {
        dispatch({ type: 'SET_NOTIFICATION', payload: [data.notification, ...notifications] })
        dispatch({
          type: 'UPDATE_PROPERTY_USER',
          payload: {
            key: 'notificationUnread',
            value: user.notificationUnread + 1,
          },
        })
      }
    }
  }

  useEffect(() => {
    socket.on('likePost', (data) => {
      onLikePost(data)
    })
  }, [post])

  const handleLikePost = () => {
    socket.emit('likePost', { post: post, user: user, likes: likes })
  }

  const isLikePost = likes.find((id) => id === user?._id)

  return (
    <div className="w-full h-full mb-6 bg-white border shadow-lg tablet:rounded-2xl border-borderColor shadow-indigo-500/40">
      <>
        <div className="relative flex flex-row items-center justify-between px-5 pt-5 pb-3">
          <div className="flex flex-row items-center">
            <Link to={`/profile/${currentUser?.id}`}>
              <Avatar user={currentUser} className="object-cover w-10 h-10 rounded-full" />
            </Link>
            <span className="flex flex-col ml-[10px]">
              <Link to={`/profile/${currentUser?.id}`}>
                <h3 className="text-lg font-semibold leading-2">{currentUser?.fullName}</h3>
              </Link>
              <div className="flex items-center ">
                <Link to={`/chi-tiet-bai-viet/${post?.id}`} className="text-sm mr-1.5 hover:underline">
                  {format(post?.createdAt, 'vi')}
                </Link>
                <span
                  className="p-1 rounded-full cursor-pointer hover:bg-bgColor"
                  onClick={handleOpenModalUpdateStatus}
                >
                  {post?.status?.startsWith('private') && <HiLockClosed />}
                  {post?.status?.startsWith('public') && <BiWorld />}
                  {post?.status?.startsWith('friend') && <FaUserFriends />}
                </span>
              </div>
            </span>
            {isOpenModalUpdateStatus && (
              <ModalUpdateStatus
                post={post}
                profilePosts={profilePosts}
                setProfilePosts={setProfilePosts}
                isOpen={isOpenModalUpdateStatus}
                setIsOpen={setIsOpenModalUpdateStatus}
                handleClose={handleCloseModalUpdateStatus}
              />
            )}
          </div>
          {showMenu && (
            <div className="absolute z-50 bg-white border rounded-md top-20 right-5 border-borderColor">
              <ul className="">
                <li
                  className="flex items-center px-3 py-2 m-1 cursor-pointer hover:bg-hoverColor"
                  onClick={handleOpenModalUpdate}
                >
                  <span className="mr-3">
                    <BsPencil fontSize={24} />
                  </span>
                  <p className="text-lg font-medium">Chỉnh sửa bài viết</p>
                </li>
                <li
                  className="flex items-center px-3 py-2 m-1 cursor-pointer hover:bg-hoverColor"
                  onClick={handleCloseModalUpdateStatus}
                >
                  <span className="mr-3">
                    <BiLockAlt fontSize={24} />
                  </span>
                  <p className="text-lg font-medium">Chỉnh sửa đối tượng</p>
                </li>
                <li
                  className="flex items-center px-3 py-2 m-1 cursor-pointer hover:bg-hoverColor"
                  onClick={handleOpenModalDelete}
                >
                  <span className="mr-3">
                    <BsTrash3 fontSize={24} />
                  </span>
                  <p className="text-lg font-medium">Xoá bài viết</p>
                </li>
                {!post?.status?.startsWith('private') && (
                  <li className="flex items-center px-3 py-2 m-1 cursor-pointer hover:bg-hoverColor">
                    <span className="mr-3">
                      <TbShare3 fontSize={24} />
                    </span>
                    <p className="text-lg font-medium">Chia sẻ</p>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* modal show Component CreatePost to update a post user    */}

          {isOpenModalUpdate && (
            <ModalUpdatePost
              post={post}
              isOpen={isOpenModalUpdate}
              setIsOpen={setIsOpenModalUpdate}
              handleClose={handleCancelUpdate}
              listPost={profilePosts}
              setListPost={setProfilePosts}
            />
          )}

          {/* modal confirm delete a post user */}
          <MyModal isOpen={isOpenModalDelete} handleClose={handleCancelDelete}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-borderColor">
                <p className="text-2xl font-medium">Xoá bài viết</p>
                <span
                  className="p-3 rounded-full cursor-pointer bg-bgColor hover:bg-hoverColor"
                  onClick={handleCancelDelete}
                >
                  <AiOutlineClose fontSize={25} color="black" />
                </span>
              </div>
              <p className="py-3 mt-4 text-lg font-normal">Bạn có chắc chắc muốn xoá bài viết này không?</p>
              <div className="flex items-center justify-end mt-3">
                <Button className="mr-3 text-black hover:bg-hoverColor rounded-xl" onClick={handleCancelDelete}>
                  Huỷ
                </Button>
                <Button className="text-white rounded-xl bg-primary" onClick={() => handleDeleteAPost(post._id)}>
                  {loading === true ? <ClipLoader color="#36d7b7" /> : 'Xoá'}
                </Button>
              </div>
            </div>
          </MyModal>
          <div className="flex ">
            <span
              className="p-2.5 cursor-pointer rounded-full bg-hoverColor"
              onClick={handleShowMenuPost}>
              <GoKebabHorizontal fontSize={24} />
            </span>
          </div>
        </div>
      </>

      <>
        <div className="px-5 ">
          <h4 className="mb-4 text-lg font-normal break-all">{post?.content}</h4>
        </div>
        <div
          className={`  ${post?.media?.length === 1 && 'grid grid-cols-1 gap-y-0 h-[500px]'}
                 ${post?.media?.length === 2 && 'grid grid-cols-2 grid-rows-2 h-[500px]'}`}
        >
          {post?.media?.length > 0 &&
            post?.media?.length < 3 &&
            post?.media.map((item, index) => (
              <div onClick={() => handleOpenAPost(post?._id)} className="h-[500px]" key={item?._id}>
                {item?.resource_type === 'video' ? (
                  <Video url={item.url} controls={true} pip={true} width="100%" />
                ) : (
                  <Image src={item.url} alt="" key={index} quantity={post?.images?.length} className="rounded-none" />
                )}
              </div>
            ))}
          {post?.media?.length === 3 && (
            <div className="grid grid-cols-2 ">
              {post.media.map((item, index) => (
                <div
                  onClick={() => handleOpenAPost(post?._id)}
                  key={item?._id}
                  className={`h-[232px] ${post.media.length - 1 === index && 'col-span-2'}`}
                >
                  {item?.resource_type === 'video' ? (
                    <Video url={item.url} controls={true} pip={true} width="100%" />
                  ) : (
                    <Image src={item.url} alt="" key={index} quantity={post?.images?.length} className="rounded-none" />
                  )}
                </div>
              ))}
            </div>
          )}

          {post?.media?.length === 4 && (
            <div className="grid grid-cols-2 ">
              {post.media.map((item, index) => (
                <div onClick={() => handleOpenAPost(post?._id)} key={item?._id} className={`h-[232px]`}>
                  {item?.resource_type === 'video' ? (
                    <Video url={item.url} controls={true} pip={true} width="100%" />
                  ) : (
                    <Image src={item.url} alt="" key={index} quantity={post?.images?.length} className="rounded-none" />
                  )}
                </div>
              ))}
            </div>
          )}

          {post?.media?.length >= 5 && (
            <div className="relative grid grid-cols-2">
              {renderListFiles.map((item, index) => (
                <div
                  onClick={() => handleOpenAPost(post?._id)}
                  key={item?._id}
                  className={`h-[232px] ${renderListFiles.length - 1 === index && 'opacity-70 '}`}
                >
                  {item?.resource_type === 'video' ? (
                    <Video url={item.url} controls={true} pip={true} width="100%" />
                  ) : (
                    <Image src={item.url} alt="" key={index} quantity={post?.images?.length} className="rounded-none" />
                  )}
                </div>
              ))}
              {renderListFiles[renderListFiles?.length - 1] && (
                <p className="absolute bottom-1/4 right-1/4 translate-x-[50%] translate-y-[50%] text-white font-semibold text-5xl">
                  + {numberHide}
                </p>
              )}
            </div>
          )}

          {/* {post?.media.length > 0 && post?.media.map((item, index) => (
            
          ))} */}
        </div>
        <div className="px-5 pb-1">
          <div className="flex items-center justify-between pt-4 mb-2">
            <div className="min-w-[8px]">
              {likes.length > 0 && (
                <div className="flex items-center">
                  <span className="mr-1">
                    <AiFillLike />
                  </span>
                  <p>{likes.length}</p>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {post?.comments.length > 0 && (
                <p className="mr-2">
                  {post?.comments.length} <span className="ml-1">bình luận</span>
                </p>
              )}
              {post?.shares.length > 0 && (
                <p>
                  {post?.shares.length} <span className="ml-1">chia sẻ</span>
                </p>
              )}
            </div>
          </div>

          <ul className="flex items-center justify-between mb-4 border-b border-borderColor">
            <li
              className="flex items-center py-3 cursor-pointer select-none tablet:px-6 rounded-xl hover:bg-bgColor"
              onClick={handleLikePost}
            >
              <AiOutlineLike fontSize={24} color={isLikePost ? 'blue' : undefined} />
              <div className="ml-2">
                <span className={`${isLikePost && 'text-primary'}`}>Thích</span>
              </div>
            </li>
            <li className="flex items-center py-3 cursor-pointer select-none tablet:px-6 rounded-xl hover:bg-bgColor">
              <FaRegComment fontSize={24} />
              <div className="ml-2">
                <span>Bình luận</span>
              </div>
            </li>
            <li className="flex items-center py-3 cursor-pointer select-none tablet:px-6 rounded-xl hover:bg-bgColor">
              <TbShare3 fontSize={24} />
              <div className="ml-2">Chia sẻ</div>
            </li>
          </ul>
          <FormCreateComment post={post} comments={comments} setComments={setComments} />

          <CommentContainer post={post} comments={comments} setComments={setComments} />
        </div>
      </>
    </div>
  )
}

export default Post
