import React, {useContext, useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {format} from 'timeago.js'
import vi from '../../utils/formatDate'
import {AiOutlineLike, AiOutlineClose} from 'react-icons/ai'
import {FaRegComment, FaUserFriends} from 'react-icons/fa'
import {FiShare2} from 'react-icons/fi'
import {GoKebabHorizontal} from 'react-icons/go'
import {BsTrash3, BsPencil} from 'react-icons/bs'
import {TbShare3} from 'react-icons/tb'
import {ClipLoader} from 'react-spinners'
import {toast} from 'react-toastify'
import Image from '../Image/Image'
import Button from '../Button/Button'
import Video from '../Video/Video'
import {AuthContext} from '../../contexts/AuthContext'
import checkAuth from '../../utils/checkAuth'
import postApi from '../../api/postApi'
import MyModal from '../MyModal/MyModal'
import ModalUpdatePost from '../ModalUpdatePost/ModalUpdatePost'
import malePic from '../../assets/imgs/male.png'
import femalePic from '../../assets/imgs/female.jpg'
import {HiLockClosed} from 'react-icons/hi'
import {BiWorld} from 'react-icons/bi'
import Avatar from '../Avatar/Avatar'
import FormCreateComment from '../FormCreateComment/FormCreateComment'
import CommentContainer from '../CommentContainer'
import {SocketContext} from './../../contexts/SocketContext'
import {AiFillLike} from 'react-icons/ai'

const PostOther = ({post, profilePosts, setProfilePosts = () => {}, currentUser}) => {
  const {user, notifications, dispatch} = useContext(AuthContext)
  const {socket} = useContext(SocketContext)
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState(post?.media)
  const navigate = useNavigate()
  const [loadPage, setLoadPage] = useState(false)
  const [comments, setComments] = useState(() => {
    const comments = post.comments.filter((c) => !c.commentParent)
    return comments.reverse()
  })
  const [likes, setLikes] = useState(post?.likes)

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
        dispatch({type: 'GET_POST', payload: res?.data?.post})
        navigate(`/photo/${res?.data?.post?._id}`)
      }
    } catch (error) {}
  }

  const onLikePost = (data) => {
    if (data?.post?._id === post?._id) {
      setLikes(data?.post?.likes)
      if (data.notification && post.user._id === user._id) {
        dispatch({type: 'SET_NOTIFICATION', payload: [data.notification, ...notifications]})
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
    socket.emit('likePost', {post: post, user: user, likes: likes})
  }

  const isLikePost = likes.find((id) => id === user?._id)

  return (
    <div className="w-full h-full mb-6 bg-white border shadow-lg rounded-2xl border-borderColor shadow-indigo-500/40">
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
                <p className="text-sm mr-1.5 hover:underline">{format(post?.createdAt, 'vi')}</p>
                <span>
                  {post?.status?.startsWith('private') && <HiLockClosed />}
                  {post?.status?.startsWith('public') && <BiWorld />}
                  {post?.status?.startsWith('friend') && <FaUserFriends />}
                </span>
              </div>
            </span>
          </div>
        </div>
      </>

      <>
        <div className="px-5 ">
          <h4 className="mb-4 text-lg font-normal break-all">{post?.content}</h4>
        </div>
        <div
          className={`mb-4  ${post?.media?.length === 1 && 'grid grid-cols-1 gap-y-0 h-[500px]'}
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
        <div className="px-5 py-4 ">
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
  )
}

export default PostOther
