import React from 'react'
import { twMerge } from 'tailwind-merge'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AuthContext } from '../../contexts/AuthContext'
const Image = ({ src = '', className, quantity = 1 }) => {
  return (
    <LazyLoadImage
      src={src}
      className={twMerge(
        `w-full h-full rounded-full object-cover border border-borderColor cursor-pointer  `,
        className,
        quantity === 2 && 'object-cover  ',
        quantity === 3 && ' overflow-hidden object-cover',
      )}
      alt="no image"
    />
  )
}

export default Image
