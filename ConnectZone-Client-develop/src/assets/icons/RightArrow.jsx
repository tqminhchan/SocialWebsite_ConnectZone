import React from 'react'
import { AiOutlineRight } from 'react-icons/ai'
const RightArrow = () => {
  return (
    <div
      className={`w-16 h-16 rounded-full absolute right-5 z-50 bg-borderColor text-black flex items-center justify-center text-2xl cursor-pointer`}
    >
      <AiOutlineRight fontSize={20} />
    </div>

  )
}

export default RightArrow