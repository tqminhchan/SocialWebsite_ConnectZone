import React, {useState, useEffect, useContext, Fragment} from 'react'
import userApi from '../../api/userApi'
import Image from '../../components/Image/Image'
import Avatar from '../../components/Avatar/Avatar'
import {Link} from 'react-router-dom'
import {FiUserX} from 'react-icons/fi'
import {ClipLoader} from 'react-spinners'
import {AuthContext} from '../../contexts/AuthContext'
import {SocketContext} from '../../contexts/SocketContext'
import Button from '../../components/Button/Button'
const SuggestFriends = () => {
  const [listFriendSuggestions, setListFriendSuggestions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const {user, dispatch} = useContext(AuthContext)
  const {socket} = useContext(SocketContext)

  const fetchListFriendSuggestions = async () => {
    setLoading(true)
    try {
      const res = await userApi.getListFriendSuggestion({
        params: {
          page,
        },
      })
      console.log(res)
      if (res?.data?.users) {
        setListFriendSuggestions(res?.data?.users)
      }
      setTotalPages(res?.data?.metadata.totalPages)
      setLoading(false)
    } catch (error) {}
  }
  useEffect(() => {
    fetchListFriendSuggestions()
  }, [])

  console.log(listFriendSuggestions)

  const handleSendFriendRequest = async (myId, friendId) => {
    try {
      const data = {
        userId: myId,
        friendId: friendId,
      }
      const res = await userApi.sendFriendRequest(data)
      socket.emit('sendFriendRequest', {user: res?.data?.sender, friendSend: res?.data?.receiver})

      dispatch({
        type: 'UPDATE_PROPERTY_USER',
        payload: {
          key: 'friendRequestsSent',
          value: res?.data?.sender?.friendRequestsSent,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancelFriendRequest = async (myId, friendId) => {
    const data = {
      userId: myId,
      friendId: friendId,
    }
    const res = await userApi.cancelFriendRequest(data)
    socket.emit('cancelSentFriendRequest', {user: res?.data?.sender, friendRequest: res?.data?.receiver})
    dispatch({
      type: 'UPDATE_PROPERTY_USER',
      payload: {
        key: 'friendRequestsSent',
        value: res?.data?.sender?.friendRequestsSent,
      },
    })
  }

  return (
    <Fragment>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen -translate-y-1/4">
          <ClipLoader />
        </div>
      ) : (
        <div className="min-h-screen mx-5 mt-5 ">
          <div className="mb-8 text-2xl font-bold text-center">Gợi ý kết bạn</div>
          <div className="col-span-9">
            {listFriendSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5">
                {listFriendSuggestions.length > 0 &&
                  listFriendSuggestions.map((item) => {
                    const isSentRequest = user?.friendRequestsSent?.some((friend) => {
                      return friend?.id === item?.id
                    })

                    const isFriend = user?.friends?.some((friend) => {
                      return friend?.id === item?.id
                    })
                    return (
                      <div key={item?.id} className="bg-white border border-borderColor rounded-md overflow-hidden">
                        <Link to={`/profile/${item?.id}`} className="col-span-1">
                          <Avatar user={item} className="object-cover w-full rounded-md h-72 rounded-t-xl" />
                          <h1 className="px-2 py-3 text-xl font-normal text-center cursor-pointer ">
                            {item?.fullName}
                          </h1>
                        </Link>
                        <div className="flex flex-col items-center mx-3 mb-3 bg-white">
                          {!isFriend && !isSentRequest && (
                            <Button
                              onClick={() => handleSendFriendRequest(user?.id, item?.id)}
                              className="flex justify-center w-full px-2 text-black rounded-lg bg-borderColor hover:bg-iconColor"
                            >
                              Thêm bạn bè
                            </Button>
                          )}
                          {isSentRequest && (
                            <Button
                              onClick={() => handleCancelFriendRequest(user?.id, item?.id)}
                              className="flex justify-center w-full px-2 text-black rounded-lg bg-borderColor hover:bg-iconColor"
                            >
                              Huỷ lời mời
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="flex justify-center">Không có gợi ý bạn bè nào </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default SuggestFriends
