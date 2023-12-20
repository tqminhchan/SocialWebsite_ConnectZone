import React, { useState, useEffect, Fragment, useContext } from 'react'
import CreatePost from '../../../components/CreatePost/CreatePost'
import InfoUser from '../../../components/InfoUser/InfoUser'
import FriendsUser from '../../../components/FriendsUser/FriendsUser'
import Post from '../../../components/Post/Post'
import postApi from '../../../api/postApi'
import checkAuth from '../../../utils/checkAuth'
import { useInView } from 'react-intersection-observer'
import { AuthContext } from '../../../contexts/AuthContext'
import BackgroundMyProfile from './BackgroundMyProfile'
import InfoMyProfile from './InfoMyProfile'
import { ClipLoader, RingLoader } from 'react-spinners'
import { Route, Routes } from 'react-router-dom'
import ListFriend from '../../ListFriend/ListFriend'
import config from '../../../config'
const MyProfile = () => {
  const [profilePosts, setProfilePosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { user: currentUser } = useContext(AuthContext)

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const res = await postApi.getAllProfilePost({
        params: {
          page,
        },
      })
      setProfilePosts((prev) => [...prev, ...res?.data?.posts])
      setTotalPages(res?.data?.metadata.totalPages)
    } catch (error) {
      console.log(error)
    }
    setLoadingPosts(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const { ref, inView } = useInView({
    threshold: 0,
  })
  useEffect(() => {
    if (inView) {
      if (page < totalPages) {
        setPage((prev) => prev + 1)
      }
    }
  }, [inView])

  return (
    <>
      {/* <Routes>
        <Route path={config.routes.listFriend} element={<ListFriend />} />
      </Routes> */}
      {checkAuth() && (
        <div className="flex justify-center flex-col w-full tablet:w-4/5 mx-auto overflow-auto">
          <BackgroundMyProfile />
          <div className="desktop:grid desktop:grid-cols-5 ">
            <div className="desktop:col-span-2">
              <InfoMyProfile />
              <FriendsUser currentUser={currentUser} />
            </div>

            <div className="desktop:col-span-3 ml-0 tablet:ml-5 ">
              <CreatePost setListPosts={setProfilePosts} />
              <div className="">
                {loadingPosts && profilePosts.length === 0 && (
                  <div className="h-[400px] flex items-center justify-center bg-white">
                    <RingLoader />
                  </div>
                )}
                {!loadingPosts && profilePosts.length === 0 && (
                  <div className="h-[400px] text-center flex items-center justify-center bg-white">
                    <p className="text-xl font-semibold text-gray-500 mx-5">
                      <span>
                        Bạn hiện chưa có bài viết nào, tạo bài viết để cùng chia sẻ và kết nối với mọi người ngay bây
                        giờ.
                      </span>
                    </p>
                  </div>
                )}
                {profilePosts.length > 0 &&
                  profilePosts.map((item, index) => (
                    <Fragment key={item?._id}>
                      <Post
                        post={item}
                        profilePosts={profilePosts}
                        setProfilePosts={setProfilePosts}
                        currentUser={currentUser}
                      />
                      {index === profilePosts.length - 2 && <div ref={ref}></div>}
                    </Fragment>
                  ))}
                {loadingPosts && profilePosts.length > 0 && (
                  <div className="flex items-center justify-center bg-white py-3">
                    <ClipLoader />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MyProfile
