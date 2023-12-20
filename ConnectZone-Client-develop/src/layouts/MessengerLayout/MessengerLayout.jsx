import React from 'react'
import Header from '../MainLayout/Header'
const MessengerLayout = ({ children }) => {
  return (
    <div className="bg-bgColor ">
      <Header />
      <div className="">
        <div className="">{children}</div>
      </div>
    </div>
  )
}

export default MessengerLayout