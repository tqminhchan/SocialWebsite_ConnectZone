import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import InfoUser from '../../../components/InfoUser/InfoUser'
import FriendsUser from '../../../components/FriendsUser/FriendsUser'
import postApi from '../../../api/postApi'
import userApi from '../../../api/userApi'
import checkAuth from '../../../utils/checkAuth'
import { useInView } from 'react-intersection-observer'
import PostOther from '../../../components/PostOther/PostOther'
import BackgroundOtherProfile from './BackgroundOtherProfile'
import InfoOtherProfile from './InfoOtherProfile'

const OtherProfile = () => {
  const [profilePosts, setProfilePosts] = useState([])
  const [currentUser, setCurrentUser] = useState({})

  const [page, setPage] = useState(1)
  const params = useParams()

  const fetchPosts = async (pagePass) => {
    let currPage = page
    if (pagePass) {
      currPage = pagePass
    }
    if (checkAuth()) {
      const res = await postApi.getAllProfilePost({
        params: {
          page: currPage,
          userId: params?.id,
        },

      })
      setProfilePosts((prev) => [...prev, ...res?.data?.posts])
    }
  }
  const fetchUser = async () => {
    const res = await userApi.getUser(params?.id)
    setCurrentUser(res?.data?.user)
  }
  useEffect(() => {
    fetchUser()
  }, [params?.id])

  useEffect(() => {
    fetchPosts(1)
    setProfilePosts([])
    setPage(1)
  }, [params?.id])

  useEffect(() => {
    fetchPosts()
  }, [page, params])

  const { ref, inView } = useInView({
    threshold: 0,
  })
  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1)
    }
  }, [inView])
  return (
    <div className="flex justify-center flex-col w-4/5 mx-auto overflow-auto">
      <BackgroundOtherProfile currentUser={currentUser} />
      <div className="desktop:grid desktop:grid-cols-5 ">
        <div className="desktop:col-span-2 ">
          <InfoOtherProfile currentUser={currentUser} />
          <FriendsUser currentUser={currentUser} />
        </div>

        <div className="desktop:col-span-3 ml-5 ">
          <div className="">
            {profilePosts &&
              profilePosts.length > 0 &&
              profilePosts.map((item, index) => (
                <Fragment key={item?._id}>
                  <PostOther
                    post={item}
                    profilePosts={profilePosts}
                    setProfilePosts={setProfilePosts}
                    currentUser={currentUser}
                  />
                  {index === profilePosts.length - 2 && <div ref={ref}></div>}
                </Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtherProfile
