import React, { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { AuthContext } from '../../contexts/AuthContext'
const Avatar = ({ className, user }) => {
  const { user: userContext } = useContext(AuthContext)
  let currentUser
  if (user) {
    currentUser = user
  } else {
    currentUser = userContext
  }
  return (
    <img
      src={user?.avatar?.url}
      className={twMerge(
        `w-full h-full rounded-full object-cover border border-borderColor cursor-pointer  `,
        className,
      )}
      alt="no image"
    />
  )
}

export default Avatar
