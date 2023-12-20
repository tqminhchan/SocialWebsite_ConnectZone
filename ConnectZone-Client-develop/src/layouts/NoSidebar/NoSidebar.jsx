import React from 'react'
import Header from '../MainLayout/Header'
const NoSidebar = ({ children }) => {
  return (
    <div className="bg-bgColor">
      <Header />
      <div className="pb-5 min-h-screen">
        <div className="">{children}</div>
      </div>
    </div>
  )
}

export default NoSidebar
