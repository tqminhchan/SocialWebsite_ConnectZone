import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Sidebar from './Sidebar'
import Rightbar from './Rightbar'
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bgColor">
      <Header />
      <div className="laptop:flex laptop:justify-between ">
        <div
          className="desktop:w-[30%] laptop:w-[20%] hidden laptop:block p-5 
        rounded-lg bg-bgColor desktop:overflow-y-auto  tablet:fixed tablet:left-0"
        >
          <Sidebar />
        </div>

        <div className="flex-1 tablet:flex tablet:justify-center">
          <div className="desktop:w-[30%] laptop:w-[20%] hidden laptop:block"></div>
          <div
            className="desktop:w-[45%] laptop:w-[50%] px-4 w-full
           mt-5 "
          >
            {children}
          </div>
          <div className="hidden desktop:w-[25%] laptop:w-[30%] laptop:block"></div>
        </div>

        <div
          className="hidden desktop:w-[25%] laptop:w-[30%] laptop:block p-5 rounded-lg
         bg-bgColor  fixed right-0 "
        >
          <Rightbar />
        </div>
      </div>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout
