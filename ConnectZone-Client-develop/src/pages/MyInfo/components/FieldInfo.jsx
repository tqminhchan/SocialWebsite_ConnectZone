import React, {useState} from 'react'
import {AiFillEdit, AiOutlineClose} from 'react-icons/ai'
import {TiTick} from 'react-icons/ti'
import {twMerge} from 'tailwind-merge'

const FieldInfo = ({label, value, handleSubmit}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="flex items-center">
      <div className="mr-10 font-medium">{label}:</div>
      <div className="flex items-center gap-x-3">
        <div>
          <input
            type="text"
            className={twMerge(
              'w-[200px] outline-none px-2 h-[32px]',
              showEdit ? 'border border-borderColor rounded' : 'border-none',
            )}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            readOnly={!showEdit}
          />
        </div>

        {isLoading && <div className="animate-spin rounded-full h-[20px] w-[20px] border-b-2 border-primary"></div>}

        {showEdit ? (
          <div className="flex items-center gap-x-2">
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowEdit(false)
                handleSubmit(inputValue)
              }}
            >
              <TiTick />
            </div>
            <div className="cursor-pointer" onClick={() => setShowEdit(false)}>
              <AiOutlineClose />
            </div>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setShowEdit(true)}>
            <AiFillEdit />
          </div>
        )}
      </div>
    </div>
  )
}

export default FieldInfo
