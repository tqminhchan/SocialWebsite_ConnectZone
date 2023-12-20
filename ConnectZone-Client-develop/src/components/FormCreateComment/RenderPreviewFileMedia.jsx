import React from 'react'
import Video from '../Video/Video'
import { AiOutlineClose } from 'react-icons/ai'

const RenderPreviewFileMedia = ({ listFile, setListFile, isOpenPreviewComment }) => {
  const handleDeleteImageVideo = () => {
    setListFile([])
  }

  return (
    <>
      {listFile?.length > 0 && isOpenPreviewComment && (
        <div className="w-[80%] mx-auto px-2.5 py-2 border border-borderColor rounded-xl flex items-center overflow-y-auto relative">
          {listFile.map((item, index) => (
            <div key={index} className="flex justify-between">
              {item?.type?.startsWith('image') ? (
                <img
                  src={URL.createObjectURL(item)}
                  className="object-cover w-16 h-16 border rounded-lg border-borderColor"
                />
              ) : (
                <Video height="100%" width="100%" url={URL.createObjectURL(item)} className="" controls={false} />
              )}
              <span
                className="absolute top-0 right-0 p-2 mt-2 mr-2 rounded-full cursor-pointer bg-bgColor hover:bg-hoverColor"
                onClick={() => handleDeleteImageVideo()}
              >
                <AiOutlineClose fontSize={18} />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default RenderPreviewFileMedia
