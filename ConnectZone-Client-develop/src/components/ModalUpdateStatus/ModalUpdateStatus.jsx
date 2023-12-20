import React, { useContext, useState } from 'react'
import MyModal from '../MyModal/MyModal'
import { AiOutlineClose } from 'react-icons/ai'
import { BiWorld } from 'react-icons/bi'
import { FaUserFriends, FaLock } from 'react-icons/fa'
import Button from '../Button/Button'
import postApi from '../../api/postApi'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'
const ModalUpdateStatus = ({ post, profilePosts, setProfilePosts, isOpen, setIsOpen, handleClose }) => {
  const [status, setStatus] = useState(post?.status)
  const { dispatch } = useContext(AuthContext)

  const handleUpdateStatePost = async () => {
    const formdata = new FormData()
    formdata.append('status', status)

    try {
      const res = await postApi.updateSinglePost(post?.id, formdata)
      console.log(res)
      let newListPost = profilePosts.map((item) => {
        if (item?.id === res?.data?.post?.id) {
          return { ...item, status: res?.data?.post?.status }
        }
        return item

      })
      console.log(newListPost)
      setProfilePosts(newListPost)


      handleClose()
    } catch (error) {
      toast.error('Cập nhật trạng thái bài viết thất bại')
      handleClose()
    }
  }

  return (
    <>
      <MyModal isOpen={isOpen} handleClose={handleClose}>
        <div className="w-[600px] min-h-[400px]">
          <div className="flex items-center justify-end">
            <p className="mx-auto text-2xl font-semibold">Chọn đối tượng</p>
            <span className="p-4 rounded-full cursor-pointer bg-bgColor hover:bg-borderColor" onClick={handleClose}>
              <AiOutlineClose fontSize={25} color="grey" />
            </span>
          </div>
          <ul className="py-2 mt-5 mb-4 border-t border-b border-borderColor">
            <li className="cursor-pointer py-2.5 px-2.5 rounded-xl mb-2 hover:bg-hoverColor relative">
              <label htmlFor="public" className="flex items-center cursor-pointer">
                <span className=" w-[80px] h-[80px] flex items-center justify-center rounded-full bg-borderColor">
                  <BiWorld fontSize={40} />
                </span>
                <div className="flex items-center justify-between ">
                  <div className="flex flex-col justify-center ml-10">
                    <span className="text-xl font-semibold">Công khai</span>
                    <span className="text-lg">Bất kỳ ai ở trên hoặc ngoài ConnectZone</span>
                  </div>
                  <input
                    type="radio"
                    id="public"
                    name="status"
                    value="public"
                    checked={status === 'public' && 'checked'}
                    className="w-6 h-6 cursor-pointer absolute right-2.5"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </label>
            </li>
            <li className="cursor-pointer py-2.5 px-2.5 rounded-xl mb-2 hover:bg-hoverColor relative">
              <label htmlFor="friend" className="flex items-center cursor-pointer">
                <span className=" w-[80px] h-[80px] flex items-center justify-center rounded-full bg-borderColor">
                  <FaUserFriends fontSize={40} />
                </span>
                <div className="flex items-center justify-between ">
                  <div className="flex flex-col justify-center ml-10">
                    <span className="text-xl font-semibold">Bạn bè</span>
                    <span className="text-lg">Bạn bè của bạn trên ConnectZone</span>
                  </div>
                  <input
                    type="radio"
                    id="friend"
                    name="status"
                    value="friend"
                    checked={status === 'friend' && 'checked'}
                    className="w-6 h-6 cursor-pointer absolute right-2.5"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </label>
            </li>
            <li className="cursor-pointer py-2.5 px-2.5 rounded-xl mb-2 hover:bg-hoverColor relative">
              <label htmlFor="private" className="flex items-center cursor-pointer">
                <span className=" w-[80px] h-[80px] flex items-center justify-center rounded-full bg-borderColor">
                  <FaLock fontSize={40} />
                </span>
                <div className="flex items-center justify-between ">
                  <div className="flex flex-col justify-center ml-10">
                    <span className="text-xl font-semibold">Chỉ mình tôi</span>
                  </div>
                  <input
                    type="radio"
                    id="private"
                    name="status"
                    value="private"
                    checked={status === 'private' && 'checked'}
                    className="w-6 h-6 cursor-pointer absolute right-2.5"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </label>
            </li>
          </ul>

          <div className="flex items-center justify-end">
            <Button className="px-8 py-3 mx-4 text-black rounded-2xl bg-bgColor" onClick={handleClose}>
              Huỷ
            </Button>
            <Button className="px-8 text-white bg-primary rounded-2xl" onClick={handleUpdateStatePost}>
              Xong
            </Button>
          </div>
        </div>
      </MyModal>
    </>
  )
}

export default ModalUpdateStatus
