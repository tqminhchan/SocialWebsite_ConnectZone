import React, { useContext, useEffect, useState } from 'react'
import { Carousel } from '@trendyol-js/react-carousel'
import { format } from 'timeago.js'
import Tippy from '@tippyjs/react/headless'
import { Link, useNavigate } from 'react-router-dom'
import { BsBell } from 'react-icons/bs'
import { FiMessageSquare } from 'react-icons/fi'
import { AiFillLike, AiFillSetting, AiOutlineClose, AiOutlineLike } from 'react-icons/ai'
import { GoSignOut } from 'react-icons/go'
import { AuthContext } from '../../contexts/AuthContext'
import Image from '../../components/Image/Image'
import Video from '../../components/Video/Video'
import Avatar from '../../components/Avatar/Avatar'
import LeftArrow from '../../assets/icons/LeftArrow'
import RightArrow from '../../assets/icons/RightArrow'
import handleLocalStorage from '../../utils/handleLocalStorage'
import FormCreateComment from '../../components/FormCreateComment/FormCreateComment'
import CommentContainer from '../../components/CommentContainer'
import { FaRegComment } from 'react-icons/fa'
import { SocketContext } from '../../contexts/SocketContext'
import { TbShare3 } from 'react-icons/tb'

const ShowPost = () => {
  const { post, user, dispatch } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const [comments, setComments] = useState(() => {
    const comments = post?.comments.filter((c) => !c.commentParent)
    return comments?.reverse()
  })
  const [likes, setLikes] = useState(post?.likes)

  const navigate = useNavigate()
  const handleSignOut = () => {
    handleLocalStorage.delete('accessToken')
    HandleAuthToken()
    dispatch({ type: 'LOGOUT' })
    navigate('/dang-nhap')
  }
  console.log(post)

  const renderPreview = () => {
    return (
      <div className="bg-white rounded-lg z-40 border border-borderColor w-[400px] pb-1 mt-2 pt-3">
        <div className="mx-4 rounded-lg shadow-lg">
          <Link to={`/profile/${user?._id}`} className="flex items-center p-3.5  rounded-lg hover:bg-hoverColor">
            <Avatar user={user} alt="" className="object-cover w-10 h-10 mr-3 rounded-full cursor-pointer" />

            <span className="text-xl font-medium">{user.fullName}</span>
          </Link>
          <div className="py-3.5 mx-3.5 border-t-[2px] border-y-borderColor">
            <p className="text-lg font-medium cursor-pointer text-primary">Xem tất cả trang cá nhân</p>
          </div>
        </div>
        <ul tabIndex="-1" className="mx-2 mt-5 cursor-pointer">
          <li className="py-3 px-4 mb-1.5  hover:bg-hoverColor rounded-lg  ">
            <Link to="/update" className="flex items-center">
              <div className="p-2.5 bg-borderColor rounded-full mr-3">
                <AiFillSetting fontSize={26} className="" />
              </div>
              <span className="text-lg font-medium">Cài đặt & quyền riêng tư</span>
            </Link>
          </li>
          <li className="py-3 px-4 mb-1.5  hover:bg-hoverColor rounded-lg  " onClick={handleSignOut}>
            <Link className="flex items-center">
              <div className="p-2.5 bg-borderColor rounded-full mr-3">
                <GoSignOut fontSize={26} className="" />
              </div>
              <span className="text-lg font-medium">Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </div>
    )
  }
  const handleClosePost = () => {
    dispatch({ type: 'CLOSE_POST' })
    navigate(-1)
  }
  useEffect(() => {
    socket.on('likePost', (data) => {
      onLikePost(data)
    })
  }, [post])
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
  const handleLikePost = () => {
    socket.emit('likePost', { post: post, user: user, likes: likes })
  }
  const isLikePost = likes?.find((id) => id === user?._id)

  return (
    <div className="flex h-screen ">
      <div className="relative w-[70%] bg-black h-full flex justify-center items-center xl:w-3/5">
        <Carousel
          className="flex items-center w-full "
          show={1}
          slide={1}
          transition={0.5}
          leftArrow={<LeftArrow />}
          rightArrow={<RightArrow />}
          responsive={true}
          useArrowKeys={true}
        >
          {post?.media?.length > 0 &&
            post?.media.map((item) => (
              <div key={item.id} className="relative flex items-center justify-center h-screen">
                {item?.resource_type === 'video' ? (
                  <Video url={item?.url} controls={true} pip={true} width="100%" />
                ) : (
                  <Image src={item?.url} className="rounded-none w-full h-screen border-none aspect-[4/3]" />
                )}
              </div>
            ))}
        </Carousel>
        <div className="absolute p-3 rounded-full cursor-pointer top-5 left-5 bg-iconColor" onClick={handleClosePost}>
          <span className="">
            <AiOutlineClose fontSize={35} color="white" />
          </span>
        </div>
      </div>
      <div className="w-[30%] xl:w-[30%] max-h-screen overflow-y-auto ">
        <div className="basis-1/4 flex items-center justify-end fixed top-0 right-0 w-[30%] py-3 px-2 bg-white border-t  border-b  border-borderColor  pr-5">
          <div className="cursor-pointer">
            <BsBell fontSize={24} />
          </div>
          <div className="mx-6 cursor-pointer">
            <FiMessageSquare fontSize={24} />
          </div>
          <Tippy render={renderPreview} interactive placement="bottom-start">
            <div className="w-12 h-12 cursor-pointer">
              <Avatar user={user} alt="" className="" />
            </div>
          </Tippy>
        </div>
        <div className=" overflow-y-auto pt-[73px] pb-[65px]">
          <div className="flex flex-col px-5 py-4 ">
            <div className="flex items-start">
              <Avatar user={user} alt="" className="rounded-full w-14 h-14" />
              <div className="ml-3.5">
                <Link to={`/profile/${user._id}`}>
                  <h3 className="text-lg font-semibold leading-2">{user?.fullName}</h3>
                </Link>
                <p className="text-sm">{format(post?.createdAt, 'vi')}</p>
              </div>
            </div>
            <p className="text-lg font-medium mt-2.5">{post?.content}</p>
          </div>
          <div className="px-5 pb-1">
            <div className="flex items-center justify-between pt-4">
              <div className="">
                {likes?.length > 0 && (
                  <div className="flex items-center">
                    <span className="mr-1">
                      <AiFillLike />
                    </span>
                    <p>{likes.length}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center mb-1.5">
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

            <ul className="flex items-center justify-between mb-4 border-t border-b border-borderColor">
              <li
                className="flex items-center py-2 my-1.5 px-1 cursor-pointer select-none rounded-xl hover:bg-bgColor"
                onClick={handleLikePost}
              >
                <AiOutlineLike fontSize={24} color={isLikePost ? 'blue' : undefined} />
                <div className="ml-2">
                  <span className={`${isLikePost && 'text-primary'}`}>Thích</span>
                </div>
              </li>
              <li className="flex items-center py-2 my-1.5 px-1 cursor-pointer select-none rounded-xl hover:bg-bgColor">
                <FaRegComment fontSize={24} />
                <div className="ml-2">
                  <span>Bình luận</span>
                </div>
              </li>
              <li className="flex items-center py-2 my-1.5 px-1 cursor-pointer select-none rounded-xl hover:bg-bgColor">
                <TbShare3 fontSize={24} />
                <div className="ml-2">Chia sẻ</div>
              </li>
            </ul>
            <CommentContainer post={post} comments={comments} setComments={setComments} />
          </div>
        </div>
        <div className="fixed bottom-0 right-0 w-[30%] py-3 px-2 bg-white border-t border-borderColor">
          <FormCreateComment post={post} comments={comments} setComments={setComments} />
        </div>
      </div>
    </div>
  )
}

export default ShowPost
