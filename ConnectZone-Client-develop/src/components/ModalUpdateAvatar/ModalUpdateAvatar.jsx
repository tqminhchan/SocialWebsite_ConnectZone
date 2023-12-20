import React, { useContext, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import MyModal from '../MyModal/MyModal'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import Button from '../Button/Button'
import userApi from '../../api/userApi'
import { AuthContext } from '../../contexts/AuthContext'

const ModalUpdateAvatar = ({ isOpen, setIsOpen = () => { }, handleClose }) => {
  const [changeAvatar, setChangeAvatar] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState()
  const { dispatch } = useContext(AuthContext)
  const handlePreviewAvatar = (e) => {

    setChangeAvatar(!changeAvatar)
    const fileImage = e.target.files[0]
    setPreviewAvatar(URL.createObjectURL(fileImage))
    setFile(fileImage)
  }
  console.log(previewAvatar)
  const handleSaveAvatar = async () => {
    setLoading(true)
    const data = new FormData()
    if (file) {
      data.append('avatar', file)
      const res = await userApi.updateAvatar(data)
      dispatch({ type: 'UPDATE_USER', payload: res?.data?.user })
      if (res?.data?.success) {
        setIsOpen(false)
        setLoading(false)
      }
    }
  }
  const handleCancelUpdateAvatar = () => {
    if (previewAvatar) {
      setPreviewAvatar('')
      setChangeAvatar(false)
    }
    setChangeAvatar(false)
    setIsOpen(false)
  }
  return (
    <MyModal isOpen={isOpen} handleClose={handleClose}>
      <div className="flex items-center justify-end w-[700px] py-2 border-b border-borderColor mb-3">
        <p className="mx-auto text-3xl font-semibold">Cập nhật ảnh đại diện</p>
        <span className="p-4 rounded-full cursor-pointer bg-bgColor hover:bg-hoverColor" onClick={handleClose}>
          <AiOutlineClose fontSize={30} />
        </span>
      </div>
      <div className=" w-[700px]">
        <form>
          <label>
            <div className="text-black py-2.5 cursor-pointer flex items-center justify-center bg-borderColor rounded-xl text-xl w-full">
              <span className="mx-2">
                <AiOutlinePlus />
              </span>
              Tải ảnh lên
            </div>
            <input
              style={{ display: 'none' }}
              type="file"
              id="file"
              name="file"
              accept=".png,.jpeg,.jpg"
              onChange={handlePreviewAvatar}
            />
          </label>

          {previewAvatar ? (
            <div className="w-2/5 h-[277px] mx-auto border border-borderColor mt-10">

              <img
                className="flex items-center justify-center object-cover w-full h-full rounded-full"
                src={previewAvatar}
              />
            </div>
          ) : (
            <div className="w-2/5 h-[277px] rounded-full mx-auto border border-borderColor mt-10"></div>
          )}
          <div className="flex items-center justify-end mt-10">
            <Button
              onClick={handleCancelUpdateAvatar}
              className="flex px-3 py-2 mx-3 text-black bg-bgColor rounded-xl"
              type="button"
            >
              Huỷ
            </Button>
            <Button
              onClick={handleSaveAvatar}
              className="flex justify-end px-3 py-2 text-white bg-primary rounded-xl"
              type="button"
            >
              {loading ? <ClipLoader /> : 'Xong'}
            </Button>
          </div>
        </form>
      </div>
    </MyModal>
  )
}

export default ModalUpdateAvatar
