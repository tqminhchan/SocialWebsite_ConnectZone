import React, { useContext, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import OutsideClickWrapper from '../OutsideClickWrapper'
import Avatar from '../Avatar/Avatar'
import Image from '../Image/Image'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { GoKebabHorizontal } from 'react-icons/go'
import { format } from 'timeago.js'
import commentApi from '../../api/commentApi'
import FormCreateComment from '../FormCreateComment/FormCreateComment'
import { FaSpinner } from 'react-icons/fa'
import Video from '../Video/Video'

const Comment = ({ comment: commentProp, post, comments, setComments, setShowFormCreateCommentReplyParent }) => {
  const { user } = useContext(AuthContext)
  const [showOption, setShowOption] = useState(false)
  const [showFormCreateCommentReply, setShowFormCreateCommentReply] = useState(false)
  const [comment, setComment] = useState(commentProp)
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteComment = async () => {
    try {
      const res = await commentApi.deleteComment(comment.id)
      if (!comment.commentParentId) {
        const newComments = post.comments.filter((c) => c.id !== comment.id)
        setComments(newComments)
      } else {
        const newComments = post.comments.map((c) => {
          if (c.id === comment.commentParentId) {
            return {
              ...c,
              commentReply: c.commentReply.filter((cr) => cr.id !== comment.id),
            }
          }
          return c
        })
        setComments(newComments)
      }
    } catch (error) {
      console.log(error)
    }
    setShowOption(false)
  }

  useEffect(() => {
    if (!commentProp) return
    if (commentProp.user.id) return
    const getComment = async () => {
      try {
        setIsLoading(true)
        const res = await commentApi.getCommentById(commentProp.id)
        setComment(res.data.comment)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getComment()
  }, [])

  useEffect(() => {
    commentProp && setComment(commentProp)
  }, [commentProp])

  return (
    <div className="mt-4">
      <div className="flex gap-x-3">
        <Link to={`/profile/${comment?.user?.id}`} className="shrink-0">
          <Avatar user={comment?.user} className="object-cover w-10 h-10 rounded-full" />
        </Link>
        <div className="">
          <div>
            <div className={twMerge('inline-block', comment?.content ? 'bg-bgColor px-3 py-2 rounded-2xl' : 'mb-2')}>
              <div className="flex items-center">
                <Link to={`/profile/${comment?.user?.id}`}>
                  <h3 className="text-base font-semibold leading-2">{comment?.user?.fullName}</h3>
                </Link>
              </div>
              {comment?.content && <p className="text-sm">{comment?.content}</p>}
            </div>
          </div>
          {comment?.media.map((item) => {
            if (item?.resource_type === 'video') {
              return <Video key={item?.id} url={item?.url} controls={true} pip={true} width="60%" height="70%" />
            } else {
              return <Image key={item?.id} src={item?.url} className="object-cover w-56 h-56 rounded-lg" />
            }
          })}
        </div>
        {comment?.user.id === user?.id && (
          <OutsideClickWrapper onClickOutside={() => setShowOption(false)}>
            <div className="flex items-center justify-center h-full">
              <div className="relative inline-flex items-center" onClick={() => setShowOption((pre) => !pre)}>
                <span className="p-1 transition-all rounded-full cursor-pointer hover:bg-hoverColor">
                  <GoKebabHorizontal fontSize={16} />
                </span>

                <div
                  className={twMerge(
                    'absolute transition-all top-[100%] right-0 min-w-[140px] rounded-lg shadow-lg bg-white z-50 overflow-hidden',
                    showOption ? 'visible max-h-[1000px]' : 'max-h-0 invisible',
                  )}
                >
                  <div className="p-2 m-1.5 bg-white border-b cursor-pointer hover:bg-bgColor border-borderColor rounded-lg">
                    Chỉnh sửa
                  </div>
                  <div className="p-2 m-1.5 bg-white cursor-pointer hover:bg-bgColor rounded-lg" onClick={handleDeleteComment}>
                    Xóa
                  </div>
                </div>
              </div>
            </div>
          </OutsideClickWrapper>
        )}
      </div>
      <div className="flex items-center text-xs gap-x-2.5 ml-[52px] mt-1 font-medium">
        <div className="cursor-pointer select-none hover:opacity-80">Thích</div>
        <div
          className="cursor-pointer select-none hover:opacity-80"
          onClick={() => {
            if (!comment.commentParent) setShowFormCreateCommentReply(true)

            setShowFormCreateCommentReplyParent && setShowFormCreateCommentReplyParent(true)
          }}
        >
          Phản hồi
        </div>
        <div className="select-none">{format(comment?.createdAt, 'vi')}</div>
      </div>
      <div className="mt-3 ml-5">
        {comment.commentReply?.map((commentReply) => (
          <Comment
            key={commentReply.id}
            comment={commentReply}
            post={post}
            comments={comments}
            setComments={setComments}
            setShowFormCreateCommentReplyParent={setShowFormCreateCommentReply}
          />
        ))}
        {!comment.commentParent && showFormCreateCommentReply && (
          <div>
            {/* <OutsideClickWrapper onClickOutside={() => setShowFormCreateCommentReply(false)}> */}
            <FormCreateComment post={post} commentParentId={comment.id} comments={comments} setComments={setComments} />
            {/* </OutsideClickWrapper> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment
