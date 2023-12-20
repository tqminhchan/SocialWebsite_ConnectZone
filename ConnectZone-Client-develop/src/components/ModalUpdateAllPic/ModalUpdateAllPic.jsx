import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { BsImage } from 'react-icons/bs'
import Image from '../Image/Image';
import Video from '../Video/Video'
import MyModal from '../MyModal/MyModal'
import postApi from '../../api/postApi';
const ModalUpdateAllPic = ({ post, setFilesDelete, isOpen, setIsOpen, fileList, setFileList, setIsOpenModalUpdate }) => {
  const handleClose = () => {
    setIsOpen(!isOpen);
    setIsOpenModalUpdate((prev) => !prev)
  }
  const handleDeleteImageVideo = (index, fileItem) => {
    if (fileItem?.public_id) {
      setFilesDelete((prev) => [...prev, fileItem])
    }
    const newFileList = fileList.filter((item, i) => i !== index)
    setFileList(newFileList)
  }
  return (
    <MyModal isOpen={isOpen} handleClose={handleClose}>
      <div className="text-modalColor w-[1000px] min-h-[500px] bg-white">
        <div className="flex justify-between mb-6">
          <span
            className=" p-3 rounded-full bg-borderColor cursor-pointer"
            onClick={handleClose}
          >
            <MdOutlineKeyboardBackspace fontSize={24} />
          </span>
          <p className="text-xl text-black font-medium">Ảnh/video</p>
        </div>
        {fileList.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 pb-5">
            {fileList.length > 0 && fileList.map((item, index) => (
              <div key={index} className="relative w-[300px] h-[300px] rounded-lg">
                {item.resource_type?.startsWith("image") || item?.type?.startsWith('image') ? (
                  <div className='w-full h-full'>
                    <Image
                      src={item?.url ? item.url : URL.createObjectURL(item)}
                      className='rounded-lg pointer-events-none'
                    />
                    <span
                      className="absolute top-3 right-3 p-2 rounded-full cursor-pointer bg-white"
                      onClick={() => handleDeleteImageVideo(index, item)}
                    >
                      <AiOutlineClose fontSize={20} />
                    </span>
                  </div>
                ) : (
                  <div className='w-full h-full'>
                    <Video
                      height="100%"
                      width="100%"
                      url={item?.url ? item?.url : URL.createObjectURL(item)}
                      pip={true}
                      className=""
                      controls={true} />
                    <span
                      className="absolute top-3 right-3 p-2 rounded-full cursor-pointer bg-white"
                      onClick={() => handleDeleteImageVideo(index, item)}
                    >
                      <AiOutlineClose fontSize={20} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <span className="p-4 ">
              <BsImage fontSize={250} />
            </span>
            <p>Thêm ảnh/video để bắt đầu</p>
          </div>
        )}
        <div>
        </div>
      </div>
    </MyModal>
  )
}

export default ModalUpdateAllPic