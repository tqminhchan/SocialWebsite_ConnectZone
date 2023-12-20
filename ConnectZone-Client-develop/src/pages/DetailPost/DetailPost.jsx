import React, { useEffect, useState, useContext, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'timeago.js'
import vi from '../../utils/formatDate'
import { AiFillLike, AiOutlineLike, AiOutlineVideoCamera } from 'react-icons/ai'
import { HiLockClosed } from 'react-icons/hi'
import { BiWorld } from 'react-icons/bi'

import { FaRegComment, FaUserFriends } from 'react-icons/fa'
import { GoKebabHorizontal } from 'react-icons/go'
import { TbShare3 } from 'react-icons/tb'
import Image from '../../components/Image/Image'
import Video from '../../components/Video/Video'
import postApi from '../../api/postApi'
import Avatar from '../../components/Avatar/Avatar'
import { BsPencil, BsTrash3 } from 'react-icons/bs'
import { ClipLoader } from 'react-spinners'
import CommentContainer from '../../components/CommentContainer/CommentContainer'
import FormCreateComment from '../../components/FormCreateComment/FormCreateComment'
import { AuthContext } from '../../contexts/AuthContext'
import { SocketContext } from '../../contexts/SocketContext'
import ModalUpdatePost from '../../components/ModalUpdatePost/ModalUpdatePost'
const DetailPost = () => {
  const [post, setPost] = useState({})
  const { user, notifications, dispatch } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(post?.likes)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
  const [isOpenModalUpdateStatus, setIsOpenModalUpdateStatus] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()

  const fetchPost = async () => {
    setLoading(true)
    try {
      const res = await postApi.getAPostById(id)
      console.log(res)
      setPost(res?.data?.post)
      setLikes(res?.data?.post?.likes)
      let newComments = []
      if (res?.data?.post?.comments) {
        newComments = res?.data?.post?.comments?.filter((c) => !c?.commentParent)
        console.log(newComments)
      }
      newComments?.reverse()
      setComments(newComments)
      setLoading(false)
    } catch (error) { }
  }
  useEffect(() => {
    fetchPost()
  }, [id])

  const handleOpenAPost = async (postId) => {
    console.log(postId)
    try {
      const res = await postApi.getAPostById(postId)
      console.log(res)
      if (res?.data?.success) {
        dispatch({ type: 'GET_POST', payload: res?.data?.post })
        navigate(`/photo/${res?.data?.post?._id}`)
      }
    } catch (error) { }
  }
  let renderListFiles
  let numberHide
  if (post?.media?.length >= 5) {
    const clonedFileList = [...post.media]
    renderListFiles = clonedFileList.slice(0, 4)
    numberHide = post?.media.length - 3
  }

  const handleShowMenuPost = () => {
    setShowMenu((prev) => !prev)
  }
  const handleOpenModalUpdate = () => {
    setIsOpenModalUpdate(!isOpenModalUpdate)
    setShowMenu((prev) => !prev)
  }
  const handleCancelUpdate = () => {
    setIsOpenModalUpdate((prev) => !prev)
    setShowMenu(false)
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

  const isLikePost = likes?.find((id) => id === user?._id)
  return (
    <Fragment>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen -translate-y-1/4">
          <ClipLoader />
        </div>
      ) : (
        <div className="w-[90vh] mx-auto mt-6 mb-4  bg-white border shadow-lg tablet:rounded-2xl border-borderColor shadow-indigo-500/40 tablet:mb-6">
          <>
            <div className="relative flex flex-row items-center justify-between px-2 pt-5 pb-3 tablet:px-5">
              <div className="flex flex-row items-center">
                <Link to={`/profile/${post?.user?._id}`}>
                  <Avatar user={post?.user} alt="" className="object-cover w-10 h-10 rounded-full" />
                </Link>
                <span className="flex flex-col ml-[10px]">
                  <Link to={`/profile/${post?.user?._id}`}>
                    <h3 className="text-base font-semibold tablet:text-lg leading-2">{post?.user?.fullName}</h3>
                  </Link>
                  <div className="flex items-center ">
                    <p className="tablet:text-sm text-xs  mr-1.5">
                      {format(post?.createdAt, 'vi')}
                    </p>
                    <span>
                      {post?.status?.startsWith('private') && <HiLockClosed />}
                      {post?.status?.startsWith('public') && <BiWorld />}
                      {post?.status?.startsWith('friend') && <FaUserFriends />}
                    </span>
                  </div>
                </span>
              </div>
              {showMenu && (
                <div className="absolute z-50 bg-white border rounded-md -bottom-36 right-5 border-borderColor">
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

                    <li className="flex items-center px-3 py-2 m-1 cursor-pointer hover:bg-hoverColor">
                      <span className="mr-3">
                        <TbShare3 fontSize={24} />
                      </span>
                      <p className="text-lg font-medium">Chia sẻ</p>
                    </li>
                  </ul>
                </div>
              )}
              {/* modal show Component CreatePost to update a post user    */}

              <ModalUpdatePost
                post={post}
                isOpen={isOpenModalUpdate}
                setIsOpen={setIsOpenModalUpdate}
                handleClose={handleCancelUpdate}
              // profilePosts={homePosts}
              // setProfilePosts={setProfilePosts}
              />

              {post?.user?.id === user?.id && (
                <div className="flex ">
                  <span
                    className="p-2.5 cursor-pointer rounded-full bg-hoverColor"
                    onClick={handleShowMenuPost}
                  >
                    <GoKebabHorizontal fontSize={24} />
                  </span>
                </div>
              )}
            </div>
          </>

          <>
            <div className="px-3 tablet:px-5">
              <h4 className="text-lg font-normal tablet:mb-4 mb-2.5">{post?.content}</h4>
            </div>
            <div
              className={`tablet:mb-4 mb-2.5  ${post?.media?.length === 1 && 'grid grid-cols-1 gap-y-0 tablet:h-[500px]'
                }
                   ${post?.media?.length === 2 && 'grid grid-cols-2 grid-rows-2 tablet:h-[500px] h-[300px]'}`}
            >
              {post?.media?.length > 0 &&
                post?.media?.length < 3 &&
                post?.media.map((item, index) => (
                  <div
                    onClick={() => handleOpenAPost(post?._id)}
                    className="tablet:h-[500px] h-[300px]"
                    key={item?._id}
                  >
                    {item?.resource_type === 'video' ? (
                      <Video url={item.url} controls={true} pip={true} width="100%" />
                    ) : (
                      <Image
                        src={item.url}
                        alt=""
                        key={index}
                        quantity={post?.images?.length}
                        className="rounded-none"
                      />
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
                        <Image
                          src={item.url}
                          alt=""
                          key={index}
                          quantity={post?.images?.length}
                          className="rounded-none"
                        />
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
                        <Image
                          src={item.url}
                          alt=""
                          key={index}
                          quantity={post?.images?.length}
                          className="rounded-none"
                        />
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
                        <Image
                          src={item.url}
                          alt=""
                          key={index}
                          quantity={post?.images?.length}
                          className="rounded-none"
                        />
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
            </div>
            <div className="px-2 py-2 tablet:px-5 tablet:py-4">
              <div className="flex items-center justify-between pt-4 mb-2">
                <div className="min-w-[8px]">
                  {likes?.length > 0 && (
                    <div className="flex items-center">
                      <span className="mr-1">
                        <AiFillLike />
                      </span>
                      <p>{likes?.length}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  {post?.comments?.length > 0 && (
                    <p className="mr-2">
                      {post?.comments?.length} <span className="ml-1">bình luận</span>
                    </p>
                  )}
                  {post?.shares?.length > 0 && (
                    <p>
                      {post?.shares?.length} <span className="ml-1">chia sẻ</span>
                    </p>
                  )}
                </div>
              </div>
              <ul className="flex items-center justify-between mb-4 border-b border-borderColor">
                <li
                  className="flex items-center px-6 py-3 cursor-pointer select-none rounded-xl hover:bg-bgColor"
                  onClick={handleLikePost}
                >
                  <AiOutlineLike fontSize={24} color={isLikePost ? 'blue' : undefined} />
                  <div className="ml-2 ">
                    <span className={`${isLikePost && 'text-primary'}`}>Thích</span>
                  </div>
                </li>
                <li className="flex items-center px-6 py-3 cursor-pointer select-none rounded-xl hover:bg-bgColor">
                  <FaRegComment fontSize={24} />
                  <div className="ml-2 ">
                    <span>Bình luận</span>
                  </div>
                </li>
                <li className="flex items-center px-6 py-3 cursor-pointer select-none rounded-xl hover:bg-bgColor">
                  <TbShare3 fontSize={24} />
                  <div className="ml-2 ">Chia sẻ</div>
                </li>
              </ul>
              <FormCreateComment post={post} comments={comments} setComments={setComments} />

              <CommentContainer post={post} comments={comments} setComments={setComments} />
            </div>
          </>
        </div>
      )}
    </Fragment>
  )
}

export default DetailPost
