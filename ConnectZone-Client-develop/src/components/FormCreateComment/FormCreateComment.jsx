import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import Avatar from '../Avatar/Avatar'
import TextareaAutosize from 'react-textarea-autosize'
import { CiFaceSmile } from 'react-icons/ci'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import { RiSendPlane2Fill } from 'react-icons/ri'
import { twMerge } from 'tailwind-merge'
import commentApi from '../../api/commentApi'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import OutsideClickWrapper from '../OutsideClickWrapper'
import { AiOutlineClose } from 'react-icons/ai'
import Video from '../Video/Video'
import RenderPreviewFileMedia from './RenderPreviewFileMedia'

const FormCreateComment = ({ post, commentParentId, comments, setComments }) => {
  const { user } = useContext(AuthContext)
  const [commentText, setCommentText] = useState('')
  const [isLoadingSendComment, setIsLoadingSendComment] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [emoji, setEmoji] = useState(null)
  const [listFile, setListFile] = useState([])
  const [isOpenPreviewComment, setIsOpenPreviewComment] = useState(false)

  const textAreaRef = useRef()

  const handleKeyDown = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault()
      handleCreateComment()
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
  }, [textAreaRef.current, commentText])

  const handleCreateComment = async () => {
    const formdata = new FormData()
    if (commentText.trim() === '' && listFile.length === 0) return
    try {
      setIsLoadingSendComment(true)
      for (let i = 0; i < listFile?.length; i++) {
        formdata.append('media', listFile[i])
      }
      const result = await commentApi.uploadMultimediaFiles(formdata)
      const res = await commentApi.createComment({
        postId: post?._id,
        content: commentText,
        commentParentId,
        media: result?.data?.media,
      })
      console.log(res)

      if (commentParentId) {
        const newComments = comments.map((c) => {
          if (c.id === commentParentId) {
            return {
              ...c,
              commentReply: [...c.commentReply, res.data.comment],
            }
          }
          return c
        })
        setComments(newComments)
      } else {
        setComments((pre) => [res.data.comment, ...pre])
      }
      setIsOpenPreviewComment(false)
    } catch (error) {
      console.log(error)
      toast.error('Bình luận thất bại, vui lòng thử lại sau')
    }
    setCommentText('')
    setIsLoadingSendComment(false)
  }

  const handleFileInputChange = (e) => {
    const mediaFiles = e.target.files[0]
    setListFile((prev) => [...prev, mediaFiles])
  }
  useEffect(() => {
    if (listFile.length > 0) {
      setIsOpenPreviewComment(true)
    }
  }, [listFile])

  return (
    <div>
      <div className="flex gap-x-3 ">
        <div>
          <Avatar user={user} alt="" className="object-cover w-10 h-10 rounded-full" />
        </div>
        <div
          className={twMerge(
            `relative flex-1 border-borderColor border inline-block`,
            commentText || listFile.length > 0 ? 'rounded-xl' : 'rounded-full h-9',
          )}
        >
          <TextareaAutosize
            placeholder="Viết bình luận..."
            className={twMerge('w-full py-2 pl-3 pr-20 text-sm outline-none bg-transparent')}
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
            minRows={1}
            ref={(tag) => {
              if (tag) {
                textAreaRef.current = tag
              }
            }}
          />
          {(commentText || listFile.length > 0) && <div className="h-8"></div>}
          <div
            className={twMerge(
              'absolute flex items-center gap-x-2 z-10',
              commentText || listFile.length > 0
                ? 'top-[calc(100%-24px)] left-3 translate-y-[-50%]'
                : 'right-3 top-[50%] translate-y-[-50%]',
            )}
          >
            <OutsideClickWrapper onClickOutside={() => setShowPicker(false)}>
              <div>
                <div className="cursor-pointer" onClick={() => setShowPicker((pre) => !pre)}>
                  <CiFaceSmile fontSize={24} />
                </div>
                {showPicker && (
                  <div
                    className={twMerge(
                      'absolute border rounded-lg top-8 border-borderColor',
                      commentText || listFile.length > 0 ? 'left-0' : 'right-6',
                    )}
                  >
                    <Picker
                      theme="light"
                      searchPosition="none"
                      previewPosition="none"
                      emojiSize="24"
                      perLine="8"
                      navPosition="bottom"
                      data={data}
                      onEmojiSelect={(e) => {
                        setEmoji(e.native)
                        setCommentText((prev) => prev + e.native)
                      }}
                    />
                  </div>
                )}
              </div>
            </OutsideClickWrapper>

            {listFile.length <= 0 && (
              <label className="flex flex-col items-center justify-center">
                <div className="z-20 cursor-pointer">
                  <MdOutlinePhotoSizeSelectActual fontSize={24} color="green" />
                </div>
                <input style={{ display: 'none' }} type="file" id="file" name="file" onChange={handleFileInputChange} />
              </label>
            )}
          </div>
          {(commentText || listFile.length > 0) && !isLoadingSendComment && (
            <div
              className="top-[calc(100%-24px)] right-3 translate-y-[-50%] cursor-pointer absolute"
              onClick={() => handleCreateComment()}
            >
              <RiSendPlane2Fill fontSize={24} color="#555" />
            </div>
          )}
          {isLoadingSendComment && (
            <div className="top-[calc(100%-24px)] right-3 translate-y-[-50%] cursor-pointer absolute">
              <div className="w-6 h-6 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <RenderPreviewFileMedia
        listFile={listFile}
        setListFile={setListFile}
        isOpenPreviewComment={isOpenPreviewComment}
      />
    </div>
  )
}

export default FormCreateComment
