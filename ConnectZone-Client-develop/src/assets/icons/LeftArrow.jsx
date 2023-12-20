import React from 'react'
import { AiOutlineLeft } from 'react-icons/ai'
const LeftArrow = ({ className }) => {
  return (

    <div className={`w-16 h-16 rounded-full absolute left-5 z-50 bg-borderColor text-black flex items-center justify-center text-2xl cursor-pointer`}
    >
      <AiOutlineLeft fontSize={20} />
    </div>

  )
}

export default LeftArrow