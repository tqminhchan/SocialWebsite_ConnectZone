import React, { useState, useContext, useEffect, Fragment } from 'react'
import { ClipLoader, RingLoader } from 'react-spinners'
import CreatePost from '../../components/CreatePost/CreatePost'
import postApi from '../../api/postApi'
import PostHome from '../../components/PostHome/PostHome'
import { useInView } from 'react-intersection-observer'

const Home = () => {
  const [homePosts, setHomePosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchFriendsPost = async () => {
    setLoadingPosts(true)
    try {
      const res = await postApi.getFriendsPost({
        params: {
          page,
        },
      })
      setHomePosts((prev) => [...prev, ...res?.data?.posts])
      setTotalPages(res?.data?.metadata.totalPages)
    } catch (error) {
      console.log(error)
    }
    setLoadingPosts(false)
  }

  useEffect(() => {
    fetchFriendsPost()
  }, [page])

  const { ref, inView } = useInView({
    threshold: 0,
  })
  useEffect(() => {
    if (inView) {
      console.log(totalPages)
      if (page < totalPages) {
        setPage((prev) => prev + 1)
      }
    }
  }, [inView])


  return (
    <div className="">
      <CreatePost setListPosts={setHomePosts} />
      <div className="">
        {loadingPosts && homePosts.length === 0 && (
          <div className="h-[400px] flex items-center justify-center bg-white">
            <RingLoader />
          </div>
        )}
        {!loadingPosts && homePosts.length === 0 && (
          <div className="h-[400px] text-center  flex items-center justify-center bg-white">
            <p className="mx-5 text-xl font-semibold text-gray-500">
              Hiện chưa có bài viết của bạn bè, Tương tác và kết bạn thêm với mọi người để cùng kết nối.
            </p>
          </div>
        )}
        {homePosts.length > 0 && (
          <Fragment>
            {homePosts &&
              homePosts.length > 0 &&
              homePosts.map((item, index) => (
                <Fragment key={item?.id}>
                  <PostHome post={item} homePosts={homePosts} setHomePosts={setHomePosts} />
                  {index === homePosts.length - 2 && <div ref={ref}></div>}
                </Fragment>
              ))}
            {loadingPosts && (
              <div className="flex items-center justify-center py-3 bg-white">
                <ClipLoader />
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Home
